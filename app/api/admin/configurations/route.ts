import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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
      }
    );
  } catch (error) {
    console.error('Error fetching configurations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch configurations'
      },
      { status: 500 }
    );
  }
} 