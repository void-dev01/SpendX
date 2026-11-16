import { TransactionService } from './transaction.service.js';
import { ExportCsvQuery } from '../validators/report.validator.js';

export interface MonthlyStatementResult {
  monthKey: string;
  monthName: string;
  startDate: string;
  endDate: string;
  transactionsCount: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  categoryBreakdown: Record<string, number>;
}

export interface TaxDeductionCategory {
  bucket: string;
  section: string;
  categories: string[];
  totalAmount: number;
  transactionCount: number;
  description: string;
}

export interface TaxSummaryResult {
  taxYear: string;
  totalDeductibleExpenses: number;
  buckets: TaxDeductionCategory[];
}

export class ReportService {
  public static async getMonthlyStatement(
    userId: string,
    year?: string,
    month?: string
  ): Promise<MonthlyStatementResult> {
    const now = new Date();
    const targetYear = year ? parseInt(year, 10) : now.getFullYear();
    const targetMonth = month ? parseInt(month, 10) - 1 : now.getMonth();

    const startDate = new Date(targetYear, targetMonth, 1).toISOString();
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999).toISOString();

    const result = await TransactionService.getTransactions(userId, {
      startDate,
      endDate,
      limit: 1000,
    });
    const txns = result.transactions;

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown: Record<string, number> = {};

    for (const t of txns) {
      if (t.type === 'INCOME') {
        totalIncome += t.amount;
      } else if (t.type === 'EXPENSE') {
        totalExpenses += t.amount;
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      }
    }

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 1000) / 10 : 0;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const monthKey = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
    const monthName = `${monthNames[targetMonth]} ${targetYear}`;

    return {
      monthKey,
      monthName,
      startDate,
      endDate,
      transactionsCount: txns.length,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netSavings: Math.round(netSavings * 100) / 100,
      savingsRate,
      categoryBreakdown,
    };
  }

  public static async getTaxSummary(
    userId: string,
    taxYear = '2025-2026'
  ): Promise<TaxSummaryResult> {
    const result = await TransactionService.getTransactions(userId, { limit: 2000 });
    const txns = result.transactions.filter((t) => t.type === 'EXPENSE');

    const bucketsConfig = [
      {
        bucket: 'Life Insurance, PPF & Investments (Section 80C)',
        section: '80C',
        categories: ['Investment', 'Insurance', 'Life Insurance', 'Provident Fund', 'Mutual Fund'],
        description: 'Deductions up to ₹1,50,000 under Section 80C of the Indian Income Tax Act.',
      },
      {
        bucket: 'Health Insurance & Preventive Health Checkup (Section 80D)',
        section: '80D',
        categories: ['Health Insurance', 'Medical', 'Healthcare', 'Doctor', 'Pharmacy'],
        description: 'Deductions up to ₹25,000 (self/family) + ₹50,000 (senior citizen parents) under Section 80D.',
      },
      {
        bucket: 'Higher Education Loan Interest (Section 80E)',
        section: '80E',
        categories: ['Education', 'Tuition', 'Student Loan'],
        description: 'Deductions on entire interest paid on education loans under Section 80E.',
      },
      {
        bucket: 'House Rent Paid (Section 80GG)',
        section: '80GG',
        categories: ['Rent', 'Housing', 'Home Lease'],
        description: 'Rent deduction for individuals not receiving HRA under Section 80GG.',
      },
    ];

    let totalDeductible = 0;
    const buckets: TaxDeductionCategory[] = bucketsConfig.map((cfg) => {
      const matchingTxns = txns.filter((t) =>
        cfg.categories.some((c) => t.category.toLowerCase().includes(c.toLowerCase()))
      );
      const totalAmount = matchingTxns.reduce((sum, t) => sum + t.amount, 0);
      totalDeductible += totalAmount;

      return {
        bucket: cfg.bucket,
        section: cfg.section,
        categories: cfg.categories,
        totalAmount: Math.round(totalAmount * 100) / 100,
        transactionCount: matchingTxns.length,
        description: cfg.description,
      };
    });

    return {
      taxYear,
      totalDeductibleExpenses: Math.round(totalDeductible * 100) / 100,
      buckets,
    };
  }

  public static async exportCsv(
    userId: string,
    params: ExportCsvQuery
  ): Promise<string> {
    const result = await TransactionService.getTransactions(userId, {
      startDate: params.startDate,
      endDate: params.endDate,
      limit: 5000,
    });

    let txns = result.transactions;
    if (params.accountId) {
      txns = txns.filter((t) => t.accountId === params.accountId);
    }
    if (params.type && params.type !== 'ALL') {
      txns = txns.filter((t) => t.type === params.type);
    }

    const headers = ['Date', 'Type', 'Category', 'Description', 'Merchant', 'Amount', 'Account ID'];
    const rows = txns.map((t) => [
      `"${t.date}"`,
      `"${t.type}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${(t.merchantName || '').replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      `"${t.accountId}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }
}
