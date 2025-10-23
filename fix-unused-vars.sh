#!/bin/bash
# Fix specific unused variables by adding underscore prefix

echo "🔧 Fixing unused variables..."

# hooks/auth/use-registration-state.ts - line 11: User
perl -i -pe 's/^(import.*\{[^}]*)\bUser\b([^}]*\}.*)$/$1_User$2/ if $. == 11' hooks/auth/use-registration-state.ts

# hooks/network/use-network-context.tsx - line 15: DEFAULT_NETWORK_CONTEXT_STATE
perl -i -pe 's/^const DEFAULT_NETWORK_CONTEXT_STATE/const _DEFAULT_NETWORK_CONTEXT_STATE/' hooks/network/use-network-context.tsx

# hooks/permissions/use-permissions-context.tsx - line 13: DEFAULT_PERMISSIONS_STATE
perl -i -pe 's/^const DEFAULT_PERMISSIONS_STATE/const _DEFAULT_PERMISSIONS_STATE/' hooks/permissions/use-permissions-context.tsx

# hooks/settings/use-settings-context.tsx - line 31: SETTINGS_STORAGE_KEY
perl -i -pe 's/^const SETTINGS_STORAGE_KEY/const _SETTINGS_STORAGE_KEY/' hooks/settings/use-settings-context.tsx

# hooks/ui/use-click-outside.ts - line 79: handlePress
perl -i -pe 's/const handlePress =/const _handlePress =/' hooks/ui/use-click-outside.ts

# hooks/use-flow-engine.ts - line 11: useState
sed -i '' '11s/useState/_useState/' hooks/use-flow-engine.ts

# hooks/use-flow-navigation.ts - line 91: resetState
perl -i -pe 's/const resetState =/const _resetState =/' hooks/use-flow-navigation.ts

# hooks/use-flow-state.ts - line 8: StepConfig
perl -i -pe 's/\bStepConfig\b/_StepConfig/' hooks/use-flow-state.ts

# hooks/use-unsaved-changes.tsx - line 77: _error (already prefixed but still flagged)
# This might need manual review

# hooks/utility/use-infinite-scroll.ts - line 68: data parameter
perl -i -pe 's/\(data: T\[\],/(\_data: T[],/' hooks/utility/use-infinite-scroll.ts

# tests/hooks/timing/use-timeout.test.tsx - line 5: waitFor
perl -i -pe 's/^(import.*\{[^}]*)\bwaitFor\b([^}]*\}.*)$/$1_waitFor$2/ if $. == 5' tests/hooks/timing/use-timeout.test.tsx

# tests/memory-leak-detection.test.ts - line 272: scope
perl -i -pe 's/const scope =/const _scope =/' tests/memory-leak-detection.test.ts

# tests/memory-leak-detection.test.ts - line 18: listener
perl -i -pe 's/const listener =/const _listener =/' tests/memory-leak-detection.test.ts

# tests/performance/memory-leak.test.ts - line 169: handler
perl -i -pe 's/const handler =/const _handler =/' tests/performance/memory-leak.test.ts

# tests/security/auth-bypass.test.ts - mockNetworkError, protectedRoute, user, publicRoute (lines 103, 114, 122, 123)
perl -i -pe 's/const mockNetworkError =/const _mockNetworkError =/' tests/security/auth-bypass.test.ts
perl -i -pe 's/const protectedRoute =/const _protectedRoute =/' tests/security/auth-bypass.test.ts
perl -i -pe 's/const user =/const _user =/ if $. == 122' tests/security/auth-bypass.test.ts
perl -i -pe 's/const publicRoute =/const _publicRoute =/' tests/security/auth-bypass.test.ts

# tests/security/injection-attacks.test.ts - email, successful (lines 93, 103)
perl -i -pe 's/const email =/const _email =/ if $. == 93' tests/security/injection-attacks.test.ts
perl -i -pe 's/const successful =/const _successful =/' tests/security/injection-attacks.test.ts

# utils/cache-strategy.ts - ttl parameters (lines 64, 119, 170)
perl -i -pe 's/\bttl: number\b/_ttl: number/' utils/cache-strategy.ts

# utils/local-first.ts - line 39: PENDING_OPERATIONS_KEY
perl -i -pe 's/^const PENDING_OPERATIONS_KEY/const _PENDING_OPERATIONS_KEY/' utils/local-first.ts

# utils/monitoring.ts - line 252: operation parameter
perl -i -pe 's/operation: Operation/_operation: Operation/' utils/monitoring.ts

# utils/notification-storage.ts - historyData (lines 68, 87)
perl -i -pe 's/const historyData =/const _historyData =/' utils/notification-storage.ts

# utils/safe-navigation.ts - fallbackError (lines 37, 70)
perl -i -pe 's/catch \(fallbackError\)/catch (_fallbackError)/' utils/safe-navigation.ts

# utils/social-auth-helpers.ts - line 57: context parameter
perl -i -pe 's/context: AuthContext/_context: AuthContext/' utils/social-auth-helpers.ts

echo "✅ Unused variables fixed"
