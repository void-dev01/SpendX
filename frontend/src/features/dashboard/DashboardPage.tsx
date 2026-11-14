import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-sm text-muted-foreground">
            Real-time balance, automated tracking, and intelligence metrics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            System Online
          </Badge>
          <Button size="sm">
            <Sparkles className="w-4 h-4 mr-1.5" /> Ask AI Coach
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">Connect accounts to begin sync</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Inflow</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-income" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">0 income events recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Outflow</CardTitle>
            <ArrowDownRight className="w-4 h-4 text-expense" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">0 expenses recorded</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Financial Assistant Foundation</CardTitle>
          <CardDescription>
            SPENDX backend architecture is configured to provide continuous analysis using Google Gemini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure backend environment variables (`SUPABASE_URL`, `GEMINI_API_KEY`) to activate real-time transaction synchronization, categorization pipelines, and automated financial insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
