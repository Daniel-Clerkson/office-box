"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ImagePlus,
  ArrowLeft,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Globe,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE_URL } from "@/utils/API";

// Types
interface EventImage {
  public_id: string;
  url: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  tags?: string[];
  image?: EventImage;
  isVirtual: boolean;
}

// Main Layout Wrapper
export default function App() {
  const pathname = usePathname();
  const isCreatePage = pathname === "/events/create";
  const isEditPage = pathname?.startsWith("/events/edit/");
  const isViewPage = pathname?.startsWith("/events/view/");

  // Extract event ID from URL for edit/view
  const eventId = pathname?.split("/").pop();

  return (
    <>
      {!isCreatePage && !isEditPage && !isViewPage && <AdminDashboard />}
      {isCreatePage && <EventForm />}
      {isEditPage && eventId && <EventForm eventId={eventId} />}
      {isViewPage && eventId && <EventViewer eventId={eventId} />}
    </>
  );
}

// Admin Dashboard - List View
function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/events`);
      if (!res.ok) throw new Error();
      const data: Event[] = await res.json();
      setEvents(data);
    } catch {
      alert("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setEvents(prev => prev.filter(e => e._id !== id));
      setDeleteModal(null);
      alert("Event deleted!");
    } catch {
      alert("Failed to delete");
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
            <p className="text-sm text-gray-500">{filteredEvents.length} events</p>
          </div>
          <button
            onClick={() => router.push("events/create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            <Plus size={20} /> Create Event
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium text-gray-900">No events found</p>
            <p className="text-gray-500 mt-2">Click "Create Event" to add one!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-100 relative">
                  {event.image ? (
                    <img src={event.image.url} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImagePlus className="text-gray-400" size={48} />
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-semibold ${event.isVirtual ? "bg-purple-600" : "bg-blue-600"}`}>
                    {event.isVirtual ? "Virtual" : "In-Person"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg truncate">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      {event.isVirtual ? <Globe size={16} /> : <MapPin size={16} />}
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => router.push(`/events/view/${event._id}`)}
                      className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      <Eye size={16} className="inline mr-1" /> View
                    </button>
                    <button
                      onClick={() => router.push(`/events/edit/${event._id}`)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      <Edit size={16} className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal(event)}
                      className="p-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold">Delete Event</h3>
            <p className="mt-2 text-gray-600">Delete "{deleteModal.title}" permanently?</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 border rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteModal._id)} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Create / Edit Form Page
async function EventForm({ eventId }: { eventId?: string }) {
  const router = useRouter();
  const isEdit = !!eventId;

  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "", description: "", date: "", time: "", location: "", isVirtual: false, tags: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load event for editing
  useEffect(() => {
    if (isEdit && eventId) {
      fetch(`${API_BASE_URL}/events/${eventId}`)
        .then(r => r.json())
        .then((data: Event) => {
          setEvent(data);
          setFormData({
            title: data.title,
            description: data.description,
            date: data.date.split("T")[0],
            time: new Date(data.date).toTimeString().slice(0, 5),
            location: data.location,
            isVirtual: data.isVirtual,
            tags: data.tags?.join(", ") || "",
          });
          setImagePreview(data.image?.url || null);
        });
    }
  }, [isEdit, eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("location", formData.location);
    submitData.append("isVirtual", String(formData.isVirtual));
    submitData.append("date", new Date(`${formData.date}T${formData.time}:00.000Z`).toISOString());
    if (formData.tags) formData.tags.split(",").map(t => t.trim()).forEach(t => submitData.append("tags[]", t));
    if (imageFile) submitData.append("image", imageFile);

    try {
      const url = isEdit ? `${API_BASE_URL}/events/${eventId}` : `${API_BASE_URL}/events`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, { method, body: submitData });
      if (!res.ok) throw new Error();

      alert(isEdit ? "Event updated!" : "Event created!");
      router.push("/events"); // Back to dashboard
    } catch {
      alert("Failed to save event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.push("/events")} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{isEdit ? "Edit Event" : "Create New Event"}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Image Upload */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
            id="image"
          />
          <label htmlFor="image" className="block cursor-pointer">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center">
                <ImagePlus size={48} className="mx-auto text-gray-400" />
                <p className="mt-4 text-lg">Click to upload event image</p>
              </div>
            )}
          </label>
        </div>

        <div className="bg-white rounded-xl p-8 space-y-6">
          <input
            type="text"
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full text-3xl font-bold border-b-2 pb-3 focus:border-blue-600 outline-none"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full border rounded-lg px-4 py-3 focus:border-blue-600 outline-none"
            required
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="border rounded-lg px-4 py-3" />
            <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required className="border rounded-lg px-4 py-3" />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isVirtual}
              onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
              className="w-5 h-5"
            />
            <span className="font-medium">Virtual Event</span>
          </label>

          <input
            type="text"
            placeholder={formData.isVirtual ? "Meeting Link" : "Location"}
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-4xl mx-auto p-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// View Single Event
async function EventViewer({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/events/${eventId}`)
      .then(r => r.json())
      .then(setEvent);
  }, [eventId]);

  if (!event) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push("/events")} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Event Details</h1>
          <button onClick={() => router.push(`/events/edit/${event._id}`)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            <Edit size={16} className="inline mr-1" /> Edit
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {event.image && <img src={event.image.url} alt={event.title} className="w-full h-96 object-cover rounded-xl" />}
        <div className="bg-white rounded-xl p-8 mt-8">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">{event.description}</p>

          <div className="grid sm:grid-cols-2 gap-8 mt-10">
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="text-xl font-semibold">
                {new Date(event.date).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                <br />
                {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-xl font-semibold">{event.location}</p>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="mt-8">
              <p className="text-sm text-gray-500">Tags</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {event.tags.map(t => (
                  <span key={t} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}