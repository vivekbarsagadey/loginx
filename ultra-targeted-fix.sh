#!/bin/bash

echo "🎯 Ultra-Targeted TypeScript Error Fix"
echo "======================================"

# Pattern 1: Fix catch blocks where param is _error but code uses error
echo "📝 Fixing catch (_error) with error usage..."

# verify-email.tsx
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)console\.error\("Email verification error:", error\);/} catch (error: unknown) {\1console.error("Email verification error:", error);/g' app/\(auth\)/verify-email.tsx

# update-email.tsx - 6 instances
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)logError\("Failed to update email in Firestore", \{ userId, error \}\);/} catch (error: unknown) {\1logError("Failed to update email in Firestore", { userId, error });/g' app/profile/update-email.tsx
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)logError\("Failed to update email", \{ error \}\);/} catch (error: unknown) {\1logError("Failed to update email", { error });/g' app/profile/update-email.tsx
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)console\.error\("Email update error:", error\);/} catch (error: unknown) {\1console.error("Email update error:", error);/g' app/profile/update-email.tsx

# 2fa.tsx - 3 instances
perl -i -pe 's/} catch \(error: unknown\) \{(\s+)logError\("2FA setup failed", \{ _error \}\);/} catch (error: unknown) {\1logError("2FA setup failed", { error });/g' app/security/2fa.tsx
perl -i -pe 's/} catch \(error: unknown\) \{(\s+)console\.error\("2FA error:", _error\);/} catch (error: unknown) {\1console.error("2FA error:", error);/g' app/security/2fa.tsx

# Storage hooks - 18 instances total
# use-async-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to get AsyncStorage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to get AsyncStorage item");/g' hooks/storage/use-async-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to set AsyncStorage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to set AsyncStorage item");/g' hooks/storage/use-async-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to remove AsyncStorage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to remove AsyncStorage item");/g' hooks/storage/use-async-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to clear AsyncStorage"\);/} catch (error: unknown) {\1handleError(error, "Failed to clear AsyncStorage");/g' hooks/storage/use-async-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to get all AsyncStorage keys"\);/} catch (error: unknown) {\1handleError(error, "Failed to get all AsyncStorage keys");/g' hooks/storage/use-async-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to merge AsyncStorage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to merge AsyncStorage item");/g' hooks/storage/use-async-storage.ts

# use-local-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to get local storage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to get local storage item");/g' hooks/storage/use-local-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to set local storage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to set local storage item");/g' hooks/storage/use-local-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to remove local storage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to remove local storage item");/g' hooks/storage/use-local-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to clear local storage"\);/} catch (error: unknown) {\1handleError(error, "Failed to clear local storage");/g' hooks/storage/use-local-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to get all local storage keys"\);/} catch (error: unknown) {\1handleError(error, "Failed to get all local storage keys");/g' hooks/storage/use-local-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to merge local storage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to merge local storage item");/g' hooks/storage/use-local-storage.ts

# use-secure-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to get secure storage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to get secure storage item");/g' hooks/storage/use-secure-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to set secure storage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to set secure storage item");/g' hooks/storage/use-secure-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to remove secure storage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to remove secure storage item");/g' hooks/storage/use-secure-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to clear secure storage"\);/} catch (error: unknown) {\1handleError(error, "Failed to clear secure storage");/g' hooks/storage/use-secure-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to get all secure storage keys"\);/} catch (error: unknown) {\1handleError(error, "Failed to get all secure storage keys");/g' hooks/storage/use-secure-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)handleError\(error, "Failed to merge secure storage item"\);/} catch (error: unknown) {\1handleError(error, "Failed to merge secure storage item");/g' hooks/storage/use-secure-storage.ts

echo "✅ Pattern 1 complete: catch block parameter fixes"

# Pattern 2: Fix utility function parameters where _error is in signature but error is used in body
echo "📝 Fixing utility function parameters..."

# firestore-helpers.ts
perl -i -pe 's/export function isFirestoreError\(_error: unknown\): _error is FirebaseError \{/export function isFirestoreError(error: unknown): error is FirebaseError {/g' utils/firestore-helpers.ts
perl -i -pe 's/return error instanceof FirebaseError && error\.code\.startsWith\("firestore\/"\);/  return error instanceof FirebaseError \&\& error.code.startsWith("firestore\/");/g' utils/firestore-helpers.ts

perl -i -pe 's/export function getFirestoreErrorMessage\(_error: unknown\): string \{/export function getFirestoreErrorMessage(error: unknown): string {/g' utils/firestore-helpers.ts

# error.ts
perl -i -pe 's/export function isFatalError\(_error: Error\): boolean \{/export function isFatalError(error: Error): boolean {/g' utils/error.ts

perl -i -pe 's/export function isFirebaseError\(_error: unknown\): _error is FirebaseError \{/export function isFirebaseError(error: unknown): error is FirebaseError {/g' utils/error.ts

# retry.ts
perl -i -pe 's/} catch \(_error: unknown\) \{(\s+)if \(error instanceof Error && shouldRetry\(error\)\) \{/} catch (error: unknown) {\1if (error instanceof Error \&\& shouldRetry(error)) {/g' utils/retry.ts

echo "✅ Pattern 2 complete: utility function parameter fixes"

# Pattern 3: Fix type compatibility Error | undefined vs Error
echo "📝 Fixing Error type compatibility..."

# This requires more careful changes to callback signatures
# use-async-retry.ts - Change callback type from Error to Error | undefined
perl -i -pe 's/onError\?: \(error: Error\) => void;/onError?: (error: Error | undefined) => void;/g' hooks/async/use-async-retry.ts

# use-fetch.ts - Similar changes
perl -i -pe 's/onError\?: \(error: Error\) => void;/onError?: (error: Error | undefined) => void;/g' hooks/async/use-fetch.ts

echo "✅ Pattern 3 complete: type compatibility fixes"

# Pattern 4: Fix auth-error-boundary shorthand properties
echo "📝 Fixing error boundary shorthand properties..."

perl -i -pe 's/\{ error, resetErrorBoundary \}/{ error: error, resetErrorBoundary: resetErrorBoundary }/g' components/auth/auth-error-boundary.tsx

# error-boundary.tsx
perl -i -pe 's/\{ error, resetErrorBoundary \}/{ error: error, resetErrorBoundary: resetErrorBoundary }/g' components/error-boundary.tsx

echo "✅ Pattern 4 complete: shorthand property fixes"

echo ""
echo "🎉 All ultra-targeted fixes applied!"
echo ""

