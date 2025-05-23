import { FormStep } from '../types/index';

export const FORM_STEPS: FormStep[] = [
  { id: 'income', title: 'Income' },
  { id: 'preTaxDeductions', title: 'Pre-Tax Deductions' },
  { id: 'essentialNeeds', title: 'Essential Needs' },
  { id: 'costToEarn', title: 'Cost to Earn' },
  { id: 'savingsInvestments', title: 'Savings & Investments' },
  { id: 'lifestyleDividends', title: 'Lifestyle Dividends' },
  { id: 'annualExpenses', title: 'Annual Expenses' },
  { id: 'additionalInfo', title: 'Additional Information' },
  { id: 'review', title: 'Review & Submit' }
];

export const INITIAL_FORM_STATE = {
  // Income
  primaryIncome: '',
  secondaryIncome: '',
  investmentIncome: '',
  governmentBenefits: '',
  alimonyChildSupport: '',
  otherIncome: '',
  
  // Pre-Tax Deductions
  federalIncomeTax: '',
  stateIncomeTax: '',
  ficaTax: '',
  retirementContributions: '',
  healthInsurancePremiums: '',
  hsaFsaContributions: '',
  unionDues: '',
  otherPayrollDeductions: '',
  
  // Fixed Monthly Expenses (Essential Needs)
  housingExpenses: '',
  utilities: '',
  foodGroceries: '',
  transportation: '',
  healthcare: '',
  childcareEducation: '',
  insurance: '',
  debtPayments: '',
  personalCareMedical: '',
  
  // Cost to Earn (C2E) Specific Categories
  commutingTransportation: '',
  workTechnology: '',
  dependentCare: '',
  workShelterUtilities: '',
  workAttire: '',
  workMeals: '',
  licensingEducation: '',
  workHealthWellness: '',
  workDebtObligations: '',
  
  // Savings & Investments
  shortTermSavings: '',
  longTermInvestments: '',
  educationSavings: '',
  charitableGiving: '',
  retirementSavings: '',
  
  // Lifestyle Dividends (Discretionary Expenses)
  foodEntertainment: '',
  travelExperiences: '',
  subscriptionsMemberships: '',
  homeLivingDecor: '',
  clothingStyle: '',
  fitnessWellness: '',
  giftsCelebrations: '',
  hobbiesRecreation: '',
  beautySelfCare: '',
  convenienceTimeSavers: '',
  petCare: '',
  kidsSchooling: '',
  philanthropyFamilySupport: '',
  
  // Legacy discretionary expenses (for backward compatibility)
  entertainmentLeisure: '',
  diningOut: '',
  shoppingPersonal: '',
  travelVacations: '',
  subscriptions: '',
  giftsSupport: '',
  
  // Annual or Irregular Expenses
  annualLicenses: '',
  homeRepairs: '',
  holidayGifts: '',
  personalCelebrations: '',
  familyEvents: '',
  vehicleMaintenance: '',
  professionalDevelopment: '',
  
  // Additional Fields for Ratios
  liquidAssets: '',
  currentLiabilities: '',
  insuranceCoverage: '',
  necessaryExpenses: '',
  enjoymentSpend: '',
  totalAssets: '',
  totalDebt: '',
  totalNetWorth: '',
  savingsRate: '',
  debtToIncomeRatio: ''
};