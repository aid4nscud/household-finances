import React from 'react';
import { NumberFieldWithC2EProps } from '../../types/index';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import C2EToggle from './C2EToggle';

const NumberFieldWithC2E: React.FC<NumberFieldWithC2EProps> = ({ 
  id, 
  label, 
  name, 
  value, 
  placeholder, 
  min, 
  max, 
  step, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  description, 
  prefix, 
  suffix,
  disabled,
  tooltip,
  showC2EToggle = false,
  isC2E = false,
  c2ePercentage = 100,
  onC2EChange,
  isRequired
}) => {
  // Function to handle changes, ensuring only valid numeric input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Remove non-numeric characters except decimal point and negative sign
    // Allow empty string for clearing the input
    if (newValue === '' || /^-?\d*\.?\d*$/.test(newValue)) {
      onChange(e);
    }
  };

  return (
    <FormItem className="mb-6 relative">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <FormLabel 
            htmlFor={id}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {isRequired && <span className="text-[#00C805] ml-1">*</span>}
          </FormLabel>
          {showC2EToggle && onC2EChange && (
            <C2EToggle
              fieldId={id}
              isC2E={isC2E}
              percentage={c2ePercentage}
              onChange={onC2EChange}
            />
          )}
        </div>
        {description && (
          <FormDescription 
            id={`${id}-description`}
            className="text-xs text-gray-500 dark:text-gray-400 italic"
          >
            {description}
          </FormDescription>
        )}
      </div>
      <div className="relative mt-1.5">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 font-medium">{prefix}</span>
          </div>
        )}
        <FormControl>
          <Input
            type="text"
            inputMode="decimal"
            id={id}
            name={name || id}
            value={value || ''}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`
              h-11 
              bg-gray-50 dark:bg-gray-900
              border-gray-200 dark:border-gray-800
              hover:border-[#00C805] dark:hover:border-[#00C805]
              focus:border-[#00C805] dark:focus:border-[#00C805]
              focus:ring-1 focus:ring-[#00C805] dark:focus:ring-[#00C805]
              text-base font-medium
              placeholder:text-gray-400 dark:placeholder:text-gray-600
              transition-all duration-200
              ${prefix ? 'pl-8' : 'pl-4'} 
              ${suffix ? 'pr-8' : 'pr-4'}
              ${touched && error ? 'border-red-500 dark:border-red-500' : ''}
              ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}
              ${isC2E ? 'border-[#00C805] dark:border-[#00C805] bg-[#00C805]/5 dark:bg-[#00C805]/10' : ''}
            `}
            aria-invalid={touched && error ? 'true' : 'false'}
            aria-describedby={`${id}-error ${id}-description`}
            required={isRequired}
          />
        </FormControl>
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 font-medium">{suffix}</span>
          </div>
        )}
      </div>
      {touched && error && (
        <FormMessage 
          id={`${id}-error`}
          className="mt-1.5 text-sm text-red-500 dark:text-red-400"
        >
          {error}
        </FormMessage>
      )}
    </FormItem>
  );
};

export default React.memo(NumberFieldWithC2E); 