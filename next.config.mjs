/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [32, 48, 64, 96, 128, 180, 220, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
    instrumentationHook: true,
    serverComponentsExternalPackages: [
      "@prisma/client",
      "prisma",
      "msedge-tts",
      "ws",
      "isomorphic-ws",
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.cursor.com",
    "*.cursor.sh",
    "*.cursorusercontent.com",
  ],
  async redirects() {
    return [
      { source: "/api/auth/signin", destination: "/login", permanent: false },
      { source: "/api/auth/error", destination: "/login", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), geolocation=(), microphone=(self), payment=(), usb=(), interest-cohort=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/:file(SD_Logo1.png|SD_Logo1.webp|SW3.png|starwall-logo.webp|starwall-logo.avif|favicon.ico|favicon-16.png|favicon-32.png|apple-touch-icon.png|icon-192.png|icon-512.png|site.webmanifest)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:file(og-stardome.jpg|og-starwall.jpg|opengraph-image.jpg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/containers/:file(.*)\\.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
