'use client';

import { useState } from 'react';

export default function DynamicForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    dependents: '',
    hasDebt: '',
    debtAmount: '',
    financialGoal: ''
  });

  const [showDebtAmount, setShowDebtAmount] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'hasDebt') {
      setShowDebtAmount(value === 'yes');
      if (value === 'no') {
        setFormData(prev => ({ ...prev, debtAmount: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const financialGoals = [
    "Save for a house",
    "Pay off debt",
    "Emergency fund",
    "Retire early"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          value={formData.fullName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
          Monthly Household Income
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
          <input
            type="number"
            id="monthlyIncome"
            name="monthlyIncome"
            required
            min="0"
            value={formData.monthlyIncome}
            onChange={handleChange}
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="monthlyExpenses" className="block text-sm font-medium text-gray-700">
          Monthly Household Expenses
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
          <input
            type="number"
            id="monthlyExpenses"
            name="monthlyExpenses"
            required
            min="0"
            value={formData.monthlyExpenses}
            onChange={handleChange}
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="dependents" className="block text-sm font-medium text-gray-700">
          Number of Dependents
        </label>
        <input
          type="number"
          id="dependents"
          name="dependents"
          required
          min="0"
          value={formData.dependents}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Do you currently have debt?
        </label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasDebt"
              value="yes"
              checked={formData.hasDebt === 'yes'}
              onChange={handleChange}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasDebt"
              value="no"
              checked={formData.hasDebt === 'no'}
              onChange={handleChange}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </div>

      {showDebtAmount && (
        <div>
          <label htmlFor="debtAmount" className="block text-sm font-medium text-gray-700">
            Total Debt Amount
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
            <input
              type="number"
              id="debtAmount"
              name="debtAmount"
              required
              min="0"
              value={formData.debtAmount}
              onChange={handleChange}
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="financialGoal" className="block text-sm font-medium text-gray-700">
          Primary Financial Goal
        </label>
        <select
          id="financialGoal"
          name="financialGoal"
          required
          value={formData.financialGoal}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a goal</option>
          {financialGoals.map(goal => (
            <option key={goal} value={goal}>{goal}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLoading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          'Generate Financial Report'
        )}
      </button>
    </form>
  );
} 