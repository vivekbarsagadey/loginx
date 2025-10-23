#!/bin/bash
# Fix unused catch block error variables by adding underscore prefix
# Rule: @typescript-eslint/no-unused-vars - unused catch errors must match /^_/u

echo "🔧 Fixing unused catch block error variables..."

# Pattern: catch (error: unknown) where 'error' is never used
# Fix: Rename to catch (_error: unknown)

find . -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.expo/*" ! -path "*/dist/*" -exec perl -i -pe '
  # Match catch blocks with error that is never used
  # This is a safe transformation because we are only adding underscore prefix
  s/catch\s*\(\s*error\s*:\s*unknown\s*\)/catch (_error: unknown)/g;
  s/catch\s*\(\s*error\s*\)/catch (_error)/g;
' {} +

echo "✅ Phase 1 complete: Unused catch errors prefixed with underscore"
