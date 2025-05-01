// Script to check database structure and connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkDatabase() {
  console.log('Checking Supabase connection and database structure...');
  
  // Verify environment variables
  console.log('Checking environment variables:');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
    return;
  } else {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set');
  }
  
  if (!supabaseKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
    return;
  } else {
    console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
  }
  
  if (!serviceKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is missing (only needed for admin operations)');
  } else {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY is set');
  }
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check connection
    const { data: healthData, error: healthError } = await supabase.rpc('healthcheck');
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError.message);
      return;
    }
    
    console.log('✅ Connected to Supabase');
    
    // Check if income_statements table exists
    const { data: tableInfo, error: tableError } = await supabase
      .from('income_statements')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('❌ income_statements table check failed:', tableError.message);
      
      if (tableError.message.includes('does not exist')) {
        console.log('\nMissing table! Running this SQL might help:');
        console.log(`
CREATE TABLE public.income_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  statement_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.income_statements ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read only their own statements
CREATE POLICY "Users can view their own statements" 
  ON public.income_statements 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own statements
CREATE POLICY "Users can insert their own statements" 
  ON public.income_statements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own statements
CREATE POLICY "Users can delete their own statements" 
  ON public.income_statements 
  FOR DELETE 
  USING (auth.uid() = user_id);
`);
      }
    } else {
      console.log('✅ income_statements table exists');
    }
    
    // Check table structure if the table exists
    if (!tableError) {
      const { data: columnInfo, error: columnError } = await supabase.rpc('table_info', { 
        p_table_name: 'income_statements' 
      });
      
      if (columnError) {
        console.error('❌ Failed to check income_statements structure:', columnError.message);
      } else {
        console.log('✅ income_statements table structure:', columnInfo);
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

checkDatabase().catch(console.error);

// To run this script:
// 1. Make sure you have the required dependencies: npm install dotenv @supabase/supabase-js
// 2. Run: node scripts/check-db.js 