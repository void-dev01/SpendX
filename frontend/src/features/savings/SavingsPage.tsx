import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus } from 'lucide-react';

export const SavingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">
            Plan, monitor, and accelerate milestone achievements.
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> New Savings Goal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Milestones</CardTitle>
          <CardDescription>Track progress towards emergency funds and targeted purchases.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No savings goals established</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Create structured savings targets to let the SPENDX engine allocate automated transfers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
