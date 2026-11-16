import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { env } from '@/config/env';

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
              <p className="text-xs text-muted-foreground font-mono">
                {env.apiBaseUrl}
              </p>
            </div>
            <Badge variant="outline">Configured</Badge>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm font-medium">Supabase Client Connection</p>
              <p className="text-xs text-muted-foreground">
                {env.supabaseUrl ? 'Endpoint set' : 'Awaiting credentials in .env'}
              </p>
            </div>
            <Badge variant={env.supabaseUrl ? 'default' : 'warning'}>
              {env.supabaseUrl ? 'Ready' : 'Pending Credentials'}
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
