import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import {
  transactionService,
  TransactionRecord,
  TransactionFiltersState,
} from '@/services/transactionService';
import { TransactionHeader } from '@/components/transactions/TransactionHeader';
import { TransactionSummaryCards } from '@/components/transactions/TransactionSummaryCards';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionMobileList } from '@/components/transactions/TransactionMobileList';
import { TransactionBulkActions } from '@/components/transactions/TransactionBulkActions';
import { TransactionPagination } from '@/components/transactions/TransactionPagination';
import { TransactionFormDialog } from '@/components/transactions/TransactionFormDialog';
import { TransactionDetailsDrawer } from '@/components/transactions/TransactionDetailsDrawer';
import { DeleteConfirmDialog } from '@/components/transactions/DeleteConfirmDialog';
import { TransactionEmptyState } from '@/components/transactions/TransactionEmptyState';
import { UniversalImportDialog } from '@/components/transactions/import/UniversalImportDialog';
import { accountService } from '@/services/accountService';

const INITIAL_FILTERS: TransactionFiltersState = {
  search: '',
  type: 'ALL',
  category: 'ALL',
  accountId: 'ALL',
  dateRange: 'ALL',
  status: 'ALL',
  sortBy: 'NEWEST',
};

export const TransactionsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // State
  const [filters, setFilters] = useState<TransactionFiltersState>(INITIAL_FILTERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Dialog & Drawer States
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionRecord | null>(null);

  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState<boolean>(false);
  const [activeDetailTransaction, setActiveDetailTransaction] = useState<TransactionRecord | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<TransactionRecord | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);

  // Fetch accounts for import reconciliation
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
  });

  // Fetch transactions using TanStack Query
  const {
    data: allTransactions = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (newRecord: Omit<TransactionRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      transactionService.createTransaction(newRecord),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setFormDialogOpen(false);
      setEditingTransaction(null);
      toast.success('Transaction Recorded', {
        description: `Successfully logged "${created.description}" (${transactionService.formatINR(created.amount)}).`,
      });
    },
    onError: (err: any) => {
      toast.error('Failed to Record Transaction', {
        description: err?.message || 'Could not save transaction to ledger.',
      });
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TransactionRecord> }) =>
      transactionService.updateTransaction(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setFormDialogOpen(false);
      setEditingTransaction(null);
      if (activeDetailTransaction?.id === updated.id) {
        setActiveDetailTransaction(updated);
      }
      toast.success('Transaction Updated', {
        description: `Updated record for "${updated.description}".`,
      });
    },
    onError: (err: any) => {
      toast.error('Update Failed', {
        description: err?.message || 'Could not update transaction record.',
      });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete?.id));
      if (activeDetailTransaction?.id === itemToDelete?.id) {
        setDetailsDrawerOpen(false);
      }
      toast.success('Transaction Deleted', {
        description: 'Record permanently removed from ledger.',
      });
    },
    onError: (err: any) => {
      toast.error('Deletion Failed', {
        description: err?.message || 'Could not delete transaction.',
      });
    },
  });

  // Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => transactionService.bulkDeleteTransactions(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteConfirmOpen(false);
      setIsBulkDeleting(false);
      const count = selectedIds.length;
      setSelectedIds([]);
      toast.success('Transactions Deleted', {
        description: `Successfully removed ${count} transactions from ledger.`,
      });
    },
    onError: (err: any) => {
      toast.error('Bulk Deletion Failed', {
        description: err?.message || 'Could not complete bulk deletion.',
      });
    },
  });

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.type !== 'ALL') count++;
    if (filters.category !== 'ALL') count++;
    if (filters.accountId !== 'ALL') count++;
    if (filters.dateRange !== 'ALL') count++;
    if (filters.status !== 'ALL') count++;
    if (filters.sortBy !== 'NEWEST') count++;
    return count;
  }, [filters]);

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      // 1. Search Query
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesDesc = t.description.toLowerCase().includes(query);
        const matchesCategory = t.category.toLowerCase().includes(query);
        const matchesMerchant = t.merchantName?.toLowerCase().includes(query) ?? false;
        const matchesNotes = t.notes?.toLowerCase().includes(query) ?? false;
        if (!matchesDesc && !matchesCategory && !matchesMerchant && !matchesNotes) {
          return false;
        }
      }

      // 2. Type Filter
      if (filters.type !== 'ALL' && t.type !== filters.type) {
        return false;
      }

      // 3. Category Filter
      if (filters.category !== 'ALL' && t.category !== filters.category) {
        return false;
      }

      // 4. Account Filter
      if (filters.accountId !== 'ALL' && t.accountId !== filters.accountId) {
        return false;
      }

      // 5. Status Filter
      if (filters.status !== 'ALL' && t.status !== filters.status) {
        return false;
      }

      // 6. Date Range Filter
      if (filters.dateRange !== 'ALL') {
        const txDate = new Date(t.date).getTime();
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (filters.dateRange === 'TODAY') {
          const isToday = new Date(t.date).toDateString() === new Date().toDateString();
          if (!isToday) return false;
        } else if (filters.dateRange === 'LAST_7_DAYS') {
          if (now - txDate > 7 * oneDay) return false;
        } else if (filters.dateRange === 'THIS_MONTH') {
          const d = new Date(t.date);
          const current = new Date();
          if (d.getMonth() !== current.getMonth() || d.getFullYear() !== current.getFullYear()) {
            return false;
          }
        } else if (filters.dateRange === 'LAST_MONTH') {
          const d = new Date(t.date);
          const current = new Date();
          const targetMonth = current.getMonth() === 0 ? 11 : current.getMonth() - 1;
          const targetYear = current.getMonth() === 0 ? current.getFullYear() - 1 : current.getFullYear();
          if (d.getMonth() !== targetMonth || d.getFullYear() !== targetYear) {
            return false;
          }
        } else if (filters.dateRange === 'LAST_3_MONTHS') {
          if (now - txDate > 90 * oneDay) return false;
        } else if (filters.dateRange === 'THIS_YEAR') {
          if (new Date(t.date).getFullYear() !== new Date().getFullYear()) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (filters.sortBy === 'OLDEST') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (filters.sortBy === 'AMOUNT_DESC') {
        return b.amount - a.amount;
      }
      if (filters.sortBy === 'AMOUNT_ASC') {
        return a.amount - b.amount;
      }
      if (filters.sortBy === 'NAME_ASC') {
        return a.description.localeCompare(b.description);
      }
      // Default: NEWEST
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [allTransactions, filters]);

  // Paginated Slices
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Handlers
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  const handleDateRangeHeaderChange = (range: TransactionFiltersState['dateRange']) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
    setCurrentPage(1);
  };

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (paginatedTransactions.every((t) => selectedIds.includes(t.id))) {
      // Deselect current page
      const pageIds = new Set(paginatedTransactions.map((t) => t.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      // Select all in current page
      const combined = new Set([...selectedIds, ...paginatedTransactions.map((t) => t.id)]);
      setSelectedIds(Array.from(combined));
    }
  };

  const handleOpenAddDialog = () => {
    setEditingTransaction(null);
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (transaction: TransactionRecord) => {
    setEditingTransaction(transaction);
    setFormDialogOpen(true);
  };

  const handleOpenDetails = (transaction: TransactionRecord) => {
    setActiveDetailTransaction(transaction);
    setDetailsDrawerOpen(true);
  };

  const handleOpenDelete = (transaction: TransactionRecord) => {
    setItemToDelete(transaction);
    setIsBulkDeleting(false);
    setDeleteConfirmOpen(true);
  };

  const handleOpenBulkDelete = () => {
    setItemToDelete(null);
    setIsBulkDeleting(true);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDeleting) {
      await bulkDeleteMutation.mutateAsync(selectedIds);
    } else if (itemToDelete) {
      await deleteMutation.mutateAsync(itemToDelete.id);
    }
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.warning('No Records to Export', {
        description: 'There are no transactions in the current filtered view.',
      });
      return;
    }
    transactionService.exportToCSV(filteredTransactions);
    toast.success('CSV Download Started', {
      description: `Exported ${filteredTransactions.length} records.`,
    });
  };

  const handleFormSubmit = async (
    data: Omit<TransactionRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingTransaction) {
      await updateMutation.mutateAsync({
        id: editingTransaction.id,
        updates: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-surface-elevated border border-border rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border p-5 rounded-2xl h-32 shadow-card" />
          ))}
        </div>
        <div className="bg-surface border border-border p-4 rounded-2xl h-16 shadow-card" />
        <div className="bg-surface border border-border p-6 rounded-2xl h-96 shadow-card" />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-surface border border-border p-8 rounded-2xl max-w-xl mx-auto my-12 text-center space-y-4 shadow-elevated">
        <div className="w-12 h-12 mx-auto rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-display font-bold text-foreground">
          Unable to Load Transactions
        </h2>
        <p className="text-xs text-secondary-text max-w-md mx-auto">
          {error instanceof Error ? error.message : 'An error occurred while communicating with the ledger service.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs text-white bg-primary hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with Title, Period Switcher & CTAs */}
      <TransactionHeader
        dateRange={filters.dateRange}
        onDateRangeChange={handleDateRangeHeaderChange}
        onAddTransaction={handleOpenAddDialog}
        onExport={handleExportCSV}
        onImport={() => setImportDialogOpen(true)}
        filteredCount={filteredTransactions.length}
      />

      {/* 2. Financial Summary Cards (Dynamic to Filtered Data) */}
      <TransactionSummaryCards transactions={filteredTransactions} />

      {/* 3. Search and Filter Bar */}
      <TransactionFilters
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* 4. Transactions List / Empty States */}
      {allTransactions.length === 0 ? (
        <TransactionEmptyState
          type="NO_DATA"
          onActionClick={handleOpenAddDialog}
        />
      ) : filteredTransactions.length === 0 ? (
        <TransactionEmptyState
          type="NO_RESULTS"
          onActionClick={handleResetFilters}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <TransactionTable
              transactions={paginatedTransactions}
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
              onViewDetails={handleOpenDetails}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDelete}
            />
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden">
            <TransactionMobileList
              transactions={paginatedTransactions}
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
              onViewDetails={handleOpenDetails}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDelete}
            />
          </div>

          {/* Pagination Controls */}
          <TransactionPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredTransactions.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Bulk Actions Contextual Floating Toolbar */}
      <TransactionBulkActions
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onDeleteSelected={handleOpenBulkDelete}
      />

      {/* Add / Edit Transaction Form Dialog */}
      <TransactionFormDialog
        isOpen={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Detailed Transaction Drawer */}
      {detailsDrawerOpen && (
        <TransactionDetailsDrawer
          transaction={activeDetailTransaction}
          onClose={() => {
            setDetailsDrawerOpen(false);
            setActiveDetailTransaction(null);
          }}
          onEdit={handleOpenEditDialog}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        title={isBulkDeleting ? `Delete ${selectedIds.length} Transactions?` : 'Delete Transaction?'}
        description={
          isBulkDeleting
            ? `Are you sure you want to permanently delete ${selectedIds.length} selected transactions? This action cannot be undone.`
            : `Are you sure you want to delete "${itemToDelete?.description}"? This action cannot be undone.`
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
          setIsBulkDeleting(false);
        }}
        isDeleting={deleteMutation.isPending || bulkDeleteMutation.isPending}
      />

      {/* Universal Automatic Import Dialog */}
      <UniversalImportDialog
        isOpen={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        accounts={accounts}
        existingTransactions={allTransactions}
        onImportComplete={() => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }}
      />
    </div>
  );
};

export default TransactionsPage;
