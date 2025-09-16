-- Make destinations publicly readable when available = true
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'destinations' 
      AND policyname = 'Public can view available destinations'
  ) THEN
    CREATE POLICY "Public can view available destinations"
    ON public.destinations
    FOR SELECT
    TO public
    USING (available = true);
  END IF;
END $$;