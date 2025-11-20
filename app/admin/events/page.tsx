"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { API_BASE_URL } from "@/utils/API";
import { useRouter } from "next/navigation";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
  images?: { public_id: string; url: string };
  isVirtual: boolean;
}

export default function EventDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data: Event[] = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setEvents(events.filter((e) => e._id !== id));
      alert("Event deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  const handleEdit = (event: Event) => setEditEvent({ ...event });

  const handleSave = async () => {
    if (!editEvent) return;
    try {
      const { _id, title, description, location, date, isVirtual, tags } = editEvent;
      const res = await fetch(`${API_BASE_URL}/events/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, location, date, isVirtual, tags }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEvents((prev) => prev.map((e) => (e._id === _id ? editEvent : e)));
      setEditEvent(null);
      alert("Event updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update event");
    }
  };

  if (loading) return <div className="text-center py-20">Loading events...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Event Dashboard</h1>
          <button
            onClick={() => router.push("events/create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} /> Create Event
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="border rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-48">
                {event.images?.url ? (
                  <img
                    src={event.images.url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    event.isVirtual ? "bg-purple-600" : "bg-blue-600"
                  }`}
                >
                  {event.isVirtual ? "Virtual" : "In-Person"}
                </span>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-bold truncate">{event.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{event.description}</p>
                <p className="text-sm mt-2">
                  <strong>Location:</strong> {event.isVirtual ? "Meeting Link" : event.location}
                </p>
                <p className="text-sm mt-1">
                  <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                </p>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {event.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit Modal */}
      {editEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Edit Event</h2>
            <input
              type="text"
              value={editEvent.title}
              onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Title"
            />
            <textarea
              value={editEvent.description}
              onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Description"
              rows={3}
            />
            <input
              type="text"
              value={editEvent.location}
              onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder={editEvent.isVirtual ? "Meeting Link" : "Location"}
            />
            <input
              type="datetime-local"
              value={new Date(editEvent.date).toISOString().slice(0, 16)}
              onChange={(e) =>
                setEditEvent({ ...editEvent, date: new Date(e.target.value).toISOString() })
              }
              className="w-full border rounded-lg px-4 py-2"
            />
            <div className="flex gap-4 mt-4">
              <button onClick={() => setEditEvent(null)} className="flex-1 py-2 border rounded-lg">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 py-2 bg-blue-600 text-white rounded-lg">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
