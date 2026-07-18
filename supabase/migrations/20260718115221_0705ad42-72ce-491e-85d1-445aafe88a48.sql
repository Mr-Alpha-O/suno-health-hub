ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS rental_unit text NOT NULL DEFAULT 'day',
  ADD COLUMN IF NOT EXISTS show_buy_price boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_rent_price boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS available_for_sale boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS available_for_rent boolean NOT NULL DEFAULT true;