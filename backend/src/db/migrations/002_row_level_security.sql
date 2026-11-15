-- ============================================================================
-- SPENDX Database Architecture: Phase 2 Row Level Security (RLS)
-- Version: 002_row_level_security.sql
-- Description: Strict Row Level Security policies guaranteeing multi-tenant isolation.
-- Users can only ever query or mutate rows where auth.uid() matches user_id.
-- ============================================================================

-- 1. Enable RLS on all SPENDX Application Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capture_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- ACCOUNTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own accounts"
    ON public.accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts"
    ON public.accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
    ON public.accounts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts"
    ON public.accounts FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- CATEGORIES POLICIES
-- System categories (is_system = true) are visible to all authenticated users.
-- Custom categories can only be viewed and modified by their creator.
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view system or personal categories"
    ON public.categories FOR SELECT
    USING (is_system = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own custom categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update own custom categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id AND is_system = false)
    WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete own custom categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id AND is_system = false);

-- ----------------------------------------------------------------------------
-- TRANSACTIONS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- BUDGETS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own budgets"
    ON public.budgets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
    ON public.budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
    ON public.budgets FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
    ON public.budgets FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- SAVINGS GOALS & CONTRIBUTIONS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own savings goals"
    ON public.savings_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals"
    ON public.savings_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals"
    ON public.savings_goals FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals"
    ON public.savings_goals FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can select own savings contributions"
    ON public.savings_contributions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings contributions"
    ON public.savings_contributions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings contributions"
    ON public.savings_contributions FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RECURRING PAYMENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own recurring payments"
    ON public.recurring_payments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recurring payments"
    ON public.recurring_payments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recurring payments"
    ON public.recurring_payments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recurring payments"
    ON public.recurring_payments FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- FINANCIAL INSIGHTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own financial insights"
    ON public.financial_insights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial insights"
    ON public.financial_insights FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial insights"
    ON public.financial_insights FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial insights"
    ON public.financial_insights FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- CAPTURE EVENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own capture events"
    ON public.capture_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own capture events"
    ON public.capture_events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- AI CHAT SESSIONS & MESSAGES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own chat sessions"
    ON public.chat_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions"
    ON public.chat_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
    ON public.chat_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions"
    ON public.chat_sessions FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can select own chat messages"
    ON public.chat_messages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- REPORTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can select own reports"
    ON public.reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
    ON public.reports FOR DELETE
    USING (auth.uid() = user_id);
