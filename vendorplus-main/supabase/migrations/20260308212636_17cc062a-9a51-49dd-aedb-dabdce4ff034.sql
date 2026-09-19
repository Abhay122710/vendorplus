
-- Drop the permissive policy and replace with restrictive ones
DROP POLICY "Service role full access" ON public.pending_sms;

-- No public/anon access - only service role (which bypasses RLS) can access this table
-- Add a deny-all policy so anon/authenticated users cannot access
CREATE POLICY "No public access" ON public.pending_sms
  FOR ALL USING (false);
