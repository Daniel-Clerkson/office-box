"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  CheckCircle,
  Loader,
  ArrowLeft,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/API";

// ──────────────────────────────────────────────────────────────
// Types & Interfaces
// ──────────────────────────────────────────────────────────────

interface Plan {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price?: number;
  tag?: string;
}

interface FormData {
  fullname: string;
  email: string;
  phone: string;
  countryCode: string;
  seats: number;
  date: string;
  planId: string | null;
}

interface ValidationErrors {
  fullname?: string;
  email?: string;
  phone?: string;
  plan?: string;
  seats?: string;
  date?: string;
}

// ──────────────────────────────────────────────────────────────
// Country Codes
// ──────────────────────────────────────────────────────────────

const countryCodes = [
  { name: "Nigeria", code: "+234", flag: "NG" },
  { name: "United States", code: "+1", flag: "US" },
  { name: "United Kingdom", code: "+44", flag: "GB" },
  { name: "Canada", code: "+1", flag: "CA" },
  { name: "Ghana", code: "+233", flag: "GH" },
  { name: "South Africa", code: "+27", flag: "ZA" },
];

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────

const BookingForm: React.FC = () => {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const defaultCountryCode = "+234";

  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    phone: "",
    countryCode: defaultCountryCode,
    seats: 1,
    date: "",
    planId: null,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/plans`);
        if (!res.ok) throw new Error("Failed to fetch plans");

        const raw = await res.json();
        let plansList: Plan[] = [];
        if (Array.isArray(raw)) plansList = raw;
        else if (raw?.plans) plansList = raw.plans;
        else if (raw?.data) plansList = raw.data;

        setPlans(plansList);
      } catch (err) {
        console.error("Failed to load plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const selectedPlan = plans.find(
    (p) =>
      formData.planId && (p._id === formData.planId || p.id === formData.planId)
  );

  const validateStep = (currentStep: number): boolean => {
    const newErrors: ValidationErrors = {};

    if (currentStep === 1) {
      if (!formData.fullname.trim() || formData.fullname.trim().length < 2)
        newErrors.fullname = "Please enter your full name (min. 2 characters)";
      if (!/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Please enter a valid email address";
      if (
        !formData.phone.trim() ||
        formData.phone.replace(/\D/g, "").length < 8
      )
        newErrors.phone =
          "Please enter a valid local phone number (min. 8 digits)";
    }

    if (currentStep === 2 && !formData.planId)
      newErrors.plan = "Please select a plan";

    if (currentStep === 3) {
      if (!formData.date) newErrors.date = "Please select a date and time";
      if (formData.seats < 1) newErrors.seats = "At least 1 seat is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => validateStep(step) && setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setSubmitting(true);
    const fullPhoneNumber =
      formData.countryCode + formData.phone.trim().replace(/\D/g, "");

    const payload = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: fullPhoneNumber,
      seats: formData.seats,
      date: new Date(formData.date).toISOString(),
      plan: formData.planId,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Booking failed");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.back()
        setStep(1);
        setFormData({
          fullname: "",
          email: "",
          phone: "",
          countryCode: defaultCountryCode,
          seats: 1,
          date: "",
          planId: null,
        });
        setErrors({});
      }, 3000);
    } catch (err: any) {
      alert("Booking failed: " + (err.message || "Please try again"));
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-medium z-10 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Check your email for confirmation details.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Top Right Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-medium text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-2">
              Reserve Your Space
            </h1>
            <p className="text-white/90 text-center text-sm sm:text-base">
              Simple. Fast. Efficient.
            </p>

            <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all ${
                      step >= s
                        ? "bg-white text-indigo-600"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-8 sm:w-12 lg:w-16 h-1 ${
                        step > s ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                    Personal Information
                  </h2>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />{" "}
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => updateField("fullname", e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                        errors.fullname
                          ? "border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      } outline-none`}
                      placeholder="John Doe"
                    />
                    {errors.fullname && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.fullname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />{" "}
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      } outline-none`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />{" "}
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-2/5 sm:w-1/3">
                        <select
                          value={formData.countryCode}
                          onChange={(e) =>
                            updateField("countryCode", e.target.value)
                          }
                          className="appearance-none w-full px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none pr-7 sm:pr-8 text-xs sm:text-sm"
                        >
                          {countryCodes.map((c) => (
                            <option key={c.name} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <Globe className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={`w-3/5 sm:w-2/3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                          errors.phone
                            ? "border-red-500"
                            : "border-gray-200 focus:border-indigo-500"
                        } outline-none`}
                        placeholder="800 000 0000"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full bg-primary text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-lg transition-all"
                  >
                    Continue to Plans
                  </button>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                    Choose Your Plan
                  </h2>

                  {loading ? (
                    <div className="flex justify-center py-12 sm:py-20">
                      <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-indigo-600" />
                    </div>
                  ) : plans.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 sm:py-10 text-sm sm:text-base">
                      No plans available at the moment.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {plans.map((plan) => {
                        const planId:any = plan._id || plan.id;
                        const isSelected = formData.planId === planId;

                        return (
                          <motion.div
                            key={planId}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateField("planId", planId)}
                            className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 transition-all ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-50 shadow-lg"
                                : "border-gray-200 hover:border-indigo-400"
                            }`}
                          >
                            {plan.tag && (
                              <span className="inline-block bg-indigo-600 text-white text-xs px-2.5 sm:px-3 py-1 rounded-full mb-2 sm:mb-3">
                                {plan.tag}
                              </span>
                            )}
                            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                              {plan.name}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                              {plan.description}
                            </p>
                            {plan.price !== undefined && (
                              <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
                                ₦{plan.price.toLocaleString()}
                              </p>
                            )}
                            {isSelected && (
                              <div className="mt-3 sm:mt-4 text-indigo-600 font-medium flex items-center gap-2 text-sm sm:text-base">
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                                Selected
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {errors.plan && (
                    <p className="text-red-500 text-center text-sm sm:text-base">
                      {errors.plan}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button
                      onClick={prevStep}
                      className="w-full sm:flex-1 border-2 border-gray-300 text-gray-700 py-3 sm:py-4 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm sm:text-base"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="w-full sm:flex-1 bg-primary text-white py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg transition-all text-sm sm:text-base"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                    Booking Details
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />{" "}
                        Number of Seats
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.seats}
                        onChange={(e) =>
                          updateField("seats", parseInt(e.target.value) || 1)
                        }
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                          errors.seats
                            ? "border-red-500"
                            : "border-gray-200 focus:border-indigo-500"
                        } outline-none`}
                      />
                      {errors.seats && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {errors.seats}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />{" "}
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.date}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => updateField("date", e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                          errors.date
                            ? "border-red-500"
                            : "border-gray-200 focus:border-indigo-500"
                        } outline-none`}
                      />
                      {errors.date && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {errors.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedPlan && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-indigo-200">
                      <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-gray-800">
                        Booking Summary
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600">Plan:</span>{" "}
                          <span className="font-semibold">
                            {selectedPlan.name}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600">Seats:</span>{" "}
                          <span className="font-semibold">
                            {formData.seats}
                          </span>
                        </div>
                        {selectedPlan.price !== undefined && (
                          <>
                            <div className="flex justify-between text-sm sm:text-base">
                              <span className="text-gray-600">
                                Price per seat:
                              </span>{" "}
                              <span>
                                ₦{selectedPlan.price.toLocaleString()}
                              </span>
                            </div>
                            <div className="border-t-2 border-indigo-200 pt-2 sm:pt-3 flex justify-between text-lg sm:text-xl font-bold text-indigo-600">
                              <span>Total:</span>
                              <span>
                                ₦
                                {(
                                  selectedPlan.price * formData.seats
                                ).toLocaleString()}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button
                      onClick={prevStep}
                      className="w-full sm:flex-1 border-2 border-gray-300 text-gray-700 py-3 sm:py-4 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm sm:text-base"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {submitting ? (
                        <>
                          <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />{" "}
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingForm;
