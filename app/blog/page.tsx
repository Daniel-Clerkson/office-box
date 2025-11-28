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
    <div className="mx-2 sm:mx-3 cursor-pointer transition-all hover:shadow-2xl flex flex-col rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden bg-white h-full hover:border-primary/30">
      {/* Image */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <span
          className={`absolute top-2 left-2 sm:top-3 sm:left-3 text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium ${
            blog.isPublished
              ? "bg-emerald-500 text-white"
              : "bg-orange-500 text-white"
          }`}
        >
          {blog.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 flex-grow">
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {blog.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-primary/10 text-primary px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium"
              >
                <FaTag className="text-[8px] sm:text-[10px]" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-2 hover:text-primary transition-colors leading-snug">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed flex-grow line-clamp-3">
          {truncate(blog.content)}
        </p>

        {/* Meta */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0 text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FaUser className="text-primary text-xs" />
            <span className="font-medium truncate">{blog.author}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FaCalendar className="text-primary text-xs" />
            <span className="whitespace-nowrap">{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        {/* Read More Button */}
        <Link href={`/blog/${blog._id}`} className="mt-2 sm:mt-4">
          <button className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-primary text-white text-sm sm:text-base rounded-full font-semibold hover:bg-primary/90 hover:shadow-lg transition-all duration-200">
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

      {/* Added top padding to prevent header overlap */}
      <section className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-b from-white to-gray-50" id="blogs">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 xl:px-16 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">
              OUR BLOG
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 sm:mt-4 px-4">
              Latest Articles & Insights
            </h2>
            <p className="text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4 leading-relaxed">
              Discover expert tips, industry trends, and valuable insights to help you grow your business
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20 sm:py-32">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12 sm:py-20 px-4">
              <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-700 font-medium mb-4 text-sm sm:text-base">Oops! {error}</p>
                <button
                  onClick={fetchBlogs}
                  className="bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:shadow-xl transition-all font-medium text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && blogs.length === 0 && (
            <div className="text-center py-20 sm:py-32 px-4">
              <div className="bg-gray-100 rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <FaTag className="text-3xl sm:text-4xl text-gray-400" />
              </div>
              <p className="text-lg sm:text-xl text-gray-600 font-medium">No blog posts yet</p>
              <p className="text-sm sm:text-base text-gray-500 mt-2">Check back soon for updates!</p>
            </div>
          )}

          {/* Blogs Carousel */}
          {!loading && !error && blogs.length > 0 && (
            <div className="px-0 sm:px-2 md:px-4">
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
                containerClass="pb-8 sm:pb-10"
              >
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BlogSection;