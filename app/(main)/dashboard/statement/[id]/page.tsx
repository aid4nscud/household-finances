import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase-server'
import { getIncomeStatementById } from '@/lib/db'
import SummaryItem from '@/components/summary/SummaryItem'
import InsightItem from '@/components/summary/InsightItem'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface StatementDetailPageProps {
  params: {
    id: string
  }
}

// Loading skeleton component
function StatementSkeleton() {
  return (
    <div className="animate-fadeIn py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-6 w-[200px]" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
      
      <div className="mt-8">
        <Skeleton className="h-8 w-[150px] mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function StatementDetailPage({ params }: StatementDetailPageProps) {
  return (
    <Suspense fallback={<StatementSkeleton />}>
      <StatementDetail params={params} />
    </Suspense>
  )
}

async function StatementDetail({ params }: StatementDetailPageProps) {
  try {
    // Get the current user
    const user = await getCurrentUser()
    if (!user) redirect('/sign-in')

    // Get the statement
    const statement = await getIncomeStatementById(params.id, user.id)

    const { statement_data: incomeStatement } = statement
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return (
      <div className="animate-fadeIn py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Household Statement
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Created on {formatDate(statement.created_at)}
            </p>
          </div>
          <div className="flex mt-4 lg:mt-0 space-x-4">
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/create">Create New Statement</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryItem
            title="Gross Revenue"
            value={incomeStatement.income.grossRevenue.formatted}
            subtitle="Total household income"
            type="income"
          />
          <SummaryItem
            title="Net Revenue"
            value={incomeStatement.netRevenue.formatted}
            subtitle="After pre-tax deductions"
            type="income"
          />
          <SummaryItem
            title="Total Needs"
            value={incomeStatement.essentialNeeds.totalNeedsExpenses.formatted}
            subtitle="Essential expenses"
            type="expense"
          />
          <SummaryItem
            title="Total Wants"
            value={incomeStatement.discretionaryExpenses.totalWantsExpenses.formatted}
            subtitle="Discretionary spending"
            type="expense"
          />
          <SummaryItem
            title="Total Savings"
            value={incomeStatement.savingsInvestments.totalSavingsInvestments.formatted}
            subtitle="Future investments"
            type="savings"
          />
          <SummaryItem
            title="Final Net Income"
            value={incomeStatement.finalNetIncome.formatted}
            subtitle="Your household profit"
            type={incomeStatement.finalNetIncome.value >= 0 ? "income" : "expense"}
          />
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Financial Insights</h2>
          <div className="space-y-4">
            {incomeStatement.insights.map((insight: string, index: number) => (
              <InsightItem key={index} content={insight} />
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in StatementDetail:', error)
    notFound()
  }
} 