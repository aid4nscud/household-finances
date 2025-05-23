import Link from 'next/link'
import { BarChart3, PieChart, TrendingUp, ArrowRight, FileText, PlusCircle, Eye, PenLine, Info } from 'lucide-react'
import { getCurrentUser } from '@/lib/supabase-server'
import { getIncomeStatements } from '@/lib/db'
import { Suspense } from 'react'

// Import our UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

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
    costToEarn: {
      totalC2E: {
        value: number;
      };
      percentOfIncome: number;
    };
  };
}

// User info display component
function UserInfoCard({ user }: { user: any }) {
  if (!user) return null;
  
  return (
    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        USER DETAILS (FOR DEMO PURPOSES ONLY)
      </h3>
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-semibold">ID:</span> {user.id}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Email Confirmed:</span> {user.email_confirmed_at ? 'Yes' : 'No'}
        </div>
        <div>
          <span className="font-semibold">Auth Provider:</span> {user.app_metadata?.provider || 'email'}
        </div>
        <div>
          <span className="font-semibold">Created:</span> {new Date(user.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-[#00C805]/30 dark:hover:border-[#00C805]/30 transition-all duration-200 p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00C805]/5 text-[#00C805]">
        <FileText className="h-8 w-8" />
      </div>
      <h3 className="mt-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
        No Statements Found
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        You haven't created any financial statements yet. Create your first statement to track your household finances and align spending with your values.
      </p>
      <div className="mt-8">
        <Link href="/dashboard/create">
          <Button 
            size="lg"
            className="bg-[#00C805] hover:bg-[#00B305] text-white shadow-none h-11 px-8 rounded-full"
          >
            <PlusCircle className="mr-2.5 h-5 w-5" />
            Create Your First Statement
          </Button>
        </Link>
      </div>
    </div>
  );
}

async function Dashboard() {
  // Get the current user
  const user = await getCurrentUser()
  console.log('User data:', JSON.stringify(user, null, 2))
  
  // Try to get the most recent statement
  let latestStatement: StatementData | null = null
  let hasStatements = false
  let statements: StatementData[] = [];
  let statementError = null;
  
  if (user) {
    try {
      const result = await getIncomeStatements(user.id, 1, 1)
      statements = result.data || [];
      hasStatements = statements && statements.length > 0
      if (hasStatements) {
        latestStatement = statements[0] as StatementData
      }
    } catch (error: any) {
      console.error('Error fetching statements:', error)
      statementError = error.message;
    }
  }
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* User info for debugging */}
          {user && process.env.NODE_ENV === 'development' && (
            <div className="space-y-6">
              <UserInfoCard user={user} />
            </div>
          )}
          
          {/* Error state */}
          {statementError && (
            <div className="space-y-6">
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/10">
                <AlertTitle className="mb-2 text-red-800 dark:text-red-200">Error fetching statements</AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-300">{statementError}</AlertDescription>
              </Alert>
            </div>
          )}
          
          {/* Page header with semantic structure */}
          <section aria-labelledby="dashboard-heading" className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="space-y-4">
                <h1 
                  id="dashboard-heading" 
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
                >
                  Household Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                  Track your household profit margin and align your spending with your values.
                </p>
              </div>
            </div>
          </section>
          
          {/* Show empty state when no statements exist */}
          {user && !hasStatements && !statementError && (
            <div className="space-y-6">
              <EmptyState />
            </div>
          )}
          
          {/* Latest statement summary */}
          {latestStatement && (
            <section aria-labelledby="latest-statement-heading" className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <h2 
                  id="latest-statement-heading"
                  className="text-2xl font-medium text-gray-900 dark:text-white flex items-center gap-2"
                >
                  Latest Financial Statement
                  <Badge variant="outline" className="font-normal bg-[#00C805]/5 text-[#00C805] border-[#00C805]/20">
                    {new Date(latestStatement.created_at).toLocaleDateString()}
                  </Badge>
                </h2>
                <div className="flex gap-4">
                  <Link href={`/dashboard/statement/${latestStatement.id}`}>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-11 rounded-full border-gray-200 hover:border-[#00C805] hover:bg-[#00C805]/5 hover:text-[#00C805] text-gray-700 dark:border-gray-700 dark:hover:border-[#00C805] dark:text-gray-200"
                    >
                      <div className="flex items-center px-5">
                        <Eye className="h-4 w-4 flex-shrink-0" />
                        <span className="ml-4">View Details</span>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/dashboard/create">
                    <Button 
                      size="sm" 
                      className="h-11 rounded-full bg-[#00C805] hover:bg-[#00B305] text-white shadow-none"
                    >
                      <div className="flex items-center px-5">
                        <PenLine className="h-4 w-4 flex-shrink-0" />
                        <span className="ml-4">Update Statement</span>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Gross Revenue Card */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#00C805]/30 dark:hover:border-[#00C805]/30 hover:shadow-lg transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase">GROSS REVENUE</p>
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-medium text-gray-900 dark:text-white">
                          {latestStatement.statement_data.income.grossRevenue.formatted}
                        </p>
                      </div>
                      <div className="bg-[#00C805]/5 p-3 rounded-xl">
                        <TrendingUp className="h-5 w-5 text-[#00C805]" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Net Revenue Card */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#00C805]/30 dark:hover:border-[#00C805]/30 hover:shadow-lg transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase">NET REVENUE</p>
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-medium text-gray-900 dark:text-white">
                          {latestStatement.statement_data.netRevenue.formatted}
                        </p>
                      </div>
                      <div className="bg-[#00C805]/5 p-3 rounded-xl">
                        <BarChart3 className="h-5 w-5 text-[#00C805]" />
                      </div>
                    </div>
                  </div>

                  {/* Operating Margin Card */}
                  {latestStatement.statement_data.costToEarn && latestStatement.statement_data.costToEarn.totalC2E.value > 0 && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#00C805]/30 dark:hover:border-[#00C805]/30 hover:shadow-lg transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase">OPERATING MARGIN</p>
                            <Info className="h-3.5 w-3.5 text-gray-400" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-2xl font-medium text-gray-900 dark:text-white">
                              {(() => {
                                const netRevenue = latestStatement.statement_data.netRevenue.value;
                                const totalC2E = latestStatement.statement_data.costToEarn.totalC2E.value;
                                const operatingMargin = netRevenue - totalC2E;
                                return new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 2
                                }).format(operatingMargin);
                              })()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                              After Cost to Earn
                              <Badge variant="outline" className="font-normal bg-[#00C805]/5 text-[#00C805] border-[#00C805]/20">
                                {latestStatement.statement_data.costToEarn.percentOfIncome}
                              </Badge>
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#00C805]/5 p-3 rounded-xl">
                          <TrendingUp className="h-5 w-5 text-[#00C805]" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Net Household Profit Card */}
                  <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border hover:shadow-lg transition-all duration-200 ${
                    latestStatement.statement_data.finalNetIncome.value >= 0 
                      ? 'border-[#00C805]/20 hover:border-[#00C805]/40' 
                      : 'border-red-200 hover:border-red-300'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                            NET HOUSEHOLD PROFIT
                          </p>
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <p className={`text-2xl font-medium ${
                          latestStatement.statement_data.finalNetIncome.value >= 0 
                            ? 'text-[#00C805]' 
                            : 'text-red-500'
                        }`}>
                          {latestStatement.statement_data.finalNetIncome.formatted}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${
                        latestStatement.statement_data.finalNetIncome.value >= 0 
                          ? 'bg-[#00C805]/5' 
                          : 'bg-red-50 dark:bg-red-500/10'
                      }`}>
                        <PieChart className={`h-5 w-5 ${
                          latestStatement.statement_data.finalNetIncome.value >= 0 
                            ? 'text-[#00C805]' 
                            : 'text-red-500'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Insights Section */}
                {latestStatement.statement_data.insights && latestStatement.statement_data.insights.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase">LATEST INSIGHTS</p>
                        <Badge variant="outline" className="font-normal bg-[#00C805]/5 text-[#00C805] border-[#00C805]/20">
                          {latestStatement.statement_data.insights.length} Total
                        </Badge>
                      </div>
                      <div className="grid gap-6">
                        {latestStatement.statement_data.insights.slice(0, 3).map((insight, index) => (
                          <div 
                            key={index}
                            className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#00C805]/30 dark:hover:border-[#00C805]/30 transition-all duration-200"
                          >
                            <div className="flex gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-[#00C805]/5 flex items-center justify-center">
                                  <Info className="h-5 w-5 text-[#00C805]" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                                {insight}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
          
          {/* Action cards */}
          {hasStatements && (
            <section aria-label="Dashboard Actions" className="pt-12 border-t border-gray-100 dark:border-gray-800">
              <div className="max-w-4xl">
                <Card className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-[#00C805]/30 dark:hover:border-[#00C805]/30 hover:shadow-lg transition-all duration-200">
                  <div className="p-6 space-y-6">
                    <div className="flex flex-row items-start gap-4">
                      <div className="flex-shrink-0 p-3 rounded-xl bg-[#00C805]/5 text-[#00C805]" aria-hidden="true">
                        <PenLine className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                          Update Statement
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          Keep your financial data current by updating your income and expenses.
                        </CardDescription>
                      </div>
                    </div>
                    <Link href="/dashboard/create" className="block w-full">
                      <Button 
                        className="w-full bg-[#00C805] hover:bg-[#00B305] text-white shadow-none h-11 px-6 rounded-full"
                      >
                        <span>Update Statement</span>
                        <ArrowRight className="ml-2.5 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
} 