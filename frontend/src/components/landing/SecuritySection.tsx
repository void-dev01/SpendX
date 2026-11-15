import React from 'react';
import { Shield, Lock, Key, UserCheck, ShieldAlert } from 'lucide-react';

const securityPrinciples = [
  {
    icon: Key,
    title: 'Protected API Credentials',
    description:
      'Sensitive service credentials and cryptographic tokens strictly remain isolated on server environments.',
    badge: 'Server-Side Security',
    color: 'text-amber-500 bg-amber-500/15',
  },
  {
    icon: Lock,
    title: 'Strict Access Controls',
    description:
      'Financial ledgers, balances, and transaction records are only accessible to authenticated, verified accounts.',
    badge: 'Zero-Trust Scopes',
    color: 'text-primary bg-primary/15',
  },
  {
    icon: Shield,
    title: 'Data Minimization & Privacy',
    description:
      'We collect only the essential financial metadata required to provide analytics and intelligent recommendations.',
    badge: 'Privacy by Design',
    color: 'text-[#8066CC] bg-[#8066CC]/15',
  },
  {
    icon: UserCheck,
    title: 'Complete User Control',
    description:
      'You retain full authority to export your ledger, disconnect authorized sources, or wipe stored data at any time.',
    badge: 'User Autonomy',
    color: 'text-emerald-500 bg-emerald-500/15',
  },
];

export const SecuritySection: React.FC = () => {
  return (
    <section id="security" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Integrity & Governance</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Your Financial Data{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-[#718FE8] to-[#8066CC] bg-clip-text text-transparent">
              Deserves Care.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Financial management starts with trust. SPENDX is designed with
            privacy-conscious data handling, strict authorization boundaries,
            and honest engineering standards.
          </p>
        </div>

        {/* 4 Security Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityPrinciples.map((item) => (
            <div
              key={item.title}
              className="glass-card-interactive rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/10 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-200`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/10 text-muted-foreground border border-white/60 dark:border-white/10">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/10 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Standard Architectural Boundary</span>
              </div>
            </div>
          ))}
        </div>

        {/* Honest Trust Banner */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/70 dark:border-white/10 max-w-3xl mx-auto flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            <strong>Our Security Pledge:</strong> We do not make unsubstantiated claims or display
            ornamental badges. All user data is handled under strict authorization principles,
            and we continuously audit our authentication and data workflows.
          </span>
        </div>
      </div>
    </section>
  );
};
