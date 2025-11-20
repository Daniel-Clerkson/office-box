"use client";

import { useState, useEffect } from "react";
import Carousel, { ResponsiveType } from "react-multi-carousel";
import ButtonGroup from "@/components/ButtonGroup";
import Link from "next/link";
import { FaUser, FaCalendar, FaTag } from "react-icons/fa";
import { API_BASE_URL } from "@/utils/API";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Blog interface matching API response
interface BlogImage {
  url?: string;
  public_id?: string;
  _id?: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  images?: BlogImage[];
  createdAt: string;
  updatedAt: string;
}

// Blog Card Component
const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const truncate = (text: string, length = 120) =>
    text.length <= length ? text : text.slice(0, length) + "...";

  const imageUrl = blog.images?.[0]?.url || "/placeholder-blog.jpg";

  return (
    <div className="mx-3 cursor-pointer transition-all hover:shadow-2xl flex flex-col rounded-2xl border border-gray-200 overflow-hidden bg-white h-full hover:border-primary/30">
      {/* Image */}
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <span
          className={`absolute top-3 left-3 text-xs px-3 py-1.5 rounded-full font-medium ${
            blog.isPublished
              ? "bg-emerald-500 text-white"
              : "bg-orange-500 text-white"
          }`}
        >
          {blog.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4 flex-grow">
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium"
              >
                <FaTag className="text-[10px]" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-primary transition-colors">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed flex-grow">
          {truncate(blog.content)}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <FaUser className="text-primary" />
            <span className="font-medium">{blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendar className="text-primary" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        {/* Read More Button */}
        <Link href={`/blog/${blog._id}`} className="mt-4">
          <button className="w-full py-3 px-6 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 hover:shadow-lg transition-all duration-200">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};

// Main Blog Section
const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/blog`);
      if (!res.ok) throw new Error(`Failed to fetch blogs (${res.status})`);

      const data = await res.json();
      const blogList: Blog[] = Array.isArray(data)
        ? data
        : data?.blogs || data?.data || [];

      setBlogs(blogList);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load blogs");
      console.error("Blog fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const responsive: ResponsiveType = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  return (
    <>
      <Header />

      <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="blogs">
        <div className="container mx-auto px-4 xl:px-16 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm tracking-wider uppercase">
              OUR BLOG
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
              Latest Articles & Insights
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Discover expert tips, industry trends, and valuable insights to help you grow your business
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-red-700 font-medium mb-4">Oops! {error}</p>
                <button
                  onClick={fetchBlogs}
                  className="bg-primary text-white px-8 py-3 rounded-full hover:shadow-xl transition-all font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && blogs.length === 0 && (
            <div className="text-center py-32">
              <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FaTag className="text-4xl text-gray-400" />
              </div>
              <p className="text-xl text-gray-600">No blog posts yet</p>
              <p className="text-gray-500 mt-2">Check back soon for updates!</p>
            </div>
          )}

          {/* Blogs Carousel */}
          {!loading && !error && blogs.length > 0 && (
            <Carousel
              responsive={responsive}
              infinite
              autoPlay
              autoPlaySpeed={4000}
              keyBoardControl
              transitionDuration={500}
              customButtonGroup={<ButtonGroup />}
              renderButtonGroupOutside
              arrows={false}
              showDots={false}
              slidesToSlide={1}
              containerClass="pb-10"
            >
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </Carousel>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BlogSection;
