"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Globe, Tag, X } from "lucide-react";
import { format } from "date-fns";
import { API_BASE_URL } from "@/utils/API";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events`);
        if (!res.ok) throw new Error("Failed to load events");

        const data = await res.json();
        console.log(data)
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const openModal = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-500 text-lg">Loading events...</div>
      </div>
    );

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }else if(events.length === 0){
    return(
      <div className="flex justify-center items-center py-20">
      <div className="text-gray-700 text-lg">No Events Currently</div>
    </div>
    )
  }

  return (
    <>
      <div className="w-full py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Upcoming Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                onClick={() => openModal(event)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="relative h-64">
                  <Image
                    src={event.image?.url || "/placeholder-event.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">{event.title}</h3>
                    <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(event.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                    {event.isVirtual && (
                      <>
                        <span className="mx-2">•</span>
                        <Globe className="w-4 h-4" />
                        <span>Virtual</span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-96">
              <Image
                src={selectedEvent.image?.url || "/placeholder-event.jpg"}
                alt={selectedEvent.title}
                fill
                className="object-cover rounded-t-2xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white">
                <h2 className="text-4xl font-bold mb-3">
                  {selectedEvent.title}
                </h2>
                <div className="flex flex-wrap gap-6 text-lg">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {format(
                      new Date(selectedEvent.date),
                      "EEEE, MMMM do, yyyy 'at' h:mm a"
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {selectedEvent.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                {selectedEvent.isVirtual && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium rounded-lg">
                    Live & Virtual
                  </span>
                )}
                <div className="flex gap-2">
                  {selectedEvent.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  About This Event
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg">
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventList;
