export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Add your tables here as they are defined in your Supabase database
      // For example:
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          created_at: string | null
          email: string | null
          name: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          created_at?: string | null
          email?: string | null
          name?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          created_at?: string | null
          email?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      income_statements: {
        Row: {
          id: string
          user_id: string
          statement_data: {
            income: {
              primaryIncome: { value: number; formatted: string }
              secondaryIncome: { value: number; formatted: string }
              investmentIncome: { value: number; formatted: string }
              governmentBenefits: { value: number; formatted: string }
              alimonyChildSupport: { value: number; formatted: string }
              otherIncome: { value: number; formatted: string }
              grossRevenue: { value: number; formatted: string }
            }
            preTaxDeductions: {
              federalIncomeTax: { value: number; formatted: string }
              stateIncomeTax: { value: number; formatted: string }
              ficaTax: { value: number; formatted: string }
              retirementContributions: { value: number; formatted: string }
              healthInsurancePremiums: { value: number; formatted: string }
              hsaFsaContributions: { value: number; formatted: string }
              unionDues: { value: number; formatted: string }
              otherPayrollDeductions: { value: number; formatted: string }
              totalPreTaxDeductions: { value: number; formatted: string }
            }
            netRevenue: { value: number; formatted: string }
            costToEarn?: {
              housingC2E: { value: number; formatted: string }
              utilitiesC2E: { value: number; formatted: string }
              transportationC2E: { value: number; formatted: string }
              childcareC2E: { value: number; formatted: string }
              professionalDevC2E: { value: number; formatted: string }
              licensesC2E: { value: number; formatted: string }
              internetC2E: { value: number; formatted: string }
              otherC2E: { value: number; formatted: string }
              totalC2E: { value: number; formatted: string }
              percentOfIncome?: string
            }
            essentialNeeds: {
              housingExpenses: { value: number; formatted: string }
              utilities: { value: number; formatted: string }
              foodGroceries: { value: number; formatted: string }
              transportation: { value: number; formatted: string }
              healthcare: { value: number; formatted: string }
              childcareEducation: { value: number; formatted: string }
              insurance: { value: number; formatted: string }
              debtPayments: { value: number; formatted: string }
              personalCareMedical: { value: number; formatted: string }
              totalNeedsExpenses: { value: number; formatted: string }
            }
            savingsInvestments: {
              shortTermSavings: { value: number; formatted: string }
              longTermInvestments: { value: number; formatted: string }
              educationSavings: { value: number; formatted: string }
              charitableGiving: { value: number; formatted: string }
              retirementSavings: { value: number; formatted: string }
              totalSavingsInvestments: { value: number; formatted: string }
            }
            grossProfit: { value: number; formatted: string }
            discretionaryExpenses: {
              entertainmentLeisure: { value: number; formatted: string }
              diningOut: { value: number; formatted: string }
              shoppingPersonal: { value: number; formatted: string }
              fitnessWellness: { value: number; formatted: string }
              travelVacations: { value: number; formatted: string }
              subscriptions: { value: number; formatted: string }
              hobbiesRecreation: { value: number; formatted: string }
              giftsSupport: { value: number; formatted: string }
              totalWantsExpenses: { value: number; formatted: string }
            }
            netProfit: { value: number; formatted: string }
            annualExpenses: {
              annualLicenses: { value: number; formatted: string }
              homeRepairs: { value: number; formatted: string }
              holidayGifts: { value: number; formatted: string }
              personalCelebrations: { value: number; formatted: string }
              familyEvents: { value: number; formatted: string }
              vehicleMaintenance: { value: number; formatted: string }
              professionalDevelopment: { value: number; formatted: string }
              totalAnnualExpenses: { value: number; formatted: string }
            }
            finalNetIncome: { value: number; formatted: string }
            recommendations: {
              needs: {
                recommended: string
                actual: string
                difference: string
                status: 'good' | 'high' | 'low'
              }
              wants: {
                recommended: string
                actual: string
                difference: string
                status: 'good' | 'high' | 'low'
              }
              savings: {
                recommended: string
                actual: string
                difference: string
                status: 'good' | 'high' | 'low'
              }
            }
            insights: string[]
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          statement_data: Database['public']['Tables']['income_statements']['Row']['statement_data']
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          statement_data?: Database['public']['Tables']['income_statements']['Row']['statement_data']
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_statements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 