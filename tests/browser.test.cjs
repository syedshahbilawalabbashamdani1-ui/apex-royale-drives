/* eslint-disable @typescript-eslint/no-require-imports -- Node test runner and Chrome DevTools protocol. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const WebSocket = require('next/dist/compiled/ws');

const baseURL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const output = path.resolve('test-results');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function eventually(check, label) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (await check()) return;
    await delay(100);
  }
  throw new Error(`Timed out: ${label}`);
}

test('browser: draft recovery, validation, custom dialog, request flow and responsive logo', { timeout: 180000 }, async () => {
  const candidates = [process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  const executable = candidates.find((candidate) => candidate && fs.existsSync(candidate));
  assert.ok(executable, 'Install Chrome/Edge or set CHROME_PATH to run browser tests.');
  fs.mkdirSync(output, { recursive: true });
  const profile = fs.mkdtempSync(path.join(output, 'chrome-'));
  const chrome = spawn(executable, ['--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let socket;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    let port, endpoint;
    await eventually(() => {
      try {
        [port, endpoint] = fs.readFileSync(portFile, 'utf8').trim().split(/\r?\n/);
        return /^\d+$/.test(port) && endpoint?.startsWith('/devtools/browser/');
      } catch (error) {
        // Chrome can briefly hold this file open while publishing its endpoint on Windows.
        if (error.code === 'ENOENT' || error.code === 'EBUSY') return false;
        throw error;
      }
    }, 'Chrome startup');
    socket = new WebSocket(`ws://127.0.0.1:${port}${endpoint}`);
    await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
    let sequence = 0;
    const pending = new Map();
    const errors = [];
    socket.on('message', (data) => {
      const message = JSON.parse(data.toString());
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      clearTimeout(request.timer);
      if (message.error) request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    });
    function command(method, params = {}, sessionId) {
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 30000);
        pending.set(id, { resolve, reject, timer });
        socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      });
    }
    const { targetId } = await command('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await command('Target.attachToTarget', { targetId, flatten: true });
    const cdp = (method, params) => command(method, params, sessionId);
    await cdp('Page.enable');
    await cdp('Runtime.enable');
    async function evaluate(expression) {
      const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    }
    const wait = (expression) => eventually(() => evaluate(expression), expression);
    async function navigate(route) {
      await cdp('Page.navigate', { url: `${baseURL}${route}` });
      await wait(`location.pathname === ${JSON.stringify(route.split('?')[0])} && document.readyState === 'complete' && !!document.querySelector('main')`);
      await delay(700); // Allow hydration and the authored step transition to finish.
    }
    async function click(text) {
      await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)} || b.querySelector('h3')?.textContent.trim() === ${JSON.stringify(text)}); if (!button || button.disabled) throw Error('Button unavailable: ' + ${JSON.stringify(text)}); button.focus(); button.click(); })()`);
      await delay(450);
    }
    async function fill(selector, value) {
      await evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); if (!input) throw Error('Missing field'); const proto = input.tagName === 'SELECT' ? HTMLSelectElement.prototype : input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, ${JSON.stringify(value)}); input.dispatchEvent(new Event('input', {bubbles:true})); input.dispatchEvent(new Event('change', {bubbles:true})); })()`);
      await delay(80);
    }
    async function key(key, code, windowsVirtualKeyCode) {
      await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode });
      await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
    }

    await navigate('/booking');
    await click('Clear draft');
    await evaluate(`document.querySelector('button[role="checkbox"]').click()`);
    await click('Next Step');
    await wait(`!!document.querySelector('#booking-pickup-date')`);
    // Native date controls permit these strings; application validation must reject them.
    await fill('#booking-pickup-date', '2020-01-01');
    await fill('#booking-return-date', '2020-01-02');
    await fill('#booking-pickup-location', 'Islamabad International Airport');
    await click('Next Step');
    assert.equal(await evaluate(`document.querySelector('#booking-pickup-date').getAttribute('aria-invalid')`), 'true');
    assert.equal(await evaluate(`document.activeElement.id`), 'booking-pickup-date');
    const pickup = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const end = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
    await fill('#booking-pickup-date', pickup);
    await fill('#booking-return-date', end);
    await click('Next Step');
    await wait(`!!document.querySelector('#booking-first-name')`);
    await fill('#booking-first-name', 'Ali');
    await fill('#booking-last-name', 'Khan');
    await fill('#booking-email', 'invalid');
    await fill('#booking-phone', '123');
    await click('Next Step');
    assert.equal(await evaluate(`document.querySelector('#booking-email').getAttribute('aria-invalid')`), 'true');
    await fill('#booking-email', 'ali@example.com');
    await fill('#booking-phone', '+92 (300) 123-4567');
    await navigate('/fleet');
    await navigate('/booking');
    await wait(`document.querySelector('#booking-first-name')?.value === 'Ali'`);
    await cdp('Page.reload');
    await wait(`document.querySelector('#booking-email')?.value === 'ali@example.com'`);
    await click('Next Step');
    await click('Prepare WhatsApp Request');
    await wait(`!!document.querySelector('dialog[open]')`);
    const request = await evaluate(`document.querySelector('dialog a[href*="wa.me"]').href`);
    const message = new URL(request).searchParams.get('text');
    assert.ok(message.includes('Ali Khan'));
    assert.ok(message.includes('Rs. 24,000'));
    assert.ok(message.includes('Phone: +923001234567'));
    assert.ok(message.includes(pickup));
    await key('Escape', 'Escape', 27);
    await wait(`!document.querySelector('dialog[open]')`);
    assert.equal(await evaluate(`document.activeElement.textContent.trim()`), 'Prepare WhatsApp Request');

    await click('Clear draft');
    await click('Custom fleet');
    await wait(`!!document.querySelector('dialog input')`);
    assert.equal(await evaluate(`document.activeElement === document.querySelector('dialog input')`), true);
    await key('Tab', 'Tab', 9);
    assert.equal(await evaluate(`document.activeElement.closest('dialog') !== null`), true);
    await click('Add to booking');
    assert.equal(await evaluate(`document.querySelector('dialog input').getAttribute('aria-invalid')`), 'true');
    await fill('dialog input', 'Custom SUV');
    await click('Add to booking');
    await wait(`!document.querySelector('dialog[open]')`);
    assert.ok((await evaluate(`document.querySelector('[role="status"]').textContent`)).includes('Custom SUV added to your booking draft.'));
    assert.ok((await evaluate(`document.querySelector('[role="status"]').textContent`)).includes('Next Step'));
    await click('Custom fleet');
    assert.equal(await evaluate(`document.querySelector('dialog input').value`), '');
    assert.equal(await evaluate(`document.querySelector('dialog input').getAttribute('aria-invalid')`), 'false');
    await fill('dialog input', '  custom   suv  ');
    await click('Add to booking');
    assert.ok((await evaluate(`document.querySelector('dialog [role="alert"]').textContent`)).includes('This vehicle is already in your booking.'));
    assert.equal(await evaluate(`JSON.parse(sessionStorage.getItem('apex-booking-draft-v1')).formData.customCarNames.length`), 1);
    await fill('dialog input', 'Custom Sedan');
    await click('Add to booking');
    await wait(`!document.querySelector('dialog[open]')`);
    assert.ok((await evaluate(`document.querySelector('[role="status"]').textContent`)).includes('Custom Sedan added'));
    await click('Custom fleet');
    await key('Escape', 'Escape', 27);
    await wait(`!document.querySelector('dialog[open]')`);
    assert.ok((await evaluate(`document.activeElement.textContent`)).includes('Custom fleet'));
    await click('Clear draft');
    await cdp('Page.reload');
    await wait(`!!document.querySelector('button[role="checkbox"]')`);
    assert.equal(await evaluate(`document.querySelectorAll('button[aria-checked="true"]').length`), 0);

    // Corrupt and blocked browser storage must never prevent a fresh booking.
    await evaluate(`sessionStorage.setItem('apex-booking-draft-v1', '{invalid')`);
    await cdp('Page.reload');
    await wait(`!!document.querySelector('button[role="checkbox"]')`);
    await delay(500);
    assert.equal(await evaluate(`document.querySelectorAll('button[aria-checked="true"]').length`), 0);
    const injection = await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(window, 'sessionStorage', {get(){throw new DOMException('Blocked','SecurityError')}})` });
    await navigate('/booking');
    await evaluate(`document.querySelector('button[role="checkbox"]').click()`);
    await click('Next Step');
    await wait(`!!document.querySelector('#booking-pickup-date')`);
    await cdp('Page.removeScriptToEvaluateOnNewDocument', { identifier: injection.identifier });

    // Use a fresh document and the real theme control, not a manually changed class.
    await navigate('/booking');
    await evaluate(`document.querySelector('button[aria-label^="Switch to "]').click()`);
    await wait(`localStorage.getItem('theme') === document.documentElement.className`);
    for (const [width, height, theme] of [[1440, 1000, 'light'], [1440, 1000, 'dark'], [390, 844, 'light'], [390, 844, 'dark']]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
      await evaluate(`document.querySelector('button[aria-label="Switch to ${theme} mode"]')?.click()`);
      await wait(`document.documentElement.classList.contains('${theme}')`);
      await cdp('Page.reload');
      await wait(`document.documentElement?.classList.contains('${theme}') && document.readyState === 'complete' && !!document.querySelector('main')`);
      await evaluate(`window.scrollTo(0, 0); document.fonts.ready`);
      await delay(500);
      const activeLogo = theme === 'light' ? '/brand/logo-light.svg' : '/brand/logo.svg';
      await wait(`['header','footer'].every(region => {
        const image = document.querySelector(region + ' img[src="${activeLogo}"]');
        return image?.complete && image.naturalWidth === 1600 && image.naturalHeight === 541 && getComputedStyle(image).display !== 'none' && image.getBoundingClientRect().width > 0 && image.getBoundingClientRect().height > 0;
      })`);
      await evaluate(`Promise.all([...document.querySelectorAll('header img, footer img')].map(image => image.decode()))`);
      assert.equal(await evaluate(`['header','footer'].every(region => [...document.querySelectorAll(region + ' img')].filter(image => getComputedStyle(image).display !== 'none').length === 1)`), true, 'Exactly one logo visible in each region');
      assert.equal(await evaluate(`localStorage.getItem('theme')`), theme, 'Theme choice survives reload');
      assert.equal(await evaluate(`fetch('${activeLogo}', {cache:'no-store'}).then(response => response.ok && response.headers.get('content-type').includes('image/svg+xml'))`), true, 'Active SVG asset returns successfully');
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), true, `No horizontal overflow at ${width}px`);
      const screenshot = await cdp('Page.captureScreenshot', { format: 'png' });
      // Loaded dimensions alone do not prove that a theme-swapped SVG painted.
      const painted = await evaluate(`(async () => {
        const bounds = document.querySelector('header img[src="${activeLogo}"]').getBoundingClientRect();
        const capture = new Image();
        capture.src = 'data:image/png;base64,${screenshot.data}';
        await capture.decode();
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(bounds.width); canvas.height = Math.floor(bounds.height);
        const context = canvas.getContext('2d');
        context.drawImage(capture, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let red = 0, neutral = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const [r,g,b] = [pixels[i],pixels[i+1],pixels[i+2]];
          if (r > 100 && r > g * 1.6 && r > b * 1.6) red++;
          if ('${theme}' === 'light' ? Math.max(r,g,b) < 100 : Math.min(r,g,b) > 180) neutral++;
        }
        return {red,neutral};
      })()`);
      assert.ok(painted.red > 10 && painted.neutral > 100, `Logo actually paints in ${theme} mode at ${width}px: ${JSON.stringify(painted)}`);
      fs.writeFileSync(path.join(output, `booking-${width}-${theme}.png`), Buffer.from(screenshot.data, 'base64'));
    }
    assert.deepEqual(errors, [], 'No uncaught browser exceptions');
  } finally {
    if (socket) socket.close();
    chrome.kill();
  }
});
