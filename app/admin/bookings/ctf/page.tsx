"use client";

import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "@/utils/API";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  CalendarCheck, 
  Mail, 
  Phone, 
  Calendar, 
  Layers, 
  Search, 
  X 
} from "lucide-react";

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

  // Enhanced Search Logic
  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return bookings;

    return bookings.filter((b) => {
      // Normalize phone numbers for comparison (remove all non-digits)
      const cleanPhone = b.phone.replace(/\D/g, "");
      const cleanQuery = query.replace(/\D/g, "");
      
      // Only search phone if query has digits
      const phoneMatch = cleanQuery ? cleanPhone.includes(cleanQuery) : false;

      return (
        b.fullname.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.plan.name.toLowerCase().includes(query) ||
        b.date.includes(query) || 
        phoneMatch
      );
    });
  }, [bookings, search]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Confirmed":
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Confirmed</span>;
      case "Pending":
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> Pending</span>;
      case "Cancelled":
        return <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><CalendarCheck className="w-3 h-3" /> {status || "Unknown"}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track all your customer bookings</p>
        </div>
        
        {/* Search Bar with Icon and Clear Button */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
         <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
         </div>
      )}

      {!loading && filteredBookings.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500">No bookings found matching "{search}".</p>
            {search && (
                <button 
                    onClick={() => setSearch("")}
                    className="mt-2 text-indigo-600 font-medium hover:underline"
                >
                    Clear search
                </button>
            )}
        </div>
      )}

      {!loading && filteredBookings.length > 0 && (
        <>
          {/* --- MOBILE VIEW: CARDS (Visible on screens smaller than lg) --- */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {filteredBookings.map((b) => (
              <div key={b._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{b.fullname}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>Created: {new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {getStatusBadge(b.status)}
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{b.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{b.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(b.date)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-indigo-500" />
                            <span className="font-medium text-gray-900">{b.plan.name}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">x{b.seats}</span>
                        </div>
                        <div className="text-right">
                             <span className="block text-xs text-gray-400">Total</span>
                             <span className="font-bold text-lg text-indigo-600">₦{(b.plan.price * b.seats).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- DESKTOP VIEW: TABLE (Hidden on small screens, visible on lg and up) --- */}
          <div className="hidden lg:block overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Details</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timeline</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{b.fullname}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{b.email}</div>
                            <div className="text-xs text-gray-500">{b.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{b.plan.name}</div>
                            <div className="text-xs text-gray-500">{b.seats} seat(s) @ ₦{b.plan.price.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm text-gray-900">{formatDate(b.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(b.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-bold text-indigo-600">₦{(b.plan.price * b.seats).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-500">Created: {new Date(b.createdAt).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-400">Updated: {new Date(b.updatedAt).toLocaleDateString()}</div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}