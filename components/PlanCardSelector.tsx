"use client";

interface Plan {
  id: number | string;
  name: string;
  price: number;
  description: string;
  perks?: string[];
  tag?: string; // e.g. "Popular"
}

interface PlanCardSelectorProps {
  plans: Plan[];
  selectedPlanId: number | string | null;
  onSelect: (plan: Plan) => void;
}

export function PlanCardSelector({
  plans,
  selectedPlanId,
  onSelect,
}: PlanCardSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {plans.map((plan) => {
        const isSelected = String(plan.id) === String(selectedPlanId);

        return (
          <div
            key={plan.id}
            onClick={() => {
              console.log("Plan selected:", plan);
              onSelect(plan);
            }}
            className={`
              cursor-pointer border rounded-2xl p-5 transition-all shadow-sm
              ${isSelected
                ? "border-blue-500 shadow-blue-300/40 dark:shadow-blue-900 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
              }
            `}
          >
            {/* Tag */}
            {plan.tag && (
              <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mb-3">
                {plan.tag}
              </span>
            )}

            {/* Plan Name */}
            <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {plan.description}
            </p>

            {/* Price */}
            <p className="mt-4 text-2xl font-bold">
              ₦{plan.price.toLocaleString()}
            </p>

            {/* Perks */}
            {plan.perks && (
              <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {plan.perks.map((perk, idx) => (
                  <li key={idx}>• {perk}</li>
                ))}
              </ul>
            )}

            {/* Selected indicator */}
            {isSelected && (
              <div className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                ✓ Selected
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
