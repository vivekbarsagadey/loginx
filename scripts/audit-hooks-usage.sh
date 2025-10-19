#!/bin/bash

# Hooks Usage Audit Script
# This script generates a comprehensive report of hook usage across the LoginX project

echo "=== LoginX Hooks Usage Audit Report ==="
echo "Generated: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root
PROJECT_ROOT="/Users/vivekbarsagadey/Vivek Projects/loginx"
cd "$PROJECT_ROOT"

echo "=== 1. Custom Hooks Library Inventory ==="
echo ""
echo "Total custom hooks available:"
find hooks -name "use-*.ts*" | wc -l

echo ""
echo "Hooks by category:"
for category in auth async ui layout device theme lifecycle utility storage timing network permissions settings adapters; do
  count=$(find hooks/$category -name "use-*.ts*" 2>/dev/null | wc -l)
  if [ $count -gt 0 ]; then
    echo "  $category: $count hooks"
  fi
done

echo ""
echo "=== 2. Hook Import Analysis ==="
echo ""
echo "Total hook imports across codebase:"
grep -r "from '@/hooks" app components 2>/dev/null | wc -l

echo ""
echo "Most used hooks (Top 15):"
grep -roh "use[A-Z][a-zA-Z]*" app components 2>/dev/null | sort | uniq -c | sort -rn | head -15

echo ""
echo "=== 3. Component Hook Usage Patterns ==="
echo ""
echo "Components with NO custom hooks:"
find app components -name "*.tsx" -type f | while read file; do
  if ! grep -q "from '@/hooks" "$file" 2>/dev/null; then
    echo "  $(basename $file)"
  fi
done | head -20

echo ""
echo "=== 4. React Hooks Usage ==="
echo ""
echo "useState usage count:"
grep -r "useState" app components 2>/dev/null | wc -l

echo "useEffect usage count:"
grep -r "useEffect" app components 2>/dev/null | wc -l

echo "useCallback usage count:"
grep -r "useCallback" app components 2>/dev/null | wc -l

echo "useMemo usage count:"
grep -r "useMemo" app components 2>/dev/null | wc -l

echo ""
echo "=== 5. Optimization Opportunities ==="
echo ""
echo "Files with multiple useState (potential for useMap/useList/useToggle):"
find app components -name "*.tsx" -type f | while read file; do
  count=$(grep -c "useState" "$file" 2>/dev/null)
  if [ $count -gt 3 ]; then
    echo "  $(basename $file): $count useState calls"
  fi
done | head -10

echo ""
echo "Files with manual debounce/throttle (should use timing hooks):"
grep -rl "setTimeout\|setInterval" app components 2>/dev/null | while read file; do
  echo "  $(basename $file)"
done | head -10

echo ""
echo "=== 6. Context Provider Analysis ==="
echo ""
echo "Context providers in the app:"
grep -r "Provider" app/_layout.tsx 2>/dev/null | grep -o "[A-Z][a-zA-Z]*Provider" | sort | uniq

echo ""
echo "=== 7. Missing Hook Opportunities ==="
echo ""
echo "Components with form logic (potential useForm):"
grep -rl "onSubmit\|handleSubmit" app 2>/dev/null | wc -l

echo ""
echo "Components with search logic (potential useSearch):"
grep -rl "search\|filter" app components 2>/dev/null | wc -l

echo ""
echo "=== End of Report ==="
echo ""
echo "Next steps:"
echo "1. Review components with NO custom hooks"
echo "2. Identify components with 4+ useState calls for state management hook refactoring"
echo "3. Replace manual debounce/throttle with timing hooks"
echo "4. Consider creating useForm, useSearch, and other missing patterns"

