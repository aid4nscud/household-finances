import React, { useMemo } from 'react';
import { FormData } from '../../../types/index';

interface ReviewStepProps {
  formData: FormData;
  isSubmitting: boolean;
}

// Helper component for section review
const ReviewSection: React.FC<{ title: string; fields: { label: string; value: string }[] }> = ({ title, fields }) => {
  return (
    <div className="mb-6">
      <h4 className="text-lg font-medium text-gray-800 mb-2 pb-1 border-b">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        {fields.map((field, idx) => (
          <div key={idx} className="flex justify-between py-1">
            <span className="text-gray-600">{field.label}</span>
            <span className="font-mono">
              {field.value ? `$${parseFloat(field.value).toFixed(2)}` : '$0.00'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, isSubmitting }) => {
  // Calculate totals for display
  const totals = useMemo(() => {
    // Monthly Income
    const totalIncome = 
      parseFloat(formData.primaryIncome || '0') +
      parseFloat(formData.secondaryIncome || '0') +
      parseFloat(formData.investmentIncome || '0') +
      parseFloat(formData.governmentBenefits || '0') +
      parseFloat(formData.alimonyChildSupport || '0') +
      parseFloat(formData.otherIncome || '0');
    
    // Pre-Tax Deductions
    const totalDeductions =
      parseFloat(formData.federalIncomeTax || '0') +
      parseFloat(formData.stateIncomeTax || '0') +
      parseFloat(formData.ficaTax || '0') +
      parseFloat(formData.retirementContributions || '0') +
      parseFloat(formData.healthInsurancePremiums || '0') +
      parseFloat(formData.hsaFsaContributions || '0') +
      parseFloat(formData.unionDues || '0') +
      parseFloat(formData.otherPayrollDeductions || '0');
    
    // Essential Needs
    const totalNeeds =
      parseFloat(formData.housingExpenses || '0') +
      parseFloat(formData.utilities || '0') +
      parseFloat(formData.foodGroceries || '0') +
      parseFloat(formData.transportation || '0') +
      parseFloat(formData.healthcare || '0') +
      parseFloat(formData.childcareEducation || '0') +
      parseFloat(formData.insurance || '0') +
      parseFloat(formData.debtPayments || '0') +
      parseFloat(formData.personalCareMedical || '0');
    
    // Savings & Investments
    const totalSavings =
      parseFloat(formData.shortTermSavings || '0') +
      parseFloat(formData.longTermInvestments || '0') +
      parseFloat(formData.educationSavings || '0') +
      parseFloat(formData.charitableGiving || '0') +
      parseFloat(formData.retirementSavings || '0');
    
    // Discretionary Expenses
    const totalDiscretionary =
      parseFloat(formData.entertainmentLeisure || '0') +
      parseFloat(formData.diningOut || '0') +
      parseFloat(formData.shoppingPersonal || '0') +
      parseFloat(formData.fitnessWellness || '0') +
      parseFloat(formData.travelVacations || '0') +
      parseFloat(formData.subscriptions || '0') +
      parseFloat(formData.hobbiesRecreation || '0') +
      parseFloat(formData.giftsSupport || '0');
    
    // Annual Expenses
    const totalAnnual =
      parseFloat(formData.annualLicenses || '0') +
      parseFloat(formData.homeRepairs || '0') +
      parseFloat(formData.holidayGifts || '0') +
      parseFloat(formData.personalCelebrations || '0') +
      parseFloat(formData.familyEvents || '0') +
      parseFloat(formData.vehicleMaintenance || '0') +
      parseFloat(formData.professionalDevelopment || '0');
    
    const netIncome = totalIncome - totalDeductions;
    const leftoverAmount = netIncome - totalNeeds - totalSavings - totalDiscretionary - totalAnnual;
    
    return {
      totalIncome,
      totalDeductions,
      netIncome,
      totalNeeds,
      totalSavings,
      totalDiscretionary,
      totalAnnual,
      leftoverAmount
    };
  }, [formData]);

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Review Your Information</h3>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 flex-grow">
          <p className="text-lg font-medium text-blue-700">Personal Information</p>
          <p><span className="font-medium">Name:</span> {formData.name}</p>
          <p><span className="font-medium">Email:</span> {formData.email}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500 flex-grow">
          <p className="text-lg font-medium text-gray-700">Monthly Summary</p>
          <p><span className="font-medium">Gross Income:</span> ${totals.totalIncome.toFixed(2)}</p>
          <p><span className="font-medium">Net Income:</span> ${totals.netIncome.toFixed(2)}</p>
          <p>
            <span className="font-medium">Remaining Balance:</span> 
            <span className={totals.leftoverAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
              {' '}${totals.leftoverAmount.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
      
      <div className="financial-summary bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <ReviewSection 
          title="Income" 
          fields={[
            { label: 'Primary Income', value: formData.primaryIncome },
            { label: 'Secondary Income', value: formData.secondaryIncome },
            { label: 'Investment Income', value: formData.investmentIncome },
            { label: 'Government Benefits', value: formData.governmentBenefits },
            { label: 'Alimony/Child Support', value: formData.alimonyChildSupport },
            { label: 'Other Income', value: formData.otherIncome },
          ]} 
        />
        
        <ReviewSection 
          title="Pre-Tax Deductions" 
          fields={[
            { label: 'Federal Income Tax', value: formData.federalIncomeTax },
            { label: 'State Income Tax', value: formData.stateIncomeTax },
            { label: 'FICA Tax', value: formData.ficaTax },
            { label: 'Retirement Contributions', value: formData.retirementContributions },
            { label: 'Health Insurance Premiums', value: formData.healthInsurancePremiums },
            { label: 'HSA/FSA Contributions', value: formData.hsaFsaContributions },
            { label: 'Union Dues', value: formData.unionDues },
            { label: 'Other Payroll Deductions', value: formData.otherPayrollDeductions },
          ]} 
        />
        
        <ReviewSection 
          title="Essential Needs" 
          fields={[
            { label: 'Housing Expenses', value: formData.housingExpenses },
            { label: 'Utilities', value: formData.utilities },
            { label: 'Food & Groceries', value: formData.foodGroceries },
            { label: 'Transportation', value: formData.transportation },
            { label: 'Healthcare', value: formData.healthcare },
            { label: 'Childcare & Education', value: formData.childcareEducation },
            { label: 'Insurance', value: formData.insurance },
            { label: 'Debt Payments', value: formData.debtPayments },
            { label: 'Personal Care & Medical', value: formData.personalCareMedical },
          ]} 
        />
        
        <ReviewSection 
          title="Savings & Investments" 
          fields={[
            { label: 'Short-term Savings', value: formData.shortTermSavings },
            { label: 'Long-term Investments', value: formData.longTermInvestments },
            { label: 'Education Savings', value: formData.educationSavings },
            { label: 'Charitable Giving', value: formData.charitableGiving },
            { label: 'Additional Retirement Savings', value: formData.retirementSavings },
          ]} 
        />
        
        <ReviewSection 
          title="Discretionary Expenses" 
          fields={[
            { label: 'Entertainment & Leisure', value: formData.entertainmentLeisure },
            { label: 'Dining Out & Takeout', value: formData.diningOut },
            { label: 'Shopping & Personal Items', value: formData.shoppingPersonal },
            { label: 'Fitness & Wellness', value: formData.fitnessWellness },
            { label: 'Travel & Vacations', value: formData.travelVacations },
            { label: 'Subscriptions & Memberships', value: formData.subscriptions },
            { label: 'Hobbies & Recreation', value: formData.hobbiesRecreation },
            { label: 'Gifts & Support for Others', value: formData.giftsSupport },
          ]} 
        />
        
        <ReviewSection 
          title="Annual/Irregular Expenses (Monthly Amount)" 
          fields={[
            { label: 'Annual Licenses & Fees', value: formData.annualLicenses },
            { label: 'Home Repairs & Maintenance', value: formData.homeRepairs },
            { label: 'Holiday Gifts', value: formData.holidayGifts },
            { label: 'Personal Celebrations', value: formData.personalCelebrations },
            { label: 'Family Events', value: formData.familyEvents },
            { label: 'Vehicle Maintenance & Repairs', value: formData.vehicleMaintenance },
            { label: 'Professional Development', value: formData.professionalDevelopment },
          ]} 
        />
      </div>
      
      <div className="submit-note mt-8 bg-green-50 p-4 rounded-md">
        <p className="text-green-700">
          <span className="font-semibold">Ready to submit?</span> Click the "Submit" button below to generate your personalized income statement and financial recommendations.
        </p>
      </div>
    </div>
  );
};

export default React.memo(ReviewStep); 