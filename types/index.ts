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
  
  // Cost to Earn (C2E) Specific Categories
  commutingTransportation: string;     // Gas, public transit, parking for work
  workTechnology: string;              // Cell phone, computer, software for work
  dependentCare: string;               // Childcare while working
  workShelterUtilities: string;        // Portion of housing/utilities for work
  workAttire: string;                  // Work clothing, dry cleaning
  workMeals: string;                   // Lunches at work, coffee
  licensingEducation: string;          // Professional dues, certifications
  workHealthWellness: string;          // Health costs required to work
  workDebtObligations: string;         // Student loans, work vehicle loans
  
  // Savings & Investments
  shortTermSavings: string;
  longTermInvestments: string;
  educationSavings: string;
  charitableGiving: string;
  retirementSavings: string;
  
  // Lifestyle Dividends (Discretionary Expenses)
  foodEntertainment: string;           // Dining out, takeout, movies, events
  travelExperiences: string;           // Vacations, hotels, weekend trips
  subscriptionsMemberships: string;    // Streaming, subscription boxes, gym
  homeLivingDecor: string;             // Furniture, décor, home upgrades
  clothingStyle: string;               // Fashion, accessories, seasonal wear
  fitnessWellness: string;             // Massage, yoga, boutique fitness
  giftsCelebrations: string;           // Gifts, parties, holidays
  hobbiesRecreation: string;           // Sports, crafts, games, creative hobbies
  beautySelfCare: string;              // Haircuts, skincare, cosmetics, nails
  convenienceTimeSavers: string;       // Meal kits, cleaning help, lawn services
  petCare: string;                     // Pet food, grooming, vet visits
  kidsSchooling: string;               // Private tuition, music, sports, dance
  philanthropyFamilySupport: string;   // Charitable giving, helping family
  
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

  // Cost to Earn settings
  [key: string]: string | any;
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
  personalInfo?: {
    name: string;
  };
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
  costToEarn: {
    housingC2E: CurrencyField;
    utilitiesC2E: CurrencyField;
    transportationC2E: CurrencyField;
    childcareC2E: CurrencyField;
    professionalDevC2E: CurrencyField;
    licensesC2E: CurrencyField;
    internetC2E: CurrencyField;
    otherC2E: CurrencyField;
    
    // Added detailed C2E categories
    commutingTransportation: CurrencyField;
    workTechnology: CurrencyField;
    dependentCare: CurrencyField;
    workShelterUtilities: CurrencyField;
    workAttire: CurrencyField;
    workMeals: CurrencyField;
    licensingEducation: CurrencyField;
    workHealthWellness: CurrencyField;
    workDebtObligations: CurrencyField;
    
    totalC2E: CurrencyField;
    percentOfIncome?: string;
  };
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
    percentOfIncome?: string;
  };
  savingsInvestments: {
    shortTermSavings: CurrencyField;
    longTermInvestments: CurrencyField;
    educationSavings: CurrencyField;
    charitableGiving: CurrencyField;
    retirementSavings: CurrencyField;
    totalSavingsInvestments: CurrencyField;
    percentOfIncome?: string;
  };
  grossProfit: CurrencyField;
  discretionaryExpenses: {
    // Legacy fields
    entertainmentLeisure: CurrencyField;
    diningOut: CurrencyField;
    shoppingPersonal: CurrencyField;
    fitnessWellness: CurrencyField;
    travelVacations: CurrencyField;
    subscriptions: CurrencyField;
    hobbiesRecreation: CurrencyField;
    giftsSupport: CurrencyField;
    
    // New Lifestyle Dividends categories
    foodEntertainment: CurrencyField;
    travelExperiences: CurrencyField;
    subscriptionsMemberships: CurrencyField;
    homeLivingDecor: CurrencyField;
    clothingStyle: CurrencyField;
    giftsCelebrations: CurrencyField;
    beautySelfCare: CurrencyField;
    convenienceTimeSavers: CurrencyField;
    petCare: CurrencyField;
    kidsSchooling: CurrencyField;
    philanthropyFamilySupport: CurrencyField;
    
    totalWantsExpenses: CurrencyField;
    percentOfIncome?: string;
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
  financialRatios?: Record<string, string>;
  insights: string[] | Insight[];
  id?: string;
  created_at?: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  statement_data?: StatementData;
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

// Preserve the existing StatementData type for backward compatibility
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
  costToEarn?: {
    housingC2E: CurrencyField;
    utilitiesC2E: CurrencyField;
    transportationC2E: CurrencyField;
    childcareC2E: CurrencyField;
    professionalDevC2E: CurrencyField;
    licensesC2E: CurrencyField;
    internetC2E: CurrencyField;
    otherC2E: CurrencyField;
    totalC2E: CurrencyField;
    percentOfIncome?: string;
  };
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
  insights: string[];
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
  name?: string;
  value: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  description?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  tooltip?: string | null;
  isRequired?: boolean;
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

export interface NumberFieldWithC2EProps extends NumberFieldProps {
  showC2EToggle?: boolean;
  isC2E?: boolean;
  c2ePercentage?: number;
  onC2EChange?: (isC2E: boolean, percentage?: number) => void;
  isRequired?: boolean;
} 