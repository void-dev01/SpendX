import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartNoAxesCombined, PlusCircle } from 'lucide-react';

export const AnalyticsEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-spendx-blue-primary/20 to-spendx-purple-primary/20 text-spendx-blue-primary flex items-center justify-center mb-4 shadow-inner">
        <ChartNoAxesCombined className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
        Your financial story starts here.
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1 leading-relaxed">
        Add transactions to unlock meaningful insights about your money. Trends, income-expense ratios, and category distributions will calculate automatically.
      </p>
      <button
        type="button"
        onClick={() => navigate('/transactions')}
        className="mt-5 flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all cursor-pointer"
      >
        <PlusCircle className="w-4 h-4" />
        <span>View Transactions</span>
      </button>
    </div>
  );
};
