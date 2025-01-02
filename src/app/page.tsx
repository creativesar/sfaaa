import Hero from "@/components/Hero";
import dynamic from 'next/dynamic';

const BlogMain = dynamic(() => import('@/app/blogmain/page'), { ssr: false });

export default function HomePage() {
  return (
    <div>
      <Hero />
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-center">Latest Blogs</h2>
        <BlogMain />
      </section>
    </div>
  );
}