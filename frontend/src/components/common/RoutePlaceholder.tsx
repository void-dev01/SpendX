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
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">{title}</h1>
            <Badge variant="outline" className="text-[11px] font-semibold text-primary border-primary/30">
              {badge}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-secondary-text">{description}</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-muted-foreground font-mono self-start sm:self-auto shadow-xs">
          <span>Route: {routeId}</span>
        </div>
      </div>

      {/* Main Content Area or Default Fintech Card */}
      {children || (
        <Card className="border border-border shadow-card rounded-2xl bg-surface">
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-display font-bold text-foreground">{title}</CardTitle>
              <CardDescription className="text-xs text-secondary-text">
                Synchronized with SPENDX intelligent data pipelines.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-surface-elevated p-4 border border-border flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Operational Status</p>
                <p className="text-[11px] text-secondary-text">
                  Ready for live ledger synchronization and telemetry capture.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-income">
                <span className="w-2 h-2 rounded-full bg-income animate-pulse" />
                <span>Ready</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Full category capabilities integrate seamlessly inside this shared shell.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
