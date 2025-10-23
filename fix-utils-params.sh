#!/bin/bash

echo "🔧 Fixing utils parameter mismatches"
echo "===================================="

# Fix utils/firestore-helpers.ts
echo "📝 Fixing firestore-helpers.ts..."
perl -i -0777 -pe 's/export function isFirestoreError\(_error: unknown\): _error is FirebaseError \{(\s+)return error/export function isFirestoreError(error: unknown): error is FirebaseError {\1return error/g' utils/firestore-helpers.ts
perl -i -0777 -pe 's/export function getFirestoreErrorMessage\(_error: unknown\): string \{(\s+)if \(isFirestoreError\(_error\)\) \{(\s+)const errorCode = \(_error as FirebaseError\).code;(\s+)switch \(errorCode\) \{/export function getFirestoreErrorMessage(error: unknown): string {\1if (isFirestoreError(error)) {\2const errorCode = (error as FirebaseError).code;\3switch (errorCode) {/g' utils/firestore-helpers.ts

# Fix utils/retry.ts
echo "📝 Fixing retry.ts..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' utils/retry.ts

# Fix utils/contact-support.ts
echo "📝 Fixing contact-support.ts..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' utils/contact-support.ts

# Fix utils/social-auth-helpers.ts
echo "📝 Fixing social-auth-helpers.ts..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' utils/social-auth-helpers.ts

echo "✅ Utils parameter fixes applied!"

