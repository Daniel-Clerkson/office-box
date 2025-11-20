"use client";
import { API_BASE_URL } from "@/utils/API";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export default function AdminLogin() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setSuccess("Login successful!");
      // Save token from response
      if (data?.token) {
        localStorage.setItem("adminToken", data.token);
      }

      console.log("Login successful:", data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-white dark:bg-slate-800 shadow-lg">
        <div className="flex w-full flex-col items-center p-6 sm:p-10">
          {/* Logo */}
          <div className="flex w-full justify-center pb-6">
            <div className="h-16 w-16" aria-label="Logo">
              <svg
                className="text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-slate-900 dark:text-slate-50 text-2xl sm:text-3xl font-bold leading-tight text-center pb-2">
            Admin Panel Login
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-normal text-center">
            Welcome back! Please enter your details.
          </p>

          {/* Error/Success Messages */}
          {error && (
            <div className="w-full mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="w-full mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-stretch gap-4 pt-6"
          >
            <label className="flex flex-col w-full">
              <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">
                Username or Email
              </p>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="flex w-full rounded-lg text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 h-12 px-3 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Enter your username or email"
              />
            </label>

            <label className="flex flex-col w-full">
              <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">
                Password
              </p>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="flex w-full rounded-lg text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 h-12 px-3 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Enter your password"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 px-5 mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-base font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="flex w-full items-center justify-between pt-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="remember-me"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="text-slate-700 dark:text-slate-300 text-sm cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
