import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground">
          Platform configurations, API endpoints, and security preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environment & Integration Status</CardTitle>
          <CardDescription>Client-side telemetry and connected services status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm font-medium">Backend API Endpoint</p>
              <p className="text-xs text-muted-foreground">
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1 (Default)'}
              </p>
            </div>
            <Badge variant="outline">Configured</Badge>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm font-medium">Supabase Client Connection</p>
              <p className="text-xs text-muted-foreground">
                {import.meta.env.VITE_SUPABASE_URL ? 'Endpoint set' : 'Awaiting credentials in .env'}
              </p>
            </div>
            <Badge variant={import.meta.env.VITE_SUPABASE_URL ? 'default' : 'warning'}>
              {import.meta.env.VITE_SUPABASE_URL ? 'Ready' : 'Pending Credentials'}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Design System Version</p>
              <p className="text-xs text-muted-foreground">Tailwind CSS v4 + Radix UI Engine</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
