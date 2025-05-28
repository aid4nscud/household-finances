import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase-server'
import { getIncomeStatementById } from '@/lib/db'
import SummaryItem from '@/components/summary/SummaryItem'
import InsightItem from '@/components/summary/InsightItem'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Helper function to format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Helper function to calculate percentage
function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

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
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white">
              Your Household Statement
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Created on {formatDate(statement.created_at)}
            </p>
          </div>
          <div className="flex mt-6 lg:mt-0 gap-3">
            <Button 
              asChild 
              variant="outline" 
              className="h-9 px-4 border-gray-200 hover:border-gray-300 hover:bg-transparent text-gray-700 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-200"
            >
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button 
              asChild 
              className="h-9 px-4 bg-[#00C805] hover:bg-[#00B305] text-white shadow-none"
            >
              <Link href={`/dashboard/create?edit=${statement.id}`}>Edit Statement</Link>
            </Button>
          </div>
        </div>

        {/* Income Section */}
        <div className="mb-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Income</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryItem
            title="Gross Revenue"
            value={incomeStatement.income.grossRevenue.formatted}
            subtitle="Total household income"
            type="income"
          />
          <SummaryItem
              title="Primary Income"
              value={incomeStatement.income.primaryIncome.formatted}
              subtitle="Main source of income"
              type="income"
            />
            {incomeStatement.income.secondaryIncome.value > 0 && (
              <SummaryItem
                title="Secondary Income"
                value={incomeStatement.income.secondaryIncome.formatted}
                subtitle="Additional income source"
                type="income"
              />
            )}
            {incomeStatement.income.investmentIncome.value > 0 && (
              <SummaryItem
                title="Investment Income"
                value={incomeStatement.income.investmentIncome.formatted}
                subtitle="Returns on investments"
            type="income"
          />
            )}
          </div>
        </div>

        {/* Pre-tax Deductions */}
        <div className="mb-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Pre-tax Deductions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryItem
              title="Total Deductions"
              value={incomeStatement.preTaxDeductions.totalPreTaxDeductions.formatted}
              subtitle="All pre-tax deductions"
              type="expense"
            />
            <SummaryItem
              title="Tax Withholdings"
              value={formatCurrency(
                Number(incomeStatement.preTaxDeductions.federalIncomeTax.value) +
                Number(incomeStatement.preTaxDeductions.stateIncomeTax.value) +
                Number(incomeStatement.preTaxDeductions.ficaTax.value)
              )}
              subtitle="Federal, state, and FICA"
              type="expense"
            />
            {incomeStatement.preTaxDeductions.retirementContributions.value > 0 && (
              <SummaryItem
                title="Retirement"
                value={incomeStatement.preTaxDeductions.retirementContributions.formatted}
                subtitle="Pre-tax retirement savings"
                type="savings"
              />
            )}
            {incomeStatement.preTaxDeductions.healthInsurancePremiums.value > 0 && (
              <SummaryItem
                title="Health Insurance"
                value={incomeStatement.preTaxDeductions.healthInsurancePremiums.formatted}
                subtitle="Insurance premiums"
                type="expense"
              />
            )}
          </div>
        </div>

        {/* Net Revenue & Cost to Earn */}
        <div className="mb-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Net Revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryItem
              title="Net Revenue"
              value={incomeStatement.netRevenue.formatted}
              subtitle="After pre-tax deductions"
              type="income"
              />
            {incomeStatement.costToEarn && incomeStatement.costToEarn.totalC2E.value > 0 && (
              <>
                <SummaryItem
                  title="Cost to Earn"
                  value={incomeStatement.costToEarn.totalC2E.formatted}
                  subtitle={`${incomeStatement.costToEarn.percentOfIncome} of net revenue`}
                  type="c2e"
                />
                <SummaryItem
                  title="Operating Margin"
                  value={formatCurrency(incomeStatement.netRevenue.value - incomeStatement.costToEarn.totalC2E.value)}
                  subtitle="After cost to earn"
                  type="income"
                />
              </>
            )}
          </div>
        </div>

        {/* Essential Needs */}
        <div className="mb-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Essential Needs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryItem
              title="Total Needs"
              value={incomeStatement.essentialNeeds.totalNeedsExpenses.formatted}
              subtitle={`${calculatePercentage(incomeStatement.essentialNeeds.totalNeedsExpenses.value, incomeStatement.netRevenue.value)}% of net revenue`}
              type="expense"
                />
            <SummaryItem
              title="Housing & Utilities"
              value={formatCurrency(
                Number(incomeStatement.essentialNeeds.housingExpenses.value) +
                Number(incomeStatement.essentialNeeds.utilities.value)
              )}
              subtitle="Shelter costs"
              type="expense"
            />
                <SummaryItem
              title="Food & Transportation"
              value={formatCurrency(
                Number(incomeStatement.essentialNeeds.foodGroceries.value) +
                Number(incomeStatement.essentialNeeds.transportation.value)
              )}
              subtitle="Basic necessities"
              type="expense"
            />
            <SummaryItem
              title="Healthcare & Insurance"
              value={formatCurrency(
                Number(incomeStatement.essentialNeeds.healthcare.value) +
                Number(incomeStatement.essentialNeeds.insurance.value)
              )}
              subtitle="Health & protection"
              type="expense"
            />
          </div>
        </div>

        {/* Savings & Investments */}
        <div className="mb-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Savings & Investments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryItem
              title="Total Savings"
              value={incomeStatement.savingsInvestments.totalSavingsInvestments.formatted}
              subtitle={`${calculatePercentage(incomeStatement.savingsInvestments.totalSavingsInvestments.value, incomeStatement.netRevenue.value)}% of net revenue`}
              type="savings"
            />
            <SummaryItem
              title="Short-term Savings"
              value={incomeStatement.savingsInvestments.shortTermSavings.formatted}
              subtitle="Emergency fund & goals"
              type="savings"
                />
            <SummaryItem
              title="Long-term Investments"
              value={incomeStatement.savingsInvestments.longTermInvestments.formatted}
              subtitle="Wealth building"
              type="savings"
            />
            {incomeStatement.savingsInvestments.retirementSavings.value > 0 && (
                <SummaryItem
                title="Additional Retirement"
                value={incomeStatement.savingsInvestments.retirementSavings.formatted}
                subtitle="Post-tax retirement"
                type="savings"
                />
              )}
          </div>
        </div>

        {/* Discretionary Expenses */}
        <div className="mb-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Discretionary Expenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryItem
              title="Total Wants"
              value={incomeStatement.discretionaryExpenses.totalWantsExpenses.formatted}
              subtitle={`${calculatePercentage(incomeStatement.discretionaryExpenses.totalWantsExpenses.value, incomeStatement.netRevenue.value)}% of net revenue`}
              type="expense"
                />
            <SummaryItem
              title="Entertainment & Dining"
              value={formatCurrency(
                Number(incomeStatement.discretionaryExpenses.entertainmentLeisure.value) +
                Number(incomeStatement.discretionaryExpenses.diningOut.value)
              )}
              subtitle="Leisure activities"
              type="expense"
            />
                <SummaryItem
              title="Shopping & Personal"
              value={formatCurrency(
                Number(incomeStatement.discretionaryExpenses.shoppingPersonal.value) +
                Number(incomeStatement.discretionaryExpenses.hobbiesRecreation.value)
              )}
              subtitle="Personal expenses"
              type="expense"
            />
            <SummaryItem
              title="Travel & Subscriptions"
              value={formatCurrency(
                Number(incomeStatement.discretionaryExpenses.travelVacations.value) +
                Number(incomeStatement.discretionaryExpenses.subscriptions.value)
              )}
              subtitle="Lifestyle choices"
              type="expense"
                />
          </div>
        </div>

        {/* Annual Expenses (Monthly Allocation) */}
        <div className="mb-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">
            Annual Expenses
            <span className="text-xs text-gray-400 dark:text-gray-500 normal-case ml-2">(Monthly Allocation)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryItem
              title="Total Annual"
              value={incomeStatement.annualExpenses.totalAnnualExpenses.formatted}
              subtitle="Monthly set aside"
              type="expense"
            />
          <SummaryItem
              title="Home & Vehicle"
              value={formatCurrency(
                Number(incomeStatement.annualExpenses.homeRepairs.value) +
                Number(incomeStatement.annualExpenses.vehicleMaintenance.value)
              )}
              subtitle="Maintenance fund"
            type="expense"
          />
          <SummaryItem
              title="Celebrations"
              value={formatCurrency(
                Number(incomeStatement.annualExpenses.holidayGifts.value) +
                Number(incomeStatement.annualExpenses.personalCelebrations.value) +
                Number(incomeStatement.annualExpenses.familyEvents.value)
              )}
              subtitle="Special occasions"
            type="expense"
          />
          <SummaryItem
              title="Professional Growth"
              value={formatCurrency(
                Number(incomeStatement.annualExpenses.professionalDevelopment.value) +
                Number(incomeStatement.annualExpenses.annualLicenses.value)
              )}
              subtitle="Career development"
              type="expense"
            />
          </div>
        </div>

        {/* Final Results */}
        <div className="mb-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Final Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryItem
              title="Gross Profit"
              value={incomeStatement.grossProfit.formatted}
              subtitle="Before discretionary"
              type={incomeStatement.grossProfit.value >= 0 ? "income" : "expense"}
            />
            <SummaryItem
              title="Net Profit"
              value={incomeStatement.netProfit.formatted}
              subtitle="After discretionary"
              type={incomeStatement.netProfit.value >= 0 ? "income" : "expense"}
          />
          <SummaryItem
            title="Final Net Income"
            value={incomeStatement.finalNetIncome.formatted}
            subtitle="Your household profit"
            type={incomeStatement.finalNetIncome.value >= 0 ? "income" : "expense"}
          />
          </div>
        </div>

        {/* 50/30/20 Rule Analysis */}
        <div className="mb-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">50/30/20 Rule Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Essential Needs (50%)</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Recommended:</span>
                  <span className="text-gray-900 dark:text-white">{incomeStatement.recommendations.needs.recommended}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Actual:</span>
                  <span className={incomeStatement.recommendations.needs.status === 'good' ? 'text-[#00C805]' : 'text-red-500'}>
                    {incomeStatement.recommendations.needs.actual}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Difference:</span>
                  <span className={incomeStatement.recommendations.needs.status === 'good' ? 'text-[#00C805]' : 'text-red-500'}>
                    {incomeStatement.recommendations.needs.difference}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Wants (30%)</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Recommended:</span>
                  <span className="text-gray-900 dark:text-white">{incomeStatement.recommendations.wants.recommended}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Actual:</span>
                  <span className={incomeStatement.recommendations.wants.status === 'good' ? 'text-[#00C805]' : 'text-red-500'}>
                    {incomeStatement.recommendations.wants.actual}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Difference:</span>
                  <span className={incomeStatement.recommendations.wants.status === 'good' ? 'text-[#00C805]' : 'text-red-500'}>
                    {incomeStatement.recommendations.wants.difference}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Savings (20%)</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Recommended:</span>
                  <span className="text-gray-900 dark:text-white">{incomeStatement.recommendations.savings.recommended}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Actual:</span>
                  <span className={incomeStatement.recommendations.savings.status === 'good' ? 'text-[#00C805]' : 'text-red-500'}>
                    {incomeStatement.recommendations.savings.actual}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Difference:</span>
                  <span className={incomeStatement.recommendations.savings.status === 'good' ? 'text-[#00C805]' : 'text-red-500'}>
                    {incomeStatement.recommendations.savings.difference}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Insights */}
        <div className="mt-12">
          <h2 className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Financial Insights</h2>
          <div className="space-y-3">
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