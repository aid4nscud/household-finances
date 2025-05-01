-- Create the income_statements table
CREATE TABLE IF NOT EXISTS public.income_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  user_email TEXT,
  statement_data JSONB NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.income_statements ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own statements
CREATE POLICY "Users can view their own statements" 
  ON public.income_statements 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own statements
CREATE POLICY "Users can insert their own statements" 
  ON public.income_statements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT SELECT, INSERT ON public.income_statements TO authenticated;

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS income_statements_user_id_idx ON public.income_statements (user_id); 