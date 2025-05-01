import React from 'react';
import { NumberFieldProps } from '../../types/index';
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

const NumberField: React.FC<NumberFieldProps> = ({ 
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
  tooltip
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
    <FormItem className="mb-4">
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">{prefix}</span>
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
            className={`${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
            aria-invalid={touched && error ? 'true' : 'false'}
            aria-describedby={`${id}-error ${id}-description`}
          />
        </FormControl>
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-muted-foreground">{suffix}</span>
          </div>
        )}
      </div>
      {description && (
        <FormDescription id={`${id}-description`}>
          {description}
        </FormDescription>
      )}
      {touched && error && (
        <FormMessage id={`${id}-error`}>
          {error}
        </FormMessage>
      )}
    </FormItem>
  );
};

export default React.memo(NumberField); 