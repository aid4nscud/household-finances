import React from 'react';
import { FormStep } from '../../types/index';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FormNavigationProps {
  steps: FormStep[];
  currentStep: number;
  visitedSteps: Record<string, boolean>;
  goToStep: (index: number) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  isSubmitting: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  steps,
  currentStep,
  visitedSteps,
  goToStep,
  goToPreviousStep,
  goToNextStep,
  isSubmitting,
  isLastStep,
  isFirstStep
}) => {
  return (
    <div className="form-navigation">
      <Separator className="mb-6" />
      
      <div className="form-actions flex justify-between">
        <Button
          type="button"
          onClick={goToPreviousStep}
          variant="outline"
          disabled={isFirstStep || isSubmitting}
          className="w-32"
          size="lg"
        >
          Previous
        </Button>
        
        {!isLastStep ? (
          <Button
            type="button"
            onClick={goToNextStep}
            disabled={isSubmitting}
            className="w-32"
            size="lg"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-32 bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
            size="lg"
            onClick={() => console.log('Submit button clicked (form will be submitted via form onSubmit)')}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              'Submit'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(FormNavigation); 