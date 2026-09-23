import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { siteUrl } from "@/lib/site-url";
import {
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
  Noto_Sans_Arabic,
  Noto_Sans_Hebrew,
  Space_Grotesk,
} from "next/font/google";
import { Helm } from "@/components/bridge/starwall-assistant";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeScript } from "@/components/theme-script";
import { AuthSessionProvider } from "@/lib/auth-session";
import { BlackBoxProvider } from "@/lib/black-box";
import { BridgeSessionProvider } from "@/lib/bridge-session";
import { PreferencesProvider } from "@/lib/i18n/context";
import { AgronViewProvider } from "@/lib/agron-view";
import { ModeProvider } from "@/lib/mode";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const notoHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hebrew",
  display: "swap",
});

function requestOrigin() {
  try {
    const h = headers();
    const host = (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim();
    if (!host) return siteUrl();
    const proto =
      h.get("x-forwarded-proto")?.split(",")[0].trim() ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`;
  } catch {
    return siteUrl();
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const origin = requestOrigin();
  return {
    metadataBase: new URL(origin),
    title: {
      default: "StarWall by AGRON — Maritime Security Intelligence",
      template: "%s",
    },
    description:
      "Intelligence, integration, and decision support for yacht, marina, port, and private island security.",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title: "StarWall by AGRON — Maritime Security Intelligence",
      description:
        "Intelligence, integration, and decision support for yacht, marina, port, and private island security.",
      type: "website",
      url: origin,
      siteName: "StarWall",
      images: [
        {
          url: "/og-starwall.jpg",
          width: 1200,
          height: 630,
          alt: "StarWall",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "StarWall by AGRON — Maritime Security Intelligence",
      description:
        "Intelligence, integration, and decision support for yacht, marina, port, and private island security.",
      images: ["/og-starwall.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${inter.variable} ${notoArabic.variable} ${notoHebrew.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col">
        <ModeProvider>
          <PreferencesProvider>
            <AuthSessionProvider>
              <BridgeSessionProvider>
                <AgronViewProvider>
                <BlackBoxProvider>
                  <SiteHeader />
                  <main className="flex-1">{children}</main>
                  <SiteFooter />
                  <Helm />
                </BlackBoxProvider>
                </AgronViewProvider>
              </BridgeSessionProvider>
            </AuthSessionProvider>
          </PreferencesProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
