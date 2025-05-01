import { redirect } from 'next/navigation'

export default function Page() {
  // This will trigger an immediate redirect to /dashboard
  redirect('/dashboard')
  
  // This part won't be rendered, but is needed to satisfy TypeScript
  return null
} 