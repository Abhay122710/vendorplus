
INSERT INTO storage.buckets (id, name, public) VALUES ('ml-outputs', 'ml-outputs', true);

CREATE POLICY "Allow public read access on ml-outputs" ON storage.objects FOR SELECT USING (bucket_id = 'ml-outputs');

CREATE POLICY "Allow authenticated upload to ml-outputs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ml-outputs');

CREATE POLICY "Allow authenticated update on ml-outputs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'ml-outputs');
