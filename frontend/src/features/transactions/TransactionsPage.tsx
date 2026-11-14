import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeftRight } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            View, categorize, and audit recorded transactions.
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Record Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
          <CardDescription>
            Continuous transaction sync and automated categorization pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <ArrowLeftRight className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No transactions recorded yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            New transactions ingested via the capture pipeline or manual entry will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
