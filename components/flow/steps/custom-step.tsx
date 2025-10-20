/**
 * Custom Step Component
 */

import { type CustomStepConfig } from '@/types/flow';
import React from 'react';
import type { FlowData } from '../flow-step-wrapper';

interface CustomStepProps {
  step: CustomStepConfig;
  data: FlowData;
  onUpdate: (data: Partial<FlowData>) => void;
}

export function CustomStep({ step, data, onUpdate }: CustomStepProps) {
  const Component = step.component;
  return <Component {...step.props} data={data} onUpdate={onUpdate} />;
}
