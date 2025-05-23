import React, { useMemo, useCallback, useState, useEffect } from 'react';
import NumberField from '../NumberField';
import NumberFieldWithC2E from '../NumberFieldWithC2E';
import { FormData } from '../../../types/index';

interface CostToEarnStepProps {
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

const CostToEarnStep: React.FC<CostToEarnStepProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors,
  touched,
  isSubmitting
}) => {
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

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cost to Earn (C2E)</h3>
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <strong className="text-purple-700 dark:text-purple-300">Cost to Earn:</strong> Represents expenses directly tied to generating your income - the personal equivalent of a business's "Cost of Goods Sold."
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Enter expenses that are <em>specifically required</em> for you to earn your income, not general living expenses.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Commuting & Transportation */}
        {renderNumberField(
          'commutingTransportation', 
          'Commuting & Transportation', 
          '250.00',
          'Gas for commuting, public transit passes, tolls, parking fees, rideshares to work, work-related vehicle maintenance.'
        )}
        
        {/* Work Technology & Tools */}
        {renderNumberField(
          'workTechnology', 
          'Work Technology & Tools', 
          '100.00',
          'Cell phone (portion used for work), laptops/computers, software, subscriptions, home internet for work use.'
        )}
        
        {/* Dependent Care */}
        {renderNumberField(
          'dependentCare', 
          'Childcare & Dependent Care', 
          '400.00',
          'Daycare, preschool, or care for dependents that allows you to work.'
        )}
        
        {/* Shelter & Utilities for Work */}
        {renderNumberField(
          'workShelterUtilities', 
          'Work-From-Home Expenses', 
          '200.00',
          'Portion of rent/mortgage, utilities, and insurance allocated to home office or work space.'
        )}
        
        {/* Work Attire */}
        {renderNumberField(
          'workAttire', 
          'Professional Appearance & Attire', 
          '75.00',
          'Work uniforms, required clothing, dry cleaning for work clothes.'
        )}
        
        {/* Work-Related Food */}
        {renderNumberField(
          'workMeals', 
          'Work-Related Meals', 
          '100.00',
          'Lunches at work, coffee while commuting, meals required for work (not personal or social dining).'
        )}
        
        {/* Licensing & Education */}
        {renderNumberField(
          'licensingEducation', 
          'Licensing & Credentials', 
          '50.00',
          'Professional dues, memberships, licensing fees, certifications, continuing education required for your role.'
        )}
        
        {/* Work-Related Health */}
        {renderNumberField(
          'workHealthWellness', 
          'Work-Required Health Costs', 
          '50.00',
          'Health costs specifically required to maintain your ability to work (not covered by insurance).'
        )}
        
        {/* Work-Supporting Debt */}
        {renderNumberField(
          'workDebtObligations', 
          'Work-Related Debt Payments', 
          '200.00',
          'Student loan minimum payments, car loans for commuting vehicles, other debt directly related to your income.'
        )}
      </div>
    </div>
  );
};

export default React.memo(CostToEarnStep);