"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Baby, Car, Hash, Search, Sparkles, SunMedium } from "lucide-react";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog";

const categoryIcons = {
  "Life Path": SunMedium,
  Vehicle: Car,
  "Baby Names": Baby,
  "Master Numbers": Sparkles,
  "Personal Year": Hash,
};

export function BlogListing({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<(typeof BLOG_CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const term = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery =
        term.length === 0 ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.category.toLowerCase().includes(term);

      return matchesCategory && matchesQuery;
    });
  }, [category, posts, query]);

  const [featured, ...remaining] = filteredPosts;

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {BLOG_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                category === item
                  ? "border-[color:var(--saffron-gold)] text-white shadow-[0_8px_24px_var(--shadow-gold)]"
                  : "border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--saffron-gold)] hover:text-[color:var(--saffron-gold)]"
              }`}
              style={
                category === item
                  ? { background: "linear-gradient(135deg, var(--saffron-gold), var(--molten-amber))" }
                  : { background: "var(--celestial-cream)" }
              }
            >
              {item}
            </button>
          ))}
        </div>

        <label className="relative block w-full lg:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search insights"
            className="w-full rounded-full border border-[color:var(--border)] bg-[color:var(--celestial-cream)] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[color:var(--saffron-gold)] focus:shadow-[0_0_0_4px_rgba(232,160,32,0.1)]"
          />
        </label>
      </div>

      {featured ? (
        <FeaturedPost post={featured} />
      ) : (
        <div
          className="mt-12 rounded-2xl p-10 text-center text-sm text-[color:var(--text-secondary)]"
          style={{ border: "1px dashed rgba(232,160,32,0.2)", background: "rgba(232,160,32,0.03)" }}
        >
          No posts match this filter yet.
        </div>
      )}

      {remaining.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {remaining.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  const Icon = categoryIcons[post.category as keyof typeof categoryIcons] ?? Sparkles;

  return (
    <article className="card-premium mt-12 grid overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
      <div
        className="flex min-h-[320px] items-center justify-center text-[color:var(--saffron-gold)]"
        style={{
          background: "linear-gradient(135deg, rgba(232,160,32,0.08), rgba(43,45,110,0.05))",
        }}
      >
        <Icon className="h-24 w-24" strokeWidth={1.15}
          style={{ filter: "drop-shadow(0 0 20px rgba(232,160,32,0.2))" }}
        />
      </div>
      <div className="flex flex-col justify-center p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-medium text-[#D4700A]"
            style={{ background: "rgba(232, 160, 32, 0.08)" }}
          >
            Featured · {post.category}
          </span>
          <time className="text-xs text-[color:var(--text-muted)]">{formatDate(post.publishedAt)}</time>
        </div>
        <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-[color:var(--sacred-indigo)]">
          {post.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">{post.excerpt}</p>
        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-xs text-[color:var(--text-muted)]">{post.readTime}</p>
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-[color:var(--saffron-gold)] transition hover:text-[color:var(--molten-amber)]"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  const Icon = categoryIcons[post.category as keyof typeof categoryIcons] ?? Sparkles;

  return (
    <article className="card-premium overflow-hidden transition-all duration-300 hover:shadow-[0_28px_60px_var(--shadow-gold)]">
      <div
        className="flex h-48 items-center justify-center text-[color:var(--saffron-gold)]"
        style={{
          background: "linear-gradient(135deg, rgba(232,160,32,0.08), rgba(43,45,110,0.05))",
        }}
      >
        <Icon className="h-11 w-11" strokeWidth={1.3}
          style={{ filter: "drop-shadow(0 0 12px rgba(232,160,32,0.2))" }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-medium text-[color:var(--saffron-gold)]"
            style={{ background: "rgba(232,160,32,0.08)" }}
          >
            {post.category}
          </span>
          <time className="text-xs text-[color:var(--text-muted)]">{formatDate(post.publishedAt)}</time>
        </div>
        <h3 className="mt-5 font-display text-[22px] font-bold leading-7 text-[color:var(--sacred-indigo)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--text-secondary)]">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex text-sm font-medium text-[color:var(--saffron-gold)] transition hover:text-[color:var(--molten-amber)]"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
