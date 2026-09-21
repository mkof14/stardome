import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/backend",
        "/backend/",
        "/tasks",
        "/pricing/desk",
        "/forgot-password",
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
