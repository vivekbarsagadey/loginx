#!/bin/bash

echo "🔧 Comprehensive TypeScript Error Fix"
echo "====================================="

# Fix 1: update-email.tsx - Change onError callback parameter from _error to error
echo "📝 Fixing update-email.tsx..."
perl -i -pe 's/onError: \(_error: unknown\) =>/onError: (error: unknown) =>/g' app/profile/update-email.tsx

# Fix 2: 2fa.tsx - Change catch block parameter from error to _error (since code uses _error)
echo "📝 Fixing 2fa.tsx..."
perl -i -pe 's/} catch \(error: unknown\) \{/} catch (_error: unknown) {/g' app/security/2fa.tsx

# Fix 3: auth-error-boundary.tsx - Fix shorthand property and parameter
echo "📝 Fixing auth-error-boundary.tsx..."
# First, let's check what we need to fix
grep -n "error, resetErrorBoundary" components/auth/auth-error-boundary.tsx || echo "Pattern not found"

# Fix 4: error-boundary.tsx - Change catch parameter from _error to error
echo "📝 Fixing error-boundary.tsx..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' components/error-boundary.tsx

# Fix 5: re-auth-prompt.tsx - Change error to _error in catch blocks
echo "📝 Fixing re-auth-prompt.tsx..."
perl -i -pe 's/} catch \(error: unknown\) \{/} catch (_error: unknown) {/g' components/security/re-auth-prompt.tsx

# Fix 6: themed-scroll-view.tsx - Change _error to error
echo "📝 Fixing themed-scroll-view.tsx..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' components/themed-scroll-view.tsx

# Fix 7: use-async-retry.ts - Change null to undefined and fix parameter names
echo "📝 Fixing use-async-retry.ts..."
# Replace null with undefined for error state
perl -i -pe 's/setError\(null\)/setError(undefined)/g' hooks/async/use-async-retry.ts
perl -i -pe 's/error: null/error: undefined/g' hooks/async/use-async-retry.ts
# Fix catch block parameter
perl -i -pe 's/} catch \(_err: unknown\) \{/} catch (_error: unknown) {/g' hooks/async/use-async-retry.ts
# Revert onError callback type change if it causes issues
perl -i -pe 's/onError\?: \(error: Error \| undefined\) => void;/onError?: (error: Error) => void;/g' hooks/async/use-async-retry.ts

# Fix 8: use-fetch.ts - Change null to undefined and fix parameter names
echo "📝 Fixing use-fetch.ts..."
# Replace null with undefined for error state
perl -i -pe 's/error: null/error: undefined/g' hooks/async/use-fetch.ts
perl -i -pe 's/setState\(\{ \.\.\.state, error: null \}\)/setState({ ...state, error: undefined })/g' hooks/async/use-fetch.ts
# Fix catch block parameter - change err to _error
perl -i -pe 's/} catch \(err: unknown\) \{/} catch (_error: unknown) {/g' hooks/async/use-fetch.ts
# Revert onError callback type change
perl -i -pe 's/onError\?: \(error: Error \| undefined\) => void;/onError?: (error: Error) => void;/g' hooks/async/use-fetch.ts

# Fix 9: Storage hooks - Change _error to error in catch blocks
echo "�� Fixing storage hooks..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' hooks/storage/use-async-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' hooks/storage/use-local-storage.ts
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' hooks/storage/use-secure-storage.ts

echo "✅ All comprehensive fixes applied!"
echo ""

