-- ============================================================================
-- SPENDX Database Architecture: Phase 5 Daily AI Message Quota & Next-Day Scheduling
-- Version: 005_ai_message_quota_queue.sql
-- ============================================================================

-- 1. AI Message Usage Table (200 Messages / Day per user)
CREATE TABLE IF NOT EXISTS public.ai_message_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    message_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_usage_date UNIQUE (user_id, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_ai_message_usage_user_date
    ON public.ai_message_usage (user_id, usage_date);

ALTER TABLE public.ai_message_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own AI usage"
    ON public.ai_message_usage FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. AI Message Scheduled Queue Table
CREATE TABLE IF NOT EXISTS public.ai_message_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    session_id TEXT,
    scheduled_for TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'PROCESSED', 'CANCELLED')),
    response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_message_queue_user_status
    ON public.ai_message_queue (user_id, status, scheduled_for ASC);

ALTER TABLE public.ai_message_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own AI queue"
    ON public.ai_message_queue FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
