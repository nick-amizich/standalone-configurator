-- Simple product configurations table
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS product_configurations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  shopify_product_id text NOT NULL UNIQUE,
  shopify_variant_id text,
  configuration_data jsonb NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_config_shopify_id 
  ON product_configurations(shopify_product_id);

-- Enable RLS
ALTER TABLE product_configurations ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for Shopify)
CREATE POLICY "Public can read active configurations" 
  ON product_configurations
  FOR SELECT 
  USING (active = true);

-- Allow authenticated users to manage configurations
CREATE POLICY "Authenticated users can manage configurations" 
  ON product_configurations
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Sample configuration to test with
INSERT INTO product_configurations (shopify_product_id, configuration_data)
VALUES (
  'test-product-123',
  '{
    "name": "Verite Closed",
    "basePrice": 299900,
    "options": [
      {
        "name": "Wood Type",
        "type": "variant",
        "values": [
          {"name": "Walnut", "priceModifier": 0, "sku": "WAL"},
          {"name": "Cherry", "priceModifier": 10000, "sku": "CHR"},
          {"name": "Cocobolo", "priceModifier": 20000, "sku": "COC"}
        ]
      },
      {
        "name": "Cable Type",
        "type": "property",
        "values": [
          {"name": "Silver", "priceModifier": 0},
          {"name": "Copper", "priceModifier": 5000}
        ]
      }
    ]
  }'::jsonb
) ON CONFLICT (shopify_product_id) DO NOTHING;