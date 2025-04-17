/**
 * Calculates financial insights based on user data
 * @param {Object} data - The user's financial data
 * @returns {String} - A formatted report with financial insights
 */
function calculateReport(data) {
  const { name, income, expenses, dependents, debt, debtAmount, financialGoal } = data;
  
  // Calculate disposable income
  const disposableIncome = income - expenses;
  const disposableIncomePercentage = ((disposableIncome / income) * 100).toFixed(1);
  
  // Calculate debt-to-income ratio if debt is reported
  let debtToIncomeRatio = 0;
  if (debt === 'Yes' && debtAmount > 0) {
    debtToIncomeRatio = ((debtAmount / (income * 12)) * 100).toFixed(1);
  }
  
  // Calculate dependent impact
  const expensesPerDependent = dependents > 0 ? (expenses / dependents).toFixed(2) : 0;
  
  // Build report
  let report = `FINANCIAL REPORT FOR ${name.toUpperCase()}\n\n`;
  
  // Basic financial metrics
  report += `Monthly Income: $${income.toLocaleString()}\n`;
  report += `Monthly Expenses: $${expenses.toLocaleString()}\n`;
  report += `Disposable Income: $${disposableIncome.toLocaleString()} (${disposableIncomePercentage}% of income)\n`;
  report += `Number of Dependents: ${dependents}\n`;
  if (dependents > 0) {
    report += `Average Expense per Dependent: $${expensesPerDependent}\n`;
  }
  
  if (debt === 'Yes') {
    report += `Total Debt: $${debtAmount.toLocaleString()}\n`;
    report += `Debt-to-Annual Income Ratio: ${debtToIncomeRatio}%\n`;
  }
  
  report += `\nPrimary Financial Goal: ${financialGoal}\n\n`;
  
  // General insights
  report += `KEY INSIGHTS:\n`;
  
  // Saving rate insights
  if (disposableIncome <= 0) {
    report += `• ALERT: Your expenses exceed your income. This is unsustainable long-term.\n`;
    report += `• RECOMMENDATION: Review your budget to reduce expenses or find ways to increase income.\n`;
  } else if (disposableIncomePercentage < 20) {
    report += `• Your saving rate (${disposableIncomePercentage}%) is below the recommended 20%.\n`;
    report += `• RECOMMENDATION: Consider finding ways to reduce expenses or increase income.\n`;
  } else {
    report += `• POSITIVE: Your saving rate of ${disposableIncomePercentage}% is healthy!\n`;
  }
  
  // Goal-specific insights
  switch(financialGoal) {
    case 'Save for a house':
      report += `• For home buying: With your current savings rate, you're saving $${disposableIncome.toLocaleString()} monthly.\n`;
      if (debt === 'Yes' && debtToIncomeRatio > 36) {
        report += `• Your debt-to-income ratio (${debtToIncomeRatio}%) may affect mortgage approval. Lenders typically prefer ratios below 36%.\n`;
      }
      report += `• RECOMMENDATION: Consider setting aside at least 20% of your home's purchase price for a down payment.\n`;
      break;
      
    case 'Pay off debt':
      if (debt === 'Yes') {
        const monthsToPayDebt = debtAmount / disposableIncome;
        report += `• At your current rate, it would take approximately ${monthsToPayDebt.toFixed(1)} months to pay off your debt.\n`;
        report += `• RECOMMENDATION: Consider the debt snowball or avalanche method to accelerate your debt payoff.\n`;
      } else {
        report += `• You've indicated no debt - congratulations! Consider redirecting your planned debt payments to savings.\n`;
      }
      break;
      
    case 'Emergency fund':
      const recommendedEmergencyFund = expenses * 6;
      report += `• A recommended emergency fund should cover 3-6 months of expenses ($${(expenses * 3).toLocaleString()} to $${recommendedEmergencyFund.toLocaleString()}).\n`;
      report += `• At your current saving rate, it would take approximately ${(recommendedEmergencyFund / disposableIncome).toFixed(1)} months to build a 6-month emergency fund.\n`;
      break;
      
    case 'Retire early':
      report += `• For early retirement, the general guideline is to save 25-30 times your annual expenses.\n`;
      const retirementTarget = expenses * 12 * 25;
      report += `• Based on your current expenses, you'd need approximately $${retirementTarget.toLocaleString()} saved.\n`;
      if (disposableIncome > 0) {
        const yearsToRetirement = (retirementTarget / (disposableIncome * 12)).toFixed(1);
        report += `• At your current saving rate, it would take approximately ${yearsToRetirement} years to reach this goal (not accounting for investment growth).\n`;
      }
      break;
  }
  
  // Final recommendations
  report += `\nRECOMMENDATIONS:\n`;
  
  if (disposableIncome <= 0) {
    report += `• Immediate action: Find ways to reduce expenses or increase income.\n`;
  } else {
    report += `• Consider the 50/30/20 budget rule: 50% for needs, 30% for wants, and 20% for savings/debt.\n`;
  }
  
  if (debt === 'Yes' && debtToIncomeRatio > 20) {
    report += `• Prioritize debt reduction to improve financial stability.\n`;
  }
  
  report += `• Regularly review and adjust your budget as your financial situation changes.\n`;
  report += `• Consider consulting with a financial advisor for personalized advice.\n`;
  
  return report;
}

export default calculateReport; 