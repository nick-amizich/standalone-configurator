// Product configuration types for Shopify integration

export interface ProductConfiguration {
  id: string;
  shopify_product_id: string;
  name: string;
  base_price: number;
  base_sku: string;
  description: string;
  active: boolean;
  configuration_data: ConfigurationData;
  created_at: string;
  updated_at: string;
}

export interface ConfigurationData {
  modelType?: string;
  material?: string;
  color?: string;
  size?: string;
  customText?: string;
  features?: string[];
  quantity?: number;
  notes?: string;
  // Add any other configuration fields as needed
  [key: string]: any;
}

export interface ProductConfigurationRequest {
  shopify_product_id?: string;
  name?: string;
  base_price?: number;
  base_sku?: string;
  description?: string;
  configuration_data: ConfigurationData;
}

export interface ProductConfigurationResponse {
  success: boolean;
  data?: ProductConfiguration;
  error?: string;
}