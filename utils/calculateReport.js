function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function calculateDebtToIncomeRatio(monthlyIncome, debtAmount) {
  return (debtAmount / (monthlyIncome * 12)) * 100;
}

export function calculateReport(formData) {
  const {
    fullName,
    monthlyIncome,
    monthlyExpenses,
    dependents,
    hasDebt,
    debtAmount,
    financialGoal
  } = formData;

  const income = parseFloat(monthlyIncome);
  const expenses = parseFloat(monthlyExpenses);
  const disposableIncome = income - expenses;
  const annualDisposableIncome = disposableIncome * 12;
  const insights = [];

  // Basic financial health insights
  insights.push(`Monthly Disposable Income: ${formatCurrency(disposableIncome)}`);
  insights.push(`Annual Disposable Income: ${formatCurrency(annualDisposableIncome)}`);

  // Expense ratio insight
  const expenseRatio = (expenses / income) * 100;
  insights.push(`Your expense-to-income ratio is ${expenseRatio.toFixed(1)}% ${
    expenseRatio > 70 ? '(Consider reducing expenses)' :
    expenseRatio < 50 ? '(Great job keeping expenses low!)' :
    '(Within reasonable range)'
  }`);

  // Debt-specific insights
  if (hasDebt === 'yes') {
    const debtToIncomeRatio = calculateDebtToIncomeRatio(income, parseFloat(debtAmount));
    insights.push(`Debt-to-Income Ratio: ${debtToIncomeRatio.toFixed(1)}% ${
      debtToIncomeRatio > 43 ? '(This is high - consider debt consolidation)' :
      debtToIncomeRatio > 30 ? '(This is moderate - focus on debt reduction)' :
      '(This is manageable)'
    }`);
  }

  // Goal-specific insights
  switch (financialGoal) {
    case 'Save for a house':
      const recommendedDownPayment = income * 12 * 3; // 3x annual income
      insights.push(`For a house down payment, aim to save ${formatCurrency(recommendedDownPayment)}. At your current rate, you could save this in ${Math.ceil(recommendedDownPayment / annualDisposableIncome)} years with current disposable income.`);
      break;

    case 'Pay off debt':
      if (hasDebt === 'yes') {
        const monthsToPayoff = parseFloat(debtAmount) / disposableIncome;
        insights.push(`At your current disposable income rate, you could pay off your debt in approximately ${Math.ceil(monthsToPayoff)} months if you commit all excess funds to debt repayment.`);
      }
      break;

    case 'Emergency fund':
      const recommendedEmergencyFund = expenses * 6;
      insights.push(`Aim for an emergency fund of ${formatCurrency(recommendedEmergencyFund)} (6 months of expenses). You could achieve this in ${Math.ceil(recommendedEmergencyFund / disposableIncome)} months with current disposable income.`);
      break;

    case 'Retire early':
      const retirementGoal = income * 12 * 25; // 25x annual income
      insights.push(`For early retirement, aim for a nest egg of ${formatCurrency(retirementGoal)}. Consider maximizing tax-advantaged retirement accounts and investing in a diversified portfolio.`);
      break;
  }

  // Dependent-specific insight
  if (parseInt(dependents) > 0) {
    const recommendedLifeInsurance = income * 12 * 10;
    insights.push(`With ${dependents} dependent${dependents > 1 ? 's' : ''}, consider life insurance coverage of ${formatCurrency(recommendedLifeInsurance)} (10x annual income).`);
  }

  return insights.join('\n\n');
} 