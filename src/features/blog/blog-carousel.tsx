"use client";

import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { client } from "../../../sanity/client";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset })
        .image(source)
        .auto("format")
        .fit("crop")
        .width(400)
        .height(400)
        .url()
    : null;

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  image?: SanityImageSource;
};

interface Props {
  posts: Post[];
}

export default function BlogCarousel({ posts }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  };

  if (posts.length === 0) return null;

  return (
    <section className="px-4 py-6 md:px-12 lg:px-20">
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-zinc-900">Panduan Wisata</h2>
          <Link
            href="/artikel"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition"
          >
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      >
        {posts.map((post) => {
          const imgUrl = post.image ? urlFor(post.image) : null;

          return (
            <Link
              key={post._id}
              href={`/artikel/${post.slug.current}`}
              className="group flex w-48 shrink-0 flex-col gap-2"
            >
              <div className="relative h-48 w-48 overflow-hidden rounded-2xl bg-zinc-200">
                {imgUrl ? (
                  <Image
                    fill
                    src={imgUrl}
                    alt={post.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                ) : null}
              </div>
              <p className="line-clamp-3 text-sm text-zinc-800">{post.title}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
