import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// This adapter transforms the API response to match what the Shopify template expects
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    
    // Fetch the configuration
    const { data, error } = await supabaseAdmin
      .from('product_configurations')
      .select('*')
      .eq('shopify_product_id', productId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // If no configuration exists, return not configured
    if (!data) {
      return NextResponse.json({
        configured: false
      });
    }

    // Transform the response to match template expectations
    const transformedResponse = {
      configured: true,
      basePrice: data.base_price || 0,
      options: []
    };

    // Convert configuration_data to options array
    const config = data.configuration_data || {};
    
    // Material option
    if (config.material || config.modelType) {
      transformedResponse.options.push({
        id: 'material',
        name: 'Material',
        type: 'property',
        required: true,
        displayOrder: 1,
        values: [
          { id: 'walnut', name: 'Walnut', available: true, priceModifier: 0 },
          { id: 'oak', name: 'Oak', available: true, priceModifier: 0 },
          { id: 'cherry', name: 'Cherry', available: true, priceModifier: 2000 }, // $20
          { id: 'maple', name: 'Maple', available: true, priceModifier: 1000 } // $10
        ]
      });
    }

    // Size option
    if (config.size) {
      transformedResponse.options.push({
        id: 'size',
        name: 'Size',
        type: 'property',
        required: true,
        displayOrder: 2,
        values: [
          { id: 'small', name: 'Small', available: true, priceModifier: 0 },
          { id: 'medium', name: 'Medium', available: true, priceModifier: 1500 }, // $15
          { id: 'large', name: 'Large', available: true, priceModifier: 3000 } // $30
        ]
      });
    }

    // Color/Finish option
    if (config.color) {
      transformedResponse.options.push({
        id: 'finish',
        name: 'Finish',
        type: 'property',
        required: false,
        displayOrder: 3,
        values: [
          { id: 'natural', name: 'Natural', available: true, priceModifier: 0 },
          { id: 'dark', name: 'Dark Stain', available: true, priceModifier: 500 }, // $5
          { id: 'light', name: 'Light Stain', available: true, priceModifier: 500 } // $5
        ]
      });
    }

    return NextResponse.json(transformedResponse);
    
  } catch (error) {
    console.error('Error fetching product configuration:', error);
    return NextResponse.json({
      configured: false,
      error: 'Failed to fetch configuration'
    }, { status: 500 });
  }
}

// Handle POST requests to save configurations
export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const body = await request.json();

    // Transform the options back to configuration_data format
    const configurationData: any = {};
    
    if (body.material) configurationData.material = body.material;
    if (body.size) configurationData.size = body.size;
    if (body.finish) configurationData.color = body.finish;
    
    // Check if configuration already exists
    const { data: existing } = await supabaseAdmin
      .from('product_configurations')
      .select('id')
      .eq('shopify_product_id', productId)
      .single();

    let result;

    if (existing) {
      // Update existing configuration
      const { data, error } = await supabaseAdmin
        .from('product_configurations')
        .update({
          configuration_data: configurationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new configuration
      const { data, error } = await supabaseAdmin
        .from('product_configurations')
        .insert({
          shopify_product_id: productId,
          configuration_data: configurationData,
          name: 'Product Configuration',
          base_price: body.basePrice || 0,
          base_sku: '',
          description: '',
          active: true
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error saving product configuration:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save configuration'
    }, { status: 500 });
  }
}