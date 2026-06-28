import { type SanityImageSource } from "@sanity/image-url";
import type { SanityDocument } from "next-sanity";
import { client } from "../../../sanity/client";
import BlogCarousel from "./blog-carousel";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...10]{
  _id,
  title,
  slug,
  publishedAt,
  image
}`;

const options = { next: { revalidate: 60 } };

export default async function BlogSection() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <BlogCarousel
      posts={posts.map((p) => ({
        _id: p._id,
        title: p.title,
        slug: p.slug,
        publishedAt: p.publishedAt,
        image: p.image as SanityImageSource | undefined,
      }))}
    />
  );
}
