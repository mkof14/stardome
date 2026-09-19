import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2];
const outDir = join(root, "public");

if (!src) {
  console.error("usage: node scripts/optimize-logo.mjs <source.png>");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const trimmed = sharp(src).trim({ threshold: 2 }).ensureAlpha();
const meta = await trimmed.metadata();
const ratio = (meta.width ?? 1) / (meta.height ?? 1);
const webW = 800;
const webH = Math.round(webW / ratio);
const pngW = 800;
const pngH = webH;
const buffer = await trimmed.toBuffer();

async function write(name, pipeline) {
  const dest = join(outDir, name);
  await pipeline.toFile(dest);
  const { size } = await sharp(dest).metadata().then(async () => {
    const { statSync } = await import("node:fs");
    return statSync(dest);
  });
  console.log(`${name} ${(size / 1024).toFixed(1)} KB`);
  return dest;
}

await write(
  "starwall-logo.webp",
  sharp(buffer).resize(webW, webH, { kernel: "lanczos3" }).webp({ quality: 74, effort: 6, alphaQuality: 88 }),
);

await write(
  "starwall-logo.avif",
  sharp(buffer).resize(webW, webH, { kernel: "lanczos3" }).avif({ quality: 58, effort: 6 }),
);

await write(
  "SW3.png",
  sharp(buffer)
    .resize(pngW, pngH, { kernel: "lanczos3" })
    .png({ compressionLevel: 9, quality: 80, adaptiveFiltering: true }),
);

async function badge(size, pad) {
  const inner = Math.round(size - pad * 2);
  const fitted = await sharp(buffer)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: fitted, gravity: "center" }])
    .png({ compressionLevel: 9 });
}

await write("favicon-32.png", await badge(32, 2));
await write("apple-touch-icon.png", await badge(180, 12));

const ogLogo = await sharp(buffer)
  .resize(780, Math.round(780 / ratio), { kernel: "lanczos3" })
  .png()
  .toBuffer();
await write(
  "og-starwall.jpg",
  sharp({
    create: { width: 1200, height: 630, channels: 3, background: { r: 0, g: 9, b: 28 } },
  })
    .composite([{ input: ogLogo, gravity: "center" }])
    .jpeg({ quality: 84, mozjpeg: true }),
);

console.log(`source ${meta.width}x${meta.height} → web ${webW}x${webH} png ${pngW}x${pngH}`);
