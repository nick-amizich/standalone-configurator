import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ProductConfiguration, ProductConfigurationRequest } from '@/types/product-config';

// GET: Retrieve product configuration
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    
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

    return NextResponse.json(
      {
        success: true,
        data: data || null
      }
    );
  } catch (error) {
    console.error('Error fetching product configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product configuration'
      },
      { status: 500 }
    );
  }
}

// POST: Create or update product configuration
export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const body: ProductConfigurationRequest = await request.json();

    // Validate request
    if (!body.configuration_data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Configuration data is required'
        },
        { status: 400 }
      );
    }

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
          configuration_data: body.configuration_data,
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
          configuration_data: body.configuration_data,
          name: body.name || 'Untitled Configuration',
          base_price: body.base_price || 0,
          base_sku: body.base_sku || '',
          description: body.description || '',
          active: true
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(
      {
        success: true,
        data: result
      }
    );
  } catch (error) {
    console.error('Error saving product configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save product configuration'
      },
      { status: 500 }
    );
  }
}

// DELETE: Remove product configuration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    const { error } = await supabaseAdmin
      .from('product_configurations')
      .delete()
      .eq('shopify_product_id', productId);

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: 'Configuration deleted successfully'
      }
    );
  } catch (error) {
    console.error('Error deleting product configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product configuration'
      },
      { status: 500 }
    );
  }
}