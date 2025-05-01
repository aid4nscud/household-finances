'use client'

import React, { useCallback, lazy, Suspense, useMemo, useState } from 'react';
import { FORM_STEPS, INITIAL_FORM_STATE } from '../../constants/formSteps';
import useFormValidation from '../../hooks/useFormValidation';
import { useFormNavigation } from '../../hooks/useFormNavigation';
import FormNavigation from './FormNavigation';
import { DynamicFormProps, NumericFormData, FormStep } from '../../types/index';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import step components for code splitting
const IncomeStep = lazy(() => import('./steps/IncomeStep'));
const PreTaxDeductionsStep = lazy(() => import('./steps/PreTaxDeductionsStep'));
const EssentialNeedsStep = lazy(() => import('./steps/EssentialNeedsStep'));
const SavingsInvestmentsStep = lazy(() => import('./steps/SavingsInvestmentsStep'));
const DiscretionaryExpensesStep = lazy(() => import('./steps/DiscretionaryExpensesStep'));
const AnnualExpensesStep = lazy(() => import('./steps/AnnualExpensesStep'));
const AdditionalInfoStep = lazy(() => import('./steps/AdditionalInfoStep'));
const ReviewStep = lazy(() => import('./steps/ReviewStep'));

// Loading placeholder for lazy-loaded components
const StepLoader = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-3/4" />
    <div className="space-y-2 mt-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

// Progress indicator component
interface FormProgressIndicatorProps {
  steps: FormStep[];
  currentStep: number;
  visitedSteps: number[];
}

// Type for a step with its index
interface IndexedFormStep extends FormStep {
  index: number;
}

const FormProgressIndicator: React.FC<FormProgressIndicatorProps> = ({ 
  steps, 
  currentStep, 
  visitedSteps 
}) => {
  // Only display a subset of steps to reduce clutter
  const displaySteps = () => {
    if (steps.length <= 5) return steps.map((step, index) => ({ ...step, index }));
    
    // For more than 5 steps, show first, last, current, and steps immediately before/after current
    const visibleSteps: IndexedFormStep[] = [];
    
    steps.forEach((step, index) => {
      // Always show first and last step
      if (index === 0 || index === steps.length - 1) {
        visibleSteps.push({ ...step, index });
        return;
      }
      
      // Show current step and steps immediately before/after
      if (
        index === currentStep || 
        index === currentStep - 1 || 
        index === currentStep + 1
      ) {
        visibleSteps.push({ ...step, index });
      }
    });
    
    return visibleSteps;
  };
  
  const visibleSteps = displaySteps();
  
  return (
    <div className="mb-8">
      <div className="relative flex items-center justify-between max-w-3xl mx-auto px-2">
        {/* Background progress bar that spans full width */}
        <div className="absolute h-[2px] bg-gray-200 left-0 right-0 top-5 -z-10"></div>
        <div 
          className="absolute h-[2px] bg-primary left-0 top-5 -z-10 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.length <= 5 ? (
          // Show all steps if 5 or fewer
          visibleSteps.map((indexedStep) => (
            <StepIndicator 
              key={indexedStep.id}
              step={indexedStep}
              index={indexedStep.index}
              currentStep={currentStep}
              visitedSteps={visitedSteps}
              isFirst={indexedStep.index === 0}
              isLast={indexedStep.index === steps.length - 1}
            />
          ))
        ) : (
          // Show filtered steps for larger forms
          <>
            {visibleSteps.map((indexedStep, displayIndex) => {
              const isFirst = displayIndex === 0;
              const isLast = displayIndex === visibleSteps.length - 1;
              
              // Add ellipsis indicators between non-adjacent steps
              const needsLeftEllipsis = !isFirst && indexedStep.index > 0 && 
                visibleSteps[displayIndex - 1]?.index !== indexedStep.index - 1;
              
              return (
                <React.Fragment key={indexedStep.id}>
                  {needsLeftEllipsis && (
                    <div className="flex items-center justify-center w-6 md:w-10">
                      <span className="text-gray-400 text-xs md:text-sm">...</span>
                    </div>
                  )}
                  <StepIndicator 
                    step={indexedStep}
                    index={indexedStep.index}
                    currentStep={currentStep}
                    visitedSteps={visitedSteps}
                    isFirst={indexedStep.index === 0}
                    isLast={indexedStep.index === steps.length - 1}
                  />
                </React.Fragment>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

// Individual step indicator component
interface StepIndicatorProps {
  step: FormStep;
  index: number;
  currentStep: number;
  visitedSteps: number[];
  isFirst: boolean;
  isLast: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  index,
  currentStep,
  visitedSteps,
  isFirst,
  isLast
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`
        flex items-center justify-center w-9 h-9 rounded-full 
        ${index < currentStep ? 'bg-primary/90 text-white' : 
          index === currentStep ? 'bg-primary text-white ring-4 ring-primary/20' : 
          visitedSteps.includes(index) ? 'bg-primary/20 text-primary' : 
          'bg-gray-100 text-gray-400'}
        transition-all duration-200 text-sm font-medium
      `}>
        {index + 1}
      </div>
      
      {/* Only show the step title for the current step on mobile */}
      <span className={`
        text-xs mt-2 text-center max-w-[70px] 
        ${index === currentStep ? 'block font-medium text-primary' : 'hidden sm:block text-gray-400'}
      `}>
        {step.title}
      </span>
    </div>
  );
};

const DynamicForm: React.FC<DynamicFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  initialEmail = '',
  initialData = null,
  isEditMode = false 
}) => {
  // Create initial form state
  const initialFormState = useMemo(() => {
    // If we have initialData, use that instead of the default
    if (initialData) {
      return initialData;
    }
    
    // Otherwise use the default form state
    return {
      ...INITIAL_FORM_STATE,
      // Set a default name since this field is required but not shown to the user
      name: 'Household Finance User',
      // We store email internally for database purposes but don't show it in the form
      email: initialEmail
    };
  }, [initialEmail, initialData]);

  // Form validation hook
  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateStep: validateFormStep,
    validateForm,
    resetForm
  } = useFormValidation({ initialFormState });

  // Create a wrapper function that converts the step ID to index for validation
  const validateStepByIndex = useCallback((stepIndex: number) => {
    // Get the step ID from the index
    const stepId = FORM_STEPS[stepIndex].id;
    // Call the original validation function with the step ID
    return validateFormStep(stepId);
  }, [validateFormStep]);

  // Form navigation hook
  const {
    currentStep,
    visitedSteps: visitedStepsObj,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isLastStep,
    isFirstStep
  } = useFormNavigation({ 
    steps: FORM_STEPS, 
    validateStep: validateStepByIndex 
  });

  // Convert visitedSteps object to array of indices for the progress indicator
  const visitedStepsArray = useMemo(() => {
    return Object.entries(visitedStepsObj)
      .filter(([_, visited]) => visited)
      .map(([id, _]) => FORM_STEPS.findIndex(step => step.id === id))
      .filter(index => index !== -1);
  }, [visitedStepsObj]);

  // State tracking
  const [localSubmitting, setLocalSubmitting] = useState(false);
  
  // Combine props isSubmitting with local state for better control
  const effectiveSubmitting = isSubmitting || localSubmitting;
  
  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission attempted');
    
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    
    if (isValid) {
      setLocalSubmitting(true);
      console.log('Form data valid, preparing for submission');

      // Add type conversion logic here
      const numericFormData: NumericFormData = {
        ...formData as NumericFormData,
      };

      console.log('Submitting form data:', numericFormData);
      onSubmit(numericFormData);
    }
  }, [formData, validateForm, onSubmit]);

  // Render the current step
  const renderStepContent = useCallback(() => {
    const currentStepId = FORM_STEPS[currentStep].id;
    const stepProps = {
      formData,
      handleChange,
      handleBlur,
      errors,
      touched,
      isSubmitting: effectiveSubmitting
    };
    
    switch (currentStepId) {
      case 'income':
        return <IncomeStep {...stepProps} />;
      case 'preTaxDeductions':
        return <PreTaxDeductionsStep {...stepProps} />;
      case 'essentialNeeds':
        return <EssentialNeedsStep {...stepProps} />;
      case 'savingsInvestments':
        return <SavingsInvestmentsStep {...stepProps} />;
      case 'discretionaryExpenses':
        return <DiscretionaryExpensesStep {...stepProps} />;
      case 'annualExpenses':
        return <AnnualExpensesStep {...stepProps} />;
      case 'additionalInfo':
        return <AdditionalInfoStep {...stepProps} />;
      case 'review':
        return <ReviewStep formData={formData} isSubmitting={effectiveSubmitting} />;
      default:
        return <div>Step not implemented yet</div>;
    }
  }, [currentStep, formData, handleChange, handleBlur, errors, touched, effectiveSubmitting]);

  return (
    <div className="dynamic-form container py-8 max-w-3xl mx-auto relative" data-testid="dynamic-form">
      {/* Loading overlay */}
      {effectiveSubmitting && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50 rounded-xl backdrop-blur-sm">
          <div className="flex flex-col items-center p-6 text-center">
            <div className="w-16 h-16 mb-4">
              <svg className="animate-spin w-full h-full text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {isEditMode ? 'Updating' : 'Processing'} your submission
            </h3>
            <p className="text-gray-500">
              We're calculating your household financial metrics and generating insights...
            </p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <Card className="mb-8 shadow-md border-0 rounded-xl overflow-hidden">
          <CardHeader className="px-8 pt-8 pb-0 border-b border-gray-100">
            <FormProgressIndicator 
              steps={FORM_STEPS} 
              currentStep={currentStep} 
              visitedSteps={visitedStepsArray} 
            />
          </CardHeader>
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {FORM_STEPS[currentStep].title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Step {currentStep + 1} of {FORM_STEPS.length}
              </p>
            </div>
            
            <Suspense fallback={<StepLoader />}>
              {renderStepContent()}
            </Suspense>
          </CardContent>
        </Card>
        
        <FormNavigation
          steps={FORM_STEPS}
          currentStep={currentStep}
          visitedSteps={visitedStepsObj}
          goToStep={goToStep}
          goToPreviousStep={goToPreviousStep}
          goToNextStep={goToNextStep}
          isSubmitting={effectiveSubmitting}
          isLastStep={isLastStep}
          isFirstStep={isFirstStep}
        />
      </form>
    </div>
  );
};

export default React.memo(DynamicForm); 