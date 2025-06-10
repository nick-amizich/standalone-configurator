import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('product_configurations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        data: data || []
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching configurations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch configurations'
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 