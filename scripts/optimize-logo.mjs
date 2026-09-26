import { mkdirSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const shareOnly = args.includes("--share") || args.every((a) => a.startsWith("-"));
const src =
  args.find((a) => !a.startsWith("-")) ?? join(root, "public/SD_Logo1.png");
const outDir = join(root, "public");
const appDir = join(root, "src/app");

mkdirSync(outDir, { recursive: true });
mkdirSync(appDir, { recursive: true });

const NAVY = { r: 0, g: 9, b: 28, alpha: 1 };

const trimmed = sharp(src).trim({ threshold: 2 }).ensureAlpha();
const meta = await trimmed.metadata();
const ratio = (meta.width ?? 1) / (meta.height ?? 1);
const webW = 1600;
const webH = Math.round(webW / ratio);
const buffer = await trimmed.toBuffer();

async function write(name, pipeline, dir = outDir) {
  const dest = join(dir, name);
  await pipeline.toFile(dest);
  const { size } = statSync(dest);
  console.log(`${name} ${(size / 1024).toFixed(1)} KB`);
  return dest;
}

if (!shareOnly) {
  await write(
    "SD_Logo1.png",
    sharp(buffer).resize(webW, webH, { kernel: "lanczos3" }).png({
      compressionLevel: 9,
      adaptiveFiltering: true,
    }),
  );

  const webp = sharp(buffer)
    .resize(800, Math.round(800 / ratio), { kernel: "lanczos3" })
    .webp({ quality: 78, effort: 6, alphaQuality: 90 });
  await write("SD_Logo1.webp", webp);
  await write(
    "starwall-logo.webp",
    sharp(buffer)
      .resize(800, Math.round(800 / ratio), { kernel: "lanczos3" })
      .webp({ quality: 78, effort: 6, alphaQuality: 90 }),
  );
  await write(
    "starwall-logo.avif",
    sharp(buffer)
      .resize(800, Math.round(800 / ratio), { kernel: "lanczos3" })
      .avif({ quality: 60, effort: 6 }),
  );
  await write(
    "SW3.png",
    sharp(buffer)
      .resize(800, Math.round(800 / ratio), { kernel: "lanczos3" })
      .png({ compressionLevel: 9, adaptiveFiltering: true }),
  );
}

const srcMeta = await sharp(src).metadata();
const starSize = Math.round(Math.min(srcMeta.width ?? 1, srcMeta.height ?? 1) * 0.72);
const starLeft = Math.max(0, Math.round((srcMeta.width ?? 1) * 0.41 - starSize / 2));
const starTop = Math.max(0, Math.round(((srcMeta.height ?? 1) - starSize) / 2));
const star = await sharp(src)
  .extract({
    left: Math.min(starLeft, Math.max(0, (srcMeta.width ?? 1) - starSize)),
    top: starTop,
    width: Math.min(starSize, srcMeta.width ?? starSize),
    height: Math.min(starSize, srcMeta.height ?? starSize),
  })
  .ensureAlpha()
  .png()
  .toBuffer();

async function tile(size, pad, { opaque = false } = {}) {
  const inner = Math.round(size - pad * 2);
  const fitted = await sharp(star)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const background = opaque ? NAVY : { r: 0, g: 0, b: 0, alpha: 0 };
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: fitted, gravity: "center" }])
    .png({ compressionLevel: 9 });
}

function pngToIco(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = 32;
  entry[1] = 32;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

await write("favicon-16.png", await tile(16, 1, { opaque: true }));
await write("favicon-32.png", await tile(32, 2, { opaque: true }));
await write("apple-touch-icon.png", await tile(180, 14, { opaque: true }));
await write("icon-192.png", await tile(192, 16, { opaque: true }));
await write("icon-512.png", await tile(512, 40, { opaque: true }));
await write("icon.png", await tile(32, 2, { opaque: true }), appDir);
await write("apple-icon.png", await tile(180, 14, { opaque: true }), appDir);

const fav32 = await sharp(join(outDir, "favicon-32.png")).png().toBuffer();
writeFileSync(join(outDir, "favicon.ico"), pngToIco(fav32));
console.log(`favicon.ico ${(statSync(join(outDir, "favicon.ico")).size / 1024).toFixed(1)} KB`);

const ogLogo = await sharp(buffer)
  .resize(980, 420, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    kernel: "lanczos3",
  })
  .png()
  .toBuffer();
const ogJpeg = await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: { r: NAVY.r, g: NAVY.g, b: NAVY.b },
  },
})
  .composite([{ input: ogLogo, gravity: "center" }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toBuffer();
writeFileSync(join(outDir, "og-stardome.jpg"), ogJpeg);
writeFileSync(join(outDir, "og-starwall.jpg"), ogJpeg);
writeFileSync(join(appDir, "opengraph-image.jpg"), ogJpeg);
writeFileSync(join(appDir, "twitter-image.jpg"), ogJpeg);
writeFileSync(join(appDir, "opengraph-image.alt.txt"), "StarDome\n");
writeFileSync(join(appDir, "twitter-image.alt.txt"), "StarDome\n");
console.log(`og-stardome.jpg ${(statSync(join(outDir, "og-stardome.jpg")).size / 1024).toFixed(1)} KB`);
console.log(`opengraph-image.jpg ${(statSync(join(appDir, "opengraph-image.jpg")).size / 1024).toFixed(1)} KB`);
console.log(`source ${meta.width}x${meta.height} → share 1200x630`);
