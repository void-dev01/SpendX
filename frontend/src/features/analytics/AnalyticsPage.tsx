import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Spending Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Historical trends, category distributions, and predictive forecasting.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Trends & Distribution</CardTitle>
          <CardDescription>Powered by Recharts visualization engine.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Analytics require transaction history</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Visual graphs, cash-flow breakdowns, and burn-rate charts will render here once data is populated.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
