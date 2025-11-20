"use client";

import React, { useState } from "react";
import { FileText, Calendar, Users, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { BsPeople, BsShop } from "react-icons/bs";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: "Total Posts", value: "248", change: "+12%", trend: "up" },
    { label: "Active Events", value: "32", change: "+8%", trend: "up" },
    { label: "Communities", value: "15", change: "+2", trend: "up" },
    { label: "Bookings", value: "1,234", change: "+18%", trend: "up" },
  ];

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
      icon: Users,
      title: "Communities",
      description: "View user groups",
      color: "from-emerald-500 to-teal-600",
      tab: "admin/communities",
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
    {
      icon: BsShop,
      title: "Plans",
      description: "See all plans",
      color: "from-white to-black",
      tab: "/admin/plans",
    },
  ];

  const router = useRouter();
  const handleClick = (link: string) => {
    router.push(link);
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
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 md:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            <div className="relative">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back, Admin! 👋
              </h1>
              <p className="text-indigo-100 text-sm md:text-base">
                Here's what's happening with your platform today.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-600">
                    {stat.label}
                  </p>
                  <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(card.tab)}
                  className="group relative overflow-hidden bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <div
                    className="relative cursor-pointer"
                    onClick={() => handleClick(card.tab)}
                  >
                    <div
                      className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color} mb-4 shadow-lg`}
                    >
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {card.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  action: "New blog post published",
                  time: "2 hours ago",
                  type: "post",
                },
                {
                  action: 'Event "Tech Summit 2024" updated',
                  time: "4 hours ago",
                  type: "event",
                },
                {
                  action: "5 new community members joined",
                  time: "6 hours ago",
                  type: "community",
                },
                {
                  action: "12 new bookings received",
                  time: "8 hours ago",
                  type: "booking",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
