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
        <div className="lg:col-span-5 rounded-2xl bg-surface border border-border p-6 shadow-card text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold font-display text-2xl mx-auto shadow-xs">
            {initials}
          </div>

          <div>
            <h3 className="text-lg font-bold font-display text-foreground">{displayName}</h3>
            <p className="text-xs text-secondary-text flex items-center justify-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{displayEmail}</span>
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Plan: Private Banking Tier (Neural Engine Active)</span>
          </div>

          <div className="pt-4 border-t border-border text-xs text-secondary-text text-left space-y-2">
            <div className="flex justify-between">
              <span>Account ID</span>
              <span className="font-mono text-foreground">{user?.id || 'usr_demo_session'}</span>
            </div>
            <div className="flex justify-between">
              <span>Default Currency</span>
              <span className="font-bold text-foreground">INR (₹)</span>
            </div>
            <div className="flex justify-between">
              <span>Session Status</span>
              <span className="text-income font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Secure
              </span>
            </div>
          </div>
        </div>

        {/* Right Preferences */}
        <div className="lg:col-span-7 rounded-2xl bg-surface border border-border p-6 shadow-card space-y-4">
          <h4 className="text-sm font-bold font-display text-foreground uppercase tracking-wider pb-2 border-b border-border">
            Account Preferences
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">AI Intelligence Auto-Categorization</p>
                <p className="text-secondary-text">Automatically label new transactions into budget envelopes</p>
              </div>
              <span className="text-income font-bold">Enabled</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Weekly Digest Telemetry</p>
                <p className="text-secondary-text">Receive weekly summary notifications every Monday</p>
              </div>
              <span className="text-primary font-bold">Active</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Zero Data Tracking Guarantee</p>
                <p className="text-secondary-text">Sensitive tokens and ledger items isolated server-side</p>
              </div>
              <span className="text-income font-bold">Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </RoutePlaceholder>
  );
};
