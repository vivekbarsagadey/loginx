#!/usr/bin/env bash

# Script to fix all error naming issues in the codebase
# This fixes the inconsistent use of _error vs error variable names

set -e

cd "$(dirname "$0")/.."

echo "Fixing error naming issues..."

# Fix console._error to console.error
echo "1. Fixing console._error -> console.error"
find hooks utils components app -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's/console\._error(/console.error(/g' {} +

# Fix _errors (plural) variable references that should be errors
echo "2. Fixing _errors -> errors where used as variables"
sed -i '' 's/Object\.keys(_errors)/Object.keys(errors)/g' hooks/use-flow-validation.ts
sed -i '' 's/Object\.keys(_errors)/Object.keys(errors)/g' hooks/utility/use-form.ts

# Fix _error variable references in specific files
echo "3. Fixing specific _error variable usage issues"

# utils/config.ts
sed -i '' 's/_errorMessage/errorMessage/g' utils/config.ts

# utils/contact-support.ts - fix error object property
sed -i '' 's/_error: _error/error: _error/g' utils/contact-support.ts
sed -i '' 's/if (typeof error === /if (typeof _error === /g' utils/contact-support.ts
sed -i '' 's/ && error !== null/ \&\& _error !== null/g' utils/contact-support.ts
sed -i '' "s/ && 'code' in error / \&\& 'code' in _error /g" utils/contact-support.ts
sed -i '' 's/error\.message/_error.message/g' utils/contact-support.ts

# utils/error-aggregator.ts
sed -i '' 's/if (_errors\[0\]\.recoverySuggestions/if (errors[0].recoverySuggestions/g' utils/error-aggregator.ts
sed -i '' 's/errorsByCategory\.get(_error\.category)/errorsByCategory.get(error.category)/g' utils/error-aggregator.ts
sed -i '' 's/existing\.push(_error)/existing.push(error)/g' utils/error-aggregator.ts
sed -i '' 's/errorsByCategory\.set(_error\.category/errorsByCategory.set(error.category/g' utils/error-aggregator.ts
sed -i '' 's/if (_errorDisplayCallback)/if (errorDisplayCallback)/g' utils/error-aggregator.ts

# utils/feedback.ts
sed -i '' 's/if (_errorConfig/if (errorConfig/g' utils/feedback.ts

# utils/firestore-helpers.ts
sed -i '' 's/if (typeof error === /if (typeof _error === /g' utils/firestore-helpers.ts
sed -i '' 's/ && error !== null/ \&\& _error !== null/g' utils/firestore-helpers.ts
sed -i '' "s/ && 'code' in error/ \&\& 'code' in _error/g" utils/firestore-helpers.ts
sed -i '' 's/return error\.message/return _error.message/g' utils/firestore-helpers.ts

# utils/firestore-ready.ts
sed -i '' 's/_error: _error/error: _error/g' utils/firestore-ready.ts

# utils/logger.ts
sed -i '' 's/errorContext\.message = error\.message/errorContext.message = _error.message/g' utils/logger.ts
sed -i '' 's/errorContext\.stack = error\.stack/errorContext.stack = _error.stack/g' utils/logger.ts
sed -i '' 's/errorContext\.name = error\.name/errorContext.name = _error.name/g' utils/logger.ts
sed -i '' 's/errorContext\.error = error/errorContext.error = _error/g' utils/logger.ts
sed -i '' 's/_errorContext/errorContext/g' utils/logger.ts

# utils/monitoring.ts
sed -i '' 's/error: _error/error: _error/g' utils/monitoring.ts

# utils/re-authentication.ts
sed -i '' 's/_error: _error/error: _error/g' utils/re-authentication.ts

# utils/registration-diagnostics.ts
sed -i '' "s/status: '_error'/status: 'error'/g" utils/registration-diagnostics.ts

# utils/registration-validator.ts
sed -i '' 's/{ isValid, _errors }/{ isValid, errors }/g' utils/registration-validator.ts

# utils/social-auth-helpers.ts
sed -i '' 's/provideErrorFeedback(_error)/provideErrorFeedback(_error)/g' utils/social-auth-helpers.ts
sed -i '' 's/if (_error && typeof error === /if (_error \&\& typeof _error === /g' utils/social-auth-helpers.ts
sed -i '' "s/ && 'code' in error)/ \&\& 'code' in _error)/g" utils/social-auth-helpers.ts

# hooks/use-flow-engine.ts - fix the _error check
sed -i '' 's/if (_error)/if (error)/g' hooks/use-flow-engine.ts

# hooks/utility/use-form.ts - fix _error check
sed -i '' 's/if (_error)/if (error)/g' hooks/utility/use-form.ts

echo "✅ Fixed all error naming issues"
echo ""
echo "Running type check to verify fixes..."
pnpm type-check
