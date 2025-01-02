import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../sanity/lib/image"; // Ensure correct import

type Post = {
  image: any; // Adjust type based on your schema
  title: string;
  summary: string;
  slug: string;
};

export default function BlogCard({ post }: { post: Post }) {
  return (
    <section className="flex flex-col justify-between h-[480px] rounded bg-light/90 dark:bg-dark/40 shadow-md shadow-gray-300 dark:shadow-black/80 group hover:scale-105 transition-transform ease-out duration-700">
      {/* Image Section */}
      <div className="relative max-h-76 flex-1">
        <Image
          src={urlFor(post.image).url() || "/placeholder.jpg"} // Ensure fallback URL
          alt={post.title || "Blog Post"}
          fill
          className="object-cover rounded-t"
        />
      </div>

      {/* Title and Summary */}
      <div className="flex flex-col justify-between gap-y-4 p-4">
        <h2 className="text-lg font-semibold line-clamp-2 text-dark dark:text-light leading-tight mb-2">
          {post.title}
        </h2>
        <p className="text-dark/70 dark:text-light/70 line-clamp-3">
          {post.summary}
        </p>

        {/* Read More Dynamic Link */}
        <div className="flex justify-center">
          <Link
            href={`/blog/${post.slug}`}
            className="block w-60 px-4 py-1 text-center text-white bg-black hover:bg-gray-600 rounded text-light font-semibold mt-4"
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}