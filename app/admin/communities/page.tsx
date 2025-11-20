"use client";

import { useEffect, useState } from "react";
import { Menu, Search, MoreVertical, Edit2, Plus } from "lucide-react";

interface Community {
  id: string;
  name: string;
  members: number;
  image: string;
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: Replace with your real API endpoint
    const fetchCommunities = async () => {
      try {
        const res = await fetch("/api/communities");
        const data = await res.json();
        setCommunities(data);
      } catch (error) {
        console.error("Failed to load communities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className="relative min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Top Navbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Communities</h1>
        </div>
      </div>

      {/* Content */}
      <main className="pb-24 p-4 flex flex-col gap-3">
        {loading ? (
          <p className="text-center text-slate-500">Loading communities...</p>
        ) : communities.length === 0 ? (
          <p className="text-center text-slate-500">No communities found.</p>
        ) : (
          communities.map((community) => (
            <div
              key={community.id}
              className="flex items-center gap-4 bg-slate-800/50 dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-slate-700"
            >
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
                style={{ backgroundImage: `url(${community.image})` }}
              />
              <div className="flex-grow">
                <p className="text-base font-medium">{community.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {community.members.toLocaleString()} members
                </p>
              </div>
              <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Edit2 className="size-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          ))
        )}
      </main>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button className="flex items-center justify-center size-14 bg-primary text-white rounded-2xl shadow-lg hover:bg-primary/90 transition-colors">
          <Plus className="size-7" />
        </button>
      </div>
    </div>
  );
}
