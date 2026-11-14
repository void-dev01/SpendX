import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, PieChart } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-sm text-muted-foreground">
            Set and track spending boundaries across categories.
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Create Budget
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
          <CardDescription>Target allocations and real-time variance monitoring.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <PieChart className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No active budgets</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Establish category limits to track monthly spending discipline.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
