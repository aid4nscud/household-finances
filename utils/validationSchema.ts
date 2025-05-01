import { z } from 'zod';

// Helper functions for validation
const isPositiveNumber = (val: string) => val !== '' && !isNaN(Number(val)) && Number(val) >= 0;
const isRequiredPositiveNumber = (val: string) => isPositiveNumber(val);
const errorMessages = {
  required: 'This field is required',
  positiveNumber: 'Must be a positive number'
};

// Base Schema for FormData
export const formDataSchema = z.object({
  // Personal Information
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  
  // Income
  primaryIncome: z.string().refine(isPositiveNumber, errorMessages.positiveNumber),
  secondaryIncome: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  investmentIncome: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  governmentBenefits: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  alimonyChildSupport: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  otherIncome: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  
  // Pre-Tax Deductions
  federalIncomeTax: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  stateIncomeTax: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  ficaTax: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  retirementContributions: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  healthInsurancePremiums: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  hsaFsaContributions: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  unionDues: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  otherPayrollDeductions: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  
  // Essential Needs
  housingExpenses: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  utilities: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  foodGroceries: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  transportation: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  healthcare: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  childcareEducation: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  insurance: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  debtPayments: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  personalCareMedical: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  
  // Savings & Investments
  shortTermSavings: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  longTermInvestments: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  educationSavings: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  charitableGiving: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  retirementSavings: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  
  // Discretionary Expenses
  entertainmentLeisure: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  diningOut: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  shoppingPersonal: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  fitnessWellness: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  travelVacations: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  subscriptions: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  hobbiesRecreation: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  giftsSupport: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  
  // Annual Expenses
  annualLicenses: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  homeRepairs: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  holidayGifts: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  personalCelebrations: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  familyEvents: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  vehicleMaintenance: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  professionalDevelopment: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  
  // Additional Fields for Ratios
  liquidAssets: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  currentLiabilities: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  insuranceCoverage: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  necessaryExpenses: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  enjoymentSpend: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  totalAssets: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  totalDebt: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  totalNetWorth: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  savingsRate: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
  debtToIncomeRatio: z.string().refine(val => val === '' || isPositiveNumber(val), errorMessages.positiveNumber),
});

// Create a helper type from the schema
export type ValidFormData = z.infer<typeof formDataSchema>;

// Create step-specific sub-schemas for validation
export const personalInfoSchema = formDataSchema.pick({
  name: true,
  email: true,
});

// For income step, primaryIncome is required, others can be 0
export const incomeSchema = z.object({
  primaryIncome: z.string().refine(isRequiredPositiveNumber, errorMessages.required),
  secondaryIncome: z.string().refine(val => val !== '', errorMessages.required),
  investmentIncome: z.string().refine(val => val !== '', errorMessages.required),
  governmentBenefits: z.string().refine(val => val !== '', errorMessages.required),
  alimonyChildSupport: z.string().refine(val => val !== '', errorMessages.required),
  otherIncome: z.string().refine(val => val !== '', errorMessages.required),
});

// For pre-tax deductions, all fields must have a value
export const preTaxDeductionsSchema = z.object({
  federalIncomeTax: z.string().refine(val => val !== '', errorMessages.required),
  stateIncomeTax: z.string().refine(val => val !== '', errorMessages.required),
  ficaTax: z.string().refine(val => val !== '', errorMessages.required),
  retirementContributions: z.string().refine(val => val !== '', errorMessages.required),
  healthInsurancePremiums: z.string().refine(val => val !== '', errorMessages.required),
  hsaFsaContributions: z.string().refine(val => val !== '', errorMessages.required),
  unionDues: z.string().refine(val => val !== '', errorMessages.required),
  otherPayrollDeductions: z.string().refine(val => val !== '', errorMessages.required),
});

// For essential needs, all fields must have a value
export const essentialNeedsSchema = z.object({
  housingExpenses: z.string().refine(val => val !== '', errorMessages.required),
  utilities: z.string().refine(val => val !== '', errorMessages.required),
  foodGroceries: z.string().refine(val => val !== '', errorMessages.required),
  transportation: z.string().refine(val => val !== '', errorMessages.required),
  healthcare: z.string().refine(val => val !== '', errorMessages.required),
  childcareEducation: z.string().refine(val => val !== '', errorMessages.required),
  insurance: z.string().refine(val => val !== '', errorMessages.required),
  debtPayments: z.string().refine(val => val !== '', errorMessages.required),
  personalCareMedical: z.string().refine(val => val !== '', errorMessages.required),
});

// For savings & investments, all fields must have a value
export const savingsInvestmentsSchema = z.object({
  shortTermSavings: z.string().refine(val => val !== '', errorMessages.required),
  longTermInvestments: z.string().refine(val => val !== '', errorMessages.required),
  educationSavings: z.string().refine(val => val !== '', errorMessages.required),
  charitableGiving: z.string().refine(val => val !== '', errorMessages.required),
  retirementSavings: z.string().refine(val => val !== '', errorMessages.required),
});

// For discretionary expenses, all fields must have a value
export const discretionaryExpensesSchema = z.object({
  entertainmentLeisure: z.string().refine(val => val !== '', errorMessages.required),
  diningOut: z.string().refine(val => val !== '', errorMessages.required),
  shoppingPersonal: z.string().refine(val => val !== '', errorMessages.required),
  fitnessWellness: z.string().refine(val => val !== '', errorMessages.required),
  travelVacations: z.string().refine(val => val !== '', errorMessages.required),
  subscriptions: z.string().refine(val => val !== '', errorMessages.required),
  hobbiesRecreation: z.string().refine(val => val !== '', errorMessages.required),
  giftsSupport: z.string().refine(val => val !== '', errorMessages.required),
});

// For annual expenses, all fields must have a value
export const annualExpensesSchema = z.object({
  annualLicenses: z.string().refine(val => val !== '', errorMessages.required),
  homeRepairs: z.string().refine(val => val !== '', errorMessages.required),
  holidayGifts: z.string().refine(val => val !== '', errorMessages.required),
  personalCelebrations: z.string().refine(val => val !== '', errorMessages.required),
  familyEvents: z.string().refine(val => val !== '', errorMessages.required),
  vehicleMaintenance: z.string().refine(val => val !== '', errorMessages.required),
  professionalDevelopment: z.string().refine(val => val !== '', errorMessages.required),
});

// For additional info, fields are optional
export const additionalInfoSchema = formDataSchema.pick({
  liquidAssets: true,
  currentLiabilities: true,
  insuranceCoverage: true,
  necessaryExpenses: true,
  enjoymentSpend: true,
  totalAssets: true,
  totalDebt: true,
  totalNetWorth: true,
  savingsRate: true,
  debtToIncomeRatio: true,
}); 