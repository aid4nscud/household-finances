import { IncomeStatement } from '../types/index';

/**
 * Email template generator for personal income statements
 */
export default function emailTemplate(data: IncomeStatement, name: string): string {
  // Format currency values
  const formatCurrency = (value: number | string | undefined | null): string => {
    if (value === undefined || value === null || value === '') return '$0.00';
    // Remove any non-numeric characters except decimal points
    const numericValue = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    // Format as currency
    return numericValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format percentage values
  const formatPercentage = (value: number | string | undefined | null): string => {
    if (value === undefined || value === null || value === '') return '0%';
    // Remove any non-numeric characters except decimal points
    const numericValue = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    // Format as percentage
    return `${numericValue.toFixed(2)}%`;
  };

  // Get date in readable format
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Use the formatted values from the IncomeStatement object
  const totalIncome = data.income.grossRevenue.value;
  const totalDeductions = data.preTaxDeductions.totalPreTaxDeductions.value;
  const essentialExpenses = data.essentialNeeds.totalNeedsExpenses.value;
  const discretionaryExpenses = data.discretionaryExpenses.totalWantsExpenses.value;
  const savingsInvestments = data.savingsInvestments.totalSavingsInvestments.value;
  const annualExpenses = data.annualExpenses.totalAnnualExpenses.value;
  
  const totalExpenses = essentialExpenses + discretionaryExpenses + annualExpenses;
  const netIncome = data.finalNetIncome.value;
  const savingsRate = data.insights.find(i => i.type === 'savingsRate')?.value || 0;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Personal Income Statement</title>
      <style>
        /* Base styles with fallbacks for email clients */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #4a6fa5 0%, #2c4c7b 100%);
          color: white;
          padding: 20px;
          border-radius: 5px 5px 0 0;
          text-align: center;
        }
        .content {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        h1, h2, h3 {
          color: #2c4c7b;
          margin-top: 0;
        }
        .header h1 {
          color: white;
          margin: 0;
        }
        .summary {
          background-color: #f5f8fc;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          border-left: 4px solid #4a6fa5;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .summary-total {
          font-weight: bold;
          font-size: 1.1em;
          border-top: 1px solid #d0d0d0;
          padding-top: 10px;
          margin-top: 10px;
        }
        .section {
          margin-bottom: 25px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .item-label {
          font-weight: 500;
          color: #555;
        }
        .item-value {
          font-weight: 600;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #777;
          font-size: 0.9em;
        }
        .positive {
          color: #28a745;
        }
        .negative {
          color: #dc3545;
        }
        .insights {
          background-color: #f0f7ff;
          padding: 15px;
          border-radius: 5px;
          margin-top: 25px;
          border-left: 4px solid #6495ED;
        }
        .insights h3 {
          color: #3a6ea5;
          margin-top: 0;
        }
        @media screen and (max-width: 480px) {
          .container {
            padding: 10px;
          }
          .header, .content {
            padding: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Personal Income Statement</h1>
          <p>Generated on ${formattedDate}</p>
        </div>
        
        <div class="content">
          <p>Hello ${name},</p>
          <p>Here is your personal income statement summary. This document provides an overview of your financial situation based on the information you provided.</p>
          
          <div class="summary">
            <h2>Financial Summary</h2>
            <div class="summary-item">
              <span>Total Income:</span>
              <span>${data.income.grossRevenue.formatted}</span>
            </div>
            <div class="summary-item">
              <span>Total Deductions:</span>
              <span>${data.preTaxDeductions.totalPreTaxDeductions.formatted}</span>
            </div>
            <div class="summary-item">
              <span>Net Revenue:</span>
              <span>${data.netRevenue.formatted}</span>
            </div>
            <div class="summary-item">
              <span>Total Expenses:</span>
              <span>${formatCurrency(totalExpenses)}</span>
            </div>
            <div class="summary-item summary-total">
              <span>Final Net Income:</span>
              <span class="${netIncome >= 0 ? 'positive' : 'negative'}">${data.finalNetIncome.formatted}</span>
            </div>
            <div class="summary-item">
              <span>Savings & Investments:</span>
              <span class="positive">${data.savingsInvestments.totalSavingsInvestments.formatted}</span>
            </div>
          </div>
          
          <!-- Income Section -->
          <div class="section">
            <h2>Income</h2>
            ${Object.entries(data.income.items).map(([key, value]) => `
              <div class="item">
                <span class="item-label">${value.label}</span>
                <span class="item-value">${value.formatted}</span>
              </div>
            `).join('')}
            <div class="item summary-total">
              <span class="item-label">Total Income</span>
              <span class="item-value">${data.income.grossRevenue.formatted}</span>
            </div>
          </div>
          
          <!-- Deductions Section -->
          <div class="section">
            <h2>Pre-Tax Deductions</h2>
            ${Object.entries(data.preTaxDeductions.items).map(([key, value]) => `
              <div class="item">
                <span class="item-label">${value.label}</span>
                <span class="item-value">${value.formatted}</span>
              </div>
            `).join('')}
            <div class="item summary-total">
              <span class="item-label">Total Deductions</span>
              <span class="item-value">${data.preTaxDeductions.totalPreTaxDeductions.formatted}</span>
            </div>
          </div>
          
          <!-- Essential Needs Section -->
          <div class="section">
            <h2>Essential Needs</h2>
            ${Object.entries(data.essentialNeeds.items).map(([key, value]) => `
              <div class="item">
                <span class="item-label">${value.label}</span>
                <span class="item-value">${value.formatted}</span>
              </div>
            `).join('')}
            <div class="item summary-total">
              <span class="item-label">Total Essential Needs</span>
              <span class="item-value">${data.essentialNeeds.totalNeedsExpenses.formatted}</span>
            </div>
          </div>
          
          <!-- Discretionary Expenses Section -->
          <div class="section">
            <h2>Discretionary Expenses</h2>
            ${Object.entries(data.discretionaryExpenses.items).map(([key, value]) => `
              <div class="item">
                <span class="item-label">${value.label}</span>
                <span class="item-value">${value.formatted}</span>
              </div>
            `).join('')}
            <div class="item summary-total">
              <span class="item-label">Total Discretionary Expenses</span>
              <span class="item-value">${data.discretionaryExpenses.totalWantsExpenses.formatted}</span>
            </div>
          </div>
          
          <!-- Savings & Investments Section -->
          <div class="section">
            <h2>Savings & Investments</h2>
            ${Object.entries(data.savingsInvestments.items).map(([key, value]) => `
              <div class="item">
                <span class="item-label">${value.label}</span>
                <span class="item-value">${value.formatted}</span>
              </div>
            `).join('')}
            <div class="item summary-total">
              <span class="item-label">Total Savings & Investments</span>
              <span class="item-value">${data.savingsInvestments.totalSavingsInvestments.formatted}</span>
            </div>
          </div>
          
          <!-- Annual Expenses Section -->
          <div class="section">
            <h2>Annual/Irregular Expenses</h2>
            ${Object.entries(data.annualExpenses.items).map(([key, value]) => `
              <div class="item">
                <span class="item-label">${value.label}</span>
                <span class="item-value">${value.formatted}</span>
              </div>
            `).join('')}
            <div class="item summary-total">
              <span class="item-label">Total Annual Expenses</span>
              <span class="item-value">${data.annualExpenses.totalAnnualExpenses.formatted}</span>
            </div>
          </div>
          
          <!-- Financial Insights -->
          <div class="insights">
            <h3>Financial Insights</h3>
            <p>Based on your financial data:</p>
            <ul>
              ${data.insights.map(insight => `
                <li>${insight.message}</li>
              `).join('')}
            </ul>
          </div>
          
          <!-- 50/30/20 Rule Analysis -->
          <div class="section">
            <h2>Budget Analysis (50/30/20 Rule)</h2>
            <div class="item">
              <span class="item-label">Needs (50%)</span>
              <span class="item-value">
                Recommended: ${data.recommendations.needs.recommended}, 
                Actual: ${data.recommendations.needs.actual}
              </span>
            </div>
            <div class="item">
              <span class="item-label">Wants (30%)</span>
              <span class="item-value">
                Recommended: ${data.recommendations.wants.recommended}, 
                Actual: ${data.recommendations.wants.actual}
              </span>
            </div>
            <div class="item">
              <span class="item-label">Savings (20%)</span>
              <span class="item-value">
                Recommended: ${data.recommendations.savings.recommended}, 
                Actual: ${data.recommendations.savings.actual}
              </span>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automatically generated report. The information provided is based on the data you submitted.</p>
            <p>© ${new Date().getFullYear()} Personal Income Statement Generator</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate a plain text version of the income statement for email clients that don't support HTML
 */
export function generatePlainTextVersion(data: IncomeStatement, name: string): string {
  // Build plain text content
  let text = `PERSONAL INCOME STATEMENT\n`;
  text += `=========================\n\n`;
  text += `FINANCIAL SUMMARY\n`;
  text += `-----------------\n`;
  text += `Total Income: ${data.income.grossRevenue.formatted}\n`;
  text += `Total Deductions: ${data.preTaxDeductions.totalPreTaxDeductions.formatted}\n`;
  text += `Net Revenue: ${data.netRevenue.formatted}\n`;
  text += `Essential Expenses: ${data.essentialNeeds.totalNeedsExpenses.formatted}\n`;
  text += `Discretionary Expenses: ${data.discretionaryExpenses.totalWantsExpenses.formatted}\n`;
  text += `Savings & Investments: ${data.savingsInvestments.totalSavingsInvestments.formatted}\n`;
  text += `Annual Expenses: ${data.annualExpenses.totalAnnualExpenses.formatted}\n`;
  text += `Final Net Income: ${data.finalNetIncome.formatted}\n\n`;

  // Income
  text += `INCOME\n`;
  text += `------\n`;
  Object.entries(data.income.items).forEach(([key, item]) => {
    text += `${item.label}: ${item.formatted}\n`;
  });
  text += `Total Income: ${data.income.grossRevenue.formatted}\n\n`;

  // Deductions
  text += `PRE-TAX DEDUCTIONS\n`;
  text += `----------\n`;
  Object.entries(data.preTaxDeductions.items).forEach(([key, item]) => {
    text += `${item.label}: ${item.formatted}\n`;
  });
  text += `Total Deductions: ${data.preTaxDeductions.totalPreTaxDeductions.formatted}\n\n`;

  // Essential Needs
  text += `ESSENTIAL NEEDS\n`;
  text += `--------\n`;
  Object.entries(data.essentialNeeds.items).forEach(([key, item]) => {
    text += `${item.label}: ${item.formatted}\n`;
  });
  text += `Total Essential Needs: ${data.essentialNeeds.totalNeedsExpenses.formatted}\n\n`;

  // Discretionary Expenses
  text += `DISCRETIONARY EXPENSES\n`;
  text += `--------\n`;
  Object.entries(data.discretionaryExpenses.items).forEach(([key, item]) => {
    text += `${item.label}: ${item.formatted}\n`;
  });
  text += `Total Discretionary Expenses: ${data.discretionaryExpenses.totalWantsExpenses.formatted}\n\n`;

  // Insights
  text += `FINANCIAL INSIGHTS\n`;
  text += `--------\n`;
  data.insights.forEach(insight => {
    text += `- ${insight.message}\n`;
  });
  text += `\n`;

  // Footer
  text += `This is an automatically generated report. The information provided is based on the data you submitted.\n`;
  text += `© ${new Date().getFullYear()} Personal Income Statement Generator`;

  return text;
} 