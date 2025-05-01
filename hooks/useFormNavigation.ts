'use client'

import { useState, useCallback, useEffect } from 'react';
import { FormStep } from '../types/index';
import { useToast } from './use-toast';

interface UseFormNavigationProps {
  steps: FormStep[];
  initialStep?: number;
  validateStep?: (stepIndex: number) => boolean;
}

export function useFormNavigation({ 
  steps, 
  initialStep = 0,
  validateStep = () => true 
}: UseFormNavigationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const { toast } = useToast();
  
  // Track visited steps to control navigation
  const [visitedSteps, setVisitedSteps] = useState<Record<string, boolean>>(() => {
    // Mark first step as always visited
    const initialVisited: Record<string, boolean> = {};
    if (steps.length > 0) {
      initialVisited[steps[0].id] = true;
    }
    return initialVisited;
  });
  
  // Current status variables
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  
  // Mark current step as visited whenever it changes
  useEffect(() => {
    const currentStepId = steps[currentStepIndex].id;
    setVisitedSteps(prev => ({
      ...prev,
      [currentStepId]: true
    }));
  }, [currentStepIndex, steps]);
  
  // Navigate to next step
  const goToNextStep = useCallback(() => {
    if (!isLastStep) {
      // Validate the current step before proceeding
      const isValid = validateStep(currentStepIndex);
      
      if (isValid) {
        // Mark next step as visited
        const nextStepId = steps[currentStepIndex + 1].id;
        setVisitedSteps(prev => ({
          ...prev,
          [nextStepId]: true
        }));
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Show error toast if validation fails
        toast({
          title: "Form Validation Error",
          description: "Please complete all required fields before proceeding.",
          variant: "destructive"
        });
      }
    }
  }, [currentStepIndex, isLastStep, steps, validateStep, toast]);
  
  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [isFirstStep]);
  
  // Navigate to specific step
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      // Only allow navigation to visited steps or the next available step
      const targetStepId = steps[stepIndex].id;
      const isNextUnvisitedStep = stepIndex === currentStepIndex + 1;
      
      if (visitedSteps[targetStepId]) {
        // Allow navigation to already visited steps
        setCurrentStepIndex(stepIndex);
      } else if (isNextUnvisitedStep) {
        // For the next unvisited step, validate the current step first
        const isValid = validateStep(currentStepIndex);
        
        if (isValid) {
          // Mark target step as visited
          setVisitedSteps(prev => ({
            ...prev,
            [targetStepId]: true
          }));
          setCurrentStepIndex(stepIndex);
        } else {
          // Show error toast if validation fails
          toast({
            title: "Form Validation Error",
            description: "Please complete all required fields before proceeding.",
            variant: "destructive"
          });
        }
      }
    }
  }, [steps, visitedSteps, currentStepIndex, validateStep, toast]);
  
  return {
    currentStep: currentStepIndex,
    currentStepIndex,
    visitedSteps,
    steps,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
  };
} 