/**
 * Universal Multi-Step Flow System - Type Definitions
 * 
 * Comprehensive type system for creating reusable, type-safe multi-step flows
 * for onboarding, registration, setup wizards, tutorials, and more.
 * 
 * @see plan/feature-unified-flow-system-1.md for complete specification
 */

import { type ImageSourcePropType, type TextStyle, type ViewStyle } from 'react-native';
import { z } from 'zod';

// ============================================================================
// Core Flow Configuration Types
// ============================================================================

/**
 * Progress indicator visual styles
 */
export type ProgressIndicatorType = 'dots' | 'stepper' | 'bar' | 'circular' | 'none';

/**
 * Step types supported by the flow system
 */
export type StepType = 
  | 'display'      // Show information, images, features
  | 'form'         // Collect user input with validation
  | 'selection'    // Single or multiple choice selection
  | 'verification' // OTP/code verification
  | 'action'       // Execute async actions (enable biometrics, etc.)
  | 'permission'   // Request device permissions
  | 'info'         // Terms, privacy policy, scrollable content
  | 'custom';      // Custom component

/**
 * Animation types for transitions
 */
export type AnimationType = 
  | 'fade' | 'fadeIn' | 'fadeOut' | 'fadeInUp' | 'fadeInDown' | 'fadeOutUp' | 'fadeOutDown'
  | 'slide' | 'slideInRight' | 'slideInLeft' | 'slideOutRight' | 'slideOutLeft'
  | 'slideInUp' | 'slideInDown' | 'slideOutUp' | 'slideOutDown'
  | 'zoom' | 'zoomIn' | 'zoomOut'
  | 'bounce' | 'shake' | 'pulse' | 'rotate' | 'flip'
  | 'spring' | 'timing';

/**
 * Visual layout variants for display steps
 */
export type DisplayVariant = 'hero' | 'card' | 'minimal' | 'split' | 'fullscreen';

/**
 * Form input visual styles
 */
export type FormVariant = 'standard' | 'material' | 'minimal' | 'card' | 'floating';

/**
 * Selection step layout styles
 */
export type SelectionVariant = 'grid' | 'list' | 'cards' | 'buttons' | 'pills';

// ============================================================================
// Theme & Styling Types
// ============================================================================

/**
 * Color theme for a step
 */
export interface StepTheme {
  colors?: {
    background?: string;
    surface?: string;
    primary?: string;
    secondary?: string;
    accent?: string;
    text?: string;
    textMuted?: string;
    error?: string;
    success?: string;
    warning?: string;
    info?: string;
    border?: string;
    divider?: string;
    [key: string]: string | undefined;
  };
  images?: {
    [key: string]: ImageSourcePropType;
  };
  animations?: {
    entrance?: AnimationType | string;
    exit?: AnimationType | string;
    [key: string]: AnimationType | string | undefined;
  };
  typography?: {
    titleSize?: number;
    titleWeight?: string;
    titleColor?: string;
    subtitleSize?: number;
    subtitleWeight?: string;
    subtitleColor?: string;
    bodySize?: number;
    bodyWeight?: string;
    bodyColor?: string;
    fontFamily?: string;
    [key: string]: number | string | undefined;
  };
  layout?: {
    spacing?: number;
    padding?: number;
    borderRadius?: number;
    elevation?: number;
    [key: string]: number | undefined;
  };
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  type?: 'spring' | 'timing' | 'sequence' | 'parallel' | 'loop';
  preset?: 'gentle' | 'bouncy' | 'stiff' | 'quick' | 'smooth' | 'slow';
  duration?: number;
  delay?: number;
  from?: Record<string, any>;
  to?: Record<string, any>;
  keyframes?: Record<string, any>[];
  loop?: boolean;
  yoyo?: boolean;
  stagger?: number;
  useNativeDriver?: boolean;
  easing?: string;
  // Spring animation properties
  damping?: number;
  stiffness?: number;
  mass?: number;
}

// ============================================================================
// Step Configuration Types
// ============================================================================

/**
 * Base step configuration - common to all step types
 */
export interface BaseStepConfig {
  id: string;
  type: StepType;
  title: string;
  subtitle?: string;
  description?: string;
  
  // Visual customization
  icon?: string;
  iconColor?: string;
  image?: ImageSourcePropType;
  images?: ImageSourcePropType[] | { [key: string]: ImageSourcePropType };
  
  // Theme customization (single or multiple themes)
  theme?: StepTheme;
  themes?: { [themeName: string]: StepTheme };
  activeTheme?: string | ((flowData: any, userPrefs: any) => string);
  
  // Visual variant
  variant?: string;
  variants?: { [variantName: string]: any };
  
  // Animations
  animation?: AnimationConfig;
  animations?: {
    enter?: AnimationConfig;
    exit?: AnimationConfig;
    elements?: Record<string, AnimationConfig>;
    [key: string]: AnimationConfig | Record<string, AnimationConfig> | undefined;
  };
  
  // Element-level animations
  elementAnimations?: {
    [elementId: string]: AnimationConfig;
  };
  
  // Responsive configuration
  responsive?: {
    small?: Partial<BaseStepConfig>;
    medium?: Partial<BaseStepConfig>;
    large?: Partial<BaseStepConfig>;
    xlarge?: Partial<BaseStepConfig>;
  };
  
  // Orientation configuration
  orientation?: {
    portrait?: Partial<BaseStepConfig>;
    landscape?: Partial<BaseStepConfig>;
  };
  
  // Navigation
  skippable?: boolean;
  allowBack?: boolean;
  
  // Conditional rendering
  condition?: (data: Record<string, any>) => boolean;
  
  // Validation
  validation?: z.ZodSchema<any>;
  validate?: (data: Record<string, any>) => Promise<{ valid: boolean; error?: string }>;
  
  // Buttons
  primaryButton?: {
    label: string;
    action?: 'next' | 'skip' | 'complete' | 'custom' | ((data: any) => void);
    disabled?: boolean | ((data: any) => boolean);
    loading?: boolean;
    haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
    icon?: string;
    style?: 'primary' | 'secondary' | 'outlined' | 'text';
  };
  
  secondaryButton?: {
    label: string;
    action?: 'back' | 'skip' | 'custom' | ((data: any) => void);
    icon?: string;
    style?: 'primary' | 'secondary' | 'outlined' | 'text';
  };
  
  // Custom styles
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

/**
 * Display step - Show information, images, features
 */
export interface DisplayStepConfig extends BaseStepConfig {
  type: 'display';
  variant?: DisplayVariant;
  
  // Content items (features, benefits, etc.)
  content?: {
    icon?: string;
    iconColor?: string;
    image?: ImageSourcePropType;
    title: string;
    description?: string;
    animation?: AnimationConfig;
  }[];
  
  // Image carousel
  carousel?: {
    autoPlay?: boolean;
    interval?: number;
    showIndicators?: boolean;
    showPagination?: boolean;
  };
  
  // Video support
  video?: {
    source: any;
    autoPlay?: boolean;
    loop?: boolean;
    controls?: boolean;
  };
}

/**
 * Form field configuration
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 
    | 'text' | 'email' | 'password' | 'phone' | 'number' | 'url'
    | 'textarea' | 'select' | 'radio' | 'checkbox' | 'switch'
    | 'date' | 'time' | 'datetime'
    | 'slider' | 'rating'
    | 'image-upload' | 'file-upload' | 'multi-image-upload' | 'multi-file-upload'
    | 'currency' | 'percentage'
    | 'multi-select' | 'autocomplete' | 'search';
  
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  helperText?: string;
  icon?: string;
  
  // Validation
  validation?: z.ZodSchema<any>;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  asyncValidation?: (value: any) => Promise<void>;
  
  // Value configuration
  defaultValue?: any;
  value?: any;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  
  // Options for select/radio/checkbox
  options?: { id: string; label: string; value?: any; disabled?: boolean }[] | string[];
  
  // File upload configuration
  acceptedFormats?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  minFiles?: number;
  
  // Input masking
  mask?: string;
  
  // Auto-complete
  autoComplete?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  
  // Conditional display
  condition?: (data: Record<string, any>) => boolean;
  
  // Visual
  secure?: boolean;
  showStrengthMeter?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  
  // Repeater fields (for dynamic lists)
  repeater?: {
    fields: FormFieldConfig[];
    minItems?: number;
    maxItems?: number;
    addButtonLabel?: string;
    removeButtonLabel?: string;
  };
  
  // Links for checkboxes (e.g., terms & conditions)
  links?: {
    text: string;
    href: string;
    modal?: boolean;
  }[];
  
  // Country code picker for phone inputs
  countryCodePicker?: boolean;
}

/**
 * Form step - Collect user input with validation
 */
export interface FormStepConfig extends BaseStepConfig {
  type: 'form';
  variant?: FormVariant;
  fields: FormFieldConfig[];
  validationSchema?: z.ZodSchema<any>;
  
  // Form submission
  onSubmit?: (data: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  
  // Auto-complete support
  autoComplete?: {
    service: 'google-places' | 'custom';
    onSelect?: (value: any) => Record<string, any>;
  };
  
  // Integration with external services
  integration?: {
    provider: 'stripe' | 'paypal' | 'custom';
    publishableKey?: string;
    config?: Record<string, any>;
  };
}

/**
 * Selection option
 */
export interface SelectionOption {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  image?: ImageSourcePropType;
  preview?: ImageSourcePropType;
  avatar?: ImageSourcePropType;
  color?: string;
  recommended?: boolean;
  disabled?: boolean;
  badge?: string;
  
  // Additional data
  price?: string;
  duration?: string;
  rating?: number;
  reviewCount?: number;
  
  // Conditional display
  condition?: (data: Record<string, any>) => boolean;
}

/**
 * Selection step - Single or multiple choice
 */
export interface SelectionStepConfig extends BaseStepConfig {
  type: 'selection';
  variant?: SelectionVariant;
  
  // Options (can be static or loaded dynamically)
  options: SelectionOption[] | ((data: Record<string, any>) => Promise<SelectionOption[]>);
  
  // Selection mode
  multiple?: boolean;
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  
  // "Any" option
  allowAny?: {
    id: string;
    title: string;
    description?: string;
  };
  
  // Grid configuration (for grid variant)
  columns?: number | 'auto';
  aspectRatio?: number;
  
  // Interaction animations
  interactions?: {
    onPress?: AnimationConfig;
    onHover?: AnimationConfig;
    onSelect?: AnimationConfig;
    onDeselect?: AnimationConfig;
  };
}

/**
 * Verification step - OTP/code verification
 */
export interface VerificationStepConfig extends BaseStepConfig {
  type: 'verification';
  verificationType: 'email' | 'phone' | 'sms' | 'totp' | 'custom';
  codeLength: number;
  
  // Verification handlers
  onVerify: (code: string) => Promise<{ verified: boolean; error?: string }>;
  onResend?: () => Promise<{ sent: boolean; error?: string }>;
  
  // Configuration
  resendInterval?: number; // Seconds before resend is allowed
  maxAttempts?: number;
  autoSubmit?: boolean; // Auto-submit when code is complete
  
  // Display
  showResendButton?: boolean;
  showTimer?: boolean;
}

/**
 * Action step - Execute async actions
 */
export interface ActionStepConfig extends BaseStepConfig {
  type: 'action';
  
  // Action to execute
  action: () => Promise<any>;
  
  // Loading state
  loadingTitle?: string;
  loadingSubtitle?: string;
  
  // Success state
  successTitle?: string;
  successSubtitle?: string;
  successIcon?: string;
  
  // Error state
  errorTitle?: string;
  errorSubtitle?: string;
  errorIcon?: string;
  
  // Retry configuration
  retry?: {
    enabled?: boolean;
    maxAttempts?: number;
    retryDelay?: number;
  };
}

/**
 * Permission step - Request device permissions
 */
export interface PermissionStepConfig extends BaseStepConfig {
  type: 'permission';
  permissions: ('camera' | 'location' | 'notifications' | 'photos' | 'microphone' | 'contacts' | string)[];
  
  // Permission handlers
  onGrant?: (permissions: string[]) => Promise<void>;
  onDeny?: (permissions: string[]) => Promise<void>;
  
  // Display
  benefits?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

/**
 * Info step - Terms, privacy, scrollable content
 */
export interface InfoStepConfig extends BaseStepConfig {
  type: 'info';
  
  // Content
  content: string | React.ReactNode;
  contentUrl?: string; // Load from URL
  
  // Acknowledgment
  requireAcknowledgment?: boolean;
  acknowledgmentText?: string;
  
  // Scrolling
  scrollable?: boolean;
  showScrollProgress?: boolean;
  requireScrollToBottom?: boolean;
}

/**
 * Custom step - Use custom component
 */
export interface CustomStepConfig extends BaseStepConfig {
  type: 'custom';
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

/**
 * Union type of all step configurations
 */
export type StepConfig = 
  | DisplayStepConfig
  | FormStepConfig
  | SelectionStepConfig
  | VerificationStepConfig
  | ActionStepConfig
  | PermissionStepConfig
  | InfoStepConfig
  | CustomStepConfig;

// ============================================================================
// Flow Configuration
// ============================================================================

/**
 * Navigation rules for the flow
 */
export interface NavigationRules {
  allowBack?: boolean;
  confirmExit?: boolean;
  exitMessage?: string;
  swipeToNavigate?: boolean;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  trackStepView?: boolean;
  trackFieldInteraction?: boolean;
  trackValidationErrors?: boolean;
  trackCompletion?: boolean;
  trackAbandonment?: boolean;
  trackSkips?: boolean;
  trackSaveProgress?: boolean;
  trackRevenue?: boolean;
}

/**
 * Auto-save configuration
 */
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // Milliseconds
  storage: 'local' | 'cloud' | 'both';
  key?: string;
}

/**
 * Experiment configuration for A/B testing
 */
export interface ExperimentConfig {
  variants: {
    [variantId: string]: Partial<StepConfig>;
  };
  selectVariant: (userId: string) => string;
  onComplete?: (variant: string, data: any) => void;
}

/**
 * Complete flow configuration
 */
export interface FlowConfig {
  // Identity
  id: string;
  title: string;
  version: string;
  description?: string;
  
  // Visual configuration
  progressIndicator: ProgressIndicatorType;
  showHeader?: boolean;
  showSkip?: boolean;
  
  // Steps
  steps: StepConfig[];
  
  // Theme (global for flow, can be overridden per step)
  theme?: StepTheme;
  themes?: { [themeName: string]: StepTheme };
  activeTheme?: string | ((flowData: any, userPrefs: any) => string);
  
  // Animations (global for flow)
  animations?: {
    stepTransition?: AnimationType | AnimationConfig;
    progressIndicator?: AnimationType | AnimationConfig;
    elements?: {
      stagger?: boolean;
      staggerDelay?: number;
    };
  };
  
  // Navigation
  navigation?: NavigationRules;
  
  // State persistence
  persistState?: boolean;
  persistenceKey?: string;
  autoSave?: boolean | AutoSaveConfig;
  
  // Analytics
  analytics?: AnalyticsConfig;
  
  // Handlers
  onComplete?: (data: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  onSkip?: (data: Record<string, any>) => Promise<{ success: boolean }>;
  onAbandonment?: (data: Record<string, any>, currentStep: string) => Promise<void>;
  onError?: (error: Error, stepId?: string) => Promise<{ handled: boolean }>;
  onStepView?: (stepId: string, data: Record<string, any>) => void;
  onSubmit?: (data: Record<string, any>) => Promise<any>;
  
  // A/B Testing
  experiments?: {
    [experimentId: string]: ExperimentConfig;
  };
  
  // Brand customization (multi-tenant)
  brands?: {
    [brandId: string]: StepTheme;
  };
  activeBrand?: string | ((flowData: any) => string);
  
  // Responsive breakpoints
  breakpoints?: {
    small?: number;
    medium?: number;
    large?: number;
    xlarge?: number;
  };
}

// ============================================================================
// Flow State Types
// ============================================================================

/**
 * Flow state - runtime state management
 */
export interface FlowState {
  // Current state
  currentStepIndex: number;
  currentStepId: string;
  totalSteps: number;
  progress: number; // 0-100
  
  // Navigation history
  stepHistory: string[];
  completedSteps: string[];
  skippedSteps: string[];
  
  // Data
  data: Record<string, any>;
  
  // UI state
  loading: boolean;
  errors: Record<string, string>;
  validationErrors: Record<string, string>;
  
  // Flow metadata
  flowId: string;
  flowVersion: string;
  startedAt: Date;
  lastUpdatedAt: Date;
  completedAt?: Date;
}

/**
 * Flow context value
 */
export interface FlowContextValue {
  // State
  state: FlowState;
  config: FlowConfig;
  currentStep: StepConfig;
  
  // Navigation
  next: () => Promise<void>;
  previous: () => void;
  skip: () => Promise<void>;
  jumpTo: (stepId: string) => void;
  complete: () => Promise<void>;
  
  // Data management
  updateData: (data: Partial<Record<string, any>>) => void;
  getData: (key: string) => any;
  setData: (key: string, value: any) => void;
  clearData: () => void;
  
  // Validation
  validateStep: (stepId?: string) => Promise<boolean>;
  validateField: (fieldName: string, value: any) => Promise<boolean>;
  
  // State persistence
  saveState: () => Promise<void>;
  loadState: () => Promise<FlowState | null>;
  clearState: () => Promise<void>;
  
  // Utilities
  canGoBack: boolean;
  canGoNext: boolean;
  canSkip: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for FlowContainer component
 */
export interface FlowContainerProps {
  flow: FlowConfig;
  
  // Handlers
  onComplete?: (data: Record<string, any>) => void;
  onSkip?: (data: Record<string, any>) => void;
  onAbandonment?: (data: Record<string, any>, currentStep: string) => void;
  
  // Customization
  theme?: 'light' | 'dark' | 'system' | string;
  userPreferences?: Record<string, any>;
  brandId?: string;
  
  // Experiment tracking
  onExperimentView?: (experimentId: string, variant: string) => void;
  
  // Initial data
  initialData?: Record<string, any>;
  
  // Resume state
  resumeState?: FlowState;
  
  // Custom styles
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  navigationStyle?: ViewStyle;
}

/**
 * Props for step renderer components
 */
export interface StepRendererProps<T extends StepConfig = StepConfig> {
  step: T;
  data: Record<string, any>;
  onUpdate: (data: Partial<Record<string, any>>) => void;
  onNext: () => Promise<void>;
  onBack: () => void;
  onSkip: () => Promise<void>;
  context: FlowContextValue;
}

/**
 * Props for custom step components
 */
export interface CustomStepProps {
  step: CustomStepConfig;
  data: Record<string, any>;
  onUpdate: (data: Partial<Record<string, any>>) => void;
  context: FlowContextValue;
}

// ============================================================================
// Validation Schema Types
// ============================================================================

/**
 * Flow configuration validation schema
 */
export const flowConfigSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
  progressIndicator: z.enum(['dots', 'stepper', 'bar', 'circular', 'none']),
  showHeader: z.boolean().optional(),
  showSkip: z.boolean().optional(),
  steps: z.array(z.any()).min(1),
  persistState: z.boolean().optional(),
  persistenceKey: z.string().optional(),
});

// Export type from schema
export type ValidatedFlowConfig = z.infer<typeof flowConfigSchema>;
