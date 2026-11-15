import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import {
  accountService,
  AccountRecord,
} from '@/services/accountService';
import { AccountsOverview } from '@/components/accounts/AccountsOverview';
import { AccountsToolbar, AccountFiltersState } from '@/components/accounts/AccountsToolbar';
import { AccountCard } from '@/components/accounts/AccountCard';
import { AccountFormDialog } from '@/components/accounts/AccountFormDialog';
import { AccountEmptyState } from '@/components/accounts/AccountEmptyState';
import { DeleteConfirmDialog } from '@/components/transactions/DeleteConfirmDialog';

const INITIAL_ACCOUNT_FILTERS: AccountFiltersState = {
  search: '',
  type: 'ALL',
  sortBy: 'BALANCE_DESC',
};

export const AccountsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<AccountFiltersState>(INITIAL_ACCOUNT_FILTERS);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [editingAccount, setEditingAccount] = useState<AccountRecord | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [accountToDelete, setAccountToDelete] = useState<AccountRecord | null>(null);

  // TanStack Query for accounts
  const {
    data: accounts = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
  });

  // Overview metrics
  const overviewMetrics = useMemo(() => {
    return accountService.computeOverviewMetrics(accounts);
  }, [accounts]);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<AccountRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      accountService.createAccount(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setFormDialogOpen(false);
      setEditingAccount(null);
      toast.success('Account Connected', {
        description: `Successfully configured "${created.name}".`,
      });
    },
    onError: (err: any) => {
      toast.error('Failed to Connect Account', {
        description: err?.message || 'Could not save account details.',
      });
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AccountRecord> }) =>
      accountService.updateAccount(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setFormDialogOpen(false);
      setEditingAccount(null);
      toast.success('Account Updated', {
        description: `Saved updates for "${updated.name}".`,
      });
    },
    onError: (err: any) => {
      toast.error('Update Failed', {
        description: err?.message || 'Could not save account modifications.',
      });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteConfirmOpen(false);
      setAccountToDelete(null);
      toast.success('Account Removed', {
        description: 'Account successfully detached from active ledger.',
      });
    },
    onError: (err: any) => {
      toast.error('Removal Failed', {
        description: err?.message || 'Could not delete account.',
      });
    },
  });

  // Filter & Sort Logic
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // 1. Search Query
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = acc.name.toLowerCase().includes(query);
        const matchesInst = acc.institution.toLowerCase().includes(query);
        const matchesType = acc.type.toLowerCase().includes(query);
        if (!matchesName && !matchesInst && !matchesType) {
          return false;
        }
      }

      // 2. Type Filter
      if (filters.type !== 'ALL' && acc.type !== filters.type) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'BALANCE_DESC') {
        return b.balance - a.balance;
      }
      if (filters.sortBy === 'BALANCE_ASC') {
        return a.balance - b.balance;
      }
      if (filters.sortBy === 'NAME_DESC') {
        return b.name.localeCompare(a.name);
      }
      // NAME_ASC
      return a.name.localeCompare(b.name);
    });
  }, [accounts, filters]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingAccount(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (account: AccountRecord) => {
    setEditingAccount(account);
    setFormDialogOpen(true);
  };

  const handleOpenDelete = (account: AccountRecord) => {
    setAccountToDelete(account);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (accountToDelete) {
      await deleteMutation.mutateAsync(accountToDelete.id);
    }
  };

  const handleFormSubmit = async (
    data: Omit<AccountRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingAccount) {
      await updateMutation.mutateAsync({
        id: editingAccount.id,
        updates: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200/70 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl h-32" />
          ))}
        </div>
        <div className="glass-panel p-4 rounded-2xl h-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel rounded-3xl p-5 h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-panel p-8 rounded-3xl max-w-xl mx-auto my-12 text-center space-y-4 border border-rose-500/20">
        <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Unable to Load Connected Accounts
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {error instanceof Error ? error.message : 'An error occurred while communicating with the account registry.'}
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
          My Accounts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage all your financial accounts, vaults, and credit cards in one place.
        </p>
      </div>

      {/* 2. Overview Summary Cards */}
      <AccountsOverview metrics={overviewMetrics} />

      {/* 3. Toolbar: Search, Type Filter, Sort & Add Account */}
      <AccountsToolbar
        filters={filters}
        onChange={setFilters}
        onAddAccount={handleOpenAdd}
        accountCount={accounts.length}
      />

      {/* 4. Accounts List / Empty State */}
      {accounts.length === 0 ? (
        <AccountEmptyState type="NO_DATA" onActionClick={handleOpenAdd} />
      ) : filteredAccounts.length === 0 ? (
        <AccountEmptyState
          type="NO_RESULTS"
          onActionClick={() => setFilters(INITIAL_ACCOUNT_FILTERS)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Your Accounts ({filteredAccounts.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <AccountFormDialog
        isOpen={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setEditingAccount(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingAccount}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Account?"
        description={`Are you sure you want to remove "${accountToDelete?.name}"? Your past recorded transactions will remain intact.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setAccountToDelete(null);
        }}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default AccountsPage;
