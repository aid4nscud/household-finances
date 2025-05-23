import React, { useMemo } from 'react';
import NumberField from '../NumberField';
import { FormData } from '../../../types/index';

interface IncomeStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const IncomeStep: React.FC<IncomeStepProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors,
  touched,
  isSubmitting
}) => {
  // Memoize rendered fields to prevent unnecessary re-renders
  const renderNumberField = useMemo(() => {
    return (id: Extract<keyof FormData, string>, label: string, placeholder = '0.00', tooltip: string | null = null, isRequired = false) => {
      const errorValue = errors[id] !== null ? errors[id] : undefined;
      return (
        <NumberField
          key={id}
          id={id}
          name={id}
          label={label}
          value={formData[id]}
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

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Tell us about your income</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderNumberField(
          'primaryIncome', 
          'Primary Income (Salary/Wages)', 
          '5000.00',
          'Your main source of income, such as salary or wages. Enter the monthly amount before taxes.',
          true
        )}
        {renderNumberField(
          'secondaryIncome', 
          'Secondary Income (Side Hustles)', 
          '1000.00',
          'Any additional income from freelance work, part-time jobs, or side businesses.'
        )}
        {renderNumberField(
          'investmentIncome', 
          'Investment Income (Dividends, Rental)', 
          '500.00',
          'Monthly income from investments, dividends, interest, or rental properties.'
        )}
        {renderNumberField(
          'governmentBenefits', 
          'Government Benefits', 
          '0.00',
          'Income from government programs such as unemployment, disability, or social security.'
        )}
        {renderNumberField(
          'alimonyChildSupport', 
          'Alimony or Child Support', 
          '0.00',
          'Monthly payments received for alimony or child support.'
        )}
        {renderNumberField(
          'otherIncome', 
          'Other Income (Bonuses, Gifts)', 
          '0.00',
          'Any other income sources not covered above, such as bonuses, gifts, or inheritance.'
        )}
      </div>
    </div>
  );
};

export default React.memo(IncomeStep); 