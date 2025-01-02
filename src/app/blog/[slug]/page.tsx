import Image from "next/image";
import { client } from "@/sanity/lib/client"; // fixed import path
import { urlFor } from "@/sanity/lib/image"; // fixed import path
import { PortableText } from "@portabletext/react";
import Comments from "@/components/Comments";

export const revalidate = 60; //seconds

export async function generateStaticParams() {
  const query = `*[_type=='post']{
    "slug":slug.current
  }`;
  const slugs = await client.fetch(query);
  const slugRoutes = slugs.map((item: { slug: string }) => item.slug);
  return slugRoutes.map((slug: string) => ({ slug }));
}

export default async function BlogPostPage({ params: { slug } }: { params: { slug: string } }) {
  const query = `*[_type=='post' && slug.current=="${slug}"]{
    title,summary,image,content,
    author->{bio,image,name}
  }[0]`;
  const post = await client.fetch(query).catch((err) => {
    console.error("Failed to fetch post:", err);
    return null;
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="mt-12 mb-24 px-4 lg:px-24 flex flex-col gap-y-12">
      <h1 className="text-3xl lg:text-6xl font-bold text-center text-dark dark:text-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {post.title}
      </h1>
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="lg:w-1/2">
          <Image
            src={urlFor(post.image).url()}
            width={600}
            height={600}
            alt={post.title}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center">
          <section className="flex gap-4 items-center mb-8">
            <Image
              src={urlFor(post.author.image).url()}
              width={50}
              height={50}
              alt={post.author.name}
              className="object-cover rounded-full h-12 w-12 shadow-md"
            />
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-dark dark:text-light" style={{ fontFamily: 'Poppins, sans-serif' }}>{post.author.name}</h3>
              {/* Bio is hidden */}
            </div>
          </section>
          <section>
            <h2 className="text-3xl font-bold uppercase text-accentDarkPrimary mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Summary
            </h2>
            <p className="text-base leading-relaxed text-justify text-dark/80 dark:text-light/80" style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
              {post.summary}
            </p>
          </section>
          <section className="text-lg leading-normal text-dark/80 dark:text-light/80 prose-h4:text-accentDarkPrimary prose-h4:text-3xl prose-h4:font-bold prose-li:list-disc prose-li:list-inside prose-li:marker:text-accentDarkSecondary prose-strong:text-dark dark:prose-strong:text-white mt-8" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px' }}>
            <PortableText 
              value={post.content} 
              components={{
                marks: {
                  strong: ({ children }) => <strong style={{ fontFamily: 'Poppins, sans-serif' }}>{children}</strong>,
                },
                listItem: {
                  bullet: ({ children }) => <li style={{ fontSize: '16px' }}>{children}</li>,
                  number: ({ children }) => <li style={{ fontSize: '16px', listStyleType: 'decimal' }}>{children}</li>,
                },
              }} 
            />
          </section>
        </div>
      </div>
      <Comments />
    </article>
  );
}