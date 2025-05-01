import React, { useMemo } from 'react';
import NumberField from '../NumberField';
import { FormData } from '../../../types/index';

interface DiscretionaryExpensesStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const DiscretionaryExpensesStep: React.FC<DiscretionaryExpensesStepProps> = ({
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
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Track your discretionary expenses</h3>
      <div className="bg-amber-50 p-4 rounded-md mb-6">
        <p className="text-amber-700 text-sm">
          <span className="font-semibold">Note:</span> These are "wants" rather than "needs" - the expenses that enhance your quality of life but aren't essential.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderNumberField(
          'entertainmentLeisure', 
          'Entertainment & Leisure', 
          '100.00',
          'Monthly expenses for entertainment like streaming services, movies, concerts, sports events, etc.'
        )}
        {renderNumberField(
          'diningOut', 
          'Dining Out & Takeout', 
          '200.00',
          'Monthly expenses for restaurants, cafes, takeout, delivery, etc.'
        )}
        {renderNumberField(
          'shoppingPersonal', 
          'Shopping & Personal Items', 
          '150.00',
          'Monthly expenses for clothing, accessories, non-essential personal items, etc.'
        )}
        {renderNumberField(
          'fitnessWellness', 
          'Fitness & Wellness', 
          '50.00',
          'Monthly expenses for gym memberships, fitness classes, wellness programs, etc.'
        )}
        {renderNumberField(
          'travelVacations', 
          'Travel & Vacations', 
          '200.00',
          'Monthly budget set aside for travel and vacations.'
        )}
        {renderNumberField(
          'subscriptions', 
          'Subscriptions & Memberships', 
          '50.00',
          'Monthly expenses for subscriptions and memberships beyond essential services.'
        )}
        {renderNumberField(
          'hobbiesRecreation', 
          'Hobbies & Recreation', 
          '100.00',
          'Monthly expenses for hobbies, sports, and recreational activities.'
        )}
        {renderNumberField(
          'giftsSupport', 
          'Gifts & Support for Others', 
          '50.00',
          'Monthly expenses for gifts, helping family/friends, etc.'
        )}
      </div>
    </div>
  );
};

export default React.memo(DiscretionaryExpensesStep); 