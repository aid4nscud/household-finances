'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStatements } from '@/hooks/useStatements'
import DynamicForm from '@/components/form/DynamicForm'
import { NumericFormData } from '@/types/index'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { FormError } from '@/components/ui/form-error'
import { Badge, PenLine } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/components/auth/auth-provider'

export function StatementFormContainer({ 
  initialEmail,
  existingStatement = null 
}: { 
  initialEmail: string;
  existingStatement?: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { createStatement, updateStatement } = useStatements()
  const { toast } = useToast()
  const [formError, setFormError] = useState<string | null>(null)
  const { session: authSession, user: authUser } = useAuth()
  const supabase = createClient()
  
  const isEditMode = !!existingStatement

  // Add useEffect to handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If not mounted yet, return a simple loading state that matches server-side render
  if (!isMounted) {
    return (
      <div className="py-8 animate-fadeIn">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Loading...
          </h1>
        </div>
      </div>
    )
  }

  const handleSubmit = async (formData: NumericFormData) => {
    console.log('StatementFormContainer received form submission', formData);
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // First, retrieve the current session state
      let currentUser = authUser;
      let currentSession = authSession;
      
      // Verify authentication status via the AuthProvider context
      if (!currentSession || !currentUser) {
        console.log('No authenticated user found in initial check, attempting to refresh session');
        
        // Try to refresh the session proactively - this is essential for form submissions
        try {
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            console.log('Successfully refreshed session for user:', session.user.email);
            currentSession = session;
            currentUser = session.user;
          } else {
            throw new Error('Session refresh failed');
          }
        } catch (refreshError) {
          console.error('Authentication failed after refresh attempt:', refreshError);
          
          // Show a user-friendly error message
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please sign in again to continue.",
            variant: "destructive",
            duration: 5000,
          });
          
          // Short delay before redirect
          await new Promise(resolve => setTimeout(resolve, 1500));
          router.push('/sign-in');
          
          throw new Error('Authentication error: You must be logged in to submit a statement.');
        }
      } else {
        console.log('Using existing authenticated session for user:', currentUser.email);
      }
      
      // At this point we should have a valid session
      if (!currentSession) {
        throw new Error('Unable to establish a valid authentication session');
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
      
      // Calculate Cost to Earn expenses
      let costToEarnExpenses: Record<string, number> = {
        housingC2E: 0,
        utilitiesC2E: 0,
        transportationC2E: 0,
        childcareC2E: 0,
        professionalDevC2E: 0,
        licensesC2E: 0,
        internetC2E: 0,
        otherC2E: 0
      };
      
      // Get C2E settings from form data
      const c2eSettings: any = formData.costToEarnSettings || {};
      
      // Calculate C2E amounts based on expense type and percentage
      // Housing expenses
      if (c2eSettings.housingExpenses?.isC2E) {
        const percentage = c2eSettings.housingExpenses.percentage || 100;
        costToEarnExpenses.housingC2E = Number(formData.housingExpenses) * (percentage / 100);
      }
      
      // Utilities
      if (c2eSettings.utilities?.isC2E) {
        const percentage = c2eSettings.utilities.percentage || 100;
        costToEarnExpenses.utilitiesC2E = Number(formData.utilities) * (percentage / 100);
      }
      
      // Transportation
      if (c2eSettings.transportation?.isC2E) {
        const percentage = c2eSettings.transportation.percentage || 100;
        costToEarnExpenses.transportationC2E = Number(formData.transportation) * (percentage / 100);
      }
      
      // Childcare
      if (c2eSettings.childcareEducation?.isC2E) {
        const percentage = c2eSettings.childcareEducation.percentage || 100;
        costToEarnExpenses.childcareC2E = Number(formData.childcareEducation) * (percentage / 100);
      }
      
      // Professional Development
      if (c2eSettings.professionalDevelopment?.isC2E) {
        const percentage = c2eSettings.professionalDevelopment.percentage || 100;
        costToEarnExpenses.professionalDevC2E = Number(formData.professionalDevelopment) * (percentage / 100);
      }
      
      // Annual Licenses
      if (c2eSettings.annualLicenses?.isC2E) {
        const percentage = c2eSettings.annualLicenses.percentage || 100;
        costToEarnExpenses.licensesC2E = Number(formData.annualLicenses) * (percentage / 100);
      }
      
      // Add dedicated C2E categories from CostToEarnStep
      const commutingTransportation = Number(formData.commutingTransportation || 0);
      const workTechnology = Number(formData.workTechnology || 0);
      const dependentCare = Number(formData.dependentCare || 0);
      const workShelterUtilities = Number(formData.workShelterUtilities || 0);
      const workAttire = Number(formData.workAttire || 0);
      const workMeals = Number(formData.workMeals || 0);
      const licensingEducation = Number(formData.licensingEducation || 0);
      const workHealthWellness = Number(formData.workHealthWellness || 0);
      const workDebtObligations = Number(formData.workDebtObligations || 0);
      
      // Add these to the total C2E (these are already full C2E amounts, not percentages)
      const totalDedicatedC2E = commutingTransportation + workTechnology + dependentCare + 
                               workShelterUtilities + workAttire + workMeals + 
                               licensingEducation + workHealthWellness + workDebtObligations;
      
      // Calculate total C2E expenses (percentage-based + dedicated)
      const totalPercentageBasedC2E = Object.values(costToEarnExpenses).reduce((sum, value) => sum + value, 0);
      const totalC2E = totalPercentageBasedC2E + totalDedicatedC2E;
      
      // Calculate the adjusted gross profit (after C2E)
      const adjustedNetRevenue = netRevenue - totalC2E;
      
      // Calculate financial metrics
      const grossProfitAfterC2E = adjustedNetRevenue - totalNeedsExpenses - totalSavingsInvestments
      const netProfitAfterC2E = grossProfitAfterC2E - totalWantsExpenses
      const finalNetIncomeAfterC2E = netProfitAfterC2E - totalAnnualExpenses
      
      console.log('Calculated financial metrics', { 
        adjustedNetRevenue,
        grossProfitAfterC2E,
        netProfitAfterC2E,
        finalNetIncomeAfterC2E
      });
      
      // Calculate recommended allocations (50/30/20 rule)
      // Prevent division by zero
      const needsRecommendedAfterC2E = adjustedNetRevenue > 0 ? adjustedNetRevenue * 0.5 : 0
      const wantsRecommendedAfterC2E = adjustedNetRevenue > 0 ? adjustedNetRevenue * 0.3 : 0
      const savingsRecommendedAfterC2E = adjustedNetRevenue > 0 ? adjustedNetRevenue * 0.2 : 0
      
      const needsActualAfterC2E = totalNeedsExpenses
      const wantsActualAfterC2E = totalWantsExpenses
      const savingsActualAfterC2E = totalSavingsInvestments
      
      // Generate financial insights with safety checks
      const insightsAfterC2E = generateInsights({
        formData,
        adjustedNetRevenue,
        grossProfitAfterC2E,
        netProfitAfterC2E,
        finalNetIncomeAfterC2E,
        needsRecommendedAfterC2E,
        needsActualAfterC2E,
        wantsRecommendedAfterC2E,
        wantsActualAfterC2E,
        savingsRecommendedAfterC2E,
        savingsActualAfterC2E
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
        costToEarn: {
          housingC2E: { value: costToEarnExpenses.housingC2E, formatted: formatCurrency(costToEarnExpenses.housingC2E) },
          utilitiesC2E: { value: costToEarnExpenses.utilitiesC2E, formatted: formatCurrency(costToEarnExpenses.utilitiesC2E) },
          transportationC2E: { value: costToEarnExpenses.transportationC2E, formatted: formatCurrency(costToEarnExpenses.transportationC2E) },
          childcareC2E: { value: costToEarnExpenses.childcareC2E, formatted: formatCurrency(costToEarnExpenses.childcareC2E) },
          professionalDevC2E: { value: costToEarnExpenses.professionalDevC2E, formatted: formatCurrency(costToEarnExpenses.professionalDevC2E) },
          licensesC2E: { value: costToEarnExpenses.licensesC2E, formatted: formatCurrency(costToEarnExpenses.licensesC2E) },
          internetC2E: { value: costToEarnExpenses.internetC2E, formatted: formatCurrency(costToEarnExpenses.internetC2E) },
          otherC2E: { value: costToEarnExpenses.otherC2E, formatted: formatCurrency(costToEarnExpenses.otherC2E) },
          
          // Add dedicated C2E categories
          commutingTransportation: { value: commutingTransportation, formatted: formatCurrency(commutingTransportation) },
          workTechnology: { value: workTechnology, formatted: formatCurrency(workTechnology) },
          dependentCare: { value: dependentCare, formatted: formatCurrency(dependentCare) },
          workShelterUtilities: { value: workShelterUtilities, formatted: formatCurrency(workShelterUtilities) },
          workAttire: { value: workAttire, formatted: formatCurrency(workAttire) },
          workMeals: { value: workMeals, formatted: formatCurrency(workMeals) },
          licensingEducation: { value: licensingEducation, formatted: formatCurrency(licensingEducation) },
          workHealthWellness: { value: workHealthWellness, formatted: formatCurrency(workHealthWellness) },
          workDebtObligations: { value: workDebtObligations, formatted: formatCurrency(workDebtObligations) },
          
          totalC2E: { value: totalC2E, formatted: formatCurrency(totalC2E) },
          percentOfIncome: (totalC2E / netRevenue * 100).toFixed(1) + '%'
        },
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
        insights: [...insights, ...insightsAfterC2E]
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
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isEditMode ? 'Update' : 'Create'} Your Household Income Statement
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mt-3">
              Track your household profit margin just like a CEO would with a business.
            </p>
          </div>
          
          {isEditMode && isMounted && (
            <div className="mt-4 md:mt-0">
              <Badge className="px-3 py-1 text-sm flex items-center gap-1.5 bg-[#00C805]/10 border-[#00C805]/20 text-[#00C805]">
                <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Editing Statement</span>
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {formError && (
        <FormError error={formError} retry={retrySubmission} />
      )}
      
      <Card className="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border-gray-100 dark:border-gray-800">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 md:w-1/3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Why This Matters</h3>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <strong className="text-gray-900 dark:text-white">Profit-First Approach:</strong> Measure your household's financial health through a profit margin, not just savings.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">Actionable Insights:</strong> Get personalized recommendations to optimize your finances like a real business CEO.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">Financial Resilience:</strong> Build a stronger financial foundation with business-level clarity.
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
  // Ensure all values are non-negative
  const values = [
    data.primaryIncome,
    data.secondaryIncome,
    data.investmentIncome,
    data.governmentBenefits,
    data.alimonyChildSupport,
    data.otherIncome
  ].map(val => Math.max(0, Number(val) || 0));

  return roundToTwo(values.reduce((sum, val) => sum + val, 0));
}

function calculateTotalDeductions(data: NumericFormData): number {
  // Ensure all values are non-negative
  const values = [
    data.federalIncomeTax,
    data.stateIncomeTax,
    data.ficaTax,
    data.retirementContributions,
    data.healthInsurancePremiums,
    data.hsaFsaContributions,
    data.unionDues,
    data.otherPayrollDeductions
  ].map(val => Math.max(0, Number(val) || 0));

  return roundToTwo(values.reduce((sum, val) => sum + val, 0));
}

function calculateTotalNeeds(data: NumericFormData): number {
  // Ensure all values are non-negative
  const values = [
    data.housingExpenses,
    data.utilities,
    data.foodGroceries,
    data.transportation,
    data.healthcare,
    data.childcareEducation,
    data.insurance,
    data.debtPayments,
    data.personalCareMedical
  ].map(val => Math.max(0, Number(val) || 0));

  return roundToTwo(values.reduce((sum, val) => sum + val, 0));
}

function calculateTotalSavings(data: NumericFormData): number {
  // Ensure all values are non-negative
  const values = [
    data.shortTermSavings,
    data.longTermInvestments,
    data.educationSavings,
    data.charitableGiving,
    data.retirementSavings
  ].map(val => Math.max(0, Number(val) || 0));

  return roundToTwo(values.reduce((sum, val) => sum + val, 0));
}

function calculateTotalWants(data: NumericFormData): number {
  // Ensure all values are non-negative
  const values = [
    data.entertainmentLeisure,
    data.diningOut,
    data.shoppingPersonal,
    data.fitnessWellness,
    data.travelVacations,
    data.subscriptions,
    data.hobbiesRecreation,
    data.giftsSupport
  ].map(val => Math.max(0, Number(val) || 0));

  return roundToTwo(values.reduce((sum, val) => sum + val, 0));
}

function calculateTotalAnnual(data: NumericFormData): number {
  // Ensure all values are non-negative and convert annual to monthly
  const annualValues = [
    data.annualLicenses,
    data.homeRepairs,
    data.holidayGifts,
    data.personalCelebrations,
    data.familyEvents,
    data.vehicleMaintenance,
    data.professionalDevelopment
  ].map(val => Math.max(0, Number(val) || 0));

  // Convert annual total to monthly
  return roundToTwo(annualValues.reduce((sum, val) => sum + val, 0) / 12);
}

// Helper function to round to 2 decimal places
function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

// Helper function to calculate percentage safely
function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return roundToTwo((value / total) * 100);
}

// Helper function to format currency consistently
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function generateInsights(params: any): string[] {
  const insights: string[] = [];
  
  // Helper function to safely calculate percentages
  const safePercentage = (value: number, total: number): number => {
    if (!value || !total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Helper function to safely get number values
  const safeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : Math.max(0, num);
  };
  
  // Get safe values for all calculations
  const {
    grossRevenue = 0,
    netRevenue = 0,
    finalNetIncome = 0,
    needsActual = 0,
    wantsActual = 0,
    savingsActual = 0,
    totalWantsExpenses = 0,
    wantsRecommended = 0
  } = params;

  // Validate core financial metrics
  const safeGrossRevenue = safeNumber(grossRevenue);
  const safeNetRevenue = safeNumber(netRevenue);
  const safeFinalNetIncome = safeNumber(finalNetIncome);
  const safeNeedsActual = safeNumber(needsActual);
  const safeWantsActual = safeNumber(wantsActual);
  const safeSavingsActual = safeNumber(savingsActual);
  
  // Basic financial health check
  if (safeGrossRevenue === 0) {
    insights.push("Please enter your income details to generate personalized insights.");
    return insights;
  }
  
  // Profit analysis
  if (safeFinalNetIncome < 0) {
    insights.push("Your household is operating at a deficit. Focus on increasing revenue or reducing expenses to achieve profitability.");
    
    // Additional deficit-specific insights
    const safeWantsExcess = safeNumber(totalWantsExpenses) - safeNumber(wantsRecommended);
    if (safeWantsExcess > 0) {
      insights.push(`Consider reducing discretionary spending by ${formatCurrency(safeWantsExcess)} to help achieve a positive profit margin.`);
    }

    if (params.costToEarn?.totalC2E) {
      const c2ePercentage = safePercentage(safeNumber(params.costToEarn.totalC2E), safeNetRevenue);
      if (c2ePercentage > 20) {
        insights.push("Your cost to earn expenses are significant. Look for opportunities to reduce work-related expenses or increase income to offset these costs.");
      }
    }
  } else {
    const profitMargin = safePercentage(safeFinalNetIncome, safeGrossRevenue);
    if (profitMargin < 10) {
      insights.push(`Your household profit margin is ${profitMargin}%. Aim for at least 10-20% for long-term financial resilience.`);
    } else {
      insights.push(`Your household profit margin is a healthy ${profitMargin}%. This gives you flexibility for future financial goals.`);
    }
  }
  
  // Net revenue check
  if (safeNetRevenue <= 0) {
    insights.push("Your net revenue is zero or negative. Review your income and pre-tax deductions to ensure accuracy.");
    return insights;
  }
  
  // 50/30/20 rule analysis
  const needsPercentage = safePercentage(safeNeedsActual, safeNetRevenue);
  const wantsPercentage = safePercentage(safeWantsActual, safeNetRevenue);
  const savingsPercentage = safePercentage(safeSavingsActual, safeNetRevenue);

  // Needs analysis
  if (needsPercentage > 50) {
    insights.push(`Essential needs make up ${needsPercentage}% of your net income, above the recommended 50%. Consider areas where you can reduce fixed costs.`);
    
    // Housing analysis
    const safeHousingExpenses = safeNumber(params.formData?.housingExpenses);
    if (safeHousingExpenses > safeNetRevenue * 0.3) {
      insights.push("Your housing costs exceed 30% of net income. Consider options like refinancing, downsizing, or finding a roommate to reduce this expense.");
    }

    // Transportation analysis
    const safeTransportation = safeNumber(params.formData?.transportation);
    if (safeTransportation > safeNetRevenue * 0.15) {
      insights.push("Transportation costs are high relative to your income. Look into cost-saving alternatives or consider reducing vehicle-related expenses.");
    }
  } else if (needsPercentage > 0) {
    insights.push(`You're managing essential needs well at ${needsPercentage}% of net income, below the recommended 50% threshold.`);
  }

  // Wants analysis
  if (wantsPercentage > 30) {
    insights.push(`Discretionary spending accounts for ${wantsPercentage}% of your net income, above the recommended 30%. This could be an area to trim expenses.`);
    
    const entertainmentDining = safeNumber(params.formData?.entertainmentLeisure) + safeNumber(params.formData?.diningOut);
    if (entertainmentDining > safeNetRevenue * 0.1) {
      insights.push("Entertainment and dining expenses exceed 10% of your income. Consider setting a budget for these activities to better align with your financial goals.");
    }
  } else if (wantsPercentage > 0) {
    insights.push(`Your discretionary spending is well-controlled at ${wantsPercentage}% of net income, within the recommended 30% limit.`);
  }
  
  // Savings analysis
  if (savingsPercentage < 20 && savingsPercentage > 0) {
    insights.push(`Your savings rate is ${savingsPercentage}%, below the recommended 20%. Increasing this will strengthen your financial position.`);
    
    const safeShortTermSavings = safeNumber(params.formData?.shortTermSavings);
    if (safeShortTermSavings < safeNetRevenue * 0.05) {
      insights.push("Consider building your emergency fund by increasing short-term savings to at least 5% of your net income.");
    }

    const safeRetirementSavings = safeNumber(params.formData?.retirementSavings);
    if (safeRetirementSavings < safeNetRevenue * 0.1) {
      insights.push("Your retirement savings could be increased to ensure long-term financial security.");
    }
  } else if (savingsPercentage >= 20) {
    insights.push(`Your savings rate of ${savingsPercentage}% exceeds the recommended 20%. You're effectively investing in future growth.`);
  }
  
  // Debt analysis
  const safeDebtPayments = safeNumber(params.formData?.debtPayments);
  if (safeDebtPayments > 0) {
    const debtPercentage = safePercentage(safeDebtPayments, safeNetRevenue);
    if (debtPercentage > 15) {
      insights.push(`Debt payments consume ${debtPercentage}% of your net income. Prioritizing debt reduction could increase your profit margin.`);
    }
  }
  
  // Cost to Earn analysis
  if (params.costToEarn?.totalC2E > 0) {
    const c2ePercentage = safePercentage(safeNumber(params.costToEarn.totalC2E), safeNetRevenue);
    if (c2ePercentage > 20) {
      insights.push(`Your cost to earn expenses are ${c2ePercentage}% of net income. Consider ways to reduce work-related expenses or negotiate for employer reimbursement.`);
    }
  }

  // Annual expense planning
  const safeTotalAnnualExpenses = safeNumber(params.formData?.totalAnnualExpenses);
  if (safeTotalAnnualExpenses > 0) {
    const monthlyAllocation = safeTotalAnnualExpenses / 12;
    const annualPercentage = safePercentage(monthlyAllocation, safeNetRevenue);
    if (annualPercentage > 10) {
      insights.push(`Your monthly allocation for annual expenses is ${annualPercentage}% of net income. Consider ways to reduce or spread out these periodic expenses.`);
    }
  }

  // Add value-based insight if we have meaningful data
  if (safeNetRevenue > 0 && (safeNeedsActual > 0 || safeWantsActual > 0)) {
    insights.push("Consider mapping your expenses to your core values. Are you investing adequately in what matters most to you?");
  }

  return insights;
} 