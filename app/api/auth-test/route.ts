import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Create server client
    const supabase = createClient()
    
    // Test Supabase URL and anon key
    const config = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
      anon_key_exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      service_key_exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      node_env: process.env.NODE_ENV
    }
    
    // Test Supabase connection
    const { data, error } = await supabase.auth.getSession()
    
    return NextResponse.json({
      status: 'success',
      message: 'Auth test completed',
      env_check: config,
      session: data || null,
      error: error || null
    })
  } catch (error) {
    console.error('Auth test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Auth test failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 