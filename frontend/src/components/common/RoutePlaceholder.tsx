import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RoutePlaceholderProps {
  title: string;
  description: string;
  routeId: string;
  icon: LucideIcon;
  badge?: string;
  children?: React.ReactNode;
}

export const RoutePlaceholder: React.FC<RoutePlaceholderProps> = ({
  title,
  description,
  routeId,
  icon: Icon,
  badge = 'Active Module',
  children,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <Badge variant="outline" className="text-[11px] font-semibold text-primary border-primary/30">
              {badge}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-muted-foreground font-mono self-start sm:self-auto">
          <span>Route: {routeId}</span>
        </div>
      </div>

      {/* Main Content Area or Default Fintech Card */}
      {children || (
        <Card className="glass-panel border border-white/80 dark:border-white/15 shadow-xl rounded-3xl">
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold">{title}</CardTitle>
              <CardDescription className="text-xs">
                Synchronized with SPENDX intelligent data pipelines.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-white/40 dark:bg-white/5 p-4 border border-white/60 dark:border-white/10 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Operational Status</p>
                <p className="text-[11px] text-muted-foreground">
                  Ready for live ledger synchronization and telemetry capture.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ready</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-[#8066CC]" />
              <span>Full category capabilities integrate seamlessly inside this shared shell.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
