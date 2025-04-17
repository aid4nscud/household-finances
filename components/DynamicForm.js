import { useState } from 'react';

export default function DynamicForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    income: '',
    expenses: '',
    dependents: '',
    debt: 'No',
    debtAmount: '',
    financialGoal: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // For number inputs, ensure they're positive numbers
    if (type === 'number') {
      // Allow empty string or positive numbers
      if (value === '' || parseFloat(value) >= 0) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // If there was an error, clear it on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Mark field as touched on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  // Validate a single field
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else {
          newErrors.name = null;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          newErrors.email = null;
        }
        break;
      case 'income':
        if (value === '') {
          newErrors.income = 'Monthly income is required';
        } else if (isNaN(value) || parseFloat(value) < 0) {
          newErrors.income = 'Monthly income must be a positive number';
        } else {
          newErrors.income = null;
        }
        break;
      case 'expenses':
        if (value === '') {
          newErrors.expenses = 'Monthly expenses are required';
        } else if (isNaN(value) || parseFloat(value) < 0) {
          newErrors.expenses = 'Monthly expenses must be a positive number';
        } else {
          newErrors.expenses = null;
        }
        break;
      case 'dependents':
        if (value === '') {
          newErrors.dependents = 'Number of dependents is required';
        } else if (isNaN(value) || parseFloat(value) < 0 || !Number.isInteger(parseFloat(value))) {
          newErrors.dependents = 'Dependents must be a non-negative whole number';
        } else {
          newErrors.dependents = null;
        }
        break;
      case 'debtAmount':
        if (formData.debt === 'Yes') {
          if (value === '') {
            newErrors.debtAmount = 'Total debt amount is required';
          } else if (isNaN(value) || parseFloat(value) <= 0) {
            newErrors.debtAmount = 'Debt amount must be a positive number';
          } else {
            newErrors.debtAmount = null;
          }
        } else {
          newErrors.debtAmount = null;
        }
        break;
      case 'financialGoal':
        if (!value) {
          newErrors.financialGoal = 'Financial goal is required';
        } else {
          newErrors.financialGoal = null;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  // Validate all fields
  const validateForm = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate each field
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      // Skip debtAmount validation if debt is 'No'
      if (key === 'debtAmount' && formData.debt === 'No') {
        return;
      }
      const fieldIsValid = validateField(key, formData[key]);
      isValid = isValid && fieldIsValid;
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format the data for submission
      const submissionData = {
        ...formData,
        income: parseFloat(formData.income),
        expenses: parseFloat(formData.expenses),
        dependents: parseInt(formData.dependents),
        debtAmount: formData.debt === 'Yes' ? parseFloat(formData.debtAmount) : 0,
      };
      
      onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Household Finances Form</h2>
      
      {/* Name */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${touched.name && errors.name ? 'border-red-500' : ''}`}
          placeholder="John Doe"
          disabled={isSubmitting}
        />
        {touched.name && errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      
      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${touched.email && errors.email ? 'border-red-500' : ''}`}
          placeholder="john@example.com"
          disabled={isSubmitting}
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      
      {/* Income */}
      <div className="form-group">
        <label htmlFor="income" className="form-label">
          Monthly Household Income ($)
        </label>
        <input
          type="number"
          id="income"
          name="income"
          value={formData.income}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${touched.income && errors.income ? 'border-red-500' : ''}`}
          placeholder="5000"
          min="0"
          step="0.01"
          disabled={isSubmitting}
        />
        {touched.income && errors.income && (
          <p className="text-red-500 text-xs mt-1">{errors.income}</p>
        )}
      </div>
      
      {/* Expenses */}
      <div className="form-group">
        <label htmlFor="expenses" className="form-label">
          Monthly Household Expenses ($)
        </label>
        <input
          type="number"
          id="expenses"
          name="expenses"
          value={formData.expenses}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${touched.expenses && errors.expenses ? 'border-red-500' : ''}`}
          placeholder="3500"
          min="0"
          step="0.01"
          disabled={isSubmitting}
        />
        {touched.expenses && errors.expenses && (
          <p className="text-red-500 text-xs mt-1">{errors.expenses}</p>
        )}
      </div>
      
      {/* Dependents */}
      <div className="form-group">
        <label htmlFor="dependents" className="form-label">
          Number of Dependents
        </label>
        <input
          type="number"
          id="dependents"
          name="dependents"
          value={formData.dependents}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${touched.dependents && errors.dependents ? 'border-red-500' : ''}`}
          placeholder="0"
          min="0"
          step="1"
          disabled={isSubmitting}
        />
        {touched.dependents && errors.dependents && (
          <p className="text-red-500 text-xs mt-1">{errors.dependents}</p>
        )}
      </div>
      
      {/* Debt */}
      <div className="form-group">
        <label className="form-label block mb-2">Do you currently have debt?</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="debt"
              value="Yes"
              checked={formData.debt === 'Yes'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-blue-600"
              disabled={isSubmitting}
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="debt"
              value="No"
              checked={formData.debt === 'No'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-blue-600"
              disabled={isSubmitting}
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </div>
      
      {/* Debt Amount (conditional) */}
      {formData.debt === 'Yes' && (
        <div className="form-group">
          <label htmlFor="debtAmount" className="form-label">
            Total Debt Amount ($)
          </label>
          <input
            type="number"
            id="debtAmount"
            name="debtAmount"
            value={formData.debtAmount}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${touched.debtAmount && errors.debtAmount ? 'border-red-500' : ''}`}
            placeholder="15000"
            min="0"
            step="0.01"
            disabled={isSubmitting}
          />
          {touched.debtAmount && errors.debtAmount && (
            <p className="text-red-500 text-xs mt-1">{errors.debtAmount}</p>
          )}
        </div>
      )}
      
      {/* Financial Goal */}
      <div className="form-group">
        <label htmlFor="financialGoal" className="form-label">
          Primary Financial Goal
        </label>
        <select
          id="financialGoal"
          name="financialGoal"
          value={formData.financialGoal}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${touched.financialGoal && errors.financialGoal ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        >
          <option value="">Select a goal...</option>
          <option value="Save for a house">Save for a house</option>
          <option value="Pay off debt">Pay off debt</option>
          <option value="Emergency fund">Emergency fund</option>
          <option value="Retire early">Retire early</option>
        </select>
        {touched.financialGoal && errors.financialGoal && (
          <p className="text-red-500 text-xs mt-1">{errors.financialGoal}</p>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className={`btn btn-primary w-full ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Report...
            </span>
          ) : (
            'Generate Financial Report'
          )}
        </button>
      </div>
    </form>
  );
} 