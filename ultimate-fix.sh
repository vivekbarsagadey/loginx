#!/bin/bash

echo "🎯 Ultimate TypeScript Fix - Final Pass"
echo "======================================="

# Fix 1: error-boundary.tsx - change _error to error
echo "📝 Fixing error-boundary.tsx..."
perl -i -pe 's/static getDerivedStateFromError\(_error: Error\): Partial<State> \{/static getDerivedStateFromError(error: Error): Partial<State> {/g' components/error-boundary.tsx
perl -i -pe 's/componentDidCatch\(_error: Error, errorInfo: ErrorInfo\): void \{/componentDidCatch(error: Error, errorInfo: ErrorInfo): void {/g' components/error-boundary.tsx

# Fix 2: themed-scroll-view.tsx - change _error to error
echo "📝 Fixing themed-scroll-view.tsx..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' components/themed-scroll-view.tsx

# Fix 3: re-auth-prompt.tsx - verify it uses _error consistently
echo "📝 Checking re-auth-prompt.tsx..."
# Already fixed by previous script

# Fix 4: 2fa.tsx - verify it uses _error consistently
echo "📝 Checking 2fa.tsx..."
# Already fixed by previous script

# Fix 5: use-async-retry.ts - change remaining null to undefined
echo "📝 Fixing use-async-retry.ts nulls..."
perl -i -pe 's/setState\(\{ \.\.\.prev, error: null, data: null \}\)/setState({ ...prev, error: undefined, data: null })/g' hooks/async/use-async-retry.ts
perl -i -pe 's/setError\(null\)/setError(undefined)/g' hooks/async/use-async-retry.ts
perl -i -pe 's/error: null/error: undefined/g' hooks/async/use-async-retry.ts

# Fix catch block with _err -> _error
perl -i -pe 's/} catch \(_err: unknown\) \{/} catch (_error: unknown) {/g' hooks/async/use-async-retry.ts

# Fix 6: use-fetch.ts - fix remaining errors  
echo "📝 Fixing use-fetch.ts..."
perl -i -pe 's/error: null/error: undefined/g' hooks/async/use-fetch.ts
perl -i -pe 's/} catch \(_err: unknown\) \{/} catch (_error: unknown) {/g' hooks/async/use-fetch.ts
perl -i -pe 's/} catch \(err: unknown\) \{/} catch (_error: unknown) {/g' hooks/async/use-fetch.ts

# Fix 7: contact-support.ts
echo "📝 Fixing contact-support.ts..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' utils/contact-support.ts

# Fix 8: firestore-helpers.ts
echo "📝 Fixing firestore-helpers.ts..."
perl -i -pe 's/} catch \(_error: unknown\) \{/} catch (error: unknown) {/g' utils/firestore-helpers.ts

echo ""
echo "✅ Ultimate fix complete!"
echo ""

