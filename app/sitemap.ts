import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

const staticPages: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.85 },
  { path: "/guide", changeFrequency: "monthly", priority: 0.95 },
  { path: "/book", changeFrequency: "weekly", priority: 0.9 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.75 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.55 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
];

type SanitySitemapPost = {
  lastModified?: string;
  slug: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogPosts = await getBlogPostsForSitemap();

  return [
    ...staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.lastModified ? new Date(post.lastModified) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

async function getBlogPostsForSitemap(): Promise<SanitySitemapPost[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    return BLOG_POSTS.map((post) => ({
      slug: post.slug,
      lastModified: post.publishedAt,
    }));
  }

  const query = encodeURIComponent(
    '*[_type == "post" && defined(slug.current)]{"slug": slug.current, "lastModified": coalesce(_updatedAt, publishedAt)}',
  );
  const url = `https://${projectId}.api.sanity.io/v2025-05-23/data/query/${dataset}?query=${query}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      throw new Error("Sanity sitemap fetch failed.");
    }

    const payload = (await response.json()) as { result?: SanitySitemapPost[] };
    const posts = payload.result ?? [];

    if (posts.length === 0) {
      return BLOG_POSTS.map((post) => ({
        slug: post.slug,
        lastModified: post.publishedAt,
      }));
    }

    return posts;
  } catch {
    return BLOG_POSTS.map((post) => ({
      slug: post.slug,
      lastModified: post.publishedAt,
    }));
  }
}
