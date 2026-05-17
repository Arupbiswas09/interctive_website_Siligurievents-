import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/schemas";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/",
          "/api/*",
          "/preview",
          "/*?preview=*",
          "/design",
          "/design/*",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
