import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Loader2,
  PlusCircle,
  Sparkles,
  Target,
  Trash2,
  Wallet,
} from 'lucide-react';
import { savingsService, SavingsGoalRecord } from '@/services/savingsService';
import { CreateGoalDialog } from '@/components/savings/CreateGoalDialog';
import { AddContributionDialog } from '@/components/savings/AddContributionDialog';

export const SavingsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch goal
  const {
    data: goal,
    isLoading: isGoalLoading,
    isError,
  } = useQuery({
    queryKey: ['savings-goal', id],
    queryFn: () => (id ? savingsService.getGoalById(id) : null),
    enabled: Boolean(id),
  });

  // Fetch contributions
  const {
    data: contributions = [],
    isLoading: isContribsLoading,
  } = useQuery({
    queryKey: ['savings-contributions', id],
    queryFn: () => (id ? savingsService.getGoalContributions(id) : []),
    enabled: Boolean(id),
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Omit<SavingsGoalRecord, 'id' | 'userId' | 'createdAt'>>) => {
      if (!id) throw new Error('Missing goal ID');
      return savingsService.updateGoal(id, data);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['savings-goal', id] });
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Goal "${updated.name}" updated!`);
      setIsEditOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update goal');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error('Missing goal ID');
      return savingsService.deleteGoal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Savings goal deleted.');
      navigate('/savings');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete goal');
    },
  });

  const contributeMutation = useMutation({
    mutationFn: (data: {
      amount: number;
      sourceAccountId: string;
      sourceAccountName: string;
      date: string;
      notes?: string;
    }) => {
      if (!id) throw new Error('Missing goal ID');
      return savingsService.addContribution(id, data);
    },
    onSuccess: ({ contribution }) => {
      queryClient.invalidateQueries({ queryKey: ['savings-goal', id] });
      queryClient.invalidateQueries({ queryKey: ['savings-contributions', id] });
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(
        `Added ${savingsService.formatINR(contribution.amount)} to goal!`
      );
      setIsAddMoneyOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to record contribution');
    },
  });

  if (isGoalLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-spendx-blue-primary animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading goal details...</p>
      </div>
    );
  }

  if (isError || !goal) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Savings Goal Not Found
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The goal you requested could not be located. It may have been archived or removed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/savings')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-spendx-blue-primary text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Goals</span>
        </button>
      </div>
    );
  }

  const progress =
    goal.targetAmount > 0
      ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
      : 0;

  const isCompleted = goal.status === 'COMPLETED' || progress >= 100;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  // Milestone checkpoints
  const milestones = [
    { label: '25% Kickoff', pct: 25, amount: goal.targetAmount * 0.25 },
    { label: '50% Halfway', pct: 50, amount: goal.targetAmount * 0.5 },
    { label: '75% Major Stride', pct: 75, amount: goal.targetAmount * 0.75 },
    { label: '100% Target Reached', pct: 100, amount: goal.targetAmount },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/savings')}
          className="self-start inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Savings Goals</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddMoneyOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-sm hover:shadow hover:opacity-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Money</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl glass-surface border border-white/80 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDeleting(true)}
            className="p-2 text-xs font-medium rounded-xl glass-surface border border-white/80 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
            aria-label="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center shrink-0 shadow-inner">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {goal.name}
                </h1>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-spendx-blue-primary/10 text-spendx-blue-primary border border-spendx-blue-primary/20'
                  }`}
                >
                  {isCompleted ? 'Goal Completed' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Category: <span className="font-semibold">{goal.category}</span> • Created on{' '}
                {new Date(goal.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-4 self-start md:self-auto">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Saved</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
                {savingsService.formatINR(goal.currentAmount)}
              </span>
            </div>
            <div className="text-slate-300 dark:text-white/20 text-2xl font-light">/</div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Target</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                {savingsService.formatINR(goal.targetAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">Milestone Progress</span>
            <span className={isCompleted ? 'text-emerald-600' : 'text-spendx-blue-primary'}>
              {progress}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200/60 dark:bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>
              {isCompleted ? (
                <span className="text-emerald-600 font-medium">All targets achieved!</span>
              ) : (
                `${savingsService.formatINR(remaining)} remaining to achieve goal`
              )}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Target Date:{' '}
              {new Date(goal.targetDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {goal.notes && (
          <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
              Goal Notes:
            </span>
            {goal.notes}
          </div>
        )}
      </div>

      {/* Milestone Roadmap */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-spendx-purple-primary" />
          <span>Milestone Checkpoints</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {milestones.map((ms) => {
            const isReached = goal.currentAmount >= ms.amount;
            return (
              <div
                key={ms.pct}
                className={`p-4 rounded-2xl border transition-all ${
                  isReached
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/25'
                    : 'glass-surface border-white/80 dark:border-white/10 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {ms.label}
                  </span>
                  {isReached ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                  {savingsService.formatINR(ms.amount)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {isReached ? 'Achieved' : 'Pending Milestone'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contribution History Ledger */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-spendx-blue-primary" />
              <span>Contribution History</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified asset reallocations deposited towards this milestone
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddMoneyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl glass-surface border border-white/80 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Deposit</span>
          </button>
        </div>

        {isContribsLoading ? (
          <div className="py-10 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-spendx-blue-primary" /> Loading history...
          </div>
        ) : contributions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100/80 dark:border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Funding Account</th>
                  <th className="py-2.5 px-3">Memo</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 dark:divide-white/5">
                {contributions.map((c) => (
                  <tr key={c.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {new Date(c.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      +{savingsService.formatINR(c.amount)}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-200 font-medium">
                      {c.sourceAccountName}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {c.notes || 'Direct allocation'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Reconciled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No contributions deposited to this goal yet. Click "Add Money" to make your first deposit!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <CreateGoalDialog
        isOpen={isEditOpen}
        initialData={goal}
        onClose={() => setIsEditOpen(false)}
        onSubmit={async (data) => {
          await updateMutation.mutateAsync(data);
        }}
        isSubmitting={updateMutation.isPending}
      />

      {/* Add Contribution Modal */}
      <AddContributionDialog
        isOpen={isAddMoneyOpen}
        goal={goal}
        onClose={() => setIsAddMoneyOpen(false)}
        onSubmit={async (data) => {
          await contributeMutation.mutateAsync(data);
        }}
        isSubmitting={contributeMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Delete Savings Goal?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                "{goal.name}"
              </span>
              ? Your accounts and past transaction records will remain safely intact.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
