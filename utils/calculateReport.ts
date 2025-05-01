import { NumericFormData, IncomeStatement, Insight } from '../types/index';

/**
 * Calculates financial insights and generates an income statement based on user data
 * @param {NumericFormData} data - The user's financial data
 * @returns {IncomeStatement} - Formatted income statement data and ratios
 */
function calculateReport(data: NumericFormData): IncomeStatement {
  const {
    name,
    
    // Income
    primaryIncome = 0,
    secondaryIncome = 0,
    investmentIncome = 0,
    governmentBenefits = 0,
    alimonyChildSupport = 0,
    otherIncome = 0,
    
    // Pre-Tax Deductions
    federalIncomeTax = 0,
    stateIncomeTax = 0,
    ficaTax = 0,
    retirementContributions = 0,
    healthInsurancePremiums = 0,
    hsaFsaContributions = 0,
    unionDues = 0,
    otherPayrollDeductions = 0,
    
    // Fixed Monthly Expenses (Essential Needs)
    housingExpenses = 0,
    utilities = 0,
    foodGroceries = 0,
    transportation = 0,
    healthcare = 0,
    childcareEducation = 0,
    insurance = 0,
    
    // Savings & Investments
    shortTermSavings = 0,
    longTermInvestments = 0,
    educationSavings = 0,
    charitableGiving = 0,
    
    // Wants / Discretionary Expenses
    entertainmentLeisure = 0,
    diningOut = 0,
    shoppingPersonal = 0,
    fitnessWellness = 0,
    travelVacations = 0,
    
    // Annual or Irregular Expenses
    annualLicenses = 0,
    homeRepairs = 0,
    holidayGifts = 0,
    personalCelebrations = 0,
    familyEvents = 0,
    
    // Additional Fields for Ratios
    liquidAssets = 0,
    currentLiabilities = 0,
    debtPayments = 0,
    insuranceCoverage = 0,
    necessaryExpenses = 0,
    enjoymentSpend = 0,
    totalAssets = 0,
  } = data;
  
  // Calculate Income Metrics
  const grossRevenue = Number(primaryIncome) + Number(secondaryIncome) + Number(investmentIncome) + 
                       Number(governmentBenefits) + Number(alimonyChildSupport) + Number(otherIncome);
  
  // Calculate Pre-Tax Deductions
  const totalPreTaxDeductions = Number(federalIncomeTax) + Number(stateIncomeTax) + Number(ficaTax) + 
                                Number(retirementContributions) + Number(healthInsurancePremiums) + 
                                Number(hsaFsaContributions) + Number(unionDues) + Number(otherPayrollDeductions);
  
  // Calculate Net Revenue
  const netRevenue = grossRevenue - totalPreTaxDeductions;
  
  // Calculate Essential Needs Expenses
  const totalNeedsExpenses = Number(housingExpenses) + Number(utilities) + Number(foodGroceries) + 
                             Number(transportation) + Number(healthcare) + Number(childcareEducation) + Number(insurance);
  
  // Calculate Savings & Investments
  const totalSavingsInvestments = Number(shortTermSavings) + Number(longTermInvestments) + 
                                  Number(educationSavings) + Number(charitableGiving);
  
  // Calculate Discretionary Expenses
  const totalWantsExpenses = Number(entertainmentLeisure) + Number(diningOut) + 
                             Number(shoppingPersonal) + Number(fitnessWellness) + Number(travelVacations);
  
  // Calculate Annual/Irregular Expenses
  const totalAnnualExpenses = Number(annualLicenses) + Number(homeRepairs) + Number(holidayGifts) + 
                              Number(personalCelebrations) + Number(familyEvents);
  
  // Calculate Profit Metrics
  const grossProfit = netRevenue - totalNeedsExpenses - totalSavingsInvestments;
  const netProfit = grossProfit - totalWantsExpenses;
  const finalNetIncome = netProfit - totalAnnualExpenses;
  
  // Calculate Financial Ratios
  const calculateRatio = (numerator: number, denominator: number): string => {
    if (!numerator || !denominator || denominator === 0) {
      return 'N/A';
    }
    return (numerator / denominator).toFixed(2);
  };
  
  const financialRatios = {
    liquidityRatio: calculateRatio(Number(liquidAssets), Number(currentLiabilities)),
    debtCoverageRatio: calculateRatio(Number(debtPayments), grossRevenue),
    protectionRatio: calculateRatio(Number(insuranceCoverage), Number(necessaryExpenses)),
    returnOnAssets: calculateRatio(finalNetIncome * 12, Number(totalAssets)), // Annualized net income
    returnOnEnjoyment: calculateRatio(Number(enjoymentSpend), grossRevenue),
    savingsRate: calculateRatio(totalSavingsInvestments, netRevenue),
    housingToIncomeRatio: calculateRatio(Number(housingExpenses), netRevenue),
    debtToIncomeRatio: calculateRatio(Number(debtPayments), netRevenue)
  };
  
  // Calculate recommended budget allocations (50/30/20 rule)
  const recommendedNeeds = netRevenue * 0.5;
  const recommendedWants = netRevenue * 0.3;
  const recommendedSavings = netRevenue * 0.2;
  
  // Format currency values
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };
  
  // Format percentage values
  const formatPercentage = (value: number, total: number): string => {
    if (!total) return "0%";
    return ((value / total) * 100).toFixed(1) + '%';
  };
  
  // Build income statement data object
  const incomeStatement: IncomeStatement = {
    personalInfo: {
      name: name as string,
    },
    income: {
      primaryIncome: { value: Number(primaryIncome), formatted: formatCurrency(Number(primaryIncome)) },
      secondaryIncome: { value: Number(secondaryIncome), formatted: formatCurrency(Number(secondaryIncome)) },
      investmentIncome: { value: Number(investmentIncome), formatted: formatCurrency(Number(investmentIncome)) },
      governmentBenefits: { value: Number(governmentBenefits), formatted: formatCurrency(Number(governmentBenefits)) },
      alimonyChildSupport: { value: Number(alimonyChildSupport), formatted: formatCurrency(Number(alimonyChildSupport)) },
      otherIncome: { value: Number(otherIncome), formatted: formatCurrency(Number(otherIncome)) },
      grossRevenue: { value: grossRevenue, formatted: formatCurrency(grossRevenue) }
    },
    preTaxDeductions: {
      federalIncomeTax: { value: Number(federalIncomeTax), formatted: formatCurrency(Number(federalIncomeTax)) },
      stateIncomeTax: { value: Number(stateIncomeTax), formatted: formatCurrency(Number(stateIncomeTax)) },
      ficaTax: { value: Number(ficaTax), formatted: formatCurrency(Number(ficaTax)) },
      retirementContributions: { value: Number(retirementContributions), formatted: formatCurrency(Number(retirementContributions)) },
      healthInsurancePremiums: { value: Number(healthInsurancePremiums), formatted: formatCurrency(Number(healthInsurancePremiums)) },
      hsaFsaContributions: { value: Number(hsaFsaContributions), formatted: formatCurrency(Number(hsaFsaContributions)) },
      unionDues: { value: Number(unionDues), formatted: formatCurrency(Number(unionDues)) },
      otherPayrollDeductions: { value: Number(otherPayrollDeductions), formatted: formatCurrency(Number(otherPayrollDeductions)) },
      totalPreTaxDeductions: { value: totalPreTaxDeductions, formatted: formatCurrency(totalPreTaxDeductions) }
    },
    netRevenue: { value: netRevenue, formatted: formatCurrency(netRevenue) },
    essentialNeeds: {
      housingExpenses: { value: Number(housingExpenses), formatted: formatCurrency(Number(housingExpenses)) },
      utilities: { value: Number(utilities), formatted: formatCurrency(Number(utilities)) },
      foodGroceries: { value: Number(foodGroceries), formatted: formatCurrency(Number(foodGroceries)) },
      transportation: { value: Number(transportation), formatted: formatCurrency(Number(transportation)) },
      healthcare: { value: Number(healthcare), formatted: formatCurrency(Number(healthcare)) },
      childcareEducation: { value: Number(childcareEducation), formatted: formatCurrency(Number(childcareEducation)) },
      insurance: { value: Number(insurance), formatted: formatCurrency(Number(insurance)) },
      totalNeedsExpenses: { value: totalNeedsExpenses, formatted: formatCurrency(totalNeedsExpenses) },
      percentOfIncome: formatPercentage(totalNeedsExpenses, netRevenue)
    },
    savingsInvestments: {
      shortTermSavings: { value: Number(shortTermSavings), formatted: formatCurrency(Number(shortTermSavings)) },
      longTermInvestments: { value: Number(longTermInvestments), formatted: formatCurrency(Number(longTermInvestments)) },
      educationSavings: { value: Number(educationSavings), formatted: formatCurrency(Number(educationSavings)) },
      charitableGiving: { value: Number(charitableGiving), formatted: formatCurrency(Number(charitableGiving)) },
      totalSavingsInvestments: { value: totalSavingsInvestments, formatted: formatCurrency(totalSavingsInvestments) },
      percentOfIncome: formatPercentage(totalSavingsInvestments, netRevenue)
    },
    grossProfit: { value: grossProfit, formatted: formatCurrency(grossProfit) },
    discretionaryExpenses: {
      entertainmentLeisure: { value: Number(entertainmentLeisure), formatted: formatCurrency(Number(entertainmentLeisure)) },
      diningOut: { value: Number(diningOut), formatted: formatCurrency(Number(diningOut)) },
      shoppingPersonal: { value: Number(shoppingPersonal), formatted: formatCurrency(Number(shoppingPersonal)) },
      fitnessWellness: { value: Number(fitnessWellness), formatted: formatCurrency(Number(fitnessWellness)) },
      travelVacations: { value: Number(travelVacations), formatted: formatCurrency(Number(travelVacations)) },
      totalWantsExpenses: { value: totalWantsExpenses, formatted: formatCurrency(totalWantsExpenses) },
      percentOfIncome: formatPercentage(totalWantsExpenses, netRevenue)
    },
    netProfit: { value: netProfit, formatted: formatCurrency(netProfit) },
    annualExpenses: {
      annualLicenses: { value: Number(annualLicenses), formatted: formatCurrency(Number(annualLicenses)) },
      homeRepairs: { value: Number(homeRepairs), formatted: formatCurrency(Number(homeRepairs)) },
      holidayGifts: { value: Number(holidayGifts), formatted: formatCurrency(Number(holidayGifts)) },
      personalCelebrations: { value: Number(personalCelebrations), formatted: formatCurrency(Number(personalCelebrations)) },
      familyEvents: { value: Number(familyEvents), formatted: formatCurrency(Number(familyEvents)) },
      totalAnnualExpenses: { value: totalAnnualExpenses, formatted: formatCurrency(totalAnnualExpenses) }
    },
    finalNetIncome: { value: finalNetIncome, formatted: formatCurrency(finalNetIncome) },
    financialRatios,
    recommendations: {
      needs: {
        recommended: formatCurrency(recommendedNeeds),
        actual: formatCurrency(totalNeedsExpenses),
        difference: formatCurrency(recommendedNeeds - totalNeedsExpenses),
        status: totalNeedsExpenses <= recommendedNeeds ? 'good' : 'high'
      },
      wants: {
        recommended: formatCurrency(recommendedWants),
        actual: formatCurrency(totalWantsExpenses),
        difference: formatCurrency(recommendedWants - totalWantsExpenses),
        status: totalWantsExpenses <= recommendedWants ? 'good' : 'high'
      },
      savings: {
        recommended: formatCurrency(recommendedSavings),
        actual: formatCurrency(totalSavingsInvestments),
        difference: formatCurrency(recommendedSavings - totalSavingsInvestments),
        status: totalSavingsInvestments >= recommendedSavings ? 'good' : 'low'
      }
    },
    insights: generateInsights(finalNetIncome, netRevenue, financialRatios, totalNeedsExpenses, totalWantsExpenses, totalSavingsInvestments)
  };
  
  return incomeStatement;
}

/**
 * Generates financial insights based on calculated metrics
 * @param {number} finalNetIncome - Final net income
 * @param {number} netRevenue - Net revenue
 * @param {Object} ratios - Financial ratios
 * @param {number} totalNeeds - Total needs expenses
 * @param {number} totalWants - Total wants expenses
 * @param {number} totalSavings - Total savings and investments
 * @returns {Array<Insight>} - Array of insights and recommendations
 */
function generateInsights(
  finalNetIncome: number, 
  netRevenue: number, 
  ratios: Record<string, string>, 
  totalNeeds: number, 
  totalWants: number, 
  totalSavings: number
): Insight[] {
  const insights: Insight[] = [];
  
  // Net Income insights
  if (finalNetIncome <= 0) {
    insights.push({
      type: 'alert',
      text: 'Your expenses exceed your income. This is unsustainable long-term.'
    });
    insights.push({
      type: 'recommendation',
      text: 'Review your budget to reduce expenses or find ways to increase income.'
    });
  } else if (finalNetIncome < netRevenue * 0.1) {
    insights.push({
      type: 'warning',
      text: 'Your net income is less than 10% of your net revenue, leaving little margin for unexpected expenses.'
    });
  } else {
    insights.push({
      type: 'positive',
      text: `You have a positive monthly net income of ${finalNetIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`
    });
  }
  
  // 50/30/20 Rule insights
  const needsPercent = (totalNeeds / netRevenue) * 100;
  const wantsPercent = (totalWants / netRevenue) * 100;
  const savingsPercent = (totalSavings / netRevenue) * 100;
  
  if (needsPercent > 50) {
    insights.push({
      type: 'warning',
      text: `Your essential needs (${needsPercent.toFixed(1)}%) exceed the recommended 50% of net income.`
    });
  }
  
  if (wantsPercent > 30) {
    insights.push({
      type: 'warning',
      text: `Your discretionary spending (${wantsPercent.toFixed(1)}%) exceeds the recommended 30% of net income.`
    });
  }
  
  if (savingsPercent < 20) {
    insights.push({
      type: 'warning',
      text: `Your savings rate (${savingsPercent.toFixed(1)}%) is below the recommended 20% of net income.`
    });
  } else {
    insights.push({
      type: 'positive',
      text: `Your savings rate of ${savingsPercent.toFixed(1)}% meets or exceeds the recommended 20%.`
    });
  }
  
  // Ratio insights
  if (ratios.liquidityRatio !== 'N/A') {
    const liquidityRatio = parseFloat(ratios.liquidityRatio);
    if (liquidityRatio < 1) {
      insights.push({
        type: 'warning',
        text: `Your liquidity ratio (${ratios.liquidityRatio}) is below 1, indicating potential short-term financial pressure.`
      });
    } else if (liquidityRatio > 3) {
      insights.push({
        type: 'information',
        text: `Your liquidity ratio (${ratios.liquidityRatio}) is above 3. Consider putting some of these liquid assets to work in investments.`
      });
    }
  }
  
  if (ratios.debtCoverageRatio !== 'N/A') {
    const debtCoverageRatio = parseFloat(ratios.debtCoverageRatio);
    if (debtCoverageRatio > 0.36) {
      insights.push({
        type: 'warning',
        text: `Your debt coverage ratio (${ratios.debtCoverageRatio}) is high. Lenders typically prefer this ratio to be below 0.36.`
      });
    }
  }
  
  if (ratios.housingToIncomeRatio !== 'N/A') {
    const housingRatio = parseFloat(ratios.housingToIncomeRatio);
    if (housingRatio > 0.28) {
      insights.push({
        type: 'warning',
        text: `Your housing costs are ${(housingRatio * 100).toFixed(1)}% of your net income, which exceeds the recommended 28%.`
      });
    }
  }
  
  // General recommendations
  insights.push({
    type: 'recommendation',
    text: 'Follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings/debt repayment.'
  });
  
  if (totalSavings < netRevenue * 0.2) {
    insights.push({
      type: 'recommendation',
      text: 'Try to increase your savings rate gradually to at least 20% of your net income.'
    });
  }
  
  insights.push({
    type: 'recommendation',
    text: 'Build an emergency fund that covers 3-6 months of essential expenses.'
  });
  
  return insights;
}

export default calculateReport; 