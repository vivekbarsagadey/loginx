#!/bin/bash

# Fix error-classifier.ts - all _error should be error
perl -i -pe 's/= \(_error: unknown\): error is/= (error: unknown): error is/g' utils/error-classifier.ts
perl -i -pe 's/= \(_error: FirebaseError\)/= (error: FirebaseError)/g' utils/error-classifier.ts
perl -i -pe 's/classifyError\(error\)/classifyError(_error)/g' utils/error-classifier.ts
perl -i -pe 's/const classifyError = \(_error: unknown\)/const classifyError = (error: unknown)/g' utils/error-classifier.ts

# Fix error.ts - same pattern
perl -i -pe 's/= \(_error: unknown\): error is/= (error: unknown): error is/g' utils/error.ts
perl -i -pe 's/hasErrorCode\(error\)/hasErrorCode(_error)/g' utils/error.ts
perl -i -pe 's/isFirebaseError\(error\)/isFirebaseError(_error)/g' utils/error.ts
perl -i -pe 's/isAxiosError\(error\)/isAxiosError(_error)/g' utils/error.ts  
perl -i -pe 's/classifyError\(error\)/classifyError(_error)/g' utils/error.ts
perl -i -pe 's/isFatalError\(error\)/isFatalError(_error)/g' utils/error.ts
perl -i -pe 's/getFirebaseErrorMessage\(error\.code\)/getFirebaseErrorMessage(_error.code)/g' utils/error.ts

# Fix firestore-helpers.ts - functions that check error types
perl -i -pe 's/isFirestoreError\(error\)/isFirestoreError(_error)/g' utils/firestore-helpers.ts
perl -i -pe 's/getFirestoreErrorMessage\(error\)/getFirestoreErrorMessage(_error)/g' utils/firestore-helpers.ts
perl -i -pe 's/const isFirestoreError = \(_error/const isFirestoreError = (error/g' utils/firestore-helpers.ts
perl -i -pe 's/const getFirestoreErrorMessage = \(_error/const getFirestoreErrorMessage = (error/g' utils/firestore.ts

# Fix memory-monitor.ts - rename __error back to _error
perl -i -pe 's/__error/_error/g' utils/memory-monitor.ts

# Fix weak-cache.ts - same
perl -i -pe 's/__error/_error/g' utils/weak-cache.ts

# Fix retry.ts - one last 'error' reference
perl -i -pe 's/"code" in error/"code" in _error/g' utils/retry.ts

# Fix auth-rate-limiter.ts - reference correct parameter
perl -i -pe 's/\} catch \(error: unknown\)/} catch (_error: unknown)/g' utils/auth-rate-limiter.ts
perl -i -pe 's/if \(error\.code/if (_error.code/g' utils/auth-rate-limiter.ts
perl -i -pe 's/message: error\./message: _error./g' utils/auth-rate-limiter.ts
perl -i -pe 's/const retryMatch = error\./const retryMatch = _error./g' utils/auth-rate-limiter.ts
perl -i -pe 's/logger\.error\([^,]+, error\)/logger.error("[AuthRateLimiter] Validation failed", _error)/g' utils/auth-rate-limiter.ts
perl -i -pe 's/return error\?/return _error?/g' utils/auth-rate-limiter.ts
perl -i -pe 's/const message = error\?/const message = _error?/g' utils/auth-rate-limiter.ts

# Fix contact-support.ts
perl -i -pe 's/typeof error ===/typeof _error ===/g' utils/contact-support.ts
perl -i -pe 's/error !== null/_error !== null/g' utils/contact-support.ts
perl -i -pe 's/"code" in error/"code" in _error/g' utils/contact-support.ts
perl -i -pe 's/\(error as/(_error as/g' utils/contact-support.ts
perl -i -pe 's/if \(error instanceof/if (_error instanceof/g' utils/contact-support.ts

# Fix distributed-lock.ts, cleanup-manager.ts, conflict-resolver.ts
perl -i -pe 's/error as Error/_error as Error/g' utils/distributed-lock.ts utils/cleanup-manager.ts utils/conflict-resolver.ts
perl -i -pe 's/throw error;/throw _error;/g' utils/distributed-lock.ts

# Fix feedback.ts
perl -i -pe 's/showError\(error\)/showError(_error)/g' utils/feedback.ts

# Fix error-aggregator.ts
perl -i -pe 's/classifyError\(error\)/classifyError(_error)/g' utils/error-aggregator.ts

# Fix social-auth-helpers.ts
perl -i -pe 's/"code" in error/"code" in _error/g' utils/social-auth-helpers.ts

# Fix hooks with error references
perl -i -pe 's/setError\(err\)/setError(_error)/g' hooks/utility/use-infinite-scroll.ts hooks/storage/use-secure-storage.ts
perl -i -pe 's/onError\(err\)/onError(_error)/g' hooks/utility/use-infinite-scroll.ts
perl -i -pe 's/\? err/? _error/g' hooks/storage/use-secure-storage.ts

# Fix use-form-submit.tsx
perl -i -pe 's/showError\(error\)/showError(_error)/g' hooks/ui/use-form-submit.tsx
perl -i -pe 's/onError\(error\)/onError(_error)/g' hooks/ui/use-form-submit.tsx
perl -i -pe 's/return \{ success: false, error \}/return { success: false, error: _error }/g' hooks/ui/use-form-submit.tsx

# Fix use-flow-validation.ts
perl -i -pe 's/return \{ valid: false, error: error\./return { valid: false, error: _error./g' hooks/use-flow-validation.ts
perl -i -pe 's/if \(error\.errors\)/if (_error.errors)/g' hooks/use-flow-validation.ts
perl -i -pe 's/for \(const err of error\./for (const err of _error./g' hooks/use-flow-validation.ts
perl -i -pe 's/\[stepToValidate\.id\]: error\./[stepToValidate.id]: _error./g' hooks/use-flow-validation.ts

# Fix use-error-handler.tsx
perl -i -pe 's/getErrorInfo\(error\)/getErrorInfo(_error)/g' hooks/utility/use-error-handler.tsx
perl -i -pe 's/isFatalError\(error\)/isFatalError(_error)/g' hooks/utility/use-error-handler.tsx
perl -i -pe 's/error,$/error: _error,/g' hooks/utility/use-error-handler.tsx
perl -i -pe 's/getErrorContextForSupport\(error\)/getErrorContextForSupport(_error)/g' hooks/utility/use-error-handler.tsx

echo "All fixes applied!"
