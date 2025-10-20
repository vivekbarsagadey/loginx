#!/bin/bash

echo "🔧 Starting comprehensive fix of all project issues..."
echo ""

# Fix 1: Auto-fix what ESLint can fix automatically
echo "📝 Step 1: Running ESLint auto-fix..."
npx eslint . --ext .ts,.tsx --fix --quiet 2>&1 | head -20

echo ""
echo "✅ Step 1 complete"
echo ""

# Fix 2: Sort imports
echo "📝 Step 2: Fixing import sorting..."
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" \
  -not -path "*/.expo/*" \
  -exec npx eslint {} --fix --rule "sort-imports: [error, {ignoreCase: true, ignoreDeclarationSort: false}]" \; 2>/dev/null

echo "✅ Step 2 complete"
echo ""

# Fix 3: Check remaining issues
echo "📊 Step 3: Checking remaining issues..."
REMAINING=$(npx eslint . --ext .ts,.tsx --format=compact 2>&1 | grep -E "error|warning" | wc -l | tr -d ' ')

echo ""
echo "======================================"
echo "📊 RESULTS:"
echo "======================================"
echo "Remaining issues: $REMAINING"
echo ""

if [ "$REMAINING" -gt "0" ]; then
  echo "📝 Top remaining issues:"
  npx eslint . --ext .ts,.tsx --format=json 2>&1 | jq -r '[.[] | .messages[] | select(.ruleId) | .ruleId] | group_by(.) | map({rule: .[0], count: length}) | sort_by(.count) | reverse | .[:10] | .[] | "  - \(.rule): \(.count)"' 2>/dev/null || echo "  (Run full lint to see details)"
fi

echo ""
echo "✅ Auto-fix complete! Review changes and commit."
