import React, { useMemo } from 'react';
import NumberField from '../NumberField';
import { FormData } from '../../../types/index';

interface PreTaxDeductionsStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const PreTaxDeductionsStep: React.FC<PreTaxDeductionsStepProps> = ({
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
      <h3 className="text-xl font-semibold text-gray-800 mb-4">What are your pre-tax deductions?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderNumberField(
          'federalIncomeTax', 
          'Federal Income Tax', 
          '800.00',
          'Estimated monthly federal income tax withheld from your paycheck.'
        )}
        {renderNumberField(
          'stateIncomeTax', 
          'State Income Tax', 
          '200.00',
          'Estimated monthly state income tax withheld from your paycheck.'
        )}
        {renderNumberField(
          'ficaTax', 
          'FICA (Social Security + Medicare)', 
          '400.00',
          'FICA taxes include Social Security (6.2%) and Medicare (1.45%) taxes.'
        )}
        {renderNumberField(
          'retirementContributions', 
          '401(k) / Retirement Contributions', 
          '300.00',
          'Monthly contributions to employer-sponsored retirement plans like 401(k), 403(b), or similar.'
        )}
        {renderNumberField(
          'healthInsurancePremiums', 
          'Health Insurance Premiums', 
          '150.00',
          'Monthly pre-tax premiums for health insurance.'
        )}
        {renderNumberField(
          'hsaFsaContributions', 
          'HSA/FSA Contributions', 
          '50.00',
          'Monthly contributions to Health Savings Account (HSA) or Flexible Spending Account (FSA).'
        )}
        {renderNumberField(
          'unionDues', 
          'Union Dues', 
          '0.00',
          'Monthly union dues or professional organization fees deducted pre-tax.'
        )}
        {renderNumberField(
          'otherPayrollDeductions', 
          'Other Payroll Deductions', 
          '0.00',
          'Any other pre-tax deductions not covered in the categories above.'
        )}
      </div>
    </div>
  );
};

export default React.memo(PreTaxDeductionsStep); 