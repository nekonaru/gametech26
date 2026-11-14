/** Diff dua JPEG pada grid 8x6 untuk melokalisasi area beda. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default ?? require('pixelmatch');
const jpegDecode = require('jpeg-js');

const aFile = process.argv[2];
const bFile = process.argv[3];
const a = jpegDecode.decode(fs.readFileSync(aFile), { useTArray: true });
const b = jpegDecode.decode(fs.readFileSync(bFile), { useTArray: true });
if (a.width !== b.width || a.height !== b.height) {
  console.error(`ukuran beda: ${a.width}x${a.height} vs ${b.width}x${b.height}`);
  process.exit(1);
}
const { width: w, height: h } = a;
const diff = new PNG({ width: w, height: h });
const n = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.15 });
console.log(`total piksel beda: ${n} (${((n / (w * h)) * 100).toFixed(2)}%)`);

const COLS = 8;
const ROWS = 6;
const cw = Math.ceil(w / COLS);
const ch = Math.ceil(h / ROWS);
const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    // pixelmatch menandai piksel beda dengan merah terang pada diff
    if (diff.data[i] > 200 && diff.data[i + 1] < 100 && diff.data[i + 2] < 100) {
      grid[Math.floor(y / ch)][Math.floor(x / cw)]++;
    }
  }
}
for (let r = 0; r < ROWS; r++) {
  console.log(grid[r].map((v) => String(v).padStart(6)).join(''));
}
// Simpan diff untuk dilihat
fs.writeFileSync(path.join(os.tmpdir(), 'dapur-diff.png'), PNG.sync.write(diff));
console.log(`diff PNG: ${path.join(os.tmpdir(), 'dapur-diff.png')}`);
