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
        return <ShieldCheck className="w-5 h-5 text-income" />;
      case 'Technology':
        return <Laptop className="w-5 h-5 text-primary" />;
      case 'Travel':
        return <Plane className="w-5 h-5 text-secondary" />;
      case 'Vehicle':
        return <Car className="w-5 h-5 text-amber-500" />;
      case 'Home':
        return <Home className="w-5 h-5 text-expense" />;
      case 'Education':
        return <GraduationCap className="w-5 h-5 text-secondary" />;
      case 'Wedding':
        return <Heart className="w-5 h-5 text-pink-500" />;
      default:
        return <PiggyBank className="w-5 h-5 text-primary" />;
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
    <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card hover:shadow-elevated flex flex-col justify-between group transition-all duration-200">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-elevated border border-border flex items-center justify-center shrink-0 shadow-xs">
              {getCategoryIcon(goal.category)}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground line-clamp-1 leading-tight">
                {goal.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-medium text-secondary-text">
                  {goal.category}
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-border" />
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-income/10 text-income border border-income/20'
                      : 'bg-primary/10 text-primary border border-primary/20'
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
              className="p-1.5 rounded-lg text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
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
                <div className="absolute right-0 mt-1 w-36 py-1 bg-surface rounded-xl shadow-elevated border border-border z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(goal);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-foreground hover:bg-surface-elevated cursor-pointer"
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
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-destructive hover:bg-destructive/10 cursor-pointer"
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
          <p className="mt-2 text-xs text-secondary-text line-clamp-2 italic">
            "{goal.notes}"
          </p>
        )}

        {/* Amount Metrics */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground block font-semibold uppercase tracking-wider">Saved</span>
            <span className="text-2xl font-display font-extrabold tracking-tight text-foreground tabular-nums">
              {savingsService.formatINR(goal.currentAmount)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-muted-foreground block font-semibold uppercase tracking-wider">Target</span>
            <span className="text-sm font-semibold text-secondary-text tabular-nums">
              {savingsService.formatINR(goal.targetAmount)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1 font-medium">
            <span className="text-secondary-text">Progress</span>
            <span
              className={
                isCompleted
                  ? 'text-income'
                  : 'text-primary'
              }
            >
              {progress}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-elevated border border-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? 'bg-income'
                  : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Target Date & Remaining */}
        <div className="mt-3 flex items-center justify-between text-xs text-secondary-text pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{getDaysLabel()}</span>
          </div>
          <span className="font-medium text-foreground">
            {isCompleted ? (
              <span className="flex items-center gap-1 text-income font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Reached
              </span>
            ) : (
              `${savingsService.formatINR(remainingAmount)} left`
            )}
          </span>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="mt-4 pt-3 flex items-center gap-2 border-t border-border">
        <button
          type="button"
          onClick={() => onAddMoney(goal)}
          className="flex-1 py-2 px-3 text-xs font-medium rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Money</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/savings/${goal.id}`)}
          className="py-2 px-3 text-xs font-medium rounded-xl bg-surface-elevated border border-border hover:bg-surface-elevated/80 text-foreground transition-all flex items-center gap-1 cursor-pointer shadow-xs"
          title="View goal history and details"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
