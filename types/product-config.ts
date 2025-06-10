// Product configuration types for Shopify integration

export interface ProductConfiguration {
  id: string;
  product_id: string;
  variant_id?: string;
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
  product_id: string;
  variant_id?: string;
  configuration_data: ConfigurationData;
}

export interface ProductConfigurationResponse {
  success: boolean;
  data?: ProductConfiguration;
  error?: string;
}