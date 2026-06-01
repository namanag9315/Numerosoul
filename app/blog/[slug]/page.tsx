import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Sparkles, UserRound } from "lucide-react";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { StarField } from "@/components/effects/StarField";
import { JsonLd } from "@/components/seo/JsonLd";
import { Divider } from "@/components/ui/Divider";
import { BLOG_POSTS, getBlogPost, getRelatedPosts } from "@/lib/blog";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Blog Post — NumeroSoul",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://numerosoul.in";
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const relatedPosts = getRelatedPosts(post.slug, post.category);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd data={articleJsonLd(post)} />
      <div className="relative selection:bg-[#E8A020]/20 selection:text-[#E8A020]">
      <section className="relative overflow-hidden px-6 pb-16 pt-32 sm:px-10 lg:px-16" style={{ background: 'radial-gradient(ellipse at 20% 50%, #FFF8EE 0%, #FAF3E0 50%, #F5EFE2 100%)' }}>
        {/* Animated stars */}
        <StarField starCount={35} color="gold" className="opacity-[0.25] z-0" />
        <StarField starCount={15} color="white" className="opacity-[0.15] z-0" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--saffron-gold)] transition hover:text-[color:var(--molten-amber)]">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="rounded-full px-3 py-1 text-xs font-medium text-[#D4700A]" style={{ background: 'rgba(232, 160, 32, 0.08)' }}>
                {post.category}
              </span>
              <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-[color:var(--sacred-indigo)]">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-5 text-sm text-[color:var(--text-secondary)]">
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-[color:var(--saffron-gold)]" />
                  {post.author}
                </span>
                <time className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[color:var(--saffron-gold)]" />
                  {formatDate(post.publishedAt)}
                </time>
                <span>{post.readTime}</span>
              </div>
            </div>
            <div className="card-premium flex min-h-[320px] items-center justify-center text-[color:var(--saffron-gold)]" style={{ background: 'linear-gradient(135deg, rgba(232,160,32,0.08), rgba(43,45,110,0.05))' }}>
              <Sparkles className="h-24 w-24" strokeWidth={1.1} style={{ filter: 'drop-shadow(0 0 20px rgba(232,160,32,0.2))' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16" style={{ background: 'radial-gradient(circle at 50% 50%, #FFFDF9 0%, #FAF6EE 60%, #F5EFE2 100%)' }}>
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl p-5" style={{ background: 'rgba(255,253,249,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(232,160,32,0.15)', boxShadow: '0 16px 40px rgba(15,23,42,0.04)' }}>
              <p className="eyebrow text-xs text-[#D4700A]">Contents</p>
              <nav className="mt-4 space-y-3">
                {post.sections.map((section) => (
                  <a
                    key={section.heading}
                    href={`#${slugify(section.heading)}`}
                    className="block text-sm leading-5 text-[color:var(--text-secondary)] transition hover:text-[#E8A020]"
                  >
                    {section.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="card-premium p-7 sm:p-10">
            <p className="text-lg leading-8 text-[color:var(--text-secondary)]">{post.excerpt}</p>
            <Divider className="my-10" />
            {post.sections.map((section) => (
              <section key={section.heading} id={slugify(section.heading)} className="scroll-mt-28">
                <h2 className="mt-10 font-display text-4xl font-bold text-[color:var(--sacred-indigo)] first:mt-0">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-5 text-base leading-8 text-[color:var(--text-secondary)]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>

          <aside>
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,253,249,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(232,160,32,0.15)', boxShadow: '0 12px 36px rgba(15,23,42,0.04)' }}>
                <p className="font-display text-2xl font-bold text-[color:var(--sacred-indigo)]">
                  Share this guide
                </p>
                <div className="mt-4">
                  <ShareButtons title={post.title} url={postUrl} />
                </div>
              </div>
              <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(145deg, rgba(232,160,32,0.08), rgba(212,112,10,0.04))', border: '1px solid rgba(232,160,32,0.15)', boxShadow: '0 12px 36px rgba(232,160,32,0.08)' }}>
                <p className="font-display text-2xl font-bold text-[color:var(--sacred-indigo)]">
                  Want a personalised reading?
                </p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
                  Bring your birth date, full name, and current question into a
                  focused session.
                </p>
                <Link href="/book" className="mt-5 inline-flex text-sm font-medium text-[color:var(--saffron-gold)] transition hover:text-[color:var(--molten-amber)]">
                  Book now →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="px-6 py-16 sm:px-10 lg:px-16" style={{ background: 'linear-gradient(to bottom, #FFFDF9 0%, #FAF6EE 50%, #F5EFE2 100%)', borderTop: '1px solid rgba(232, 160, 32, 0.12)' }}>
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-4xl font-bold text-[color:var(--sacred-indigo)]">Related Posts</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="card-premium p-6 transition-all duration-300 hover:shadow-[0_28px_60px_var(--shadow-gold)]"
                >
                  <span className="text-xs font-medium text-[color:var(--saffron-gold)]">{relatedPost.category}</span>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-7 text-[color:var(--sacred-indigo)]">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      </div>
    </>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
