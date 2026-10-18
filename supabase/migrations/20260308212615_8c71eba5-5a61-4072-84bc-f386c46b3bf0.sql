
CREATE TABLE public.pending_sms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  error text
);

ALTER TABLE public.pending_sms ENABLE ROW LEVEL SECURITY;

-- Allow edge functions (service role) full access, no public access
CREATE POLICY "Service role full access" ON public.pending_sms
  FOR ALL USING (true) WITH CHECK (true);
