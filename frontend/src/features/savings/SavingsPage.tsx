import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import {
  SavingsGoalRecord,
  savingsService,
} from '@/services/savingsService';
import { SavingsOverview } from '@/components/savings/SavingsOverview';
import {
  SavingsToolbar,
  SavingsFiltersState,
} from '@/components/savings/SavingsToolbar';
import { SavingsGoalCard } from '@/components/savings/SavingsGoalCard';
import { CreateGoalDialog } from '@/components/savings/CreateGoalDialog';
import { AddContributionDialog } from '@/components/savings/AddContributionDialog';
import { SavingsProgressChart } from '@/components/savings/SavingsProgressChart';
import { SavingsInsights } from '@/components/savings/SavingsInsights';
import { SavingsEmptyState } from '@/components/savings/SavingsEmptyState';

export const SavingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoalRecord | null>(null);
  const [contributingGoal, setContributingGoal] = useState<SavingsGoalRecord | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<SavingsGoalRecord | null>(null);

  // Filters state
  const [filters, setFilters] = useState<SavingsFiltersState>({
    search: '',
    category: 'ALL',
    status: 'ALL',
    sortBy: 'PROGRESS_DESC',
  });

  // Fetch Goals
  const {
    data: goals = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['savings-goals'],
    queryFn: () => savingsService.getGoals(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (
      data: Omit<SavingsGoalRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ) => savingsService.createGoal(data),
    onSuccess: (newGoal) => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Savings goal "${newGoal.name}" created successfully!`);
      setIsCreateOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create savings goal');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<SavingsGoalRecord, 'id' | 'userId' | 'createdAt'>>;
    }) => savingsService.updateGoal(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Savings goal "${updated.name}" updated!`);
      setEditingGoal(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update goal');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => savingsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Savings goal deleted.');
      setDeletingGoal(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete goal');
    },
  });

  const contributeMutation = useMutation({
    mutationFn: (params: {
      goalId: string;
      data: {
        amount: number;
        sourceAccountId: string;
        sourceAccountName: string;
        date: string;
        notes?: string;
      };
    }) => savingsService.addContribution(params.goalId, params.data),
    onSuccess: ({ goal, contribution }) => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(
        `Allocated ${savingsService.formatINR(contribution.amount)} to "${goal.name}"!`
      );
      setContributingGoal(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to add money to goal');
    },
  });

  // Overview metrics
  const overviewMetrics = useMemo(() => {
    return savingsService.computeOverviewMetrics(goals);
  }, [goals]);

  // Insights
  const insights = useMemo(() => {
    return savingsService.generateInsights(goals);
  }, [goals]);

  // Filtered & Sorted Goals
  const filteredGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Status filter
        if (filters.status === 'ACTIVE' && goal.status !== 'ACTIVE') return false;
        if (filters.status === 'COMPLETED' && goal.status !== 'COMPLETED') return false;

        // Category filter
        if (filters.category !== 'ALL' && goal.category !== filters.category) return false;

        // Search filter
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchName = goal.name.toLowerCase().includes(q);
          const matchNotes = goal.notes?.toLowerCase().includes(q);
          const matchCat = goal.category.toLowerCase().includes(q);
          if (!matchName && !matchNotes && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const progA = a.targetAmount > 0 ? a.currentAmount / a.targetAmount : 0;
        const progB = b.targetAmount > 0 ? b.currentAmount / b.targetAmount : 0;

        switch (filters.sortBy) {
          case 'PROGRESS_DESC':
            return progB - progA;
          case 'PROGRESS_ASC':
            return progA - progB;
          case 'TARGET_DESC':
            return b.targetAmount - a.targetAmount;
          case 'TARGET_ASC':
            return a.targetAmount - b.targetAmount;
          case 'DATE_ASC':
            return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
          default:
            return 0;
        }
      });
  }, [goals, filters]);

  const isFiltered = Boolean(
    filters.search || filters.category !== 'ALL' || filters.status !== 'ALL'
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple">
            Savings Goals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Turn your financial dreams into achievable milestones with automated pacing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white font-medium text-xs shadow-md hover:shadow-lg hover:opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* 2. Overview Metrics Cards */}
      <SavingsOverview metrics={overviewMetrics} />

      {/* 3. Toolbar (Search, Filter, Sort, New Goal) */}
      <SavingsToolbar
        filters={filters}
        onChange={setFilters}
        onCreateGoal={() => setIsCreateOpen(true)}
        totalGoalCount={goals.length}
      />

      {/* 4. Main Goals Content */}
      {isLoading ? (
        <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-spendx-blue-primary animate-spin mb-3" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Loading savings milestones...
          </p>
        </div>
      ) : isError ? (
        <div className="glass-panel p-10 rounded-2xl text-center text-rose-500 text-xs">
          Failed to load savings goals. Please reload or check your connection.
        </div>
      ) : filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGoals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onAddMoney={(g) => setContributingGoal(g)}
              onEdit={(g) => setEditingGoal(g)}
              onDelete={(g) => setDeletingGoal(g)}
            />
          ))}
        </div>
      ) : (
        <SavingsEmptyState
          isFiltered={isFiltered}
          onResetFilters={() =>
            setFilters({
              search: '',
              category: 'ALL',
              status: 'ALL',
              sortBy: 'PROGRESS_DESC',
            })
          }
          onCreateGoal={() => setIsCreateOpen(true)}
        />
      )}

      {/* 5. Progress Charts & Category Allocation */}
      {goals.length > 0 && <SavingsProgressChart goals={goals} />}

      {/* 6. AI Insights & Pacing Intelligence */}
      {insights.length > 0 && <SavingsInsights insights={insights} />}

      {/* Modal 1: Create New Goal */}
      <CreateGoalDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          await createMutation.mutateAsync(data);
        }}
        isSubmitting={createMutation.isPending}
      />

      {/* Modal 2: Edit Goal */}
      <CreateGoalDialog
        isOpen={Boolean(editingGoal)}
        initialData={editingGoal}
        onClose={() => setEditingGoal(null)}
        onSubmit={async (data) => {
          if (editingGoal) {
            await updateMutation.mutateAsync({ id: editingGoal.id, data });
          }
        }}
        isSubmitting={updateMutation.isPending}
      />

      {/* Modal 3: Add Contribution (Deposit) */}
      <AddContributionDialog
        isOpen={Boolean(contributingGoal)}
        goal={contributingGoal}
        onClose={() => setContributingGoal(null)}
        onSubmit={async (data) => {
          if (contributingGoal) {
            await contributeMutation.mutateAsync({
              goalId: contributingGoal.id,
              data,
            });
          }
        }}
        isSubmitting={contributeMutation.isPending}
      />

      {/* Modal 4: Delete Confirmation */}
      {deletingGoal && (
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
                "{deletingGoal.name}"
              </span>
              ? Your accumulated ledger balance will remain recorded in source accounts.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingGoal(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deletingGoal.id)}
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
