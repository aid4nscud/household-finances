import React, { useMemo } from 'react';
import NumberField from '../NumberField';
import { FormData } from '../../../types/index';

interface SavingsInvestmentsStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const SavingsInvestmentsStep: React.FC<SavingsInvestmentsStepProps> = ({
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
      const errorValue = errors[id] !== null ? errors[id] : undefined;

      return (
        <NumberField
          key={id.toString()}
          id={id.toString()}
          name={id.toString()}
          label={label}
          value={formData[id]}
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

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">How much are you saving and investing?</h3>
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <p className="text-blue-700 text-sm">
          <span className="font-semibold">Note:</span> These are additional savings beyond any retirement contributions already deducted from your paycheck.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderNumberField(
          'shortTermSavings', 
          'Short-term Savings', 
          '200.00',
          'Monthly contributions to emergency fund, vacation fund, or other short-term savings goals.'
        )}
        {renderNumberField(
          'longTermInvestments', 
          'Long-term Investments', 
          '300.00',
          'Monthly contributions to investment accounts like IRAs, taxable brokerage accounts, etc.'
        )}
        {renderNumberField(
          'educationSavings', 
          'Education Savings', 
          '0.00',
          'Monthly contributions to 529 plans or other education savings accounts.'
        )}
        {renderNumberField(
          'charitableGiving', 
          'Charitable Giving', 
          '50.00',
          'Monthly charitable donations and contributions.'
        )}
        {renderNumberField(
          'retirementSavings', 
          'Additional Retirement Savings', 
          '0.00',
          'Any retirement savings beyond what is already deducted from your paycheck.'
        )}
      </div>
    </div>
  );
};

export default React.memo(SavingsInvestmentsStep); 