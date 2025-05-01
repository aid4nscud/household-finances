import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/supabase-server'
import { getIncomeStatements } from '@/lib/db'
import { Suspense } from 'react'
import { PlusCircle, FileText, ArrowRight } from 'lucide-react'

// Skeleton loader for the history page
function StatementHistorySkeleton() {
  return (
    <div className="animate-fadeIn py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-6 w-[200px]" />
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<StatementHistorySkeleton />}>
      <StatementHistory />
    </Suspense>
  )
}

async function StatementHistory() {
  try {
    // Get the current user
    const user = await getCurrentUser()
    if (!user) redirect('/sign-in')

    // Get the user's income statements
    const { data: statements } = await getIncomeStatements(user.id, 1, 50)
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    return (
      <div className="animate-fadeIn py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Statement History
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mt-2">
              Review and compare past financial statements
            </p>
          </div>
          <Button asChild size="lg" className="mt-4 md:mt-0 gap-2">
            <Link href="/dashboard/create">
              <PlusCircle className="h-4 w-4" />
              <span>Create New Statement</span>
            </Link>
          </Button>
        </div>

        {statements && statements.length > 0 ? (
          <div className="space-y-4">
            {statements.map((statement) => (
              <Card key={statement.id} className="hover:bg-accent/5 transition duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">
                          Financial Statement
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Created on {formatDate(statement.created_at)}
                        </p>
                        {statement.statement_data.finalNetIncome && (
                          <p className={`text-sm mt-1 font-medium ${
                            statement.statement_data.finalNetIncome.value >= 0 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            Net Income: {statement.statement_data.finalNetIncome.formatted}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="mt-4 md:mt-0 gap-1">
                      <Link href={`/dashboard/statement/${statement.id}`}>
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No statements found</CardTitle>
              <CardDescription>
                You haven't created any income statements yet.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild>
                <Link href="/dashboard/create">Create Your First Statement</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error in StatementHistory:', error)
    
    return (
      <div className="animate-fadeIn py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Statement History</h1>
        <Card>
          <CardHeader>
            <CardTitle>Error loading statements</CardTitle>
            <CardDescription>
              There was a problem loading your statements. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/create">Create New Statement</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
} 