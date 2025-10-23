/**
 * Flow Context Provider and Hook
 *
 * Provides flow context to child components
 */

import { type FlowContextValue } from '@/types/flow';
import { createContext, useContext } from 'react';

/**
 * Flow context
 */
export const FlowContext = createContext<FlowContextValue | null>(null);

/**
 * Hook to access flow context
 *
 * @throws Error if used outside of FlowContainer
 */
export function useFlowContext(): FlowContextValue {
  const context = useContext(FlowContext);

  if (!context) {
    throw new Error('useFlowContext must be used within a FlowContainer');
  }

  return context;
}
