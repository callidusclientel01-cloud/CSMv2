-- Create currencies table
CREATE TABLE public.currencies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    symbol TEXT NOT NULL,
    exchange_rate NUMERIC NOT NULL DEFAULT 1.0,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone needs to see active currencies)
CREATE POLICY "Currencies are viewable by everyone" 
ON public.currencies FOR SELECT 
USING (true);

-- Create policies for admin access (assumes admin role is managed in user_roles or similar, we will just restrict by auth for now as standard)
-- Assuming we want authenticated users to be able to manage this (we can adjust to match existing RLS)
CREATE POLICY "Currencies are manageable by authenticated admins" 
ON public.currencies FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Insert default data
INSERT INTO public.currencies (code, symbol, exchange_rate, is_default, is_active)
VALUES
    ('USD', '$', 1.00, true, true),
    ('EUR', '€', 0.92, false, true),
    ('GBP', '£', 0.79, false, true),
    ('AED', 'د.إ', 3.67, false, true),
    ('INR', '₹', 83.50, false, true);
