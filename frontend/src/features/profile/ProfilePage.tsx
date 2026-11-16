import React from 'react';
import { UserRound, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { RoutePlaceholder } from '@/components/common/RoutePlaceholder';
import { useAuthStore } from '@/stores/authStore';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  const displayName = user?.fullName || (user?.email ? user.email.split('@')[0] : 'User Profile');
  const displayEmail = user?.email || 'user@spendx.local';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'UP';

  return (
    <RoutePlaceholder
      title="User Profile & Identity"
      description="Personal workspace credentials, membership tier, and telemetry preferences."
      routeId="/profile"
      icon={UserRound}
      badge="Personal"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left ID Card */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/80 dark:border-white/15 shadow-xl text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#718FE8] via-[#8B72D6] to-[#8066CC] text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
            {initials}
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground">{displayName}</h3>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{displayEmail}</span>
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#8066CC]" />
            <span>Plan: Private Banking Tier (Neural Engine Active)</span>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/10 text-xs text-muted-foreground text-left space-y-2">
            <div className="flex justify-between">
              <span>Account ID</span>
              <span className="font-mono">{user?.id || 'usr_demo_session'}</span>
            </div>
            <div className="flex justify-between">
              <span>Default Currency</span>
              <span className="font-bold text-foreground">INR (₹)</span>
            </div>
            <div className="flex justify-between">
              <span>Session Status</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Secure
              </span>
            </div>
          </div>
        </div>

        {/* Right Preferences */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/80 dark:border-white/15 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-black/5 dark:border-white/10">
            Account Preferences
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">AI Intelligence Auto-Categorization</p>
                <p className="text-muted-foreground">Automatically label new transactions into budget envelopes</p>
              </div>
              <span className="text-emerald-600 font-bold">Enabled</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Weekly Digest Telemetry</p>
                <p className="text-muted-foreground">Receive weekly summary notifications every Monday</p>
              </div>
              <span className="text-primary font-bold">Active</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Zero Data Tracking Guarantee</p>
                <p className="text-muted-foreground">Sensitive tokens and ledger items isolated server-side</p>
              </div>
              <span className="text-emerald-600 font-bold">Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </RoutePlaceholder>
  );
};
