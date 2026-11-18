-- ============================================================================
-- SPENDX Database Architecture: Phase 4 Hybrid Backend Alignment & Optimization
-- Version: 004_hybrid_alignment.sql
-- Description:
-- 1. Notification preferences table for edge alert rules & multi-channel prefs
-- 2. Performance indexes on transactions(user_id, date DESC), budgets, capture_events
-- 3. Capture events support and audit indexing for edge SMS/UPI/CSV/PDF imports
-- 4. Recurring transactions standard view for cross-compatibility
-- 5. Strict multi-tenant Row Level Security (RLS) policies
-- ============================================================================

-- 1. Notification Preferences Table for Edge and Core Alert Rules
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    push_enabled BOOLEAN NOT NULL DEFAULT true,
    budget_threshold_alerts BOOLEAN NOT NULL DEFAULT true,
    recurring_due_alerts BOOLEAN NOT NULL DEFAULT true,
    savings_milestone_alerts BOOLEAN NOT NULL DEFAULT true,
    weekly_digest_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable RLS on notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own notification preferences"
    ON public.notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
    ON public.notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
    ON public.notification_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notification preferences"
    ON public.notification_preferences FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Composite B-Tree Indexes for Instant Ingestion & Telemetry Queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_date_desc
    ON public.transactions (user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date_type
    ON public.transactions (user_id, date DESC, type);

CREATE INDEX IF NOT EXISTS idx_transactions_user_category
    ON public.transactions (user_id, category);

CREATE INDEX IF NOT EXISTS idx_budgets_user_category
    ON public.budgets (user_id, category);

CREATE INDEX IF NOT EXISTS idx_savings_goals_user_target_date
    ON public.savings_goals (user_id, target_date);

CREATE INDEX IF NOT EXISTS idx_recurring_payments_user_due
    ON public.recurring_payments (user_id, next_due_date, status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
    ON public.notifications (user_id, is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_capture_events_user_created
    ON public.capture_events (user_id, created_at DESC);

-- 4. Recurring Transactions View Alias
CREATE OR REPLACE VIEW public.recurring_transactions AS
    SELECT 
        id,
        user_id,
        account_id,
        name AS title,
        amount,
        frequency,
        category,
        next_due_date,
        is_automatic,
        status,
        created_at,
        updated_at
    FROM public.recurring_payments;

-- 5. Trigger for updated_at on notification_preferences
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notification_preferences_updated_at'
    ) THEN
        CREATE TRIGGER trg_notification_preferences_updated_at
            BEFORE UPDATE ON public.notification_preferences
            FOR EACH ROW
            EXECUTE FUNCTION public.set_updated_at();
    END IF;
END $$;
