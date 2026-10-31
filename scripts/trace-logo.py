"""Trace the supplied brand artwork into filled SVG paths (Pillow only)."""
from collections import defaultdict
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
source = Image.open(ROOT / 'public/brand/Apex Royale Luxury Car Logo.png').convert('RGB')
source.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
image = source.quantize(colors=16, method=Image.Quantize.MEDIANCUT)
width, height = image.size
pixels = image.load()
palette = image.getpalette()


def simplify(points, tolerance=0.65):
    if len(points) < 3:
        return points
    x, y = points[0]
    dx, dy = points[-1][0] - x, points[-1][1] - y
    length = dx * dx + dy * dy
    best, index = 0, 0
    for i in range(1, len(points) - 1):
        px, py = points[i][0] - x, points[i][1] - y
        t = max(0, min(1, (px * dx + py * dy) / length)) if length else 0
        distance = (px - t * dx) ** 2 + (py - t * dy) ** 2
        if distance > best:
            best, index = distance, i
    if best <= tolerance * tolerance:
        return [points[0], points[-1]]
    return simplify(points[:index + 1], tolerance)[:-1] + simplify(points[index:], tolerance)


parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title">',
         '<title id="title">Apex Royale Drives</title>']
light_parts = parts.copy()
for color in sorted(color for _, color in image.getcolors()):
    rgb = palette[color * 3:color * 3 + 3]
    if max(rgb) < 24:
        continue
    edges = defaultdict(list)
    for y in range(height):
        for x in range(width):
            if pixels[x, y] != color:
                continue
            if y == 0 or pixels[x, y - 1] != color:
                edges[(x, y)].append((x + 1, y))
            if x == width - 1 or pixels[x + 1, y] != color:
                edges[(x + 1, y)].append((x + 1, y + 1))
            if y == height - 1 or pixels[x, y + 1] != color:
                edges[(x + 1, y + 1)].append((x, y + 1))
            if x == 0 or pixels[x - 1, y] != color:
                edges[(x, y + 1)].append((x, y))
    contours = []
    while edges:
        start = next(iter(edges))
        point, points = start, [start]
        while True:
            following = edges[point].pop()
            if not edges[point]:
                del edges[point]
            points.append(following)
            point = following
            if point == start:
                break
        area = abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(points, points[1:]))) / 2
        if area < 3:
            continue
        # Split the closed ring before simplification to preserve the silhouette.
        mid = len(points) // 2
        points = simplify(points[:mid + 1])[:-1] + simplify(points[mid:])
        contours.append('M' + ' '.join(f'{x},{y}' for x, y in points[:-1]) + 'Z')
    if contours:
        fill = '#' + ''.join(f'{c:02x}' for c in rgb)
        geometry = f'fill-rule="evenodd" d="{"".join(contours)}"/>'
        parts.append(f'<path fill="{fill}" {geometry}')
        # Reverse the silver shading for white surfaces, retaining the brand red.
        light_rgb = rgb if rgb[0] > 1.5 * max(rgb[1], rgb[2]) else [255 - c for c in rgb]
        light_fill = '#' + ''.join(f'{c:02x}' for c in light_rgb)
        light_parts.append(f'<path fill="{light_fill}" {geometry}')
parts.append('</svg>')
light_parts.append('</svg>')
for filename, content in [('logo.svg', parts), ('logo-light.svg', light_parts)]:
    target = ROOT / 'public/brand' / filename
    target.write_text('\n'.join(content), encoding='utf-8')
    print(f'Traced {width}x{height} artwork to {target.name}: {target.stat().st_size:,} bytes; transparent vector paths.')
