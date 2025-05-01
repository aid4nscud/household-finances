import React, { useMemo } from 'react';
import NumberField from '../NumberField';
import { FormData } from '../../../types/index';

interface AdditionalInfoStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
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
          key={id}
          id={id}
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
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Almost done! Additional financial information</h3>
      <div className="bg-green-50 p-4 rounded-md mb-6">
        <p className="text-green-700 text-sm">
          <span className="font-semibold">Note:</span> This information helps us calculate important financial ratios and provide more personalized insights.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderNumberField(
          'liquidAssets', 
          'Liquid Assets', 
          '5000.00',
          'Total value of cash, checking/savings accounts, and other easily accessible funds.'
        )}
        {renderNumberField(
          'currentLiabilities', 
          'Current Liabilities', 
          '2000.00',
          'Total amount of short-term debt payments due in the next 12 months.'
        )}
        {renderNumberField(
          'insuranceCoverage', 
          'Insurance Coverage', 
          '500000.00',
          'Total insurance coverage (life, disability, etc.) in dollar amount.'
        )}
        {renderNumberField(
          'totalAssets', 
          'Total Assets', 
          '250000.00',
          'Total value of all assets: home, vehicles, investments, retirement accounts, etc.'
        )}
        {renderNumberField(
          'totalDebt', 
          'Total Debt', 
          '150000.00',
          'Total of all debts and loans: mortgage, car loans, student loans, credit cards, etc.'
        )}
        {renderNumberField(
          'totalNetWorth', 
          'Total Net Worth', 
          '100000.00',
          'Your total assets minus total liabilities (automatically calculated if you fill in the fields above).'
        )}
      </div>
    </div>
  );
};

export default React.memo(AdditionalInfoStep); 