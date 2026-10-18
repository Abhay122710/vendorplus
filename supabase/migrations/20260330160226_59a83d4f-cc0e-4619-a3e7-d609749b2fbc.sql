
-- Allow shopowners to insert their own shop
CREATE POLICY "Shopowners can insert own shop"
ON public.shops FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid()::text);

-- Allow shopowners to update their own shop
CREATE POLICY "Shopowners can update own shop"
ON public.shops FOR UPDATE TO authenticated
USING (owner_id = auth.uid()::text);

-- Allow shopowners to insert products for their own shop
CREATE POLICY "Shopowners can insert own products"
ON public.products FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.shops WHERE id::text = shop_id AND owner_id = auth.uid()::text)
);

-- Allow shopowners to update products for their own shop
CREATE POLICY "Shopowners can update own products"
ON public.products FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.shops WHERE id::text = shop_id AND owner_id = auth.uid()::text)
);

-- Allow shopowners to delete products for their own shop
CREATE POLICY "Shopowners can delete own products"
ON public.products FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.shops WHERE id::text = shop_id AND owner_id = auth.uid()::text)
);
