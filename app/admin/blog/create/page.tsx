"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { API_BASE_URL } from "@/utils/API";

// === Type Definitions ===
interface CloudinaryImage {
  public_id: string;
  url: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
}

interface BlogPostFormData {
  title: string;
  author: string;
  content: string;
  isPublished: boolean;
  tags: string[];
  image?: CloudinaryImage | null; // Single cover image
}

type SubmitStatus = "success" | "error" | null;

export default function BlogPostForm() {
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    author: "",
    content: "",
    isPublished: false,
    tags: [],
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [autoSaved, setAutoSaved] = useState(true);
  const [tagInput, setTagInput] = useState("");

  // === Handlers ===
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-save simulation
    setAutoSaved(false);
    setTimeout(() => setAutoSaved(true), 1000);
  };

  const uploadToCloudinary = async (file: File): Promise<CloudinaryImage> => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max 5MB)`);
    }

    const formData = new FormData();
    formData.append("folder", "Blogs");
    formData.append("files", file);

    const response = await fetch(`${API_BASE_URL}/cloudinary/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Upload failed");
    }

    const data = await response.json();
    // Handle both single object and array response
    const result = Array.isArray(data) ? data[0] : data;
    return result as CloudinaryImage;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setImagePreview(null);

    try {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const uploadedImage = await uploadToCloudinary(file);

      setFormData((prev) => ({ ...prev, image: uploadedImage }));
      setAutoSaved(false);
      setTimeout(() => setAutoSaved(true), 1000);
    } catch (error: any) {
      alert(error.message || "Failed to upload image");
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        ...formData,
        // Only include image if it exists
        image: formData.image || undefined,
      };

      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to publish");

      setSubmitStatus("success");
      setTimeout(() => {
        setFormData({
          title: "",
          author: "",
          content: "",
          isPublished: false,
          tags: [],
          image: null,
        });
        setImagePreview(null);
        setSubmitStatus(null);
      }, 2000);
    } catch (error: any) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {submitStatus && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl text-white font-medium ${
            submitStatus === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {submitStatus === "success" ? (
            <>
              <CheckCircle size={20} />
              Post published successfully!
            </>
          ) : (
            <>
              <AlertCircle size={20} />
              Failed to publish. Try again.
            </>
          )}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">New Blog Post</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.content}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-32">
        {/* Cover Image */}
        <div>
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden group">
              <img
                src={imagePreview}
                alt="Cover"
                className="w-full h-96 object-cover"
              />
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  onClick={removeImage}
                  className="p-4 bg-red-600 hover:bg-red-700 rounded-full"
                >
                  <X size={28} className="text-white" />
                </button>
              </div>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-300 rounded-xl p-16 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-semibold">Add Cover Image</p>
              <p className="text-sm text-gray-500">1200×800px recommended • Max 5MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a captivating title..."
            className="w-full text-4xl font-bold border-b-2 border-transparent focus:border-blue-500 outline-none pb-4"
          />

          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="Your name (optional)"
            className="w-full text-lg text-gray-600 border-b pb-2 focus:border-blue-500 outline-none"
          />

          {/* Tags */}
          <div>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
                placeholder="Add tag..."
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTag}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Start writing your amazing post..."
            rows={15}
            className="w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-lg leading-relaxed"
          />

          {/* Publish Toggle */}
          <div className="flex items-center justify-between py-6 border-t">
            <div>
              <p className="font-medium">Publish immediately</p>
              <p className="text-sm text-gray-600">Uncheck to save as draft</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6"></div>
            </label>
          </div>

          {/* Auto-save */}
          <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <CheckCircle
              size={18}
              className={autoSaved ? "text-green-600" : "text-gray-400"}
            />
            {autoSaved ? "All changes saved" : "Saving..."}
          </div>
        </div>

        {/* Preview */}
        {(formData.title || formData.content) && (
          <div className="mt-12 p-8 bg-white border rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
              Preview
            </h3>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg mb-6" />
            )}
            <h1 className="text-3xl font-bold mb-3">{formData.title || "Your Title Here"}</h1>
            {formData.author && <p className="text-gray-600 mb-4">By {formData.author}</p>}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {formData.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div className="prose max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">{formData.content || "Your content will appear here..."}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}