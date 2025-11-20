"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  User,
  MapPin,
  Clock,
  CreditCard,
  Home,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { API_BASE_URL } from "@/utils/API";

interface Booking {
  id: string;
  guestName: string;
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  price: number;
  status: string;
  imageUrl: string;
  paymentMethod: string;
}

export default function SingleBookingPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch booking by ID
  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`${API_BASE_URL}/booking/${id}`);
        if (!res.ok) throw new Error("Failed to fetch booking");
        const data = await res.json();
        setBooking(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-400">
        <AlertCircle className="w-10 h-10 mb-3" />
        <p className="text-lg font-medium">Failed to load booking</p>
        <p className="text-sm text-slate-400">{error}</p>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Booking Details</h1>
        </div>
      </header>

      {/* Booking Details */}
      <main className="p-4 flex flex-col gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-slate-100">
              {booking.propertyName}
            </h2>
            <span
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                booking.status === "confirmed"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-300">
              <User className="w-5 h-5 text-primary" />
              <p>
                Booked by <span className="font-semibold">{booking.guestName}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-5 h-5 text-primary" />
              <p>{booking.location}</p>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <CalendarDays className="w-5 h-5 text-primary" />
              <p>
                Check-in: <span className="font-medium">{booking.checkIn}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <Clock className="w-5 h-5 text-primary" />
              <p>
                Check-out: <span className="font-medium">{booking.checkOut}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <CreditCard className="w-5 h-5 text-primary" />
              <p>
                ₦{booking.price.toLocaleString()} — paid via{" "}
                {booking.paymentMethod}
              </p>
            </div>
          </div>

          <button className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
            View Apartment Details
          </button>
        </div>

        {/* Apartment Preview */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div
            className="bg-cover bg-center rounded-lg w-20 h-20"
            style={{ backgroundImage: `url(${booking.imageUrl})` }}
          ></div>
          <div className="flex-grow">
            <p className="text-base font-medium text-slate-50 line-clamp-1">
              {booking.propertyName}
            </p>
            <p className="text-sm text-slate-400">Ocean View • Wi-Fi • Pool Access</p>
          </div>
          <Home className="w-6 h-6 text-slate-400" />
        </div>

        {/* Cancel Booking */}
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 flex items-center justify-between">
          <p className="text-red-300 font-medium">Need to cancel this booking?</p>
          <button
            onClick={() => alert("Cancel booking logic here")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5" />
            Cancel Booking
          </button>
        </div>
      </main>
    </div>
  );
}
