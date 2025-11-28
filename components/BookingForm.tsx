"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Users, 
  Calendar, 
  CheckCircle, 
  Loader,
  ArrowLeft,
  Globe
} from 'lucide-react';

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
// Country Code Data
// ──────────────────────────────────────────────────────────────

const countryCodes = [
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
];

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────

const BookingForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const defaultCountryCode = countryCodes.find(c => c.code === '+234')?.code || countryCodes[0].code;

  const [formData, setFormData] = useState<FormData>({
    fullname: '',
    email: '',
    phone: '',
    countryCode: defaultCountryCode,
    seats: 1,
    date: '',
    planId: null,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const fetchPlans = async (): Promise<void> => {
      try {
        setLoading(true);
        // Simulated plans data
        const mockPlans: Plan[] = [
          { _id: '1', name: 'Basic', description: 'Perfect for individuals', price: 10000, tag: 'Popular' },
          { _id: '2', name: 'Pro', description: 'Great for small teams', price: 25000, tag: 'Best Value' },
          { _id: '3', name: 'Enterprise', description: 'For large organizations', price: 50000 },
        ];
        
        setTimeout(() => {
          setPlans(mockPlans);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Failed to load plans:', err);
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
    
    const fullPhoneNumber = formData.countryCode + formData.phone.trim().replace(/\D/g, ''); 

    const payload = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: fullPhoneNumber,
      seats: formData.seats,
      date: new Date(formData.date).toISOString(),
      plan: formData.planId,
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Booking payload:', payload);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setFormData({
          fullname: '',
          email: '',
          phone: '',
          countryCode: defaultCountryCode,
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
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <button
          onClick={() => setSuccess(false)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-medium z-10 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">Booking Confirmed!</h2>
          <p className="text-gray-600 text-base sm:text-lg">Check your email for confirmation details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      <button
        onClick={() => alert('Going back...')}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-medium text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="max-w-5xl mx-auto mt-12 sm:mt-0">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 relative">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-2">Reserve Your Space</h1>
            <p className="text-white/90 text-center text-sm sm:text-base">Simple. Fast. Efficient.</p>

            {/* Progress Indicator */}
            <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold transition-all text-sm sm:text-base ${
                      step >= s
                        ? 'bg-white text-indigo-600'
                        : 'bg-white/30 text-white'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-8 sm:w-12 lg:w-16 h-1 ${step > s ? 'bg-white' : 'bg-white/30'}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Personal Information</h2>

                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => updateField('fullname', e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                      errors.fullname ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                    } outline-none`}
                    placeholder="John Doe"
                  />
                  {errors.fullname && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fullname}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                      errors.email ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                    } outline-none`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-2/5 sm:w-1/3">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => updateField('countryCode', e.target.value)}
                        className="appearance-none w-full px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none pr-7 sm:pr-8 text-xs sm:text-sm"
                      >
                        {countryCodes.map(c => (
                          <option key={c.name} value={c.code} title={c.name}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <Globe className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                    </div>

                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={`w-3/5 sm:w-2/3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                        errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                      } outline-none`}
                      placeholder="800 000 0000"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
                </div>

                <button
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-lg transition-all"
                >
                  Continue to Plans
                </button>
              </div>
            )}

            {/* Step 2: Choose Plan */}
            {step === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Choose Your Plan</h2>

                {loading ? (
                  <div className="flex justify-center py-12 sm:py-20">
                    <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-indigo-600" />
                  </div>
                ) : plans.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 sm:py-10 text-sm sm:text-base">No plans available at the moment.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {plans.map((plan) => {
                      const planId = plan._id || plan.id || null;
                      const isSelected = formData.planId === planId;

                      return (
                        <div
                          key={planId}
                          onClick={() => updateField('planId', planId)}
                          className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                              : 'border-gray-200 hover:border-indigo-400'
                          }`}
                        >
                          {plan.tag && (
                            <span className="inline-block bg-indigo-600 text-white text-xs px-2.5 sm:px-3 py-1 rounded-full mb-2 sm:mb-3">
                              {plan.tag}
                            </span>
                          )}
                          <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{plan.name}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{plan.description}</p>
                          {plan.price !== undefined && (
                            <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
                              ₦{plan.price.toLocaleString()}
                            </p>
                          )}
                          {isSelected && (
                            <div className="mt-3 sm:mt-4 text-indigo-600 font-medium flex items-center gap-2 text-sm sm:text-base">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                              Selected
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {errors.plan && <p className="text-red-500 text-center text-sm sm:text-base">{errors.plan}</p>}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <button
                    onClick={prevStep}
                    className="w-full sm:flex-1 border-2 border-gray-300 text-gray-700 py-3 sm:py-4 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm sm:text-base"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer text-white py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg transition-all text-sm sm:text-base"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Booking Details */}
            {step === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Booking Details</h2>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      Number of Seats
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.seats}
                      onChange={(e) => updateField('seats', parseInt(e.target.value) || 1)}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                        errors.seats ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                      } outline-none`}
                    />
                    {errors.seats && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.seats}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      min={new Date().toISOString().slice(0, 16)}
                      onChange={(e) => updateField('date', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                        errors.date ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                      } outline-none`}
                    />
                    {errors.date && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.date}</p>}
                  </div>
                </div>

                {selectedPlan && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-indigo-200">
                    <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-gray-800">Booking Summary</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-semibold">{selectedPlan.name}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Seats:</span>
                        <span className="font-semibold">{formData.seats}</span>
                      </div>
                      {selectedPlan.price !== undefined && (
                        <>
                          <div className="flex justify-between text-sm sm:text-base">
                            <span className="text-gray-600">Price per seat:</span>
                            <span>₦{selectedPlan.price.toLocaleString()}</span>
                          </div>
                          <div className="border-t-2 border-indigo-200 pt-2 sm:pt-3 flex justify-between text-lg sm:text-xl font-bold text-indigo-600">
                            <span>Total:</span>
                            <span>₦{(selectedPlan.price * formData.seats).toLocaleString()}</span>
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
                    className="w-full sm:flex-1 cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;