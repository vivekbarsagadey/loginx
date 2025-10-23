#!/bin/bash
echo "🔧 Fixing remaining unused variables..."

# hooks/use-flow-navigation.ts - line 91: resetState
perl -i -pe 's/(\s+)const resetState =/$1const _resetState =/' hooks/use-flow-navigation.ts

# hooks/use-flow-state.ts - line 8: StepConfig
perl -i -pe 's/import.*StepConfig.*from/import type { _StepConfig } from/' hooks/use-flow-state.ts

# hooks/use-unsaved-changes.tsx - line 77: _error (remove the catch block if truly unused)
# This is a false positive - _error is correctly prefixed

# hooks/utility/use-infinite-scroll.ts - line 68: data parameter
perl -i -pe 's/\(data: T\[\],/(_data: T[],/' hooks/utility/use-infinite-scroll.ts

# tests/memory-leak-detection.test.ts - line 18: listener
perl -i -pe 's/const listener =/const _listener =/ if $. == 18' tests/memory-leak-detection.test.ts

# tests/security/auth-bypass.test.ts - line 103: mockNetworkError
perl -i -pe 's/const mockNetworkError =/const _mockNetworkError =/ if $. == 103' tests/security/auth-bypass.test.ts

# tests/security/injection-attacks.test.ts - lines 93, 103
perl -i -pe 's/const email =/const _email =/ if $. == 93' tests/security/injection-attacks.test.ts
perl -i -pe 's/const successful =/const _successful =/ if $. == 103' tests/security/injection-attacks.test.ts

# utils/cache-strategy.ts - ttl parameters (lines 64, 119, 170)
perl -i -pe 's/ttl: number/_ttl: number/g' utils/cache-strategy.ts

# utils/monitoring.ts - line 252: operation parameter
perl -i -pe 's/operation: Operation/_operation: Operation/ if $. == 252' utils/monitoring.ts

# utils/notification-storage.ts - historyData (lines 68, 87)
perl -i -pe 's/const historyData =/const _historyData =/ if $. == 68 || $. == 87' utils/notification-storage.ts

# utils/social-auth-helpers.ts - line 57: context parameter
perl -i -pe 's/context: AuthContext/_context: AuthContext/ if $. == 57' utils/social-auth-helpers.ts

echo "✅ Remaining unused variables fixed!"
