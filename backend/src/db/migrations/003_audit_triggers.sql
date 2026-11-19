-- ============================================================================
-- SPENDX Database Architecture: Phase 3 Triggers, Constraints & Audit Hooks
-- Version: 003_audit_triggers.sql
-- Description: Automated timestamp triggers, duplicate transaction constraints,
-- and automated user profile initialization hooks.
-- ============================================================================

-- 1. Automated Timestamp Trigger Function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at Triggers
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_accounts_updated_at ON public.accounts;
CREATE TRIGGER trigger_accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_transactions_updated_at ON public.transactions;
CREATE TRIGGER trigger_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_budgets_updated_at ON public.budgets;
CREATE TRIGGER trigger_budgets_updated_at
    BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_savings_goals_updated_at ON public.savings_goals;
CREATE TRIGGER trigger_savings_goals_updated_at
    BEFORE UPDATE ON public.savings_goals
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_recurring_payments_updated_at ON public.recurring_payments;
CREATE TRIGGER trigger_recurring_payments_updated_at
    BEFORE UPDATE ON public.recurring_payments
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 2. Transaction Integrity & Duplicate Protection Constraint
-- Guarantees reference numbers cannot be duplicated within an account for a user.
-- ----------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS uq_transactions_ref_number
    ON public.transactions(user_id, account_id, reference_number)
    WHERE reference_number IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 3. Automatic Profile & Seed Categories Provisioning on Signup
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Provision default profile
    INSERT INTO public.profiles (id, email, full_name, currency)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'currency', 'INR')
    )
    ON CONFLICT (id) DO NOTHING;

    -- Provision default system categories if empty
    IF NOT EXISTS (SELECT 1 FROM public.categories WHERE is_system = true LIMIT 1) THEN
        INSERT INTO public.categories (name, type, icon, color_hex, is_system) VALUES
            ('Salary', 'INCOME', 'Briefcase', '#22C55E', true),
            ('Freelance & Consulting', 'INCOME', 'Laptop', '#10B981', true),
            ('Investments & Dividends', 'INCOME', 'TrendingUp', '#06B6D4', true),
            ('Food & Dining', 'EXPENSE', 'Utensils', '#F59E0B', true),
            ('Groceries', 'EXPENSE', 'ShoppingBag', '#84CC16', true),
            ('Housing & Rent', 'EXPENSE', 'Home', '#0D9488', true),
            ('Utilities & Bills', 'EXPENSE', 'Zap', '#EAB308', true),
            ('Transportation', 'EXPENSE', 'Car', '#16A34A', true),
            ('Healthcare & Medical', 'EXPENSE', 'HeartPulse', '#EC4899', true),
            ('Entertainment & Leisure', 'EXPENSE', 'Film', '#10B981', true),
            ('Shopping & Electronics', 'EXPENSE', 'Tag', '#05CD99', true),
            ('Account Transfer', 'TRANSFER', 'ArrowLeftRight', '#64748B', true);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users for seamless onboarding
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
