import { useState, useCallback } from 'react';
import { FormData } from '../types/index';
import { 
  formDataSchema, 
  personalInfoSchema, 
  incomeSchema,
  preTaxDeductionsSchema,
  essentialNeedsSchema,
  savingsInvestmentsSchema,
  discretionaryExpensesSchema,
  annualExpensesSchema,
  additionalInfoSchema
} from '../utils/validationSchema';
import { ZodError } from 'zod';

interface UseFormValidationProps {
  initialFormState: FormData;
}

interface ValidationResult {
  formData: FormData;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  validateField: (name: string, value: string) => boolean;
  validateStep: (stepId: string) => boolean;
  validateForm: () => boolean;
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  resetForm: () => void;
}

export const useFormValidation = ({ initialFormState }: UseFormValidationProps): ValidationResult => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Helper function to extract Zod validation errors
  const extractZodErrors = useCallback((error: ZodError): Record<string, string> => {
    const formattedErrors: Record<string, string> = {};
    
    error.errors.forEach((err) => {
      if (err.path.length > 0) {
        formattedErrors[err.path[0].toString()] = err.message;
      }
    });
    
    return formattedErrors;
  }, []);

  // Validate a single field using Zod
  const validateField = useCallback((name: string, value: string): boolean => {
    // Create a single-field schema to validate
    const fieldData = { [name]: value };
    
    try {
      // Validate the specific field
      formDataSchema.pick({ [name]: true }).parse(fieldData);
      
      // Clear error if validation passes
      setErrors(prev => ({ ...prev, [name]: null }));
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = extractZodErrors(error);
        setErrors(prev => ({ ...prev, ...fieldErrors }));
        return false;
      }
      
      // Default error message if not a ZodError
      setErrors(prev => ({ ...prev, [name]: 'Invalid input' }));
      return false;
    }
  }, [extractZodErrors]);

  // Validate fields for current step using the appropriate schema
  const validateStep = useCallback((stepId: string): boolean => {
    console.log(`Validating step ${stepId}`);
    // Get the subset of form data for the current step
    let stepSchema;
    let requiredFields: string[] = [];
    
    // Select the appropriate schema based on step ID
    switch (stepId) {
      case 'personalInfo':
        stepSchema = personalInfoSchema;
        requiredFields = ['name', 'email'];
        break;
        
      case 'income':
        stepSchema = incomeSchema;
        requiredFields = [
          'primaryIncome', 
          'secondaryIncome', 
          'investmentIncome',
          'governmentBenefits',
          'alimonyChildSupport',
          'otherIncome'
        ];
        break;
        
      case 'preTaxDeductions':
        stepSchema = preTaxDeductionsSchema;
        requiredFields = [
          'federalIncomeTax',
          'stateIncomeTax',
          'ficaTax',
          'retirementContributions',
          'healthInsurancePremiums',
          'hsaFsaContributions',
          'unionDues',
          'otherPayrollDeductions'
        ];
        break;
        
      case 'essentialNeeds':
        stepSchema = essentialNeedsSchema;
        requiredFields = [
          'housingExpenses',
          'utilities',
          'foodGroceries',
          'transportation',
          'healthcare',
          'childcareEducation',
          'insurance',
          'debtPayments',
          'personalCareMedical'
        ];
        break;
        
      case 'savingsInvestments':
        stepSchema = savingsInvestmentsSchema;
        requiredFields = [
          'shortTermSavings',
          'longTermInvestments',
          'educationSavings',
          'charitableGiving',
          'retirementSavings'
        ];
        break;
        
      case 'discretionaryExpenses':
        stepSchema = discretionaryExpensesSchema;
        requiredFields = [
          'entertainmentLeisure',
          'diningOut',
          'shoppingPersonal',
          'fitnessWellness',
          'travelVacations',
          'subscriptions',
          'hobbiesRecreation',
          'giftsSupport'
        ];
        break;
        
      case 'annualExpenses':
        stepSchema = annualExpensesSchema;
        requiredFields = [
          'annualLicenses',
          'homeRepairs',
          'holidayGifts',
          'personalCelebrations',
          'familyEvents',
          'vehicleMaintenance',
          'professionalDevelopment'
        ];
        break;
        
      case 'additionalInfo':
        stepSchema = additionalInfoSchema;
        // No required fields in this step
        break;
        
      case 'review':
        // No validation for review step
        return true;
        
      default:
        // No validation for unknown steps
        return true;
    }
    
    // Mark all fields in this step as touched to show validation errors
    if (requiredFields.length > 0) {
      const updatedTouched = { ...touched };
      requiredFields.forEach(field => {
        updatedTouched[field] = true;
      });
      setTouched(updatedTouched);
    }
    
    try {
      // Extract only the relevant fields for the current step
      const stepData: Partial<FormData> = {};
      if (stepSchema && stepSchema.shape) {
        Object.keys(stepSchema.shape).forEach(key => {
          stepData[key as keyof FormData] = formData[key as keyof FormData];
        });
      }
      
      // Validate the step data
      if (stepSchema) {
        stepSchema.parse(stepData);
        
        // Clear errors for the fields in this step
        const updatedErrors = { ...errors };
        if (stepSchema.shape) {
          Object.keys(stepSchema.shape).forEach(key => {
            updatedErrors[key] = null;
          });
        }
        setErrors(updatedErrors);
        
        return true;
      }
      
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = extractZodErrors(error);
        setErrors(prev => ({ ...prev, ...fieldErrors }));
        console.log('Validation errors:', fieldErrors);
        return false;
      }
      
      return false;
    }
  }, [formData, extractZodErrors, touched, errors]);

  // Validate all form data
  const validateForm = useCallback((): boolean => {
    // Mark required fields as touched
    const requiredFields: Record<string, boolean> = {
      name: true,
      email: true, 
      primaryIncome: true,
    };
    
    setTouched(prev => ({
      ...prev,
      ...requiredFields
    }));
    
    try {
      // Validate the entire form
      formDataSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = extractZodErrors(error);
        setErrors(prev => ({ ...prev, ...fieldErrors }));
      }
      return false;
    }
  }, [formData, extractZodErrors]);

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type } = e.target;
    
    // For number inputs, ensure they're positive numbers
    if (type === 'number') {
      // Allow empty string or positive numbers
      if (value === '' || parseFloat(value) >= 0) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // If there was an error, clear it on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  // Mark field as touched on blur and validate
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, [validateField]);

  // Reset form to initial state
  const resetForm = useCallback((): void => {
    setFormData(initialFormState);
    setErrors({});
    setTouched({});
  }, [initialFormState]);

  return {
    formData,
    errors,
    touched,
    setFormData,
    handleChange,
    handleBlur,
    validateField,
    validateStep,
    validateForm,
    setTouched,
    resetForm
  };
};

export default useFormValidation; 