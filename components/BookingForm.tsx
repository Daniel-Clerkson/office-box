"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Users, 
  Calendar, 
  CheckCircle, 
  Loader,
  ArrowLeft,
  Globe // Added Globe icon for country code
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/utils/API';

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
  phone: string; // This will now store the local part of the number
  countryCode: string; // NEW: Stores the country code, e.g., '+234'
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
// Country Code Data
// ──────────────────────────────────────────────────────────────

// Simplified list for demonstration. You can expand this.
const countryCodes = [
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  // Add more countries here
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

  // Set default country code to Nigeria (+234)
  const defaultCountryCode = countryCodes.find(c => c.code === '+234')?.code || countryCodes[0].code;

  const [formData, setFormData] = useState<FormData>({
    fullname: '',
    email: '',
    phone: '',
    countryCode: defaultCountryCode, // Initializing new state
    seats: 1,
    date: '',
    planId: null,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Fetch plans (omitted for brevity, assume it's the same)
  useEffect(() => {
    const fetchPlans = async (): Promise<void> => {
      try {
        setLoading(true);
        // NOTE: Fix template literal syntax
        const res = await fetch(`${API_BASE_URL}/plans`);
        
        if (!res.ok) throw new Error('Failed to fetch plans');

        const raw = await res.json();

        let plansList: Plan[] = [];
        if (Array.isArray(raw)) {
          plansList = raw;
        } else if (raw?.plans && Array.isArray(raw.plans)) {
          plansList = raw.plans;
        } else if (raw?.data && Array.isArray(raw.data)) {
          plansList = raw.data;
        }

        setPlans(plansList);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const selectedPlan = plans.find(
    (p) => formData.planId !== null && (p._id === formData.planId || p.id === formData.planId)
  );

  const validateStep = (currentStep: number): boolean => {
    const newErrors: ValidationErrors = {};

    if (currentStep === 1) {
      if (!formData.fullname.trim() || formData.fullname.trim().length < 2) {
        newErrors.fullname = 'Please enter your full name (min. 2 characters)';
      }
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      // NEW VALIDATION: Check local number part length (e.g., min 8 digits)
      if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 8) {
        newErrors.phone = 'Please enter a valid local phone number (min. 8 digits)';
      }
    }

    if (currentStep === 2 && !formData.planId) {
      newErrors.plan = 'Please select a plan';
    }

    if (currentStep === 3) {
      if (!formData.date) {
        newErrors.date = 'Please select a date and time';
      }
      if (formData.seats < 1) {
        newErrors.seats = 'At least 1 seat is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (): void => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = (): void => setStep(prev => Math.max(1, prev - 1));

  const handleSubmit = async (): Promise<void> => {
    if (!validateStep(3)) return;

    setSubmitting(true);
    
    // COMBINE countryCode and phone for the final payload
    const fullPhoneNumber = formData.countryCode + formData.phone.trim().replace(/\D/g, ''); 

    const payload = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: fullPhoneNumber, // Use the combined number
      seats: formData.seats,
      date: new Date(formData.date).toISOString(),
      plan: formData.planId,
    };

    try {
      // NOTE: Fix template literal syntax
      const res = await fetch(`${API_BASE_URL}/booking`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Booking failed');
      }

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setFormData({
          fullname: '',
          email: '',
          phone: '',
          countryCode: defaultCountryCode, // Reset to default
          seats: 1,
          date: '',
          planId: null,
        });
        setErrors({});
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      alert('Booking failed: ' + message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Floating Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-4 rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-medium z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Booking Confirmed!</h2>
          <p className="text-gray-600 text-lg">Check your email for confirmation details.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 relative">
      {/* Main Back Button (Top Left) */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-6 z-20 cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-4 rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Header with Back Button (Top Right) */}
          <div className="bg-primary p-8 relative">
          
            <h1 className="text-4xl font-bold text-white text-center mb-2">Reserve Your Space</h1>
            <p className="text-white/90 text-center">Simple. Fast. Efficient.</p>

            <div className="flex justify-center items-center gap-4 mt-8">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${                      step >= s
                        ? 'bg-white text-indigo-600'
                        : 'bg-white/30 text-white'
                    }`}                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 h-1 ${step > s ? 'bg-white' : 'bg-white/30'}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>

                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => updateField('fullname', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.fullname ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'} outline-none`}                      placeholder="John Doe"
                    />
                    {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <Mail className="w-5 h-5 text-indigo-600" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'} outline-none`}                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Number (SPLIT INPUT) */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <Phone className="w-5 h-5 text-indigo-600" />
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code Dropdown */}
                      <div className="relative w-1/3">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => updateField('countryCode', e.target.value)}
                          className={`appearance-none w-full px-2 sm:px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none pr-8 text-sm`}
                        >
                          {countryCodes.map(c => (
                            <option key={c.name} value={c.code} title={c.name}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>

                      {/* Local Phone Number Input */}
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={`w-2/3 px-4 py-3 rounded-xl border-2 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'} outline-none`}                        
                        placeholder="800 000 0000"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full bg-primary cursor-pointer text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                  >
                    Continue to Plans
                  </button>
                </motion.div>
              )}

              {/* Step 2 (Rest of the component remains the same) */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Plan</h2>

                  {loading ? (
                    <div className="flex justify-center py-20">
                      <Loader className="w-12 h-12 animate-spin text-indigo-600" />
                    </div>
                  ) : plans.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No plans available at the moment.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {plans.map((plan) => {
                        const planId = plan._id || plan.id || null;
                        const isSelected = formData.planId === planId;

                        return (
                          <motion.div
                            key={planId}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateField('planId', planId)}
                            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                                : 'border-gray-200 hover:border-indigo-400'
                            }`}                          >
                            {plan.tag && (
                              <span className="inline-block bg-indigo-600 text-white text-xs px-3 py-1 rounded-full mb-3">
                                {plan.tag}
                              </span>
                            )}
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                            {plan.price !== undefined && (
                              <p className="text-3xl font-bold text-indigo-600">
                                ₦{plan.price.toLocaleString()}
                              </p>
                            )}
                            {isSelected && (
                              <div className="mt-4 text-indigo-600 font-medium flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Selected
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {errors.plan && <p className="text-red-500 text-center">{errors.plan}</p>}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={prevStep}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 bg-primary cursor-pointer text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 (omitted for brevity, assume it's the same) */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        Number of Seats
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.seats}
                        onChange={(e) => updateField('seats', parseInt(e.target.value) || 1)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${                          errors.seats ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } outline-none`}                      />
                      {errors.seats && <p className="text-red-500 text-sm mt-1">{errors.seats}</p>}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.date}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => updateField('date', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${                          errors.date ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } outline-none`}                      />
                      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>
                  </div>

                  {selectedPlan && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                      <h3 className="font-bold text-xl mb-4 text-gray-800">Booking Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan:</span>
                          <span className="font-semibold">{selectedPlan.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seats:</span>
                          <span className="font-semibold">{formData.seats}</span>
                        </div>
                        {selectedPlan.price !== undefined && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price per seat:</span>
                              <span>₦{selectedPlan.price.toLocaleString()}</span>
                            </div>
                            <div className="border-t-2 border-indigo-200 pt-3 flex justify-between text-xl font-bold text-indigo-600">
                              <span>Total:</span>
                              <span>₦{(selectedPlan.price * formData.seats).toLocaleString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={prevStep}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
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
