import type { Metadata } from "next";
import { BlogListing } from "@/components/blog/BlogListing";
import { StarField } from "@/components/effects/StarField";
import { JsonLd } from "@/components/seo/JsonLd";
import { BLOG_POSTS } from "@/lib/blog";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Numerology Blog",
  description:
    "Read NumeroSoul numerology insights on life path numbers, baby names, vehicle numbers, master numbers, and personal year cycles.",
};

export default function BlogPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <div className="page-shell selection:bg-[#E8A020]/20 selection:text-[#E8A020]">
        {/* Hero */}
        <section className="page-hero">
          {/* Animated stars */}
          <StarField starCount={35} color="gold" className="opacity-[0.25] z-0" />
          <StarField starCount={15} color="white" className="opacity-[0.15] z-0" />

          <div className="page-hero-inner">
            <p className="eyebrow text-[#D4700A]">✦ Numerology Insights ✦</p>
            <h1 className="page-title">
              Latest <span className="page-title-accent">Insights</span>
            </h1>
            <p className="page-subtitle">
              Guides for names, dates, vehicles, compatibility, personal years,
              and the number patterns woven through everyday decisions.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="mx-auto max-w-7xl">
            <BlogListing posts={BLOG_POSTS} />
          </div>
        </section>
      </div>
    </>
  );
}
