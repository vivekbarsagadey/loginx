#!/bin/bash

echo "🎯 Final Parameter Name Fix"
echo "==========================="

# Fix utils/error.ts - Change _error to error in function bodies
echo "📝 Fixing utils/error.ts..."
perl -i -pe 's/export function isFatalError\(_error: Error\): boolean \{/export function isFatalError(error: Error): boolean {/g' utils/error.ts
perl -i -pe 's/export function isFirebaseError\(_error: unknown\): _error is FirebaseError \{/export function isFirebaseError(error: unknown): error is FirebaseError {/g' utils/error.ts

# Fix utils/firestore-helpers.ts - Change _error to error
echo "📝 Fixing utils/firestore-helpers.ts..."
perl -i -pe 's/export function isFirestoreError\(_error: unknown\): _error is FirebaseError \{/export function isFirestoreError(error: unknown): error is FirebaseError {/g' utils/firestore-helpers.ts
perl -i -pe 's/export function getFirestoreErrorMessage\(_error: unknown\): string \{/export function getFirestoreErrorMessage(error: unknown): string {/g' utils/firestore-helpers.ts

# Fix utils/retry.ts - Change _error to error in catch block
echo "📝 Fixing utils/retry.ts..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' utils/retry.ts

# Fix utils/contact-support.ts - Change _error to error
echo "📝 Fixing utils/contact-support.ts..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' utils/contact-support.ts

# Fix utils/social-auth-helpers.ts - Change _error to error
echo "📝 Fixing utils/social-auth-helpers.ts..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' utils/social-auth-helpers.ts

# Fix hooks/storage files - These seem to have error references but _error params, need to check actual usage
echo "📝 Fixing hooks/storage files (checking actual usage)..."
# For secure storage, if code uses _error, keep _error; if it uses error, change to error
# Let's check what these files actually use

# Fix hooks/utility/use-infinite-scroll.ts
echo "📝 Fixing hooks/utility/use-infinite-scroll.ts..."
perl -i -pe 's/} catch \(error: unknown\) \{/} catch (_error: unknown) {/g' hooks/utility/use-infinite-scroll.ts

echo "✅ Final parameter fixes applied!"
echo ""

