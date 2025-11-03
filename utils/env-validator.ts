/**
 * Runtime environment variable validation
 * Ensures all required config is present before app starts
 */

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
] as const;

/**
 * Optional environment variables (for validation info only)
 */
const OPTIONAL_ENV_VARS = [
  'EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
  'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID',
  'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
  'EXPO_PUBLIC_SENTRY_DSN',
  'EXPO_PUBLIC_AMPLITUDE_KEY',
  'EXPO_PUBLIC_MIXPANEL_TOKEN',
] as const;

interface ValidationError {
  variable: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate a single environment variable
 */
function validateEnvVar(varName: string, value: string | undefined, required: boolean): ValidationError | null {
  // Check if missing
  if (!value || value === '' || value === 'undefined' || value === 'null') {
    return {
      variable: varName,
      message: required ? 'Required environment variable is missing' : 'Optional environment variable is missing',
    };
  }

  // Validate URL format for specific variables
  if (varName.includes('URL') || varName.includes('DOMAIN') || varName === 'EXPO_PUBLIC_SENTRY_DSN') {
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`);
    } catch {
      return {
        variable: varName,
        message: 'Invalid URL format',
      };
    }
  }

  // Validate API key format (should be reasonably long)
  if (varName.includes('API_KEY') && value.length < 10) {
    return {
      variable: varName,
      message: 'API key seems too short (minimum 10 characters)',
    };
  }

  return null;
}

/**
 * Validate all environment variables
 * @returns Validation result with errors and warnings
 */
export function validateEnvironment(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate required variables
  for (const varName of REQUIRED_ENV_VARS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (process.env as any)[varName];
    const error = validateEnvVar(varName, value, true);

    if (error) {
      errors.push(error);
    }
  }

  // Validate optional variables (warnings only)
  for (const varName of OPTIONAL_ENV_VARS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (process.env as any)[varName];
    const error = validateEnvVar(varName, value, false);

    if (error && value !== undefined) {
      // Only warn if value is provided but invalid
      warnings.push(error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate environment variables and throw if validation fails
 * Use this at app startup to ensure all required config is present
 */
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();

  if (!result.isValid) {
    const errorMessages = result.errors.map((err) => `  • ${err.variable}: ${err.message}`).join('\n');

    const errorMessage = `❌ Environment Variable Validation Failed:\n\n${errorMessages}\n\nPlease check your .env file and ensure all required Firebase credentials are properly configured.`;

    throw new Error(errorMessage);
  }

  // Log warnings in development
  if (__DEV__ && result.warnings.length > 0) {
    console.warn('⚠️ Environment Variable Warnings:');
    for (const warning of result.warnings) {
      console.warn(`  • ${warning.variable}: ${warning.message}`);
    }
  }
}

/**
 * Get environment variable validation status
 * Useful for debugging or displaying in dev tools
 */
export function getEnvironmentStatus(): {
  required: { name: string; present: boolean; valid: boolean }[];
  optional: { name: string; present: boolean; valid: boolean }[];
} {
  const required = REQUIRED_ENV_VARS.map((varName) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (process.env as any)[varName];
    const error = validateEnvVar(varName, value, true);
    return {
      name: varName,
      present: !!value && value !== '' && value !== 'undefined' && value !== 'null',
      valid: !error,
    };
  });

  const optional = OPTIONAL_ENV_VARS.map((varName) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (process.env as any)[varName];
    const error = validateEnvVar(varName, value, false);
    return {
      name: varName,
      present: !!value && value !== '' && value !== 'undefined' && value !== 'null',
      valid: !error,
    };
  });

  return { required, optional };
}

/**
 * Log environment status (development only)
 */
export function logEnvironmentStatus(): void {
  if (!__DEV__) {
    return;
  }

  const status = getEnvironmentStatus();

  // Use console.warn which is allowed by ESLint
  console.warn('🔧 Environment Configuration Status:');
  console.warn('\nRequired Variables:');
  for (const variable of status.required) {
    const icon = variable.present && variable.valid ? '✅' : '❌';
    console.warn(`  ${icon} ${variable.name}`);
  }

  console.warn('\nOptional Variables:');
  for (const variable of status.optional) {
    const icon = variable.present ? (variable.valid ? '✅' : '⚠️') : '○';
    console.warn(`  ${icon} ${variable.name}`);
  }

  console.warn('');
}
