/* eslint-disable @typescript-eslint/no-require-imports -- Node 20 CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const cache = new Map();
function load(filename) {
  const absolute = path.resolve(__dirname, '../src', filename);
  const file = [absolute, `${absolute}.tsx`, `${absolute}.ts`].find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) throw new Error(`Missing source: ${filename}`);
  if (cache.has(file)) return cache.get(file);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => {
    // Supply route context for server rendering, without simulating browser hooks.
    if (name === 'next/navigation') return { usePathname: () => '/fleet', useRouter: () => ({ replace() {} }) };
    if (name === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
    if (name.startsWith('@/')) return load(name.slice(2));
    if (name.startsWith('.')) return load(path.relative(path.resolve(__dirname, '../src'), path.resolve(path.dirname(file), name)));
    return require(name);
  }, mod, mod.exports);
  cache.set(file, mod.exports);
  return mod.exports;
}

test('FAQ, terms and privacy identify their own canonical routes', () => {
  for (const [file, canonical] of [['faq/layout', '/faq'], ['terms/layout', '/terms'], ['privacy/page', '/privacy']]) {
    assert.equal(load(`app/${file}`).metadata.alternates.canonical, canonical);
  }
});

test('header retains its compact navigation menu', () => {
  const Component = load('components/layout/NavigationMenu').default;
  const html = renderToStaticMarkup(React.createElement(Component));
  assert.ok(html.includes('aria-label="Open menu"'));
  assert.ok(html.includes('aria-expanded="false"'));
  for (const { href, label } of load('lib/constants').NAV_LINKS) {
    assert.ok(html.includes(`href="${href}"`));
    assert.ok(html.includes(`>${label}</a>`));
  }
  assert.match(html, /href="\/fleet" aria-current="page"/);
});

test('fleet category rendering includes only matching vehicles', () => {
  const Component = load('app/fleet/FleetView').default;
  const { cars } = load('lib/cars');
  const html = renderToStaticMarkup(React.createElement(Component, { initialCategory: 'Sedan', carCount: cars.length }));
  for (const car of cars) {
    assert.equal(html.includes(`href="/car/${car.id}"`), car.category === 'Sedan');
  }
});

test('booking starts at selection for unknown or unavailable cars', () => {
  const Component = load('app/booking/BookingView').default;
  const { cars } = load('lib/cars');
  const car = cars[0];
  const available = car.available;
  try {
    car.available = false;
    for (const initialCarId of ['unknown-car', car.id]) {
      const html = renderToStaticMarkup(React.createElement(Component, { initialCarId }));
      assert.ok(html.includes('Select your vehicle'));
      assert.ok(!html.includes('id="booking-pickup-date"'));
    }
    car.available = true;
    const html = renderToStaticMarkup(React.createElement(Component, { initialCarId: car.id }));
    assert.ok(html.includes('id="booking-pickup-date"'));
    assert.ok(html.includes('id="booking-return-date"'));
  } finally {
    car.available = available;
  }
});

test('a closed booking request modal renders no confirmation or WhatsApp action', () => {
  const Component = load('components/ui/BookingRequestModal').default;
  const html = renderToStaticMarkup(React.createElement(Component, { open: false, onClose() {}, whatsappMessage: 'Request' }));
  assert.equal(html, '');
});

test('brand logo renders both transparent theme assets for server-rendered pages', () => {
  const Component = load('components/ui/BrandLogo').default;
  const html = renderToStaticMarkup(React.createElement(Component));
  for (const asset of ['/brand/logo.svg', '/brand/logo-light.svg']) {
    assert.ok(html.includes(`src="${asset}"`), `Missing theme asset: ${asset}`);
    const source = fs.readFileSync(path.resolve(__dirname, '../public', asset.slice(1)), 'utf8');
    assert.ok(source.includes('<path'), 'Logo contains vector paths');
    assert.match(source, /<svg[^>]*width="1600"[^>]*height="541"/, 'SVG declares its intrinsic dimensions');
    assert.ok(!/<(?:rect|image)\b/.test(source), 'Logo has no background rectangle or embedded raster');
  }
});
