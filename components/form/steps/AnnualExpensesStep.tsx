import React, { useMemo } from 'react';
import NumberField from '../NumberField';
import { FormData } from '../../../types/index';

interface AnnualExpensesStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const AnnualExpensesStep: React.FC<AnnualExpensesStepProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors,
  touched,
  isSubmitting
}) => {
  // Memoize rendered fields to prevent unnecessary re-renders
  const renderNumberField = useMemo(() => {
    return (id: keyof FormData, label: string, placeholder = '0.00', tooltip: string | null = null) => {
      return (
        <NumberField
          key={id}
          id={id}
          label={label}
          value={formData[id]}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors[id]}
          touched={touched[id]}
          disabled={isSubmitting}
          tooltip={tooltip}
        />
      );
    };
  }, [formData, errors, touched, handleChange, handleBlur, isSubmitting]);

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Don't forget your annual or irregular expenses</h3>
      <div className="bg-purple-50 p-4 rounded-md mb-6">
        <p className="text-purple-700 text-sm">
          <span className="font-semibold">Note:</span> Enter the <strong>monthly amount</strong> you set aside for these expenses, not the total annual cost. For example, if an expense costs $1,200 per year, enter $100 per month.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderNumberField(
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
        {renderNumberField(
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