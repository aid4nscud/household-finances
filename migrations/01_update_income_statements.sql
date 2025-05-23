-- Drop existing table if it exists
DROP TABLE IF EXISTS public.income_statements;

-- Create income_statements table
CREATE TABLE public.income_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create policy for users to modify their own statements
CREATE POLICY "Users can update their own statements" 
  ON public.income_statements 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX income_statements_user_id_idx ON public.income_statements (user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_income_statements_updated_at
    BEFORE UPDATE ON public.income_statements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 