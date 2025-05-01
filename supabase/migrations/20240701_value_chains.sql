-- Create value_chains table
CREATE TABLE IF NOT EXISTS value_chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chain_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE value_chains ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own value chains
CREATE POLICY "Users can view their own value chains" 
  ON value_chains FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own value chains
CREATE POLICY "Users can insert their own value chains" 
  ON value_chains FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own value chains
CREATE POLICY "Users can update their own value chains" 
  ON value_chains FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own value chains
CREATE POLICY "Users can delete their own value chains" 
  ON value_chains FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX value_chains_user_id_idx ON value_chains (user_id); 