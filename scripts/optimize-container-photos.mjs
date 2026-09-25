import { mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = "/home/ubuntu/.cursor/projects/workspace/assets";
const outDir = join(root, "public/containers");
mkdirSync(outDir, { recursive: true });

const jobs = [
  ["57400acd-6cb5-442d-b2c9-2aed5029b699.png", "agron-stardome-brand", 1800],
  ["f90aa218-bbbf-4ac1-b401-21af8776c14f.png", "stardome-harbor-black", 1400],
  ["14f30fed-07b8-4781-8846-37ccceb42644.png", "stardome-island-sand", 1400],
  ["5dbff3e2-f2ec-4646-9c48-c1befa6e4edf.png", "stardome-quay-white", 1400],
  ["85e19ffa-114a-4aa7-9958-1975025761fc.png", "stardome-deck-compact", 1400],
  ["0e9c9f11-d01e-4311-b7b0-e0e83bc70cc9.png", "agron-sites-three", 1800],
  ["9921f43e-d491-4428-83d6-f1fff5a32d14.png", "agron-sites-four", 1800],
];

for (const [file, name, width] of jobs) {
  const src = join(srcDir, file);
  const meta = await sharp(src).rotate().metadata();
  const height = Math.round((width / (meta.width ?? width)) * (meta.height ?? width));
  const dest = join(outDir, `${name}.webp`);
  await sharp(src)
    .rotate()
    .resize(width, height, { kernel: "lanczos3" })
    .webp({ quality: 80, effort: 6 })
    .toFile(dest);
  const { size } = statSync(dest);
  const outMeta = await sharp(dest).metadata();
  console.log(`${name}.webp ${outMeta.width}x${outMeta.height} ${(size / 1024).toFixed(0)} KB`);
}
