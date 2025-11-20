"use client";

import React, { useState } from "react";
import {
  LogOut,
  User,
  LayoutDashboard,
  FileText,
  Calendar,
  Menu,
  X,
  Ticket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/utils/AuthGuard";
import Logo from "@/assets/images/OfficeBOX-icon.png"
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("Are you sure ?")) {
      localStorage.clear();
      router.push("/");
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "/admin" },
    { icon: FileText, label: "Blogs", id: "/admin/blog" },
    { icon: Calendar, label: "Events", id: "/admin/events" },
    { icon: Ticket, label: "CTF", id: "/admin/bookings/ctf" },
  ];

  const handleNav = (link: string) => {
    router.push(link);
    setActiveTab(link);
    setSidebarOpen(false);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <Image
            src={Logo}
            width={64}
            height={64}
            alt="logo"
            />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:ml-64 min-h-screen flex flex-col">
          {/* Navbar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>

                <p className="text-xl text-slate-700">Admin Panel</p>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <User className="w-6 h-6" />
                </button>
                <button
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>

          {/* Bottom Navigation (Mobile) */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-inset-bottom">
            <div className="grid grid-cols-4 gap-1 p-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "text-indigo-500"
                      : "text-slate-600"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </AuthGuard>
  );
}
