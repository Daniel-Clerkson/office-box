"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  CalendarX2,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Users,
  CalendarCheck,
} from "lucide-react";
import { API_BASE_URL } from "@/utils/API";

// Exact shape from your API
interface Plan {
  _id: string;
  name: string;
  price: number;
}

interface Booking {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  date: string; // ISO string
  seats: number;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
  status?: "Confirmed" | "Pending" | "Cancelled" | "Completed"; // optional if not sent
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Current" | "Past">("Current");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/booking`);

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        const list: Booking[] = Array.isArray(data)
          ? data
          : data?.bookings || data?.data || [];

        setBookings(list);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    const query = search.toLowerCase().trim();

    return bookings
      .filter((b) => {
        if (query) {
          const matches =
            b.fullname.toLowerCase().includes(query) ||
            b.email.toLowerCase().includes(query) ||
            b.phone.includes(query.replace(/\D/g, "")) ||
            b.plan.name.toLowerCase().includes(query) ||
            b.date.includes(query);
          if (!matches) return false;
        }

        const bookingDate = new Date(b.date);
        return activeTab === "Current" ? bookingDate >= now : bookingDate < now;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return activeTab === "Current" ? dateA - dateB : dateB - dateA;
      });
  }, [bookings, activeTab, search]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      new Date(now.setDate(now.getDate() + 1)).toDateString() ===
      date.toDateString();

    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    const day = isToday
      ? "Today"
      : isTomorrow
      ? "Tomorrow"
      : date.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

    return `${day} at ${time}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-rose-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "Pending":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CalendarCheck className="w-5 h-5 text-indigo-600" />;
    }
  };
  const counts = {
    Current: bookings.filter((b) => new Date(b.date) >= new Date()).length,
    Past: bookings.filter((b) => new Date(b.date) < new Date()).length,
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Search */}
          <div className="px-4 py-3 bg-white">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, plan, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>

        {/* Tabs */}
        <div className="flex bg-white border-b border-gray-200">
          {(["Current", "Past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 font-semibold text-sm transition-all relative ${
                activeTab === tab ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              {tab}
              {/* 2. Use the pre-calculated object to show the count for THIS tab */}
              <span className="ml-2 text-xs opacity-70">({counts[tab]})</span>

              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-md" />
              )}
            </button>
          ))}
        </div>

        {/* Booking List */}
        <main className="flex-1 px-4 py-4 space-y-3 pb-24 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-500">Loading your bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarX2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {search
                  ? "No bookings found"
                  : `No ${activeTab.toLowerCase()} bookings`}
              </h3>
              <p className="text-sm text-gray-500">
                {search
                  ? "Try different search terms"
                  : "You have no bookings yet"}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <button
                key={booking._id}
                onClick={() => setSelectedBooking(booking)}
                className="w-full text-left bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-4 flex items-center gap-4 border border-gray-100"
              >
                <div
                  className={`w-14 h-14 rounded-full ${getAvatarColor(
                    booking.fullname
                  )} text-white flex items-center justify-center font-bold text-lg shrink-0`}
                >
                  {getInitials(booking.fullname)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {booking.fullname}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {booking.plan.name}{" "}
                    {booking.seats > 1 && `· ${booking.seats} seats`}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600">
                    ₦{booking.plan.price.toLocaleString()}
                  </p>
                  {booking.seats > 1 && (
                    <p className="text-xs text-gray-500">
                      Total: ₦
                      {(booking.plan.price * booking.seats).toLocaleString()}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Booking Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-full ${getAvatarColor(
                    selectedBooking.fullname
                  )} text-white flex items-center justify-center text-2xl font-bold`}
                >
                  {getInitials(selectedBooking.fullname)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedBooking.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Booked on{" "}
                    {new Date(selectedBooking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-semibold text-lg">
                      {new Date(selectedBooking.date).toLocaleString([], {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <User className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-semibold">{selectedBooking.plan.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Seats</p>
                    <p className="font-semibold">
                      {selectedBooking.seats} seat
                      {selectedBooking.seats > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{selectedBooking.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{selectedBooking.phone}</p>
                  </div>
                </div>

                <div className="border-t pt-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Price per seat</p>
                      <p className="font-semibold">
                        ₦{selectedBooking.plan.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ₦
                        {(
                          selectedBooking.plan.price * selectedBooking.seats
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
