import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import {
  budgetService,
  BudgetRecord,
  BudgetWithMetrics,
} from '@/services/budgetService';
import { transactionService } from '@/services/transactionService';
import { BudgetOverviewCards } from '@/components/budgets/BudgetOverviewCards';
import { OverallBudgetCard } from '@/components/budgets/OverallBudgetCard';
import { CategoryBudgetCard } from '@/components/budgets/CategoryBudgetCard';
import { BudgetToolbar, BudgetFiltersState } from '@/components/budgets/BudgetToolbar';
import { BudgetFormDialog } from '@/components/budgets/BudgetFormDialog';
import { BudgetCharts } from '@/components/budgets/BudgetCharts';
import { BudgetAlertsAndInsights } from '@/components/budgets/BudgetAlertsAndInsights';
import { BudgetEmptyState } from '@/components/budgets/BudgetEmptyState';
import { DeleteConfirmDialog } from '@/components/transactions/DeleteConfirmDialog';

const INITIAL_BUDGET_FILTERS: BudgetFiltersState = {
  period: 'THIS_MONTH',
  statusFilter: 'ALL',
  sortBy: 'UTIL_DESC',
};

export const BudgetsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<BudgetFiltersState>(INITIAL_BUDGET_FILTERS);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [editingBudget, setEditingBudget] = useState<BudgetRecord | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [budgetToDelete, setBudgetToDelete] = useState<BudgetRecord | null>(null);

  // TanStack Query for budgets
  const {
    data: budgets = [],
    isLoading: isBudgetsLoading,
    isError: isBudgetsError,
    error: budgetsError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getBudgets(),
  });

  // Query actual transactions to reconcile budget spending
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  // Compute live budget metrics reconciled with transactions
  const budgetMetrics = useMemo(() => {
    return budgetService.computeBudgetsWithMetrics(budgets, transactions, filters.period);
  }, [budgets, transactions, filters.period]);

  // Overall metrics
  const overallMetrics = useMemo(() => {
    return budgetService.computeOverallMetrics(budgetMetrics);
  }, [budgetMetrics]);

  // Alerts & Insights
  const alerts = useMemo(() => {
    return budgetService.generateAlerts(budgetMetrics);
  }, [budgetMetrics]);

  const insights = useMemo(() => {
    return budgetService.generateInsights(budgetMetrics);
  }, [budgetMetrics]);

  // Filter & Sort category cards
  const filteredBudgetMetrics = useMemo(() => {
    return budgetMetrics.filter((b) => {
      if (filters.statusFilter === 'NEAR_LIMIT_EXCEEDED') {
        return b.status === 'NEAR_LIMIT' || b.status === 'EXCEEDED';
      }
      if (filters.statusFilter === 'NORMAL') {
        return b.status === 'NORMAL' || b.status === 'APPROACHING';
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'BUDGET_DESC') {
        return b.allocatedAmount - a.allocatedAmount;
      }
      if (filters.sortBy === 'BUDGET_ASC') {
        return a.allocatedAmount - b.allocatedAmount;
      }
      if (filters.sortBy === 'SPENT_DESC') {
        return b.spent - a.spent;
      }
      if (filters.sortBy === 'NAME_ASC') {
        return a.category.localeCompare(b.category);
      }
      // UTIL_DESC
      return b.utilizationPercentage - a.utilizationPercentage;
    });
  }, [budgetMetrics, filters]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<BudgetRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      budgetService.createBudget(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setFormDialogOpen(false);
      setEditingBudget(null);
      toast.success('Budget Created', {
        description: `Configured ${created.category} limit of ${budgetService.formatINR(created.allocatedAmount)}.`,
      });
    },
    onError: (err: any) => {
      toast.error('Failed to Create Budget', {
        description: err?.message || 'Could not save budget allocation.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BudgetRecord> }) =>
      budgetService.updateBudget(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setFormDialogOpen(false);
      setEditingBudget(null);
      toast.success('Budget Updated', {
        description: `Saved updates for ${updated.category}.`,
      });
    },
    onError: (err: any) => {
      toast.error('Update Failed', {
        description: err?.message || 'Could not update budget.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => budgetService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteConfirmOpen(false);
      setBudgetToDelete(null);
      toast.success('Budget Deleted', {
        description: 'Budget removed. Your transaction history remains preserved.',
      });
    },
    onError: (err: any) => {
      toast.error('Deletion Failed', {
        description: err?.message || 'Could not delete budget.',
      });
    },
  });

  // Handlers
  const handleOpenCreate = () => {
    setEditingBudget(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (budget: BudgetWithMetrics) => {
    setEditingBudget(budget);
    setFormDialogOpen(true);
  };

  const handleOpenDelete = (budget: BudgetWithMetrics) => {
    setBudgetToDelete(budget);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (budgetToDelete) {
      await deleteMutation.mutateAsync(budgetToDelete.id);
    }
  };

  const handleFormSubmit = async (
    data: Omit<BudgetRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingBudget) {
      await updateMutation.mutateAsync({
        id: editingBudget.id,
        updates: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  if (isBudgetsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200/70 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl h-32" />
          ))}
        </div>
        <div className="glass-panel p-6 rounded-3xl h-44" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel p-5 rounded-3xl h-44" />
          ))}
        </div>
      </div>
    );
  }

  if (isBudgetsError) {
    return (
      <div className="glass-panel p-8 rounded-3xl max-w-xl mx-auto my-12 text-center space-y-4 border border-rose-500/20">
        <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Unable to Load Budgets
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {budgetsError instanceof Error ? budgetsError.message : 'An error occurred while calculating budget telemetry.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-spendx-blue-primary hover:bg-spendx-blue-primary/90 transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple">
          Budgets
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Plan smarter, spend better, and stay in control of your money.
        </p>
      </div>

      {/* 2. Overview Summary Cards */}
      <BudgetOverviewCards metrics={overallMetrics} />

      {/* 3. Overall Budget Prominent Panel */}
      <OverallBudgetCard metrics={overallMetrics} />

      {/* 4. Toolbar: Period selector, Status Filter, Sort & CTA */}
      <BudgetToolbar
        filters={filters}
        onChange={setFilters}
        onCreateBudget={handleOpenCreate}
        budgetCount={budgets.length}
      />

      {/* 5. Category Budgets Grid / Empty State */}
      {budgets.length === 0 ? (
        <BudgetEmptyState type="NO_DATA" onActionClick={handleOpenCreate} />
      ) : filteredBudgetMetrics.length === 0 ? (
        <BudgetEmptyState
          type="NO_RESULTS"
          onActionClick={() => setFilters(INITIAL_BUDGET_FILTERS)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Category Budgets ({filteredBudgetMetrics.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBudgetMetrics.map((budget) => (
              <CategoryBudgetCard
                key={budget.id}
                budget={budget}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* 6. Visualizations (Donut Distribution & Bar Budget vs Actual) */}
      <BudgetCharts budgetMetrics={budgetMetrics} />

      {/* 7. Alerts & Insights */}
      <BudgetAlertsAndInsights alerts={alerts} insights={insights} />

      {/* Add / Edit Dialog */}
      <BudgetFormDialog
        isOpen={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingBudget}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Budget?"
        description={`Are you sure you want to delete the budget for "${budgetToDelete?.category}"? Your past transactions and spending history will not be affected.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setBudgetToDelete(null);
        }}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default BudgetsPage;
