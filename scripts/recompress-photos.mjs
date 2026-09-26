import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dirs = [join(root, "public/containers"), join(root, "public/home")];

for (const dir of dirs) {
  for (const name of readdirSync(dir).filter((file) => file.endsWith(".webp"))) {
    const dest = join(dir, name);
    const before = statSync(dest).size;
    const image = sharp(dest);
    const meta = await image.metadata();
    const buffer = await image
      .webp({ quality: 76, effort: 6, alphaQuality: 88 })
      .toBuffer();
    if (buffer.length >= before) {
      console.log(`${name} keep ${(before / 1024).toFixed(0)} KB`);
      continue;
    }
    await sharp(buffer).toFile(dest);
    console.log(
      `${name} ${meta.width}x${meta.height} ${(before / 1024).toFixed(0)} → ${(buffer.length / 1024).toFixed(0)} KB`,
    );
  }
}
