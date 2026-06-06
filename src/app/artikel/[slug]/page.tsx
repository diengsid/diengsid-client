import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import type { Metadata } from "next";
import { PortableText, type SanityDocument } from "next-sanity";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "../../../../sanity/client";
import Navbar from "@/components/shared/navbar/navbar";
import { Footer } from "@/components/shared/footer/footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source).auto("format").url()
    : null;

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  image,
  body,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
}`;

const RELATED_QUERY = `*[
  _type == "post"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...3]{
  _id, title, slug, publishedAt,
  image,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
}`;

const options = { next: { revalidate: 60 } };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug }, options);
  if (!post) return { title: "Artikel tidak ditemukan" };

  const imgUrl = post.image ? urlFor(post.image) : undefined;

  return {
    title: post.title,
    description: `Baca artikel "${post.title}" di Diengs.id`,
    openGraph: {
      title: post.title,
      images: imgUrl ? [imgUrl] : [],
    },
  };
}

// ── Related card ──────────────────────────────────────────────────────────────

function RelatedCard({ post }: { post: SanityDocument }) {
  const imgUrl = post.image ? urlFor(post.image) : null;

  return (
    <Link
      href={`/artikel/${post.slug.current}`}
      className="group flex gap-3 rounded-xl p-2 transition hover:bg-zinc-50"
    >
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        {imgUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgUrl}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-50 text-lg">
            🏔️
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-800 transition group-hover:text-emerald-700">
          {post.title}
        </p>
        <p className="text-xs text-zinc-400">{formatDate(post.publishedAt)}</p>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const [post, related] = await Promise.all([
    client.fetch<SanityDocument>(POST_QUERY, { slug }, options),
    client.fetch<SanityDocument[]>(RELATED_QUERY, { slug }, options),
  ]);

  if (!post) notFound();

  const heroUrl = post.image ? urlFor(post.image) : null;

  return (
    <>
      <Navbar token={token?.value} />

      {/* ── Hero image ── */}
      {heroUrl ? (
        <div className="relative h-[50vh] min-h-72 w-full overflow-hidden bg-zinc-900 pt-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroUrl}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-4xl px-6 pb-8 lg:px-8">
            <h1 className="text-2xl font-bold leading-snug text-white drop-shadow md:text-4xl">
              {post.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(post.publishedAt)}
              </span>
              {post.estimatedReadingTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.estimatedReadingTime} menit baca
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-linear-to-b from-emerald-50 to-white pb-8 pt-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h1 className="text-2xl font-bold leading-snug text-zinc-900 md:text-4xl">
              {post.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(post.publishedAt)}
              </span>
              {post.estimatedReadingTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.estimatedReadingTime} menit baca
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Body + Sidebar ── */}
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">

          {/* ── Article body ── */}
          <article className="min-w-0 flex-1">
            <Link
              href="/artikel"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-emerald-700"
            >
              <ArrowLeft size={15} />
              Kembali ke artikel
            </Link>

            <div className="prose prose-zinc prose-sm max-w-none
              prose-headings:font-bold prose-headings:text-zinc-900
              prose-h2:text-xl prose-h3:text-lg
              prose-p:text-zinc-600 prose-p:leading-relaxed
              prose-a:text-emerald-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-strong:text-zinc-800
              prose-blockquote:border-l-emerald-400 prose-blockquote:text-zinc-500 prose-blockquote:italic
              prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-emerald-700
              prose-img:rounded-xl prose-img:shadow-sm
              prose-hr:border-zinc-200
              md:prose-base"
            >
              {Array.isArray(post.body) && <PortableText value={post.body} />}
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="w-full shrink-0 lg:w-72 xl:w-80">
            <div className="sticky top-24 flex flex-col gap-6">

              <Link
                href="/artikel"
                className="hidden items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-emerald-700 lg:flex"
              >
                <ArrowLeft size={15} />
                Kembali ke artikel
              </Link>

              {/* Related articles */}
              {related.length > 0 && (
                <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Artikel Terkait
                  </p>
                  <div className="flex flex-col gap-1">
                    {related.map((r) => (
                      <RelatedCard key={r._id} post={r} />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 p-5 text-white">
                <p className="font-bold leading-snug">
                  Rencanakan wisata Dieng Anda
                </p>
                <p className="mt-1.5 text-sm text-emerald-100">
                  Temukan penginapan dan paket tour terbaik di kawasan Dieng Wonosobo.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Cari Penginapan →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
