// Usage: npm run fixture -- <AUTH:CODE | WKT | PROJJSON | file> [--format WKT2:2019|WKT1:GDAL|PROJJSON] [--point lon,lat]
//
// Transforms a point from WGS 84 with proj4js, using the definition parsed by
// wkt-parser, and with PROJ's cs2cs. If the results agree, prints a fixture for
// test/test-fixtures.json.
//
// Requires PROJ (projinfo, cs2cs) and proj4js, which is not a dependency so it
// doesn't get in the way of npm link. Install it with `npm install --no-save proj4`.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import wktParser from '../index.js';

const usage = 'Usage: npm run fixture -- <AUTH:CODE | WKT | PROJJSON | file> [--format WKT2:2019|WKT1:GDAL|PROJJSON] [--point lon,lat]';

function option(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args.splice(index, 2)[1];
}

function run(command, args, input) {
  return execFileSync(command, args, { encoding: 'utf8', input }).trim();
}

// Center of the area of use, from the first BBOX[south,west,north,east] of the WKT2 representation
function areaOfUseCenter(definition) {
  const wkt2 = run('projinfo', ['-o', 'WKT2:2019', '-q', '--single-line', definition]);
  const match = wkt2.match(/BBOX\[([^\]]+)\]/);
  if (!match) {
    return undefined;
  }
  const [south, west, north, east] = match[1].split(',').map(Number);
  let lon = (west + (east < west ? east + 360 : east)) / 2;
  if (lon > 180) {
    lon -= 360;
  }
  return [lon, (south + north) / 2];
}

let proj4;
try {
  proj4 = (await import('proj4')).default;
} catch {
  console.error('proj4js not found. Install it with `npm install --no-save proj4`.');
  process.exit(2);
}

const args = process.argv.slice(2);
const format = option(args, '--format') || 'WKT2:2019';
const pointOption = option(args, '--point');
const input = args[0];
if (!input) {
  console.error(usage);
  process.exit(2);
}

const definition = existsSync(input) ? readFileSync(input, 'utf8').trim() : input;
const code = /^\w+:\w+$/.test(definition) ?
  run('projinfo', ['-o', format, '-q', '--single-line', '--boundcrs-to-wgs84', definition]) :
  definition;
const source = code.startsWith('{') ? JSON.parse(code) : code;
const parsed = wktParser(source);

const point = pointOption ? pointOption.split(',').map(Number) : areaOfUseCenter(definition);
if (!point) {
  console.error('The definition has no area of use. Provide a test point with --point lon,lat.');
  process.exit(2);
}

// Both outputs are in the axis order of the CRS
const expected = run('cs2cs', ['-f', '%.10f', 'OGC:CRS84', code], `${point[0]} ${point[1]}`)
  .split(/\s+/).slice(0, 2).map(Number);
// proj4js modifies the definition object it is given
const got = proj4('EPSG:4326', structuredClone(parsed)).forward(point.slice(), true);
// Same transformation with proj4js, but from PROJ's PROJ string, to tell wkt-parser issues from proj4js issues
const projString = run('projinfo', ['-o', 'PROJ', '-q', code]);
const reference = proj4('EPSG:4326', proj4.Proj(projString)).forward(point.slice(), true);

const tolerance = parsed.projName === 'longlat' ? 1e-8 : 1e-3;
const agree = (a, b) => b.every((value, i) => Math.abs(a[i] - value) <= tolerance);
const agrees = agree(got, expected);

console.error(`WGS 84 ${point.join(', ')}`);
console.error(`  PROJ:    ${expected.join(', ')}`);
console.error(`  proj4js: ${got.join(', ')}`);
console.error(`  proj4js with ${projString}: ${reference.join(', ')}`);
if (!agrees) {
  console.error('proj4js with wkt-parser does not agree with PROJ');
  if (agree(reference, expected)) {
    console.error('proj4js with the PROJ string agrees, so the difference likely comes from wkt-parser.');
  } else if (agree(reference, got)) {
    console.error('proj4js with the PROJ string has the same result, so the difference likely comes from proj4js.');
  }
  if (!/TOWGS84|ABRIDGEDTRANSFORMATION|BoundCRS/i.test(code)) {
    console.error('The definition has no datum transformation, so the difference may come from PROJ choosing a different one than proj4js.');
  }
  process.exit(1);
}
console.error('proj4js with wkt-parser agrees with PROJ');
console.log(JSON.stringify({ code: source, value: parsed }, null, 2));
