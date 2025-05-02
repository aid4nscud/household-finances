'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStatements } from '@/hooks/useStatements'
import DynamicForm from '@/components/form/DynamicForm'
import { NumericFormData } from '@/types/index'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { FormError } from '@/components/ui/form-error'
import { Badge, PenLine } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export function StatementFormContainer({ 
  initialEmail,
  existingStatement = null 
}: { 
  initialEmail: string;
  existingStatement?: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { createStatement, updateStatement } = useStatements()
  const { toast } = useToast()
  const [formError, setFormError] = useState<string | null>(null)
  
  const isEditMode = !!existingStatement

  const handleSubmit = async (formData: NumericFormData) => {
    console.log('StatementFormContainer received form submission', formData);
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // First verify authentication status
      const supabase = createClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error('Authentication error before statement submission:', sessionError);
        throw new Error('Authentication error: You must be logged in to submit a statement.');
      }
      
      // Delay to ensure the loading state is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate financial metrics
      const grossRevenue = calculateTotalIncome(formData)
      const totalPreTaxDeductions = calculateTotalDeductions(formData)
      const netRevenue = grossRevenue - totalPreTaxDeductions
      const totalNeedsExpenses = calculateTotalNeeds(formData)
      const totalSavingsInvestments = calculateTotalSavings(formData)
      const grossProfit = netRevenue - totalNeedsExpenses - totalSavingsInvestments
      const totalWantsExpenses = calculateTotalWants(formData)
      const netProfit = grossProfit - totalWantsExpenses
      const totalAnnualExpenses = calculateTotalAnnual(formData)
      const finalNetIncome = netProfit - totalAnnualExpenses
      
      console.log('Calculated financial metrics', { 
        grossRevenue,
        totalPreTaxDeductions,
        netRevenue,
        totalNeedsExpenses,
        totalSavingsInvestments
      });
      
      // Calculate recommended allocations (50/30/20 rule)
      // Prevent division by zero
      const needsRecommended = netRevenue > 0 ? netRevenue * 0.5 : 0
      const wantsRecommended = netRevenue > 0 ? netRevenue * 0.3 : 0
      const savingsRecommended = netRevenue > 0 ? netRevenue * 0.2 : 0
      
      const needsActual = totalNeedsExpenses
      const wantsActual = totalWantsExpenses
      const savingsActual = totalSavingsInvestments
      
      // Format currency values
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(value)
      }
      
      // Generate financial insights with safety checks
      const insights = generateInsights({
        formData,
        grossRevenue,
        netRevenue,
        totalNeedsExpenses,
        totalSavingsInvestments,
        totalWantsExpenses,
        finalNetIncome,
        needsRecommended,
        needsActual,
        wantsRecommended,
        wantsActual,
        savingsRecommended,
        savingsActual
      })
      
      // Prepare statement data
      const statementData = {
        income: {
          primaryIncome: { value: Number(formData.primaryIncome), formatted: formatCurrency(Number(formData.primaryIncome)) },
          secondaryIncome: { value: Number(formData.secondaryIncome), formatted: formatCurrency(Number(formData.secondaryIncome)) },
          investmentIncome: { value: Number(formData.investmentIncome), formatted: formatCurrency(Number(formData.investmentIncome)) },
          governmentBenefits: { value: Number(formData.governmentBenefits), formatted: formatCurrency(Number(formData.governmentBenefits)) },
          alimonyChildSupport: { value: Number(formData.alimonyChildSupport), formatted: formatCurrency(Number(formData.alimonyChildSupport)) },
          otherIncome: { value: Number(formData.otherIncome), formatted: formatCurrency(Number(formData.otherIncome)) },
          grossRevenue: { value: grossRevenue, formatted: formatCurrency(grossRevenue) }
        },
        preTaxDeductions: {
          federalIncomeTax: { value: Number(formData.federalIncomeTax), formatted: formatCurrency(Number(formData.federalIncomeTax)) },
          stateIncomeTax: { value: Number(formData.stateIncomeTax), formatted: formatCurrency(Number(formData.stateIncomeTax)) },
          ficaTax: { value: Number(formData.ficaTax), formatted: formatCurrency(Number(formData.ficaTax)) },
          retirementContributions: { value: Number(formData.retirementContributions), formatted: formatCurrency(Number(formData.retirementContributions)) },
          healthInsurancePremiums: { value: Number(formData.healthInsurancePremiums), formatted: formatCurrency(Number(formData.healthInsurancePremiums)) },
          hsaFsaContributions: { value: Number(formData.hsaFsaContributions), formatted: formatCurrency(Number(formData.hsaFsaContributions)) },
          unionDues: { value: Number(formData.unionDues), formatted: formatCurrency(Number(formData.unionDues)) },
          otherPayrollDeductions: { value: Number(formData.otherPayrollDeductions), formatted: formatCurrency(Number(formData.otherPayrollDeductions)) },
          totalPreTaxDeductions: { value: totalPreTaxDeductions, formatted: formatCurrency(totalPreTaxDeductions) }
        },
        netRevenue: { value: netRevenue, formatted: formatCurrency(netRevenue) },
        essentialNeeds: {
          housingExpenses: { value: Number(formData.housingExpenses), formatted: formatCurrency(Number(formData.housingExpenses)) },
          utilities: { value: Number(formData.utilities), formatted: formatCurrency(Number(formData.utilities)) },
          foodGroceries: { value: Number(formData.foodGroceries), formatted: formatCurrency(Number(formData.foodGroceries)) },
          transportation: { value: Number(formData.transportation), formatted: formatCurrency(Number(formData.transportation)) },
          healthcare: { value: Number(formData.healthcare), formatted: formatCurrency(Number(formData.healthcare)) },
          childcareEducation: { value: Number(formData.childcareEducation), formatted: formatCurrency(Number(formData.childcareEducation)) },
          insurance: { value: Number(formData.insurance), formatted: formatCurrency(Number(formData.insurance)) },
          debtPayments: { value: Number(formData.debtPayments), formatted: formatCurrency(Number(formData.debtPayments)) },
          personalCareMedical: { value: Number(formData.personalCareMedical), formatted: formatCurrency(Number(formData.personalCareMedical)) },
          totalNeedsExpenses: { value: totalNeedsExpenses, formatted: formatCurrency(totalNeedsExpenses) }
        },
        savingsInvestments: {
          shortTermSavings: { value: Number(formData.shortTermSavings), formatted: formatCurrency(Number(formData.shortTermSavings)) },
          longTermInvestments: { value: Number(formData.longTermInvestments), formatted: formatCurrency(Number(formData.longTermInvestments)) },
          educationSavings: { value: Number(formData.educationSavings), formatted: formatCurrency(Number(formData.educationSavings)) },
          charitableGiving: { value: Number(formData.charitableGiving), formatted: formatCurrency(Number(formData.charitableGiving)) },
          retirementSavings: { value: Number(formData.retirementSavings), formatted: formatCurrency(Number(formData.retirementSavings)) },
          totalSavingsInvestments: { value: totalSavingsInvestments, formatted: formatCurrency(totalSavingsInvestments) }
        },
        grossProfit: { value: grossProfit, formatted: formatCurrency(grossProfit) },
        discretionaryExpenses: {
          entertainmentLeisure: { value: Number(formData.entertainmentLeisure), formatted: formatCurrency(Number(formData.entertainmentLeisure)) },
          diningOut: { value: Number(formData.diningOut), formatted: formatCurrency(Number(formData.diningOut)) },
          shoppingPersonal: { value: Number(formData.shoppingPersonal), formatted: formatCurrency(Number(formData.shoppingPersonal)) },
          fitnessWellness: { value: Number(formData.fitnessWellness), formatted: formatCurrency(Number(formData.fitnessWellness)) },
          travelVacations: { value: Number(formData.travelVacations), formatted: formatCurrency(Number(formData.travelVacations)) },
          subscriptions: { value: Number(formData.subscriptions), formatted: formatCurrency(Number(formData.subscriptions)) },
          hobbiesRecreation: { value: Number(formData.hobbiesRecreation), formatted: formatCurrency(Number(formData.hobbiesRecreation)) },
          giftsSupport: { value: Number(formData.giftsSupport), formatted: formatCurrency(Number(formData.giftsSupport)) },
          totalWantsExpenses: { value: totalWantsExpenses, formatted: formatCurrency(totalWantsExpenses) }
        },
        netProfit: { value: netProfit, formatted: formatCurrency(netProfit) },
        annualExpenses: {
          annualLicenses: { value: Number(formData.annualLicenses), formatted: formatCurrency(Number(formData.annualLicenses)) },
          homeRepairs: { value: Number(formData.homeRepairs), formatted: formatCurrency(Number(formData.homeRepairs)) },
          holidayGifts: { value: Number(formData.holidayGifts), formatted: formatCurrency(Number(formData.holidayGifts)) },
          personalCelebrations: { value: Number(formData.personalCelebrations), formatted: formatCurrency(Number(formData.personalCelebrations)) },
          familyEvents: { value: Number(formData.familyEvents), formatted: formatCurrency(Number(formData.familyEvents)) },
          vehicleMaintenance: { value: Number(formData.vehicleMaintenance), formatted: formatCurrency(Number(formData.vehicleMaintenance)) },
          professionalDevelopment: { value: Number(formData.professionalDevelopment), formatted: formatCurrency(Number(formData.professionalDevelopment)) },
          totalAnnualExpenses: { value: totalAnnualExpenses, formatted: formatCurrency(Number(totalAnnualExpenses)) }
        },
        finalNetIncome: { value: finalNetIncome, formatted: formatCurrency(finalNetIncome) },
        recommendations: {
          needs: {
            recommended: formatCurrency(needsRecommended),
            actual: formatCurrency(needsActual),
            difference: formatCurrency(needsRecommended - needsActual),
            status: needsActual <= needsRecommended ? 'good' : 'high'
          },
          wants: {
            recommended: formatCurrency(wantsRecommended),
            actual: formatCurrency(wantsActual),
            difference: formatCurrency(wantsRecommended - wantsActual),
            status: wantsActual <= wantsRecommended ? 'good' : 'high'
          },
          savings: {
            recommended: formatCurrency(savingsRecommended),
            actual: formatCurrency(savingsActual),
            difference: formatCurrency(savingsRecommended - savingsActual),
            status: savingsActual >= savingsRecommended ? 'good' : 'low'
          }
        },
        valueChainOpportunities: identifyValueChainOpportunities(formData),
        insights
      }
      
      let statementId;
      
      // Use the appropriate method based on whether we're editing or creating
      if (isEditMode && existingStatement) {
        statementId = await updateStatement(existingStatement.id, statementData);
      } else {
        statementId = await createStatement(statementData);
      }
      
      if (statementId) {
        // Short delay to allow toast to display before redirect
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/dashboard/statement/${statementId}`)
      }
    } catch (error) {
      console.error('Error with statement:', error)
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred. Please try again.';
      
      setFormError(errorMessage);
      
      toast({
        title: "Error",
        description: `There was a problem ${isEditMode ? 'updating' : 'creating'} your income statement. Please try again.`,
        variant: "destructive",
        duration: 7000, // Show error longer
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const retrySubmission = () => {
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Extract existing form data from the statement if in edit mode
  const extractInitialFormData = () => {
    if (!existingStatement || !existingStatement.statement_data) return null;
    
    const sd = existingStatement.statement_data;
    
    return {
      // Income
      primaryIncome: sd.income.primaryIncome.value.toString(),
      secondaryIncome: sd.income.secondaryIncome.value.toString(),
      investmentIncome: sd.income.investmentIncome.value.toString(),
      governmentBenefits: sd.income.governmentBenefits.value.toString(),
      alimonyChildSupport: sd.income.alimonyChildSupport.value.toString(),
      otherIncome: sd.income.otherIncome.value.toString(),
      
      // Pre-Tax Deductions
      federalIncomeTax: sd.preTaxDeductions.federalIncomeTax.value.toString(),
      stateIncomeTax: sd.preTaxDeductions.stateIncomeTax.value.toString(),
      ficaTax: sd.preTaxDeductions.ficaTax.value.toString(),
      retirementContributions: sd.preTaxDeductions.retirementContributions.value.toString(),
      healthInsurancePremiums: sd.preTaxDeductions.healthInsurancePremiums.value.toString(),
      hsaFsaContributions: sd.preTaxDeductions.hsaFsaContributions.value.toString(),
      unionDues: sd.preTaxDeductions.unionDues.value.toString(),
      otherPayrollDeductions: sd.preTaxDeductions.otherPayrollDeductions.value.toString(),
      
      // Essential Needs
      housingExpenses: sd.essentialNeeds.housingExpenses.value.toString(),
      utilities: sd.essentialNeeds.utilities.value.toString(),
      foodGroceries: sd.essentialNeeds.foodGroceries.value.toString(),
      transportation: sd.essentialNeeds.transportation.value.toString(),
      healthcare: sd.essentialNeeds.healthcare.value.toString(),
      childcareEducation: sd.essentialNeeds.childcareEducation.value.toString(),
      insurance: sd.essentialNeeds.insurance.value.toString(),
      debtPayments: sd.essentialNeeds.debtPayments?.value.toString() || "0",
      personalCareMedical: sd.essentialNeeds.personalCareMedical?.value.toString() || "0",
      
      // Savings & Investments
      shortTermSavings: sd.savingsInvestments.shortTermSavings.value.toString(),
      longTermInvestments: sd.savingsInvestments.longTermInvestments.value.toString(),
      educationSavings: sd.savingsInvestments.educationSavings.value.toString(),
      charitableGiving: sd.savingsInvestments.charitableGiving.value.toString(),
      retirementSavings: sd.savingsInvestments.retirementSavings?.value.toString() || "0",
      
      // Discretionary Expenses
      entertainmentLeisure: sd.discretionaryExpenses.entertainmentLeisure.value.toString(),
      diningOut: sd.discretionaryExpenses.diningOut.value.toString(),
      shoppingPersonal: sd.discretionaryExpenses.shoppingPersonal.value.toString(),
      fitnessWellness: sd.discretionaryExpenses.fitnessWellness.value.toString(),
      travelVacations: sd.discretionaryExpenses.travelVacations.value.toString(),
      subscriptions: sd.discretionaryExpenses.subscriptions?.value.toString() || "0",
      hobbiesRecreation: sd.discretionaryExpenses.hobbiesRecreation?.value.toString() || "0",
      giftsSupport: sd.discretionaryExpenses.giftsSupport?.value.toString() || "0",
      
      // Annual Expenses
      annualLicenses: sd.annualExpenses.annualLicenses.value.toString(),
      homeRepairs: sd.annualExpenses.homeRepairs.value.toString(),
      holidayGifts: sd.annualExpenses.holidayGifts.value.toString(),
      personalCelebrations: sd.annualExpenses.personalCelebrations.value.toString(),
      familyEvents: sd.annualExpenses.familyEvents.value.toString(),
      vehicleMaintenance: sd.annualExpenses.vehicleMaintenance?.value.toString() || "0",
      professionalDevelopment: sd.annualExpenses.professionalDevelopment?.value.toString() || "0",
      
      // Fields that might not be in the form but needed for proper handling
      name: 'Household Finance User',
      email: initialEmail
    };
  };
  
  const initialFormData = extractInitialFormData();
  
  return (
    <div className="py-8 animate-fadeIn">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {isEditMode ? 'Update' : 'Create'} Your Household Income Statement
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mt-3">
              Track your household profit margin and align spending with your values, just like a CEO would with a business.
            </p>
          </div>
          
          {isEditMode && (
            <div className="mt-4 md:mt-0">
              <Badge className="px-3 py-1 text-sm flex items-center gap-1.5 bg-primary/5 border-primary/20">
                <PenLine className="h-3.5 w-3.5 text-primary" />
                <span>Editing Statement</span>
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {formError && (
        <FormError error={formError} retry={retrySubmission} />
      )}
      
      <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-muted/30">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 md:p-8 md:w-1/3">
              <h3 className="text-lg font-medium mb-3">Why This Matters</h3>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Profit-First Approach:</strong> Measure your household's financial health through a profit margin, not just savings.
                </p>
                <p>
                  <strong>Value Alignment:</strong> Connect your spending habits to your core values and what truly matters to you.
                </p>
                <p>
                  <strong>Actionable Insights:</strong> Get personalized recommendations to optimize your finances like a real business CEO.
                </p>
                <p>
                  <strong>Financial Resilience:</strong> Build a stronger financial foundation with business-level clarity.
                </p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 md:w-2/3">
              <DynamicForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                initialEmail={initialEmail}
                initialData={initialFormData}
                isEditMode={isEditMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Calculation helper functions
function calculateTotalIncome(data: NumericFormData): number {
  return (
    Number(data.primaryIncome) +
    Number(data.secondaryIncome) +
    Number(data.investmentIncome) +
    Number(data.governmentBenefits) +
    Number(data.alimonyChildSupport) +
    Number(data.otherIncome)
  )
}

function calculateTotalDeductions(data: NumericFormData): number {
  return (
    Number(data.federalIncomeTax) +
    Number(data.stateIncomeTax) +
    Number(data.ficaTax) +
    Number(data.retirementContributions) +
    Number(data.healthInsurancePremiums) +
    Number(data.hsaFsaContributions) +
    Number(data.unionDues) +
    Number(data.otherPayrollDeductions)
  )
}

function calculateTotalNeeds(data: NumericFormData): number {
  return (
    Number(data.housingExpenses) +
    Number(data.utilities) +
    Number(data.foodGroceries) +
    Number(data.transportation) +
    Number(data.healthcare) +
    Number(data.childcareEducation) +
    Number(data.insurance) +
    Number(data.debtPayments) +
    Number(data.personalCareMedical)
  )
}

function calculateTotalSavings(data: NumericFormData): number {
  return (
    Number(data.shortTermSavings) +
    Number(data.longTermInvestments) +
    Number(data.educationSavings) +
    Number(data.charitableGiving) +
    Number(data.retirementSavings)
  )
}

function calculateTotalWants(data: NumericFormData): number {
  return (
    Number(data.entertainmentLeisure) +
    Number(data.diningOut) +
    Number(data.shoppingPersonal) +
    Number(data.fitnessWellness) +
    Number(data.travelVacations) +
    Number(data.subscriptions) +
    Number(data.hobbiesRecreation) +
    Number(data.giftsSupport)
  )
}

function calculateTotalAnnual(data: NumericFormData): number {
  return (
    Number(data.annualLicenses) +
    Number(data.homeRepairs) +
    Number(data.holidayGifts) +
    Number(data.personalCelebrations) +
    Number(data.familyEvents) +
    Number(data.vehicleMaintenance) +
    Number(data.professionalDevelopment)
  )
}

function generateInsights(params: any): string[] {
  const insights: string[] = []
  
  // Safety check for division by zero
  if (params.grossRevenue === 0) {
    insights.push("Please enter your income details to generate personalized insights.")
    return insights
  }
  
  // Profit-focused insights
  if (params.finalNetIncome < 0) {
    insights.push("Your household is operating at a deficit. Focus on increasing revenue or reducing expenses to achieve profitability.")
  } else {
    const profitMargin = (params.finalNetIncome / params.grossRevenue) * 100
    if (profitMargin < 10) {
      insights.push(`Your household profit margin is ${profitMargin.toFixed(1)}%. Aim for at least 10-20% for long-term financial resilience.`)
    } else {
      insights.push(`Your household profit margin is a healthy ${profitMargin.toFixed(1)}%. This gives you flexibility for future financial goals.`)
    }
  }
  
  // Safety check for netRevenue before calculating percentages
  if (params.netRevenue <= 0) {
    insights.push("Your net revenue is zero or negative. Review your income and pre-tax deductions to ensure accuracy.")
    return insights
  }
  
  // 50/30/20 rule insights
  const needsPercentage = (params.needsActual / params.netRevenue) * 100
  const wantsPercentage = (params.wantsActual / params.netRevenue) * 100
  const savingsPercentage = (params.savingsActual / params.netRevenue) * 100
  
  if (needsPercentage > 50) {
    insights.push(`Essential needs make up ${needsPercentage.toFixed(1)}% of your net income, above the recommended 50%. Consider areas where you can reduce fixed costs.`)
  }
  
  if (wantsPercentage > 30) {
    insights.push(`Discretionary spending accounts for ${wantsPercentage.toFixed(1)}% of your net income, above the recommended 30%. This could be an area to trim expenses.`)
  }
  
  if (savingsPercentage < 20) {
    insights.push(`Your savings rate is ${savingsPercentage.toFixed(1)}%, below the recommended 20%. Increasing this will strengthen your financial position.`)
  } else {
    insights.push(`Your savings rate of ${savingsPercentage.toFixed(1)}% exceeds the recommended 20%. You're effectively investing in future growth.`)
  }
  
  // Only add these insights if housing expenses are present
  if (params.formData.housingExpenses && params.formData.housingExpenses > 0) {
    // Housing insights
    const housingPercentage = (Number(params.formData.housingExpenses) / params.netRevenue) * 100
    if (housingPercentage > 30) {
      insights.push(`Housing costs represent ${housingPercentage.toFixed(1)}% of your net income, above the recommended 30%. This may limit flexibility in other areas.`)
    }
  }
  
  // Only add these insights if debt payments are present
  if (params.formData.debtPayments && params.formData.debtPayments > 0) {
    // Debt insights
    const debtPercentage = (Number(params.formData.debtPayments) / params.netRevenue) * 100
    if (debtPercentage > 15) {
      insights.push(`Debt payments consume ${debtPercentage.toFixed(1)}% of your net income. Prioritizing debt reduction could increase your profit margin.`)
    }
  }
  
  // Add value-focused insight
  insights.push("Consider mapping your expenses to your core values. Are you investing adequately in what matters most to you?")
  
  return insights
}

function identifyValueChainOpportunities(data: NumericFormData): any {
  // Core value categories often mentioned by users
  const valueCategories = [
    {
      name: "Security & Peace of Mind",
      spending: Number(data.shortTermSavings) + Number(data.insurance) + Number(data.healthInsurancePremiums) + Number(data.homeRepairs),
      recommendations: [
        "Emergency funds provide security against unexpected events",
        "Adequate insurance protects what you value most"
      ]
    },
    {
      name: "Family & Relationships",
      spending: Number(data.childcareEducation) + Number(data.giftsSupport) + Number(data.familyEvents) + Number(data.holidayGifts),
      recommendations: [
        "Investing in family experiences creates lasting memories",
        "Supporting family education provides long-term benefits"
      ]
    },
    {
      name: "Health & Wellbeing",
      spending: Number(data.healthcare) + Number(data.fitnessWellness) + Number(data.personalCareMedical) + Number(data.foodGroceries),
      recommendations: [
        "Preventative health spending reduces long-term costs",
        "Wellness investments improve quality of life"
      ]
    },
    {
      name: "Growth & Freedom",
      spending: Number(data.travelVacations) + Number(data.professionalDevelopment) + Number(data.educationSavings) + Number(data.hobbiesRecreation),
      recommendations: [
        "Personal development creates future earning potential",
        "New experiences broaden perspectives"
      ]
    },
    {
      name: "Legacy & Impact",
      spending: Number(data.charitableGiving) + Number(data.longTermInvestments) + Number(data.retirementSavings),
      recommendations: [
        "Charitable giving aligns spending with personal values",
        "Long-term investments build generational impact"
      ]
    }
  ]
  
  return valueCategories
} 