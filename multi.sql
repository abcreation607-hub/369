-- 1. Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  condition TEXT NOT NULL,
  offer_price NUMERIC NOT NULL,
  actual_price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Offers Table
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create E-Bills Table
CREATE TABLE ebills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  item TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Realtime Sync on All Tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE offers;
ALTER PUBLICATION supabase_realtime ADD TABLE ebills;

-- 5. Open Public Read & Write Policies (Simple Store Setup)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read/Write Products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Offers" ON offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Ebills" ON ebills FOR ALL USING (true) WITH CHECK (true);

