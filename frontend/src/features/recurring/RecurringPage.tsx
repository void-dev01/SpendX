import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import {
  recurringService,
  RecurringRecord,
  DetectedRecurringItem,
} from '@/services/recurringService';
import { accountService } from '@/services/accountService';
import { transactionService } from '@/services/transactionService';

import { RecurringOverviewCards } from '@/components/recurring/RecurringOverviewCards';
import { RecurringToolbar, RecurringSortOption } from '@/components/recurring/RecurringToolbar';
import { RecurringPaymentCard } from '@/components/recurring/RecurringPaymentCard';
import { RecurringFormDialog } from '@/components/recurring/RecurringFormDialog';
import { PaymentCalendar } from '@/components/recurring/PaymentCalendar';
import { UpcomingPaymentsTimeline } from '@/components/recurring/UpcomingPaymentsTimeline';
import { RecurringDetectionCard } from '@/components/recurring/RecurringDetectionCard';
import { RecurringInsights } from '@/components/recurring/RecurringInsights';
import { RecurringEmptyState } from '@/components/recurring/RecurringEmptyState';

export const RecurringPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Filters and state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState<RecurringSortOption>('dueDateAsc');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<RecurringRecord | null>(null);
  const [dismissedDetectionIds, setDismissedDetectionIds] = useState<string[]>([]);

  // 1. Fetch recurring payments
  const { data: payments = [] } = useQuery({
    queryKey: ['recurringPayments'],
    queryFn: () => recurringService.getRecurringPayments(),
  });

  // 2. Fetch accounts for payment source linking
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
  });

  // 3. Fetch transactions for smart pattern detection
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  // 4. Calculate metrics
  const metrics = useMemo(() => {
    return recurringService.getOverviewMetrics(payments);
  }, [payments]);

  // 5. Automatic detection engine
  const detectedItems = useMemo(() => {
    const rawDetected = recurringService.detectPotentialRecurring(transactions, payments);
    return rawDetected.filter((item) => !dismissedDetectionIds.includes(item.id));
  }, [transactions, payments, dismissedDetectionIds]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newPayment: Omit<RecurringRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      recurringService.createRecurringPayment(newPayment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RecurringRecord> }) =>
      recurringService.updateRecurringPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => recurringService.deleteRecurringPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
    },
  });

  const togglePauseMutation = useMutation({
    mutationFn: (payment: RecurringRecord) => recurringService.togglePause(payment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => recurringService.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  // Filtering & Sorting
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.merchant.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'ALL') {
      result = result.filter((p) => p.status === selectedStatus);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'dueDateAsc') {
        return new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime();
      }
      if (sortBy === 'dueDateDesc') {
        return new Date(b.nextDueDate).getTime() - new Date(a.nextDueDate).getTime();
      }
      if (sortBy === 'amountDesc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amountAsc') {
        return a.amount - b.amount;
      }
      if (sortBy === 'nameAsc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [payments, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingPayment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (payment: RecurringRecord) => {
    setEditingPayment(payment);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Partial<RecurringRecord>) => {
    if (editingPayment) {
      await updateMutation.mutateAsync({ id: editingPayment.id, data });
    } else {
      await createMutation.mutateAsync(
        data as Omit<RecurringRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
      );
    }
  };

  const handleConfirmDetected = async (detected: DetectedRecurringItem) => {
    await createMutation.mutateAsync({
      name: detected.merchant,
      merchant: detected.merchant,
      category: detected.category,
      amount: detected.estimatedAmount,
      frequency: detected.suggestedFrequency,
      startDate: new Date().toISOString(),
      nextDueDate: detected.predictedNextDate,
      status: 'UPCOMING',
    });
    setDismissedDetectionIds((prev) => [...prev, detected.id]);
  };

  const handleDismissDetected = (id: string) => {
    setDismissedDetectionIds((prev) => [...prev, id]);
  };

  const isFiltering =
    Boolean(searchQuery.trim()) || selectedCategory !== 'ALL' || selectedStatus !== 'ALL';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              Money Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            Recurring Payments & Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your subscriptions, EMIs, house rent, and automated scheduled direct debits.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-spendx-primary flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>New Schedule</span>
        </button>
      </div>

      {/* 2. Overview Metrics Cards */}
      <RecurringOverviewCards metrics={metrics} />

      {/* 3. Smart Pattern Detection Banner */}
      {detectedItems.length > 0 && (
        <RecurringDetectionCard
          detectedItems={detectedItems}
          onConfirm={handleConfirmDetected}
          onDismiss={handleDismissDetected}
        />
      )}

      {/* 4. Toolbar & Controls */}
      <RecurringToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreateDialog={handleOpenCreate}
      />

      {/* 5. Main Content: Grid or Calendar */}
      {viewMode === 'calendar' ? (
        <PaymentCalendar payments={filteredPayments} onSelectPayment={handleEdit} />
      ) : filteredPayments.length === 0 ? (
        <RecurringEmptyState
          isFiltering={isFiltering}
          onClearFilters={handleClearFilters}
          onAddPayment={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayments.map((payment) => (
            <RecurringPaymentCard
              key={payment.id}
              payment={payment}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              onTogglePause={(p) => togglePauseMutation.mutate(p)}
              onMarkAsPaid={(id) => markPaidMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* 6. Upcoming Payments Timeline */}
      <UpcomingPaymentsTimeline
        payments={payments}
        onSelectPayment={handleEdit}
        onMarkAsPaid={(id) => markPaidMutation.mutate(id)}
      />

      {/* 7. Recurring Intelligence & Analytics Insights */}
      <RecurringInsights payments={payments} />

      {/* 8. Add / Edit Modal */}
      <RecurringFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingPayment={editingPayment}
        accounts={accounts}
      />
    </div>
  );
};
