import React from 'react';
import {
  SquaresFour,
  ArrowsLeftRight,
  Wallet,
  ChartPie,
  Target,
  ArrowsClockwise,
  TrendUp,
  Sparkle,
  Lightbulb,
  FileText,
  Bell,
  User,
  Gear,
  House,
} from '@phosphor-icons/react';

export type NavigationGroup =
  | 'Overview'
  | 'Money Management'
  | 'Intelligence'
  | 'Reporting'
  | 'Personal';

export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
  group: NavigationGroup;
  badge?: string;
  isAiAccent?: boolean;
  mobileBottomNav?: boolean;
  mobileBottomIcon?: React.ElementType;
}

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  'Overview',
  'Money Management',
  'Intelligence',
  'Reporting',
  'Personal',
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // GROUP 1 — OVERVIEW
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: SquaresFour,
    group: 'Overview',
    mobileBottomNav: true,
    mobileBottomIcon: House,
  },

  // GROUP 2 — MONEY MANAGEMENT
  {
    id: 'transactions',
    name: 'Transactions',
    path: '/transactions',
    icon: ArrowsLeftRight,
    group: 'Money Management',
    mobileBottomNav: true,
  },
  {
    id: 'accounts',
    name: 'Accounts',
    path: '/accounts',
    icon: Wallet,
    group: 'Money Management',
    mobileBottomNav: true,
  },
  {
    id: 'budgets',
    name: 'Budgets',
    path: '/budgets',
    icon: ChartPie,
    group: 'Money Management',
  },
  {
    id: 'savings',
    name: 'Savings Goals',
    path: '/savings',
    icon: Target,
    group: 'Money Management',
  },
  {
    id: 'recurring',
    name: 'Recurring',
    path: '/recurring',
    icon: ArrowsClockwise,
    group: 'Money Management',
  },

  // GROUP 3 — INTELLIGENCE
  {
    id: 'analytics',
    name: 'Analytics',
    path: '/analytics',
    icon: TrendUp,
    group: 'Intelligence',
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    path: '/ai-assistant',
    icon: Sparkle,
    group: 'Intelligence',
    badge: 'Pro',
    isAiAccent: true,
    mobileBottomNav: true,
  },
  {
    id: 'insights',
    name: 'Insights',
    path: '/insights',
    icon: Lightbulb,
    group: 'Intelligence',
  },

  // GROUP 4 — REPORTING
  {
    id: 'reports',
    name: 'Reports & Tax',
    path: '/reports',
    icon: FileText,
    group: 'Reporting',
  },

  // GROUP 5 — PERSONAL
  {
    id: 'notifications',
    name: 'Notifications',
    path: '/notifications',
    icon: Bell,
    group: 'Personal',
  },
  {
    id: 'profile',
    name: 'Profile',
    path: '/profile',
    icon: User,
    group: 'Personal',
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    icon: Gear,
    group: 'Personal',
  },
];

export interface RouteMetadata {
  title: string;
  category: string;
  breadcrumbs: string[];
}

export const ROUTE_METADATA_MAP: Record<string, RouteMetadata> = {
  '/dashboard': {
    title: 'Financial Overview',
    category: 'Overview',
    breadcrumbs: ['SPENDX', 'Overview', 'Dashboard'],
  },
  '/transactions': {
    title: 'Transactions Ledger',
    category: 'Money Management',
    breadcrumbs: ['SPENDX', 'Finance', 'Transactions'],
  },
  '/accounts': {
    title: 'Connected Accounts',
    category: 'Money Management',
    breadcrumbs: ['SPENDX', 'Finance', 'Accounts'],
  },
  '/budgets': {
    title: 'Budget Envelopes',
    category: 'Money Management',
    breadcrumbs: ['SPENDX', 'Finance', 'Budgets'],
  },
  '/savings': {
    title: 'Savings Goals',
    category: 'Money Management',
    breadcrumbs: ['SPENDX', 'Finance', 'Savings Goals'],
  },
  '/recurring': {
    title: 'Recurring Charges',
    category: 'Money Management',
    breadcrumbs: ['SPENDX', 'Finance', 'Recurring'],
  },
  '/analytics': {
    title: 'Financial Telemetry',
    category: 'Intelligence',
    breadcrumbs: ['SPENDX', 'Intelligence', 'Analytics'],
  },
  '/ai-assistant': {
    title: 'AI Financial Assistant',
    category: 'Intelligence',
    breadcrumbs: ['SPENDX', 'Intelligence', 'AI Assistant'],
  },
  '/ai-coach': {
    title: 'AI Financial Coach',
    category: 'Intelligence',
    breadcrumbs: ['SPENDX', 'Intelligence', 'AI Coach'],
  },
  '/insights': {
    title: 'Financial Insights',
    category: 'Intelligence',
    breadcrumbs: ['SPENDX', 'Intelligence', 'Insights'],
  },
  '/reports': {
    title: 'Financial Reports',
    category: 'Reporting',
    breadcrumbs: ['SPENDX', 'Reporting', 'Monthly Reports'],
  },
  '/notifications': {
    title: 'Notifications',
    category: 'Personal',
    breadcrumbs: ['SPENDX', 'Personal', 'Notifications'],
  },
  '/profile': {
    title: 'User Profile',
    category: 'Personal',
    breadcrumbs: ['SPENDX', 'Personal', 'Profile'],
  },
  '/settings': {
    title: 'Account Settings',
    category: 'Personal',
    breadcrumbs: ['SPENDX', 'Personal', 'Settings'],
  },
};

export const getRouteMetadata = (pathname: string): RouteMetadata => {
  // Check exact match
  if (ROUTE_METADATA_MAP[pathname]) {
    return ROUTE_METADATA_MAP[pathname];
  }

  // Check detail routes e.g. /transactions/:id
  if (pathname.startsWith('/transactions/')) {
    return {
      title: 'Transaction Details',
      category: 'Money Management',
      breadcrumbs: ['SPENDX', 'Finance', 'Transactions', 'Detail'],
    };
  }
  if (pathname.startsWith('/accounts/')) {
    return {
      title: 'Account Details',
      category: 'Money Management',
      breadcrumbs: ['SPENDX', 'Finance', 'Accounts', 'Detail'],
    };
  }
  if (pathname.startsWith('/budgets/')) {
    return {
      title: 'Budget Details',
      category: 'Money Management',
      breadcrumbs: ['SPENDX', 'Finance', 'Budgets', 'Detail'],
    };
  }
  if (pathname.startsWith('/savings/')) {
    return {
      title: 'Savings Goal Details',
      category: 'Money Management',
      breadcrumbs: ['SPENDX', 'Finance', 'Savings Goals', 'Detail'],
    };
  }
  if (pathname.startsWith('/recurring/')) {
    return {
      title: 'Recurring Payment Details',
      category: 'Money Management',
      breadcrumbs: ['SPENDX', 'Finance', 'Recurring', 'Detail'],
    };
  }

  return {
    title: 'Dashboard',
    category: 'Overview',
    breadcrumbs: ['SPENDX', 'Workspace'],
  };
};
