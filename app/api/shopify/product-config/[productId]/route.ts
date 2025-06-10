import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ProductConfiguration, ProductConfigurationRequest } from '@/types/product-config';

// CORS headers for Shopify
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

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
      .eq('product_id', productId)
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
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching product configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product configuration'
      },
      { status: 500, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if configuration already exists
    const { data: existing } = await supabaseAdmin
      .from('product_configurations')
      .select('id')
      .eq('product_id', productId)
      .eq('variant_id', body.variant_id || null)
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
          product_id: productId,
          variant_id: body.variant_id || null,
          configuration_data: body.configuration_data
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
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error saving product configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save product configuration'
      },
      { status: 500, headers: corsHeaders }
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
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('variant_id');

    const { error } = await supabaseAdmin
      .from('product_configurations')
      .delete()
      .eq('product_id', productId)
      .eq('variant_id', variantId || null);

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: 'Configuration deleted successfully'
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting product configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product configuration'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}