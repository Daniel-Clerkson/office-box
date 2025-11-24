"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Users,
  Ticket,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BsPeople, BsShop } from "react-icons/bs";
import { API_BASE_URL } from "@/utils/API";
interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

interface Activity {
  action: string;
  time: string;
  type: string;
}

interface DashboardData {
  stats: Stat[];
  recentActivity: Activity[];
}

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ──────────────────────────────────────────────────────────────
  // Fetch Data Logic - Using All Four APIs
  // ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setFetchError(null);

      // Define application API endpoints
      const POSTS_ENDPOINT = `${API_BASE_URL}/blog`;
      const PLANS_ENDPOINT = `${API_BASE_URL}/plans`;
      const BOOKINGS_ENDPOINT = `${API_BASE_URL}/booking`;
      const EVENTS_ENDPOINT = `${API_BASE_URL}/events`;

      try {
        // Use Promise.all to fetch data concurrently
        const [postsRes, plansRes, bookingsRes, eventsRes] = await Promise.all([
          fetch(POSTS_ENDPOINT),
          fetch(PLANS_ENDPOINT),
          fetch(BOOKINGS_ENDPOINT),
          fetch(EVENTS_ENDPOINT),
        ]);

        // Check for response errors
        if (!postsRes.ok || !plansRes.ok || !bookingsRes.ok || !eventsRes.ok) {
          const errorDetail =
            (!postsRes.ok ? "Posts failed. " : "") +
            (!plansRes.ok ? "Plans failed. " : "") +
            (!bookingsRes.ok ? "Bookings failed. " : "") +
            (!eventsRes.ok ? "Events failed. " : "");

          throw new Error(
            `One or more API calls failed: ${errorDetail.trim()}`
          );
        }

        // Parse the JSON data
        const postsData = await postsRes.json();
        const plansData = await plansRes.json();
        const bookingsData = await bookingsRes.json();
        const eventsData = await eventsRes.json();

        // Calculate counts from array length (assuming API returns arrays of objects)
        const totalPosts = Array.isArray(postsData) ? postsData.length : 0;
        const totalPlans = Array.isArray(plansData) ? plansData.length : 0;
        const totalBookings = Array.isArray(bookingsData)
          ? bookingsData.length
          : 0;
        const totalEvents = Array.isArray(eventsData) ? eventsData.length : 0;

        // Construct dynamic Stats Array
        const newStats: Stat[] = [
          {
            label: "Total Posts",
            value: totalPosts.toLocaleString(),
            change: "+12%",
            trend: "up",
          },
          {
            label: "Total Plans",
            value: totalPlans.toLocaleString(),
            change: "+2",
            trend: "up",
          },
          {
            label: "Total Bookings",
            value: totalBookings.toLocaleString(),
            change: "+18%",
            trend: "up",
          },
          {
            label: "Total Events",
            value: totalEvents.toLocaleString(),
            change: "+8%",
            trend: "up",
          },
        ];

        // Combine results into the desired state structure
        setDashboardData({
          stats: newStats,
          recentActivity: [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setFetchError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching counts."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Static Action Cards (Links for navigation)
  const cards = [
    {
      icon: FileText,
      title: "Blog Posts",
      description: "Manage all posts",
      color: "from-blue-500 to-indigo-600",
      tab: "/admin/blog",
    },
    {
      icon: Calendar,
      title: "Events",
      description: "Create & edit events",
      color: "from-purple-500 to-pink-600",
      tab: "admin/events",
    },
    {
      icon: BsShop,
      title: "Plans",
      description: "See all pricing plans",
      color: "from-emerald-500 to-teal-600",
      tab: "/admin/plans",
    },
    {
      icon: Ticket,
      title: "Bookings",
      description: "See all bookings",
      color: "from-orange-500 to-red-600",
      tab: "admin/bookings",
    },
    {
      icon: BsPeople,
      title: "Users",
      description: "See all users",
      color: "from-yellow-500 to-green-600",
      tab: "/admin/users",
    },
    // Adding a generic Admin Management card for the 6th spot
    {
      icon: Users,
      title: "CTF",
      description: "Manage and Track all customers ",
      color: "from-slate-700 to-slate-900",
      tab: "/admin/bookings/ctf",
    },
  ];

  const handleClick = (link: string) => {
    router.push(link);
  };

  const statsToDisplay = dashboardData?.stats || [];
  const activityToDisplay = dashboardData?.recentActivity || [];

  // ──────────────────────────────────────────────────────────────
  // Render Logic
  // ──────────────────────────────────────────────────────────────

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-lg">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-lg text-slate-600 font-medium">
            Loading dashboard data...
          </p>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-xl shadow-lg border border-red-200">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
          <p className="text-lg text-red-700 font-medium">
            Error loading data.
          </p>
          <p className="text-sm text-red-500 mt-1">{fetchError}</p>
        </div>
      );
    }

    return (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsToDisplay.length > 0 ? (
            statsToDisplay.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-600">
                    {stat.label}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.trend === "up"
                        ? "text-emerald-500 bg-emerald-50"
                        : stat.trend === "down"
                        ? "text-red-500 bg-red-50"
                        : "text-slate-500 bg-slate-50"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))
          ) : (
            <div className="lg:col-span-4 text-center py-10 text-slate-500 bg-white rounded-xl shadow-lg">
              No statistics available.
            </div>
          )}
        </div>

        {/* Action Cards (Static Links) */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {cards.map((card, index) => (
              <button
                key={index}
                onClick={() => handleClick(card.tab)}
                className="group relative overflow-hidden bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="relative cursor-pointer">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color} mb-4 shadow-lg`}
                  >
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600">{card.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className=" min-h-screen flex flex-col">
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 p-6 md:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            <div className="relative">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back!
              </h1>
              <p className="text-indigo-100 text-sm md:text-base">
                Here's what's happening with Office Box today.
              </p>
            </div>
          </div>

          {/* Render the dynamic content */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
