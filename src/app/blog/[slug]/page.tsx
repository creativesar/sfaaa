// Import necessary libraries and modules
import Image from "next/image";
import { client } from "@/sanity/lib/client"; // Sanity client for fetching data
import { urlFor } from "@/sanity/lib/image"; // Helper function to get image URLs
import { PortableText } from "@portabletext/react"; // Render rich text content
import Comments from "@/components/Comments"; // Comments component

// Revalidate the page data every 60 seconds for ISR (Incremental Static Regeneration)
export const revalidate = 60;

// Generate static params for all posts
export async function generateStaticParams() {
  const query = `*[_type=='post']{ "slug": slug.current }`;
  try {
    const slugs = await client.fetch(query); // Fetch slugs from Sanity
    return slugs.map((item: { slug: any; }) => ({ slug: item.slug })); // Return slugs as params
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return []; // Return empty array in case of error
  }
}

// BlogPostPage Component: Render a specific blog post
interface Params {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params: { slug } }: Params) {
  // Query to fetch the blog post by its slug
  const query = `*[_type=='post' && slug.current == $slug]{
    title, summary, image, content,
    author->{bio, image, name}
  }[0]`;

  // Fetch post data from Sanity
  const post = await client.fetch(query, { slug }).catch((err) => {
    console.error("Failed to fetch post:", err);
    return null; // Return null in case of error
  });

  // If no post is found, display a "Post not found" message
  if (!post) {
    return <div>Post not found</div>;
  }

  // Destructure post data
  const { title, summary, image, content, author } = post;

  // Render the blog post
  return (
    <article className="mt-12 mb-24 px-4 lg:px-24 flex flex-col gap-y-12">
      {/* Post Title */}
      <h1
        className="text-3xl lg:text-6xl font-bold text-center text-dark dark:text-light"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {title}
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Post Image */}
        <div className="lg:w-1/2">
          <Image
            src={urlFor(image).url()}
            width={600}
            height={600}
            alt={title}
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="lg:w-1/2 flex flex-col justify-center">
          {/* Author Information */}
          <section className="flex gap-4 items-center mb-8">
            <Image
              src={urlFor(author.image).url()}
              width={50}
              height={50}
              alt={author.name}
              className="object-cover rounded-full h-12 w-12 shadow-md"
            />
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-dark dark:text-light">
                {author.name}
              </h3>
            </div>
          </section>

          {/* Post Summary */}
          <section>
            <h2 className="text-3xl font-bold uppercase text-accentDarkPrimary mb-4">
              Summary
            </h2>
            <p className="text-base leading-relaxed text-justify">
              {summary}
            </p>
          </section>

          {/* Post Content */}
          <section className="text-lg leading-normal prose mt-8">
            <PortableText value={content} />
          </section>
        </div>
      </div>

      {/* Comments Section */}
      <Comments />
    </article>
  );
}
