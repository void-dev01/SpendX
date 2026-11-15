import React from 'react';
import { Wallet, Plus, Building2, CreditCard, ArrowUpRight } from 'lucide-react';
import { RoutePlaceholder } from '@/components/common/RoutePlaceholder';
import { Button } from '@/components/ui/button';

export const AccountsPage: React.FC = () => {
  return (
    <RoutePlaceholder
      title="Connected Accounts"
      description="Manage bank connections, credit cards, investment accounts, and digital wallets."
      routeId="/accounts"
      icon={Wallet}
      badge="Money Management"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button size="sm" className="rounded-xl shadow-sm cursor-pointer">
            <Plus className="w-4 h-4 mr-1.5" /> Connect Account
          </Button>
        </div>

        {/* Demo Connected Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Account 1 */}
          <div className="glass-panel rounded-3xl p-5 border border-white/80 dark:border-white/15 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Active Sync
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Primary Checking
              </p>
              <h3 className="text-xl font-bold text-foreground tabular-nums mt-0.5">₹84,200.00</h3>
            </div>
            <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground">
              <span>HDFC Bank •••• 4821</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>

          {/* Account 2 */}
          <div className="glass-panel rounded-3xl p-5 border border-white/80 dark:border-white/15 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#8066CC]/15 text-[#8066CC] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                Credit Card
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Rewards Titanium
              </p>
              <h3 className="text-xl font-bold text-foreground tabular-nums mt-0.5">₹12,450.00</h3>
            </div>
            <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground">
              <span>ICICI Bank •••• 9104</span>
              <span className="text-[11px] text-amber-500 font-medium">Due in 12 days</span>
            </div>
          </div>

          {/* Account 3 */}
          <div className="glass-panel rounded-3xl p-5 border border-white/80 dark:border-white/15 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Liquid Vault
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Emergency Savings
              </p>
              <h3 className="text-xl font-bold text-foreground tabular-nums mt-0.5">₹27,930.00</h3>
            </div>
            <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground">
              <span>Axis High-Yield •••• 3310</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+4.2% p.a.</span>
            </div>
          </div>
        </div>
      </div>
    </RoutePlaceholder>
  );
};
