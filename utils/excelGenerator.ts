import { IncomeStatement } from '../types/index';

// Type definition for XLSX
declare global {
  interface Window {
    XLSX: any;
  }
}

/**
 * Formats a currency value for Excel
 * @param {number} value The number to format
 * @returns {string} Formatted currency string
 */
const formatCurrency = (value: number): string => {
  return value ? `$${value.toFixed(2)}` : '$0.00';
};

/**
 * Generate an Excel workbook from income statement data
 * @param {IncomeStatement} incomeStatement The income statement data object
 * @param {string} userName The user's name
 * @returns {Object} Excel workbook object
 */
const generateWorkbook = (incomeStatement: IncomeStatement, userName: string): any => {
  // Ensure we're in a browser environment
  if (typeof window === 'undefined' || !window.XLSX) {
    throw new Error('Excel functionality is only available in browser environment');
  }
  
  // Use global XLSX object
  const XLSX = window.XLSX;
  
  // Create a new workbook with a single sheet
  const workbook = XLSX.utils.book_new();
  const currentDate = new Date().toLocaleDateString();
  
  // Create simple summary data
  const summaryData = [
    ['Personal Income Statement'],
    [`Generated for: ${userName}`],
    [`Date: ${currentDate}`],
    [],
    ['INCOME SUMMARY'],
    ['Category', 'Amount'],
    ['Primary Income', formatCurrency(incomeStatement.income.primaryIncome.value)],
    ['Secondary Income', formatCurrency(incomeStatement.income.secondaryIncome.value)],
    ['Investment Income', formatCurrency(incomeStatement.income.investmentIncome.value)],
    ['Other Income', formatCurrency(incomeStatement.income.otherIncome.value)],
    ['Gross Revenue', formatCurrency(incomeStatement.income.grossRevenue.value)],
    [],
    ['EXPENSE SUMMARY'],
    ['Category', 'Amount'],
    ['Essential Needs', formatCurrency(incomeStatement.essentialNeeds.totalNeedsExpenses.value)],
    ['Discretionary Expenses', formatCurrency(incomeStatement.discretionaryExpenses.totalWantsExpenses.value)],
    ['Savings & Investments', formatCurrency(incomeStatement.savingsInvestments.totalSavingsInvestments.value)],
    ['Annual Expenses', formatCurrency(incomeStatement.annualExpenses.totalAnnualExpenses.value)],
    [],
    ['NET INCOME', formatCurrency(incomeStatement.finalNetIncome.value)]
  ];
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Add column width
  worksheet['!cols'] = [{ wch: 30 }, { wch: 20 }];
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Income Statement");
  
  return workbook;
};

/**
 * Generate and download an Excel file from income statement data
 * @param {IncomeStatement} incomeStatement The income statement data object
 * @param {string} userName The user's name
 */
export const generateExcelFile = (incomeStatement: IncomeStatement, userName: string): void => {
  try {
    // Add safety checks
    if (!incomeStatement) {
      throw new Error('No income statement data provided');
    }
    
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Cannot generate Excel file on server-side');
    }
    
    // Check if XLSX is available
    if (!window.XLSX) {
      throw new Error('XLSX library not available. Please refresh the page and try again.');
    }
    
    // Get global XLSX object
    const XLSX = window.XLSX;
    
    // Generate workbook
    console.log('Generating Excel workbook...');
    const workbook = generateWorkbook(incomeStatement, userName);
    
    // Create a file name
    const fileName = `Income_Statement_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Use writeFile method
    console.log('Writing file...');
    XLSX.writeFile(workbook, fileName);
    console.log('Excel file generated successfully');
    
  } catch (error) {
    console.error('Excel generation error:', error);
    throw error;
  }
}; 