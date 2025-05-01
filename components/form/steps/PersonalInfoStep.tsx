import React from 'react';
import { FormData } from '../../../types/index';

interface PersonalInfoStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  handleChange,
  handleBlur,
  errors,
  touched,
  isSubmitting
}) => {
  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-5">Let's start with your information</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="form-group">
          <label htmlFor="name" className="form-label text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              touched.name && errors.name ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="John Doe"
            disabled={isSubmitting}
            aria-invalid={touched.name && errors.name ? 'true' : 'false'}
            aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
          />
          {touched.name && errors.name && (
            <p 
              className="text-red-500 text-xs mt-1" 
              id="name-error"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              touched.email && errors.email ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="john@example.com"
            disabled={isSubmitting}
            aria-invalid={touched.email && errors.email ? 'true' : 'false'}
            aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
          />
          {touched.email && errors.email && (
            <p 
              className="text-red-500 text-xs mt-1" 
              id="email-error"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PersonalInfoStep); 