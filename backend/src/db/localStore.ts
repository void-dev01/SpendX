import fs from 'fs';
import path from 'path';
import { AccountRecord, RecurringRecord, Transaction, NotificationRecord } from '../types/index.js';

export interface UserProfileRecord {
  id: string;
  email: string;
  fullName: string;
  currency: string;
  updatedAt: string;
}

export interface RawBudget {
  id: string;
  userId: string;
  category: string;
  allocatedAmount: number;
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  createdAt: string;
  updatedAt: string;
}

export interface RawSavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalDbSchema {
  users: UserProfileRecord[];
  accounts: AccountRecord[];
  transactions: Transaction[];
  budgets: RawBudget[];
  savingsGoals: RawSavingsGoal[];
  recurring: RecurringRecord[];
  notifications: NotificationRecord[];
  aiMessageUsage?: Record<string, number>;
  queuedMessages?: any[];
}

const DEFAULT_DB: LocalDbSchema = {
  users: [],
  accounts: [],
  transactions: [],
  budgets: [],
  savingsGoals: [],
  recurring: [],
  notifications: [],
  aiMessageUsage: {},
  queuedMessages: [],
};

class LocalStore {
  private dbPath: string;
  private cache: LocalDbSchema | null = null;

  constructor() {
    const dataDir = path.resolve(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // Fallback to current directory if folder creation is restricted
      }
    }
    this.dbPath = path.resolve(dataDir, 'spendx-local-db.json');
  }

  public read(): LocalDbSchema {
    if (process.env.NODE_ENV === 'test') {
      if (!this.cache) {
        this.cache = JSON.parse(JSON.stringify(DEFAULT_DB)) as LocalDbSchema;
      }
      return this.cache;
    }

    if (this.cache !== null) return this.cache;

    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        this.cache = { ...DEFAULT_DB, ...JSON.parse(raw) } as LocalDbSchema;
        return this.cache;
      }
    } catch {
      // Return default schema on read failure
    }

    this.cache = JSON.parse(JSON.stringify(DEFAULT_DB)) as LocalDbSchema;
    this.write(this.cache);
    return this.cache;
  }

  public write(data: LocalDbSchema): void {
    this.cache = data;
    if (process.env.NODE_ENV === 'test') return;

    try {
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.dbPath);
    } catch {
      try {
        fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
      } catch (writeErr) {
        // Fallback write failure ignored for local store resilience
        void writeErr;
      }
    }
  }

  // Domain Accessors
  public getAccounts(): AccountRecord[] {
    return this.read().accounts;
  }

  public saveAccounts(accounts: AccountRecord[]): void {
    const db = this.read();
    db.accounts = accounts;
    this.write(db);
  }

  public getTransactions(): Transaction[] {
    return this.read().transactions;
  }

  public saveTransactions(txns: Transaction[]): void {
    const db = this.read();
    db.transactions = txns;
    this.write(db);
  }

  public getBudgets(): RawBudget[] {
    return this.read().budgets;
  }

  public saveBudgets(budgets: RawBudget[]): void {
    const db = this.read();
    db.budgets = budgets;
    this.write(db);
  }

  public getSavingsGoals(): RawSavingsGoal[] {
    return this.read().savingsGoals;
  }

  public saveSavingsGoals(goals: RawSavingsGoal[]): void {
    const db = this.read();
    db.savingsGoals = goals;
    this.write(db);
  }

  public getRecurring(): RecurringRecord[] {
    return this.read().recurring;
  }

  public saveRecurring(rec: RecurringRecord[]): void {
    const db = this.read();
    db.recurring = rec;
    this.write(db);
  }

  public getUserProfile(userId: string): UserProfileRecord {
    const db = this.read();
    const found = db.users.find((u) => u.id === userId);
    if (found) return found;
    const defaultUser: UserProfileRecord = {
      id: userId,
      email: `${userId}@spendx.local`,
      fullName: 'SpendX User',
      currency: 'INR',
      updatedAt: new Date().toISOString(),
    };
    db.users.push(defaultUser);
    this.write(db);
    return defaultUser;
  }

  public saveUserProfile(profile: UserProfileRecord): void {
    const db = this.read();
    const idx = db.users.findIndex((u) => u.id === profile.id);
    if (idx !== -1) {
      db.users[idx] = profile;
    } else {
      db.users.push(profile);
    }
    this.write(db);
  }
}

export const localStore = new LocalStore();
