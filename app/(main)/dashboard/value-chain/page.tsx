import { getCurrentUser } from '@/lib/supabase-server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ValueChainComponent } from '@/components/value-chain/ValueChainComponent'

export const metadata = {
  title: 'Value Chain | ValYou',
  description: 'Define what money truly means to you and align your finances with your core values',
}

export default async function ValueChainPage() {
  // Get the current authenticated user
  const user = await getCurrentUser()
  if (!user) {
    redirect('/sign-in')
  }
  
  // Get the user's most recent statement to extract value chain data
  const supabase = createClient()
  const { data: statement } = await supabase
    .from('income_statements')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  // Get the user's saved value chain data if it exists
  const { data: valueChainData } = await supabase
    .from('value_chains')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  return (
    <ValueChainComponent 
      userId={user.id} 
      statement={statement} 
      existingValueChain={valueChainData}
    />
  )
} 