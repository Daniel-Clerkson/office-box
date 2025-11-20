"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/API";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Customer" | "Admin";
  joined: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/users`);
        if (!res.ok) throw new Error("Failed to fetch users");

        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm">
        <button
          className="p-2 rounded-full hover:bg-gray-200"
          onClick={() => router.back()}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold">Manage Users</h1>
      </header>

      {/* User List */}
      <div className="flex flex-col divide-y divide-gray-200">
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-2 hover:bg-gray-100/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="font-medium text-base">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 sm:mt-0">
                <p className="text-sm text-gray-500">{user.joined}</p>
                <p className="text-sm font-medium text-indigo-600">{user.role}</p>
                <button className="p-2 rounded-full hover:bg-gray-200">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
