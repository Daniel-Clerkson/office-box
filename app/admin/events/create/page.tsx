"use client";
import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Globe,
  ImagePlus,
  ArrowLeft,
  Loader2,
  Tag,
  X,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/API";

// === Types ===
interface CloudinaryImage {
  public_id: string;
  url: string;
  secure_url?: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;     // YYYY-MM-DD
  time: string;     // HH:mm — only for UI
  location: string;
  isVirtual: boolean;
  tags: string[];
  image?: CloudinaryImage | null;
}

export default function EventCreator() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    isVirtual: false,
    tags: [],
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [autoSaved, setAutoSaved] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData | "image", string>>>({});

  // === Image Upload ===
  // === Fixed Image Upload — Handles { images: [{ public_id, url }] } ===
  const uploadToCloudinary = async (file: File): Promise<CloudinaryImage> => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`Image too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max 5MB)`);
    }
  
    const formData = new FormData();
    formData.append("folder", "events");
    formData.append("files", file);
  
    const res = await fetch(`${API_BASE_URL}/cloudinary/upload`, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Upload failed");
    }
  
    const data = await res.json();
  
    // Your backend returns: { images: [{ public_id, url, ... }] }
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
      throw new Error("No image returned from server");
    }
  
    const uploadedImage = data.images[0]; // Get the first (and only) image
    return {
      public_id: uploadedImage.public_id,
      url: uploadedImage.url,
    };
  };
  
  // === Fixed handleImageUpload ===
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setIsUploadingImage(true);
    setImagePreview(null);
  
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
  
      // Upload and get correct { public_id, url }
      const uploaded = await uploadToCloudinary(file);
  
      console.log("Uploaded image:", uploaded); // Now correct!
  
      setFormData(prev => ({ ...prev, image: uploaded }));
      setErrors(prev => ({ ...prev, image: "" }));
      setAutoSaved(false);
      setTimeout(() => setAutoSaved(true), 1000);
    } catch (error: any) {
      alert(error.message || "Failed to upload image");
      setImagePreview(null);
      setFormData(prev => ({ ...prev, image: null }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // === Tags ===
  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // === Submit — NO `time` field sent ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (!formData.description.trim()) newErrors.description = "Description required";
    if (!formData.date) newErrors.date = "Date required";
    if (!formData.time) newErrors.time = "Time required";
    if (!formData.location.trim()) newErrors.location = "Location required";

    const fullDateTime = new Date(`${formData.date}T${formData.time || "00:00"}:00.000Z`);
    if (isNaN(fullDateTime.getTime()) || fullDateTime < new Date()) {
      newErrors.date = "Invalid or past date/time";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        isVirtual: formData.isVirtual,
        date: fullDateTime.toISOString(), // Only this — no separate time
        tags: formData.tags,
        ...(formData.image && {
          image: {
            public_id: formData.image.public_id,
            url: formData.image.url,
          },
        }),
      };

      console.log("Sending:", payload);

      const res = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create event");
      }

      alert("Event created successfully!");
      router.push("/events");
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Create Event</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-32">
        {/* Image */}
        <div>
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden group">
              <img src={imagePreview} alt="Event" className="w-full h-96 object-cover" />
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button onClick={removeImage} className="p-4 bg-red-600 rounded-full hover:bg-red-700">
                  <X size={28} className="text-white" />
                </button>
              </div>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-300 rounded-xl p-16 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <ImagePlus size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-semibold">Add Event Image</p>
              <p className="text-sm text-gray-500">Max 5MB • 1200×800 recommended</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Form */}
        <div className="space-y-6">
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Event Title *"
            className={`w-full text-4xl font-bold border-b-2 pb-4 focus:border-blue-500 outline-none ${errors.title ? "border-red-500" : "border-transparent"}`}
          />
          {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}

          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={5}
            placeholder="Describe your event..."
            className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}

          {/* Date & Time Picker (combined on submit) */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 text-gray-500" size={20} />
                <input
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.date ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.time ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.time && <p className="text-red-600 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isVirtual}
              onChange={e => setFormData(prev => ({ ...prev, isVirtual: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="font-medium">This is a virtual event</span>
          </label>

          <div>
            <label className="block text-sm font-medium mb-2">
              {formData.isVirtual ? "Meeting Link *" : "Location *"}
            </label>
            <div className="relative">
              {formData.isVirtual ? <Globe className="absolute left-3 top-3.5 text-gray-500" size={20} /> : <MapPin className="absolute left-3 top-3.5 text-gray-500" size={20} />}
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder={formData.isVirtual ? "Zoom, Google Meet..." : "Eko Hotel, Lagos"}
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.location ? "border-red-500" : "border-gray-300"}`}
              />
            </div>
            {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTag(e)}
                placeholder="Add tag..."
                className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={addTag} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {tag}
                    <button onClick={() => removeTag(tag)}><X size={16} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-center py-4 flex items-center justify-center gap-2 text-sm text-gray-600">
            <CheckCircle size={18} className={autoSaved ? "text-green-600" : "text-gray-400"} />
            {autoSaved ? "Saved" : "Saving..."}
          </div>
        </div>
      </main>
    </div>
  );
}