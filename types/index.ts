// Form Data Types
export interface FormData {
  // Personal Information
  name: string;
  email: string;
  
  // Income
  primaryIncome: string;
  secondaryIncome: string;
  investmentIncome: string;
  governmentBenefits: string;
  alimonyChildSupport: string;
  otherIncome: string;
  
  // Pre-Tax Deductions
  federalIncomeTax: string;
  stateIncomeTax: string;
  ficaTax: string;
  retirementContributions: string;
  healthInsurancePremiums: string;
  hsaFsaContributions: string;
  unionDues: string;
  otherPayrollDeductions: string;
  
  // Fixed Monthly Expenses (Essential Needs)
  housingExpenses: string;
  utilities: string;
  foodGroceries: string;
  transportation: string;
  healthcare: string;
  childcareEducation: string;
  insurance: string;
  debtPayments: string;
  personalCareMedical: string;
  
  // Savings & Investments
  shortTermSavings: string;
  longTermInvestments: string;
  educationSavings: string;
  charitableGiving: string;
  retirementSavings: string;
  
  // Wants / Discretionary Expenses
  entertainmentLeisure: string;
  diningOut: string;
  shoppingPersonal: string;
  fitnessWellness: string;
  travelVacations: string;
  subscriptions: string;
  hobbiesRecreation: string;
  giftsSupport: string;
  
  // Annual or Irregular Expenses
  annualLicenses: string;
  homeRepairs: string;
  holidayGifts: string;
  personalCelebrations: string;
  familyEvents: string;
  vehicleMaintenance: string;
  professionalDevelopment: string;
  
  // Additional Fields for Ratios
  liquidAssets: string;
  currentLiabilities: string;
  insuranceCoverage: string;
  necessaryExpenses: string;
  enjoymentSpend: string;
  totalAssets: string;
  totalDebt: string;
  totalNetWorth: string;
  savingsRate: string;
  debtToIncomeRatio: string;
}

export interface NumericFormData extends Omit<FormData, 'name' | 'email'> {
  name: string;
  email: string;
  [key: string]: string | number;
}

// Income Statement Types
export interface CurrencyValue {
  value: number;
  formatted: string;
}

export interface Recommendation {
  recommended: string;
  actual: string;
  difference: string;
  status: 'good' | 'high' | 'low';
}

export interface Insight {
  type: 'alert' | 'warning' | 'positive' | 'recommendation' | 'information';
  text: string;
}

export interface IncomeStatement {
  id: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  statement_data: StatementData;
}

export interface StatementData {
  income: {
    primaryIncome: CurrencyField;
    secondaryIncome: CurrencyField;
    investmentIncome: CurrencyField;
    governmentBenefits: CurrencyField;
    alimonyChildSupport: CurrencyField;
    otherIncome: CurrencyField;
    grossRevenue: CurrencyField;
  };
  preTaxDeductions: {
    federalIncomeTax: CurrencyField;
    stateIncomeTax: CurrencyField;
    ficaTax: CurrencyField;
    retirementContributions: CurrencyField;
    healthInsurancePremiums: CurrencyField;
    hsaFsaContributions: CurrencyField;
    unionDues: CurrencyField;
    otherPayrollDeductions: CurrencyField;
    totalPreTaxDeductions: CurrencyField;
  };
  netRevenue: CurrencyField;
  essentialNeeds: {
    housingExpenses: CurrencyField;
    utilities: CurrencyField;
    foodGroceries: CurrencyField;
    transportation: CurrencyField;
    healthcare: CurrencyField;
    childcareEducation: CurrencyField;
    insurance: CurrencyField;
    debtPayments: CurrencyField;
    personalCareMedical: CurrencyField;
    totalNeedsExpenses: CurrencyField;
  };
  savingsInvestments: {
    shortTermSavings: CurrencyField;
    longTermInvestments: CurrencyField;
    educationSavings: CurrencyField;
    charitableGiving: CurrencyField;
    retirementSavings: CurrencyField;
    totalSavingsInvestments: CurrencyField;
  };
  grossProfit: CurrencyField;
  discretionaryExpenses: {
    entertainmentLeisure: CurrencyField;
    diningOut: CurrencyField;
    shoppingPersonal: CurrencyField;
    fitnessWellness: CurrencyField;
    travelVacations: CurrencyField;
    subscriptions: CurrencyField;
    hobbiesRecreation: CurrencyField;
    giftsSupport: CurrencyField;
    totalWantsExpenses: CurrencyField;
  };
  netProfit: CurrencyField;
  annualExpenses: {
    annualLicenses: CurrencyField;
    homeRepairs: CurrencyField;
    holidayGifts: CurrencyField;
    personalCelebrations: CurrencyField;
    familyEvents: CurrencyField;
    vehicleMaintenance: CurrencyField;
    professionalDevelopment: CurrencyField;
    totalAnnualExpenses: CurrencyField;
  };
  finalNetIncome: CurrencyField;
  recommendations: {
    needs: RecommendationField;
    wants: RecommendationField;
    savings: RecommendationField;
  };
  valueChainOpportunities: ValueCategory[];
  insights: string[];
}

interface CurrencyField {
  value: number;
  formatted: string;
}

interface RecommendationField {
  recommended: string;
  actual: string;
  difference: string;
  status: 'good' | 'high' | 'low';
}

export interface ValueCategory {
  id?: string;
  name: string;
  spending: number;
  monthlyAmount?: number;
  valueAlignment?: string;
  recommendations: string[];
}

// Form Steps Type
export interface FormStep {
  id: string;
  title: string;
}

// Component Props Types
export interface NumberFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  description?: string;
  prefix?: string;
  suffix?: string;
  tooltip?: string | null;
}

export interface ProgressBarProps {
  progress: number;
}

export interface DynamicFormProps {
  onSubmit: (formData: NumericFormData) => void;
  isSubmitting: boolean;
  initialEmail?: string;
  initialData?: any | null;
  isEditMode?: boolean;
}

export interface SummaryItemProps {
  label: string;
  value: string;
  color?: string;
}

export interface InsightItemProps {
  insight: Insight;
  index: number;
} 