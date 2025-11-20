"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollUp from "@/components/ScrollUp";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { API_BASE_URL } from "@/utils/API";

// Blog interface
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

const BlogPost: React.FC = () => {
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) throw new Error("Blog ID is missing");

        const res = await fetch(`${API_BASE_URL}/blog/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch blog post (${res.status})`);

        const result: Blog = await res.json();
        setPost(result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load blog post";
        console.error("Error fetching blog post:", message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading blog post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 px-4 text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <Link
          href="/blog"
          className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Blog post not found
      </div>
    );
  }

  // Safely get first image or fallback
  const imageUrl = post.images?.[0]?.url || "/placeholder-blog.jpg";

  return (
    <>
      <Header />

      <div className="bg-white min-h-screen py-10 px-5">
        <div className="max-w-5xl mx-auto">
          {/* Cover Image */}
          <div className="w-full">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full rounded-3xl object-cover h-80 md:h-[450px] shadow"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mt-8">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-5 gap-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-gray-800 font-medium">{post.author || "Unknown Author"}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {post.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
            {post.content}
          </div>

          {/* Back Button */}
          <div className="flex justify-center mt-10">
            <Link
              href="/blog"
              className="flex gap-2 items-center justify-center shadow rounded-full bg-slate-200 px-6 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
            >
              <AiOutlineArrowLeft className="text-md" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollUp />
    </>
  );
};

export default BlogPost;
