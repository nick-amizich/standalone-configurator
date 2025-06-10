-- Create product_configurations table
CREATE TABLE IF NOT EXISTS public.product_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL,
    variant_id TEXT,
    configuration_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_product_configurations_product_id ON public.product_configurations(product_id);
CREATE INDEX idx_product_configurations_variant_id ON public.product_configurations(variant_id);
CREATE INDEX idx_product_configurations_created_at ON public.product_configurations(created_at DESC);

-- Create unique constraint to prevent duplicate configurations
CREATE UNIQUE INDEX idx_product_configurations_unique 
ON public.product_configurations(product_id, COALESCE(variant_id, ''));

-- Enable Row Level Security
ALTER TABLE public.product_configurations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access (for Shopify)
CREATE POLICY "Allow anonymous read access" ON public.product_configurations
    FOR SELECT
    USING (true);

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access" ON public.product_configurations
    USING (auth.role() = 'service_role');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_configurations_updated_at
    BEFORE UPDATE ON public.product_configurations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();