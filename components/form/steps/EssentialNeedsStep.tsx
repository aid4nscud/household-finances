import React, { useMemo, useCallback, useState, useEffect } from 'react';
import NumberField from '../NumberField';
import NumberFieldWithC2E from '../NumberFieldWithC2E';
import { FormData } from '../../../types/index';

interface EssentialNeedsStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

interface C2ESetting {
  isC2E: boolean;
  percentage: number;
}

type C2ESettings = Record<string, C2ESetting>;

const EssentialNeedsStep: React.FC<EssentialNeedsStepProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors,
  touched,
  isSubmitting
}) => {
  // Local state to track C2E settings
  const [c2eSettings, setC2ESettings] = useState<C2ESettings>({});
  
  // Initialize C2E settings from form data
  useEffect(() => {
    if (formData.costToEarnSettings) {
      setC2ESettings({...formData.costToEarnSettings});
    } else {
      // Initialize with empty settings
      formData.costToEarnSettings = {};
    }
  }, []);
  
  // Handler for C2E toggle changes
  const handleC2EChange = useCallback((fieldId: string, isC2E: boolean, percentage?: number) => {
    // Update local state
    setC2ESettings(prev => {
      const newSettings = {...prev};
      newSettings[fieldId] = {
        isC2E,
        percentage: percentage || 100
      };
      return newSettings;
    });
    
    // Update form data
    if (!formData.costToEarnSettings) {
      formData.costToEarnSettings = {};
    }
    
    formData.costToEarnSettings[fieldId] = {
      isC2E,
      percentage: percentage || 100
    };
  }, [formData]);

  // Memoize rendered fields to prevent unnecessary re-renders
  const renderNumberField = useMemo(() => {
    return (id: string, label: string, placeholder = '0.00', tooltip: string | null = null, isRequired = false) => {
      const errorValue = errors[id] !== null ? errors[id] : undefined;
      return (
        <NumberField
          key={id}
          id={id}
          name={id}
          label={label}
          value={formData[id as keyof FormData] as string}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errorValue}
          touched={touched[id]}
          disabled={isSubmitting}
          tooltip={tooltip}
          isRequired={isRequired}
        />
      );
    };
  }, [formData, errors, touched, handleChange, handleBlur, isSubmitting]);

  // Memoize rendered C2E fields
  const renderC2EField = useMemo(() => {
    return (id: string, label: string, placeholder = '0.00', tooltip: string | null = null, isRequired = false) => {
      const errorValue = errors[id] !== null ? errors[id] : undefined;
      const setting = c2eSettings[id];
      
      return (
        <NumberFieldWithC2E
          key={id}
          id={id}
          name={id}
          label={label}
          value={formData[id as keyof FormData] as string}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errorValue}
          touched={touched[id]}
          disabled={isSubmitting}
          tooltip={tooltip}
          showC2EToggle={true}
          isC2E={setting?.isC2E || false}
          c2ePercentage={setting?.percentage || 100}
          onC2EChange={(isC2E, percentage) => handleC2EChange(id, isC2E, percentage)}
          isRequired={isRequired}
        />
      );
    };
  }, [formData, errors, touched, handleChange, handleBlur, isSubmitting, c2eSettings, handleC2EChange]);

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Let's review your essential expenses</h3>
      <div className="mb-4 p-4 bg-[#00C805]/5 dark:bg-[#00C805]/10 border border-[#00C805]/20 dark:border-[#00C805]/20 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Cost to Earn:</strong> Flag expenses directly required to generate your income, like commuting or work-allocated home expenses.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderC2EField(
          'housingExpenses', 
          'Housing (Mortgage/Rent, Taxes, HOA)', 
          '1500.00',
          'Total monthly housing costs including mortgage/rent, property taxes, HOA fees, etc.',
          true
        )}
        {renderC2EField(
          'utilities', 
          'Utilities (Electric, Water, Gas, Trash)', 
          '300.00',
          'Monthly expenses for all utility services.',
          true
        )}
        {renderNumberField(
          'foodGroceries', 
          'Food & Groceries', 
          '600.00',
          'Monthly food and grocery expenses (excluding dining out).',
          true
        )}
        {renderC2EField(
          'transportation', 
          'Transportation', 
          '400.00',
          'Monthly expenses for transportation including car payments, fuel, public transit, etc.'
        )}
        {renderNumberField(
          'healthcare', 
          'Healthcare', 
          '200.00',
          'Monthly healthcare expenses including medication, doctor visits, etc. (not including insurance premiums).'
        )}
        {renderC2EField(
          'childcareEducation', 
          'Childcare & Education', 
          '0.00',
          'Monthly expenses for childcare, school tuition, etc.'
        )}
        {renderNumberField(
          'insurance', 
          'Insurance (Auto, Home, Life)', 
          '150.00',
          'Monthly insurance expenses not already deducted from your paycheck.'
        )}
        {renderNumberField(
          'debtPayments', 
          'Minimum Debt Payments', 
          '300.00',
          'Monthly minimum payments on loans, credit cards, etc.'
        )}
        {renderNumberField(
          'personalCareMedical', 
          'Personal Care & Medical', 
          '100.00',
          'Monthly expenses for personal care items, medications, etc.'
        )}
      </div>
    </div>
  );
};

export default React.memo(EssentialNeedsStep); 