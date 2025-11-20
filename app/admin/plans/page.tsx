"use client";
import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft, Edit2, Trash2, Check, X, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/utils/API";
import { useRouter } from "next/navigation";

interface Plan {
  id?: string;
  _id?: string;
  planId?: string;
  name: string;
  price: number | string;
  description: string;
  perks: string[];
  [key: string]: any;
}

export default function ManagePlans() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    perks: [""],
  });

  const API_ENDPOINTS = {
    getPlans: `${API_BASE_URL}/plans`,
    createPlan: `${API_BASE_URL}/plans`,
    updatePlan: (id: string) => `${API_BASE_URL}/plans/${id}`,
    deletePlan: (id: string) => `${API_BASE_URL}/plans/${id}`,
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_ENDPOINTS.getPlans);
      if (!response.ok) throw new Error("Failed to fetch plans");
      const data = await response.json();
      setPlans(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode: string, plan: Plan | null = null) => {
    setModalMode(mode);
    if (mode === "edit" && plan) {
      const planWithId = { ...plan, id: plan.id || plan._id || plan.planId };
      setCurrentPlan(planWithId);
      setFormData({
        name: plan.name,
        price: String(plan.price),
        description: plan.description,
        perks: plan.perks || [""],
      });
    } else {
      setCurrentPlan(null);
      setFormData({ name: "", price: "", description: "", perks: [""] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPlan(null);
    setFormData({ name: "", price: "", description: "", perks: [""] });
  };

  const validateFormData = (): { isValid: boolean; filteredPerks: string[] } => {
    const numericPrice = Number(formData.price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert("Price must be a number greater than 0.");
      return { isValid: false, filteredPerks: [] };
    }
    if (!formData.description.trim()) {
      alert("Description cannot be empty.");
      return { isValid: false, filteredPerks: [] };
    }
    const filteredPerks = formData.perks.filter((perk) => perk.trim() !== "");
    if (filteredPerks.length === 0) {
      alert("Please add at least one perk.");
      return { isValid: false, filteredPerks: [] };
    }
    return { isValid: true, filteredPerks };
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { isValid, filteredPerks } = validateFormData();
    if (!isValid) { setSaving(false); return; }
    const bodyData = { ...formData, price: Number(formData.price), perks: filteredPerks };
    try {
      const response = await fetch(API_ENDPOINTS.createPlan, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error("Failed to create plan");
      const result = await response.json();
      setPlans([...plans, { ...result, id: result.id || result._id || result.planId }]);
      alert("Plan created successfully!");
      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally { setSaving(false); }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlan?.id) { alert("Plan ID missing."); return; }
    setSaving(true);
    const { isValid, filteredPerks } = validateFormData();
    if (!isValid) { setSaving(false); return; }
    const bodyData = { ...formData, price: Number(formData.price), perks: filteredPerks };
    try {
      const response = await fetch(API_ENDPOINTS.updatePlan(currentPlan.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error("Failed to update plan");
      const result = await response.json();
      setPlans(plans.map((p) => (p.id === currentPlan.id ? { ...result, id: result.id || result._id || result.planId } : p)));
      alert("Plan updated successfully!");
      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally { setSaving(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (modalMode === "add") await handleAddPlan(e);
    else await handleUpdatePlan(e);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    setDeleting(id);
    try {
      const response = await fetch(API_ENDPOINTS.deletePlan(id), { method: "DELETE" });
      if (!response.ok) throw new Error(`Failed to delete plan: ${response.status}`);
      setPlans(plans.filter((p) => p.id !== id));
      alert("Plan deleted successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally { setDeleting(null); }
  };

  const updatePerk = (index: number, value: string) => {
    const updated = [...formData.perks];
    updated[index] = value;
    setFormData({ ...formData, perks: updated });
  };
  const addPerk = () => setFormData({ ...formData, perks: [...formData.perks, ""] });
  const removePerk = (index: number) =>
    setFormData({ ...formData, perks: formData.perks.filter((_, i) => i !== index) });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 flex items-center gap-4 p-4 bg-gray-100/80 backdrop-blur-sm">
        <ArrowLeft className="w-6 h-6 text-gray-800 cursor-pointer" />
        <h1 className="text-gray-800 text-lg md:text-xl font-bold">Manage Plans</h1>
      </header>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-800 text-sm">Error loading plans. Showing cached data.</p>
        </div>
      )}

      {/* Plans Grid */}
      <main className="p-4 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{plan.name}</h2>
                  <p className="text-gray-600 font-medium">₦{Number(plan.price).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal("edit", plan)} disabled={deleting !== null} className="text-gray-600 hover:bg-gray-100 p-2 rounded-full disabled:opacity-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => plan._id && handleDelete(plan._id)}
                    disabled={deleting !== null}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-full disabled:opacity-50 flex items-center justify-center"
                  >
                    {deleting === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 cursor-pointer" />}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

              <div className="space-y-2 border-t border-gray-200 pt-3">
                {plan.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <p className="text-sm text-gray-800">{perk}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Add Button */}
      <button onClick={() => openModal("add")} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition">
        <Plus className="w-7 h-7" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] sm:max-h-[95vh] my-4 sm:my-0">
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">{modalMode === "add" ? "Add Plan" : "Edit Plan"}</h2>
              <button onClick={closeModal}><X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="text-xs sm:text-sm text-gray-700">Plan Name *</label>
                <input value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-50 border text-sm text-gray-800" placeholder="e.g., Premium" />
              </div>

              <div>
                <label className="text-xs sm:text-sm text-gray-700">Price (₦) *</label>
                <input type="number" step="0.01" min="0.01" value={formData.price} required onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-50 border text-sm text-gray-800" placeholder="e.g., 1500" />
              </div>

              <div>
                <label className="text-xs sm:text-sm text-gray-700">Description *</label>
                <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-50 border text-sm text-gray-800 resize-none" />
              </div>

              {/* Perks */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm text-gray-700">Perks</label>
                  <button type="button" onClick={addPerk} className="text-blue-600 text-xs sm:text-sm">+ Add Perk</button>
                </div>

                {formData.perks.map((perk, index) => (
                  <div key={index} className="flex gap-2 items-center mb-2">
                    <input type="text" value={perk} onChange={(e) => updatePerk(index, e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border text-sm text-gray-800" placeholder="Enter perk" />
                    {formData.perks.length > 1 && <button type="button" onClick={() => removePerk(index)} className="shrink-0 text-red-500 hover:bg-red-100 p-1 rounded-full"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="w-full sm:w-auto px-4 py-2 rounded-lg text-gray-700 text-sm sm:text-base order-2 sm:order-1">Cancel</button>
                <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2">
                  {saving && <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />}
                  <span>{saving ? "Saving..." : modalMode === "add" ? "Create Plan" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
