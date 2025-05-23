import React, { useMemo } from 'react';
import NumberField from '../NumberField';
import { FormData } from '../../../types/index';

interface LifestyleDividendsStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const LifestyleDividendsStep: React.FC<LifestyleDividendsStepProps> = ({
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
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Lifestyle Dividends</h3>
      <div className="mb-6 p-4 bg-[#00C805]/5 dark:bg-[#00C805]/10 rounded-lg border border-[#00C805]/20 dark:border-[#00C805]/20">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <strong className="text-[#00C805]">Lifestyle Dividends</strong> are the quality-of-life expenses that enhance your daily life - the "profit" from your earnings that you choose to reinvest in your wellbeing and enjoyment.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          These are discretionary "wants" rather than "needs" - expenses that make life more enjoyable but aren't essential.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Food & Entertainment */}
        {renderNumberField(
          'foodEntertainment', 
          'Food & Entertainment', 
          '300.00',
          'Dining out, takeout, movies, concerts, sports events, etc.'
        )}
        
        {/* 2. Travel & Experiences */}
        {renderNumberField(
          'travelExperiences', 
          'Travel & Experiences', 
          '200.00',
          'Vacations, hotels, weekend trips, experiences, etc.'
        )}
        
        {/* 3. Subscriptions & Memberships */}
        {renderNumberField(
          'subscriptionsMemberships', 
          'Subscriptions & Memberships', 
          '75.00',
          'Streaming services, subscription boxes, gym memberships, etc.'
        )}
        
        {/* 4. Home Living & Decor */}
        {renderNumberField(
          'homeLivingDecor', 
          'Home Living & Decor', 
          '100.00',
          'Furniture, decor, home upgrades beyond basic needs.'
        )}
        
        {/* 5. Clothing & Personal Style */}
        {renderNumberField(
          'clothingStyle', 
          'Clothing & Personal Style', 
          '150.00',
          'Fashion, accessories, seasonal wear beyond basic needs.'
        )}
        
        {/* 6. Fitness & Wellness */}
        {renderNumberField(
          'fitnessWellness', 
          'Fitness & Wellness', 
          '80.00',
          'Massage, yoga, boutique fitness, wellness products (not medically required).'
        )}
        
        {/* 7. Gifts & Celebrations */}
        {renderNumberField(
          'giftsCelebrations', 
          'Gifts & Celebrations', 
          '75.00',
          'Gifts, parties, holidays, celebrations.'
        )}
        
        {/* 8. Hobbies & Recreation */}
        {renderNumberField(
          'hobbiesRecreation', 
          'Hobbies & Recreation', 
          '100.00',
          'Sports equipment, crafts, games, creative hobbies, recreational activities.'
        )}
        
        {/* 9. Beauty & Self-Care */}
        {renderNumberField(
          'beautySelfCare', 
          'Beauty & Self-Care', 
          '80.00',
          'Haircuts, skincare, cosmetics, nails, spa treatments.'
        )}
        
        {/* 10. Convenience & Time Savers */}
        {renderNumberField(
          'convenienceTimeSavers', 
          'Convenience & Time Savers', 
          '100.00',
          'Meal kits, cleaning help, lawn services, convenience services.'
        )}
        
        {/* 11. Pet Care */}
        {renderNumberField(
          'petCare', 
          'Pet Care', 
          '100.00',
          'Pet food, grooming, vet visits, toys, pet services.'
        )}
        
        {/* 12. Kids & Schooling */}
        {renderNumberField(
          'kidsSchooling', 
          'Kids & Schooling', 
          '150.00',
          'Private tuition, music lessons, sports, dance classes, extracurricular activities.'
        )}
        
        {/* 13. Philanthropy & Family Support */}
        {renderNumberField(
          'philanthropyFamilySupport', 
          'Philanthropy & Family Support', 
          '100.00',
          'Charitable giving, helping family members with expenses.'
        )}
      </div>
    </div>
  );
};

export default React.memo(LifestyleDividendsStep);