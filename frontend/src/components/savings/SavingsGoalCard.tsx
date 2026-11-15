import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Laptop,
  Plane,
  Car,
  Home,
  GraduationCap,
  Heart,
  PiggyBank,
  MoreVertical,
  Edit2,
  Trash2,
  PlusCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { SavingsGoalRecord, savingsService } from '@/services/savingsService';

interface SavingsGoalCardProps {
  goal: SavingsGoalRecord;
  onAddMoney: (goal: SavingsGoalRecord) => void;
  onEdit: (goal: SavingsGoalRecord) => void;
  onDelete: (goal: SavingsGoalRecord) => void;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  goal,
  onAddMoney,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Emergency Fund':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'Technology':
        return <Laptop className="w-5 h-5 text-spendx-blue-primary" />;
      case 'Travel':
        return <Plane className="w-5 h-5 text-indigo-500" />;
      case 'Vehicle':
        return <Car className="w-5 h-5 text-amber-500" />;
      case 'Home':
        return <Home className="w-5 h-5 text-rose-500" />;
      case 'Education':
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'Wedding':
        return <Heart className="w-5 h-5 text-pink-500" />;
      default:
        return <PiggyBank className="w-5 h-5 text-spendx-purple-primary" />;
    }
  };

  const progress =
    goal.targetAmount > 0
      ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
      : 0;

  const isCompleted = goal.status === 'COMPLETED' || progress >= 100;
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

  // Compute days remaining
  const targetDateObj = new Date(goal.targetDate);
  const now = new Date();
  const diffTime = targetDateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getDaysLabel = () => {
    if (isCompleted) return 'Target Achieved 🎉';
    if (diffDays < 0) return 'Past Target Date';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  return (
    <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group transition-all duration-200">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass-surface border border-white/80 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              {getCategoryIcon(goal.category)}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">
                {goal.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {goal.category}
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-spendx-blue-primary/10 text-spendx-blue-primary dark:text-spendx-blue-primary border border-spendx-blue-primary/20'
                  }`}
                >
                  {isCompleted ? 'Completed' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Savings goal actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-36 py-1 glass-panel rounded-xl shadow-lg border border-white/80 dark:border-white/10 z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(goal);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Goal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(goal);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Goal</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Note if available */}
        {goal.notes && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">
            "{goal.notes}"
          </p>
        )}

        {/* Amount Metrics */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Saved</span>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 tabular-nums">
              {savingsService.formatINR(goal.currentAmount)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Target</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
              {savingsService.formatINR(goal.targetAmount)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1 font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span
              className={
                isCompleted
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-spendx-blue-primary'
              }
            >
              {progress}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Target Date & Remaining */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{getDaysLabel()}</span>
          </div>
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {isCompleted ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Reached
              </span>
            ) : (
              `${savingsService.formatINR(remainingAmount)} left`
            )}
          </span>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="mt-4 pt-3 flex items-center gap-2 border-t border-slate-100/60 dark:border-white/5">
        <button
          type="button"
          onClick={() => onAddMoney(goal)}
          className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-gradient-to-r from-spendx-blue-primary/10 to-spendx-purple-primary/10 hover:from-spendx-blue-primary/20 hover:to-spendx-purple-primary/20 text-spendx-blue-primary dark:text-spendx-soft-purple border border-spendx-blue-primary/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Money</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/savings/${goal.id}`)}
          className="py-2 px-3 text-xs font-medium rounded-xl glass-surface border border-white/80 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1 cursor-pointer"
          title="View goal history and details"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
