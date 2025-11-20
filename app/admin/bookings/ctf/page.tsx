"use client";

import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "@/utils/API";
import { CheckCircle, XCircle, AlertCircle, CalendarCheck } from "lucide-react";

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
  date: string;
  seats: number;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
  status?: "Confirmed" | "Pending" | "Cancelled" | "Completed";
}

export default function BookingsTablePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/booking`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : data?.bookings || data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();
    return bookings.filter((b) => {
      if (!query) return true;
      return (
        b.fullname.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.phone.includes(query.replace(/\D/g, "")) ||
        b.plan.name.toLowerCase().includes(query) ||
        b.date.includes(query)
      );
    });
  }, [bookings, search]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Confirmed":
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Confirmed</span>;
      case "Pending":
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Pending</span>;
      case "Cancelled":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> {status || "Unknown"}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Bookings Overview</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name, email, phone, plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Full Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Plan</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Seats</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Price/Seat</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Total</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Created At</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Updated At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-10 text-gray-500">Loading bookings...</td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-10 text-gray-500">No bookings found.</td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{b.fullname}</td>
                  <td className="px-4 py-2">{b.email}</td>
                  <td className="px-4 py-2">{b.phone}</td>
                  <td className="px-4 py-2">{b.plan.name}</td>
                  <td className="px-4 py-2">{b.seats}</td>
                  <td className="px-4 py-2">{formatDate(b.date)}</td>
                  <td className="px-4 py-2">{getStatusBadge(b.status)}</td>
                  <td className="px-4 py-2 text-right">₦{b.plan.price.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">₦{(b.plan.price * b.seats).toLocaleString()}</td>
                  <td className="px-4 py-2">{formatDate(b.createdAt)}</td>
                  <td className="px-4 py-2">{formatDate(b.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
