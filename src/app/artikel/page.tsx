import { Footer } from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/navbar/navbar";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import type { SanityDocument } from "next-sanity";
import { cookies } from "next/headers";
import Link from "next/link";
import { client } from "../../../sanity/client";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset })
        .image(source)
        .auto("format")
        .url()
    : null;

export const metadata: Metadata = {
  title: "Artikel & Tips Wisata Dieng",
  description:
    "Baca artikel terbaru seputar wisata Dieng, tips perjalanan, penginapan, dan keindahan alam kawasan Dieng Wonosobo.",
};

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...20]{
  _id,
  title,
  slug,
  publishedAt,
  image,
  "excerpt": pt::text(body)[0...160],
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
  "categories": categories[]->title
}`;

const options = { next: { revalidate: 60 } };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Hero post (large, left) ───────────────────────────────────────────────────

function HeroCard({ post }: { post: SanityDocument }) {
  const imgUrl = post.image ? urlFor(post.image) : null;

  return (
    <Link
      href={`/artikel/${post.slug.current}`}
      className="group relative flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-2xl bg-zinc-900"
    >
      {imgUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-65"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-emerald-700 to-teal-900" />
      )}
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />

      <div className="relative z-10 flex flex-col gap-2.5 p-5 md:p-6">
        {post.categories?.[0] && (
          <span className="w-fit rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            {post.categories[0]}
          </span>
        )}
        <h2 className="text-lg font-bold leading-snug text-white transition group-hover:text-emerald-200 md:text-xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="line-clamp-2 text-xs leading-relaxed text-white/70">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(post.publishedAt)}
          </span>
          {post.estimatedReadingTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.estimatedReadingTime} mnt baca
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Side post (compact, stacked right) ───────────────────────────────────────

function SideCard({ post }: { post: SanityDocument }) {
  const imgUrl = post.image ? urlFor(post.image) : null;

  return (
    <Link
      href={`/artikel/${post.slug.current}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-100 transition hover:shadow-md"
    >
      <div className="relative aspect-video shrink-0 overflow-hidden bg-zinc-100">
        {imgUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgUrl}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100 text-2xl">
            🏔️
          </div>
        )}
        {post.categories?.[0] && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white shadow">
            {post.categories[0]}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Calendar size={11} />
          {formatDate(post.publishedAt)}
          {post.estimatedReadingTime > 0 && (
            <>
              <span>·</span>
              <Clock size={11} />
              {post.estimatedReadingTime} mnt
            </>
          )}
        </div>
        <h3 className="line-clamp-2 font-bold leading-snug text-zinc-900 transition group-hover:text-emerald-700">
          {post.title}
        </h3>
        <div className="mt-auto flex items-center gap-1 pt-1 text-xs font-semibold text-emerald-700">
          Baca selengkapnya
          <ChevronRight
            size={12}
            className="transition group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}

// ── Regular article card ──────────────────────────────────────────────────────

function ArticleCard({ post }: { post: SanityDocument }) {
  const imgUrl = post.image ? urlFor(post.image) : null;

  return (
    <Link
      href={`/artikel/${post.slug.current}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition hover:shadow-md"
    >
      {/* image */}
      <div className="relative aspect-video overflow-hidden bg-zinc-100">
        {imgUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgUrl}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
            <span className="text-3xl">🏔️</span>
          </div>
        )}
        {post.categories?.[0] && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
            {post.categories[0]}
          </span>
        )}
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2.5 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(post.publishedAt)}
          </span>
          {post.estimatedReadingTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.estimatedReadingTime} mnt
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 font-bold leading-snug text-zinc-900 transition group-hover:text-emerald-700">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-1 pt-1 text-xs font-semibold text-emerald-700">
          Baca selengkapnya
          <ChevronRight
            size={13}
            className="transition group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ArtikelPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  const [featured, second, third] = posts;
  const rest = posts.slice(1);

  return (
    <>
      <Navbar token={token?.value} />

      {/* Hero */}
      <section className="bg-linear-to-b from-emerald-50 to-white pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Blog & Artikel
            </span>
            <h1 className="mt-3 text-3xl font-bold text-zinc-900 md:text-4xl">
              Tips &amp; Cerita Wisata Dieng
            </h1>
            <p className="mt-3 text-base text-zinc-500">
              Panduan perjalanan, rekomendasi penginapan, dan cerita seru dari
              kawasan Dieng Wonosobo untuk membantu merencanakan petualangan
              Anda.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-20 lg:px-12">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl">📝</span>
            <h2 className="mt-4 text-lg font-semibold text-zinc-700">
              Belum ada artikel
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Pantau terus — konten menarik segera hadir!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {/* Editorial featured: hero kiri + 2 kartu kanan */}
            {featured && (
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-0.5 w-8 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Artikel Terbaru
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-5 md:grid-rows-2 md:h-120">
                  {/* hero — ambil 3 kolom */}
                  <div className="md:col-span-3 md:row-span-2">
                    <HeroCard post={featured} />
                  </div>
                  {/* side atas */}
                  {second && (
                    <div className="md:col-span-2 md:row-span-1">
                      <SideCard post={second} />
                    </div>
                  )}
                  {/* side bawah */}
                  {third && (
                    <div className="md:col-span-2 md:row-span-1">
                      <SideCard post={third} />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Grid semua artikel */}
            {rest.length > 0 && (
              <section>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-0.5 w-8 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                      Semua Artikel
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {rest.length} artikel
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <ArticleCard key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
