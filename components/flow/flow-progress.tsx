/**
 * Flow Progress Component
 * 
 * Wrapper for different progress indicator types
 */

import React from 'react';
import { type ProgressIndicatorType, type StepConfig } from '@/types/flow';
import { DotsProgress } from './progress/dots-progress';
import { StepperProgress } from './progress/stepper-progress';
import { BarProgress } from './progress/bar-progress';
import { CircularProgress } from './progress/circular-progress';

interface FlowProgressProps {
  type: ProgressIndicatorType;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  steps: StepConfig[];
}

export function FlowProgress({
  type,
  currentStep,
  totalSteps,
  completedSteps,
  steps,
}: FlowProgressProps) {
  switch (type) {
    case 'dots':
      return (
        <DotsProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          completedSteps={completedSteps}
        />
      );

    case 'stepper':
      return (
        <StepperProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={steps}
        />
      );

    case 'bar':
      return (
        <BarProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );

    case 'circular':
      return (
        <CircularProgress
          progress={(currentStep + 1) / totalSteps}
        />
      );

    case 'none':
    default:
      return null;
  }
}
