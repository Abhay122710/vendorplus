CREATE TABLE public.order_call_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL,
  digit text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_call_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read order responses"
ON public.order_call_responses FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "No public insert"
ON public.order_call_responses FOR INSERT
TO anon, authenticated
WITH CHECK (false);

ALTER PUBLICATION supabase_realtime ADD TABLE public.order_call_responses;