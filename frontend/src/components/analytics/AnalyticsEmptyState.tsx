import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartNoAxesCombined, PlusCircle } from 'lucide-react';

export const AnalyticsEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-surface border border-border p-12 flex flex-col items-center justify-center text-center shadow-card">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <ChartNoAxesCombined className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold font-display text-foreground">
        Your financial story starts here.
      </h3>
      <p className="text-xs text-secondary-text max-w-md mt-1 leading-relaxed">
        Add transactions to unlock meaningful insights about your money. Trends, income-expense ratios, and category distributions will calculate automatically.
      </p>
      <button
        type="button"
        onClick={() => navigate('/transactions')}
        className="mt-5 flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer min-h-[40px]"
      >
        <PlusCircle className="w-4 h-4" />
        <span>View Transactions</span>
      </button>
    </div>
  );
};
