import React, { useMemo } from 'react';
import NumberField from '../NumberField';
import { FormData } from '../../../types/index';

interface EssentialNeedsStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const EssentialNeedsStep: React.FC<EssentialNeedsStepProps> = ({
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
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Let's review your essential expenses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderNumberField(
          'housingExpenses', 
          'Housing (Mortgage/Rent, Taxes, HOA)', 
          '1500.00',
          'Total monthly housing costs including mortgage/rent, property taxes, HOA fees, etc.'
        )}
        {renderNumberField(
          'utilities', 
          'Utilities (Electric, Water, Gas, Trash)', 
          '300.00',
          'Monthly expenses for all utility services.'
        )}
        {renderNumberField(
          'foodGroceries', 
          'Food & Groceries', 
          '600.00',
          'Monthly food and grocery expenses (excluding dining out).'
        )}
        {renderNumberField(
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
        {renderNumberField(
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