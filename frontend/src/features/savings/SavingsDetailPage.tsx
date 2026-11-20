import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  Target,
  PlusCircle,
  Edit2,
  Trash2,
  Sparkles,
  Wallet,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { savingsService, SavingsGoalRecord } from '@/services/savingsService';
import { CreateGoalDialog } from '@/components/savings/CreateGoalDialog';
import { AddContributionDialog } from '@/components/savings/AddContributionDialog';

export const SavingsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch goal
  const {
    data: goal,
    isLoading: isGoalLoading,
    isError,
  } = useQuery({
    queryKey: ['savingsGoal', id],
    queryFn: () => (id ? savingsService.getGoalById(id) : null),
  });

  // Fetch contributions
  const { data: contributions = [], isLoading: isContribsLoading } = useQuery({
    queryKey: ['savingsContributions', id],
    queryFn: () => (id ? savingsService.getGoalContributions(id) : []),
    enabled: Boolean(id),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => savingsService.deleteGoal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast.success('Savings goal deleted');
      navigate('/savings');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete goal');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<SavingsGoalRecord>) => savingsService.updateGoal(id!, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoal', id] });
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      setIsEditOpen(false);
      toast.success(`Updated "${updated.name}"`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update goal');
    },
  });

  // Contribute mutation
  const contributeMutation = useMutation({
    mutationFn: (data: {
      amount: number;
      sourceAccountId: string;
      sourceAccountName: string;
      date: string;
      notes?: string;
    }) => savingsService.addContribution(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoal', id] });
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      queryClient.invalidateQueries({ queryKey: ['savingsContributions', id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setIsAddMoneyOpen(false);
      toast.success('Contribution added successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to record contribution');
    },
  });

  if (isGoalLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-xs text-secondary-text font-medium">Loading goal details...</p>
      </div>
    );
  }

  if (isError || !goal) {
    return (
      <div className="bg-surface p-10 rounded-2xl text-center space-y-4 border border-border shadow-card">
        <h2 className="text-lg font-display font-bold text-foreground">
          Savings Goal Not Found
        </h2>
        <p className="text-xs text-secondary-text max-w-sm mx-auto">
          The goal you requested could not be located. It may have been archived or removed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/savings')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-[#111711] cursor-pointer shadow-xs"
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
          className="self-start inline-flex items-center gap-2 text-xs font-medium text-foreground px-3 py-1.5 rounded-xl bg-surface-elevated border border-border hover:bg-surface-elevated/80 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Savings Goals</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddMoneyOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-[#111711] shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Money</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-surface-elevated border border-border hover:bg-surface-elevated/80 text-foreground transition-colors cursor-pointer shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDeleting(true)}
            className="p-2 text-xs font-semibold rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/25 transition-all cursor-pointer shadow-xs focus:ring-2 focus:ring-red-500"
            aria-label="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                  {goal.name}
                </h1>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-income/10 text-income border border-income/20'
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}
                >
                  {isCompleted ? 'Goal Completed' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-secondary-text mt-0.5">
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
              <span className="text-xs text-secondary-text block font-medium">Saved</span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tabular-nums">
                {savingsService.formatINR(goal.currentAmount)}
              </span>
            </div>
            <div className="text-muted-foreground text-2xl font-light">/</div>
            <div>
              <span className="text-xs text-secondary-text block font-medium">Target</span>
              <span className="text-xl sm:text-2xl font-display font-bold text-secondary-text tabular-nums">
                {savingsService.formatINR(goal.targetAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-foreground">Milestone Progress</span>
            <span className={isCompleted ? 'text-income' : 'text-primary'}>
              {progress}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-surface-elevated border border-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? 'bg-income'
                  : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-secondary-text pt-1">
            <span>
              {isCompleted ? (
                <span className="text-income font-medium">All targets achieved!</span>
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
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs text-foreground">
            <span className="font-semibold text-secondary-text block mb-0.5">
              Goal Notes:
            </span>
            {goal.notes}
          </div>
        )}
      </div>

      {/* Milestone Roadmap */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-card space-y-4">
        <h3 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>Milestone Checkpoints</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {milestones.map((ms) => {
            const isReached = goal.currentAmount >= ms.amount;
            return (
              <div
                key={ms.pct}
                className={`p-4 rounded-xl border transition-all ${
                  isReached
                    ? 'bg-income/5 border-income/30'
                    : 'bg-surface-elevated border-border opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground">
                    {ms.label}
                  </span>
                  {isReached ? (
                    <CheckCircle2 className="w-4 h-4 text-income" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-base font-display font-bold text-foreground tabular-nums">
                  {savingsService.formatINR(ms.amount)}
                </div>
                <div className="text-[11px] text-secondary-text mt-1">
                  {isReached ? 'Achieved' : 'Pending Milestone'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contribution History Ledger */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span>Contribution History</span>
            </h3>
            <p className="text-xs text-secondary-text mt-0.5">
              Verified asset reallocations deposited towards this milestone
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddMoneyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-surface-elevated border border-border hover:bg-surface-elevated/80 text-foreground transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Deposit</span>
          </button>
        </div>

        {isContribsLoading ? (
          <div className="py-10 text-center text-xs text-secondary-text flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" /> Loading history...
          </div>
        ) : contributions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Funding Account</th>
                  <th className="py-2.5 px-3">Memo</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {contributions.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-elevated transition-colors">
                    <td className="py-3 px-3 text-foreground font-medium">
                      {new Date(c.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 font-display font-bold text-income tabular-nums">
                      +{savingsService.formatINR(c.amount)}
                    </td>
                    <td className="py-3 px-3 text-foreground font-medium">
                      {c.sourceAccountName}
                    </td>
                    <td className="py-3 px-3 text-secondary-text">
                      {c.notes || 'Direct allocation'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-income/10 text-income border border-income/20">
                        <CheckCircle2 className="w-3 h-3" /> Reconciled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-secondary-text">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs space-y-4">
            <h3 className="text-base font-display font-bold text-foreground">
              Delete Savings Goal?
            </h3>
            <p className="text-xs text-secondary-text leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                "{goal.name}"
              </span>
              ? Your accounts and past transaction records will remain safely intact.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-surface-elevated border border-border text-foreground hover:bg-surface-elevated/80 shadow-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 focus:ring-2 focus:ring-red-500"
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

export default SavingsDetailPage;
