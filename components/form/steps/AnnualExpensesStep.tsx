import React, { useMemo, useCallback, useState, useEffect } from 'react';
import NumberField from '../NumberField';
import NumberFieldWithC2E from '../NumberFieldWithC2E';
import { FormData } from '../../../types/index';

interface AnnualExpensesStepProps {
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

const AnnualExpensesStep: React.FC<AnnualExpensesStepProps> = ({
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
    return (id: string, label: string, placeholder = '0.00', tooltip: string | null = null) => {
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
        />
      );
    };
  }, [formData, errors, touched, handleChange, handleBlur, isSubmitting]);

  // Memoize rendered C2E fields
  const renderC2EField = useMemo(() => {
    return (id: string, label: string, placeholder = '0.00', tooltip: string | null = null) => {
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
        />
      );
    };
  }, [formData, errors, touched, handleChange, handleBlur, isSubmitting, c2eSettings, handleC2EChange]);

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Don't forget your annual or irregular expenses</h3>
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md mb-6">
        <p className="text-purple-700 dark:text-purple-300 text-sm">
          <span className="font-semibold">Note:</span> Enter the <strong>monthly amount</strong> you set aside for these expenses, not the total annual cost. For example, if an expense costs $1,200 per year, enter $100 per month.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderC2EField(
          'annualLicenses', 
          'Annual Licenses & Fees', 
          '50.00',
          'Monthly amount for vehicle registration, professional licenses, memberships renewed annually, etc.'
        )}
        {renderNumberField(
          'homeRepairs', 
          'Home Repairs & Maintenance', 
          '150.00',
          'Monthly amount saved for occasional home repairs, maintenance, and improvements.'
        )}
        {renderNumberField(
          'holidayGifts', 
          'Holiday Gifts', 
          '100.00',
          'Monthly amount set aside for holiday gift shopping.'
        )}
        {renderNumberField(
          'personalCelebrations', 
          'Personal Celebrations', 
          '50.00',
          'Monthly amount for birthdays, anniversaries, and other special occasions.'
        )}
        {renderNumberField(
          'familyEvents', 
          'Family Events', 
          '50.00',
          'Monthly amount for family reunions, graduations, weddings, etc.'
        )}
        {renderNumberField(
          'vehicleMaintenance', 
          'Vehicle Maintenance & Repairs', 
          '100.00',
          'Monthly amount for oil changes, repairs, new tires, etc.'
        )}
        {renderC2EField(
          'professionalDevelopment', 
          'Professional Development', 
          '50.00',
          'Monthly amount for courses, certifications, professional books, etc.'
        )}
      </div>
    </div>
  );
};

export default React.memo(AnnualExpensesStep); 