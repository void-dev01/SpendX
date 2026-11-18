import { supabaseAdminClient } from '../config/supabase.js';
import { FinancialCalculationService } from './financial.service.js';
import { AppError } from '../middleware/errorHandler.js';

export class ReportService {
  public static async getTaxDeductionSummary(userId: string, period: 'this_year' | 'last_month' | 'this_month' = 'this_year') {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { start, end } = FinancialCalculationService.getDateRange(period);

    const { data: txns } = await supabaseAdminClient
      .from('transactions')
      .select('amount, category, description, date, status')
      .eq('user_id', userId)
      .eq('type', 'EXPENSE')
      .gte('date', start.toISOString())
      .lte('date', end.toISOString());

    let section80D_Health = 0;
    let section80E_Education = 0;
    let section80GG_Rent = 0;

    (txns || []).forEach((t: any) => {
      if (t.status === 'FAILED') return;
      const amt = Number(t.amount);
      const cat = (t.category || '').toLowerCase();
      const desc = (t.description || '').toLowerCase();

      if (cat.includes('health') || desc.includes('insurance') || desc.includes('hospital') || desc.includes('mediclaim')) {
        section80D_Health += amt;
      } else if (cat.includes('education') || desc.includes('tuition') || desc.includes('course') || desc.includes('school')) {
        section80E_Education += amt;
      } else if (cat.includes('housing') || cat.includes('rent') || desc.includes('rent')) {
        section80GG_Rent += amt;
      }
    });

    return {
      period,
      section80D: {
        category: 'Section 80D (Health Insurance & Medical)',
        eligibleAmount: section80D_Health,
        statutoryLimit: 25000,
        deductibleClaim: Math.min(section80D_Health, 25000),
      },
      section80E: {
        category: 'Section 80E (Higher Education Interest/Fees)',
        eligibleAmount: section80E_Education,
        statutoryLimit: 50000,
        deductibleClaim: Math.min(section80E_Education, 50000),
      },
      section80GG: {
        category: 'Section 80GG (House Rent Allowance / Payment)',
        eligibleAmount: section80GG_Rent,
        statutoryLimit: 60000,
        deductibleClaim: Math.min(section80GG_Rent, 60000),
      },
      totalEligibleDeductions:
        Math.min(section80D_Health, 25000) +
        Math.min(section80E_Education, 50000) +
        Math.min(section80GG_Rent, 60000),
    };
  }

  public static async exportTransactionsCSV(userId: string, period: 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all' = 'this_month') {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { start, end } = FinancialCalculationService.getDateRange(period);

    const { data: txns } = await supabaseAdminClient
      .from('transactions')
      .select('date, type, category, amount, description, merchant_name, payment_method, status')
      .eq('user_id', userId)
      .gte('date', start.toISOString())
      .lte('date', end.toISOString())
      .order('date', { ascending: false });

    // Build RFC 4180 CSV
    const headers = ['Date', 'Type', 'Category', 'Amount (INR)', 'Description', 'Merchant', 'Payment Method', 'Status'];
    const rows = (txns || []).map((t: any) => [
      `"${new Date(t.date).toISOString().split('T')[0]}"`,
      `"${t.type}"`,
      `"${t.category || ''}"`,
      `"${Number(t.amount).toFixed(2)}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${(t.merchant_name || '').replace(/"/g, '""')}"`,
      `"${t.payment_method || 'UPI'}"`,
      `"${t.status || 'COMPLETED'}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }
}
