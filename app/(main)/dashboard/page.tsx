import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { BarChart3, PieChart, TrendingUp, ArrowRight, FileText, PlusCircle, Eye, PenLine } from 'lucide-react'
import { getCurrentUser } from '@/lib/supabase-server'
import { getIncomeStatements } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Dashboard skeleton loading state
function DashboardSkeleton() {
  return (
    <div className="animate-fadeIn py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-6 w-[200px]" />
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  )
}

interface StatementData {
  id: string;
  created_at: string;
  statement_data: {
    income: {
      grossRevenue: {
        value: number;
        formatted: string;
      }
    };
    netRevenue: {
      value: number;
      formatted: string;
    };
    finalNetIncome: {
      value: number;
      formatted: string;
    };
    insights: string[];
  };
}

async function Dashboard() {
  // Get the current user
  const user = await getCurrentUser()
  
  // Try to get the most recent statement
  let latestStatement: StatementData | null = null
  let hasStatements = false
  
  if (user) {
    try {
      const { data: statements } = await getIncomeStatements(user.id, 1, 1)
      hasStatements = statements && statements.length > 0
      if (hasStatements) {
        latestStatement = statements[0] as StatementData
      }
    } catch (error) {
      console.error('Error fetching statements:', error)
    }
  }
  
  return (
    <div className="animate-fadeIn py-8 space-y-12">
      {/* Page header with semantic structure */}
      <section aria-labelledby="dashboard-heading" className="mb-4">
        <h1 
          id="dashboard-heading" 
          className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          Household Dashboard
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mt-3">
          Track your household profit margin and align your spending with your values.
        </p>
      </section>
      
      {/* Latest statement summary */}
      {latestStatement && (
        <section aria-labelledby="latest-statement-heading" className="pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 
              id="latest-statement-heading"
              className="text-2xl font-bold text-gray-900 dark:text-gray-50"
            >
              Latest Financial Statement
            </h2>
            <div className="flex gap-2 mt-3 md:mt-0">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/statement/${latestStatement.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </Button>
              <Button size="sm" variant="default" asChild>
                <Link href="/dashboard/create">
                  <PenLine className="mr-2 h-4 w-4" />
                  Update Statement
                </Link>
              </Button>
            </div>
          </div>
          
          <Card className="bg-card shadow-md border-muted/30">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">GROSS REVENUE</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {latestStatement.statement_data.income.grossRevenue.formatted}
                      </p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">NET REVENUE</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {latestStatement.statement_data.netRevenue.formatted}
                      </p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-full">
                      <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                </div>
                
                <div className={`p-5 rounded-lg shadow-sm ${
                  latestStatement.statement_data.finalNetIncome.value >= 0 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-1.5">
                      <p className={`text-sm font-medium ${
                        latestStatement.statement_data.finalNetIncome.value >= 0 
                          ? 'text-green-800 dark:text-green-300' 
                          : 'text-red-800 dark:text-red-300'
                      }`}>
                        NET HOUSEHOLD PROFIT
                      </p>
                      <p className={`text-2xl font-bold ${
                        latestStatement.statement_data.finalNetIncome.value >= 0 
                          ? 'text-green-700 dark:text-green-400' 
                          : 'text-red-700 dark:text-red-400'
                      }`}>
                        {latestStatement.statement_data.finalNetIncome.formatted}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${
                      latestStatement.statement_data.finalNetIncome.value >= 0 
                        ? 'bg-green-100 dark:bg-green-800/30' 
                        : 'bg-red-100 dark:bg-red-800/30'
                    }`}>
                      <PieChart className={`h-5 w-5 ${
                        latestStatement.statement_data.finalNetIncome.value >= 0 
                          ? 'text-green-600 dark:text-green-300' 
                          : 'text-red-600 dark:text-red-300'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
              
              {latestStatement.statement_data.insights && latestStatement.statement_data.insights.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">LATEST INSIGHTS</p>
                  <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      {latestStatement.statement_data.insights[0]}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
      
      {/* Action cards */}
      <section className="pt-4" aria-label="Dashboard Actions">
        <h2 className="sr-only">Dashboard Actions</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="group flex flex-col h-full overflow-hidden bg-card hover:bg-card/95 border-muted/30 shadow-md hover:shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 rounded-xl">
            <CardHeader className="flex flex-row items-start gap-4 p-6 pb-3">
              <div className="flex-shrink-0 p-2.5 rounded-full bg-primary/10 text-primary" aria-hidden="true">
                {hasStatements ? <PenLine className="h-5 w-5 sm:h-6 sm:w-6" /> : <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl mb-1">{hasStatements ? 'Update Statement' : 'Create Statement'}</CardTitle>
                <CardDescription className="text-sm">
                  {hasStatements ? 'Update your household financial statement' : 'Generate a new household financial statement'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6 pt-3">
              <p className="text-sm text-muted-foreground">
                {hasStatements ? 'Keep your financial data up-to-date for accurate insights.' : 'Track your income, expenses, and savings in a structured format.'}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button 
                asChild 
                className="w-full group"
                size="default"
              >
                <Link 
                  href="/dashboard/create" 
                  className="flex items-center justify-center"
                  aria-label={hasStatements ? "Update your financial statement" : "Create a new financial statement"}
                >
                  <span>{hasStatements ? 'Update Statement' : 'Start New Statement'}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="group flex flex-col h-full overflow-hidden bg-card hover:bg-card/95 border-muted/30 shadow-md hover:shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 rounded-xl">
            <CardHeader className="flex flex-row items-start gap-4 p-6 pb-3">
              <div className="flex-shrink-0 p-2.5 rounded-full bg-green-500/10 text-green-600" aria-hidden="true">
                <PieChart className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl mb-1">Value Chain</CardTitle>
                <CardDescription className="text-sm">
                  Align spending with your core values
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6 pt-3">
              <p className="text-sm text-muted-foreground">
                Connect your financial decisions to what truly matters to you.
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button 
                asChild 
                variant="outline" 
                className="w-full group border-green-200 hover:bg-green-50/50 hover:text-green-700 hover:border-green-300"
                size="default"
              >
                <Link 
                  href="/dashboard/value-chain" 
                  className="flex items-center justify-center"
                  aria-label="Define your value chain"
                >
                  <span>Define Values</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Keyboard navigation helper for screen readers */}
      <div className="sr-only">
        <p>Use tab key to navigate through dashboard action cards</p>
      </div>
    </div>
  )
} 