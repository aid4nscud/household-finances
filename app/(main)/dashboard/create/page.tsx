import { getCurrentUser } from '@/lib/supabase-server'
import { StatementFormContainer } from '@/components/form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Household Statement | ValYou',
  description: 'Create or update your household financial statement',
}

export default async function CreateStatementPage() {
  // Get the current authenticated user
  const user = await getCurrentUser()
  if (!user) {
    redirect('/sign-in')
  }
  
  // Get the user's most recent statement
  const supabase = createClient()
  const { data: statement } = await supabase
    .from('income_statements')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  // Pass the statement to the form if it exists (null otherwise)
  return <StatementFormContainer initialEmail={user?.email || ''} existingStatement={statement} />
} 