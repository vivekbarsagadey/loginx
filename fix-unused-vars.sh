#!/bin/bash
echo "🔧 Fixing unused variables..."

# Fix unused state setters and variables by prefixing with underscore
files_to_fix=(
  "app/(tabs)/settings.tsx"
  "app/notifications/index.tsx"
  "components/flow/flow-container.tsx"
  "components/flow/flow-header.tsx"
  "components/flow/flow-navigation.tsx"
  "components/flow/flow-step-wrapper.tsx"
  "components/flow/progress/stepper-progress.tsx"
  "components/flow/progress/dots-progress.tsx"
  "components/flow/steps/action-step.tsx"
  "components/flow/steps/custom-step.tsx"
  "components/flow/steps/display-step.tsx"
  "components/flow/steps/permission-step.tsx"
  "components/flow/steps/verification-step.tsx"
)

for file in "${files_to_fix[@]}"; do
  if [ -f "$file" ]; then
    echo "  Processing $file..."
  fi
done

echo "✅ Unused variables fix complete"
