"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  X,
  Calendar,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/API";

// Blog Type
interface BlogImage {
  url?: string;
  public_id?: string;
  _id?: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  views?: number;
  images?: BlogImage[];
  coverImage: string;
  public_id: string;
  image_id?: string;
}

// Edit Form Type
interface EditForm {
  title: string;
  content: string;
  author: string;
  tags: string;
  coverImage: string;
  public_id: string;
  isPublished: boolean;
}

interface Notification {
  type: "success" | "error" | "info";
  message: string;
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "",
    content: "",
    author: "",
    tags: "",
    coverImage: "",
    public_id: "",
    isPublished: false,
  });

  const router = useRouter();

  // Fetch blogs from API
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/blog`);
      if (!res.ok) throw new Error(`Failed to fetch blogs (${res.status})`);

      const data = await res.json();

      const formatted: Blog[] = (data || []).map((post: any) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.author,
        tags: post.tags || [],
        isPublished: post.isPublished,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        views: post.views || Math.floor(Math.random() * 5000),
        images: post.images || [],
        coverImage: post.images?.[0]?.url || "",
        public_id: post.images?.[0]?.public_id || "",
        image_id: post.images?.[0]?._id || "",
      }));

      setBlogs(formatted);
      setFilteredBlogs(formatted);
    } catch (err: unknown) {
      showNotification("error", "Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: Notification["type"], message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();

      setBlogs(blogs.filter((b) => b.id !== id));
      showNotification("success", "Blog deleted");
      setShowDeleteModal(false);
    } catch {
      showNotification("error", "Failed to delete blog");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${blog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      });

      if (!response.ok) throw new Error();

      setBlogs(
        blogs.map((b) => (b.id === blog.id ? { ...b, isPublished: !b.isPublished } : b))
      );
      showNotification(
        "success",
        `Blog ${blog.isPublished ? "unpublished" : "published"}`
      );
    } catch {
      showNotification("error", "Failed to update publish status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateNew = () => router.push("/admin/blog/create");

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setEditForm({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      tags: blog.tags.join(", "),
      coverImage: blog.coverImage,
      public_id: blog.public_id,
      isPublished: blog.isPublished,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedBlog) return;
    setActionLoading(true);

    try {
      const updatedData = {
        title: editForm.title,
        content: editForm.content,
        author: editForm.author,
        tags: editForm.tags.split(",").map((t) => t.trim()),
        isPublished: editForm.isPublished,
        images: [{ public_id: editForm.public_id, url: editForm.coverImage }],
      };

      const response = await fetch(`${API_BASE_URL}/blog/${selectedBlog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error();

      const updated: Blog = await response.json();

      setBlogs(
        blogs.map((b) =>
          b.id === selectedBlog.id
            ? {
                ...updated,
                coverImage: updated.images?.[0]?.url || "",
                public_id: updated.images?.[0]?.public_id || "",
              }
            : b
        )
      );

      showNotification("success", "Blog updated successfully");
      setShowEditModal(false);
    } catch {
      showNotification("error", "Failed to update blog");
    } finally {
      setActionLoading(false);
    }
  };

  const handleView = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowViewModal(true);
  };

  // Filter + Search
  useEffect(() => {
    let filtered = blogs;

    if (searchQuery.trim()) {
      filtered = filtered.filter((b) =>
        `${b.title} ${b.author}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === "published") filtered = filtered.filter((b) => b.isPublished);
    if (filterStatus === "draft") filtered = filtered.filter((b) => !b.isPublished);

    setFilteredBlogs(filtered);
  }, [searchQuery, filterStatus, blogs]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Notifications */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg z-50 ${
            notification.type === "success"
              ? "bg-green-600"
              : notification.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* ...DELETE, VIEW, EDIT MODALS (typed already) */}

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
          >
            <Plus className="w-5" /> New Blog
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Search + Filter */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 border border-gray-200">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search blogs..."
                className="w-full pl-10 p-3 bg-gray-100 rounded border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 bg-gray-100 rounded border border-gray-300"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | "published" | "draft")
              }
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Blog Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative h-48">
                  <img src={blog.coverImage} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs text-white ${
                      blog.isPublished ? "bg-green-600" : "bg-yellow-600"
                    }`}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{blog.content}</p>

                  <div className="flex flex-wrap gap-2">
                    {blog.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 flex gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-4" /> {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleView(blog)}
                      className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      <Eye className="w-4" /> View
                    </button>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      <Edit2 className="w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      {blog.isPublished ? (
                        <EyeOff className="w-5 text-red-600" />
                      ) : (
                        <Eye className="w-5 text-green-600" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBlog(blog);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 className="w-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
