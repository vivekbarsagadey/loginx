# Code Refactoring Quick Reference Guide

## Quick Lookup Table

| Pattern              | Old Approach                    | New Approach            | Lines Saved |
| -------------------- | ------------------------------- | ----------------------- | ----------- |
| Info Box             | Manual `<ThemedView>` with icon | `<InfoBox>`             | ~15         |
| Selectable Button    | Custom button component         | `<SelectableButton>`    | ~30         |
| Character Counter    | Manual text display             | `<CharacterCounter>`    | ~5          |
| Quick Action Card    | Custom card component           | `<QuickActionCard>`     | ~20         |
| Setting Row          | Custom row layout               | `<SettingRow>`          | ~25         |
| Form Submission      | Try-catch-finally blocks        | `useFormSubmit()`       | ~40         |
| Navigation + Haptics | Manual haptic + router          | `useHapticNavigation()` | ~3          |
| Loading States       | Manual state + error handling   | `useLoadingState()`     | ~20         |
| Form Validation      | Inline validation               | Validation utilities    | ~10         |

---

## Component Replacements

### InfoBox

```tsx
// ❌ Before
<ThemedView style={[styles.infoBox, { backgroundColor: primaryColor + '1A' }]}>
  <Feather name="info" size={20} color={primaryColor} />
  <ThemedText style={styles.infoText}>Message</ThemedText>
</ThemedView>

// ✅ After
<InfoBox message="Message" variant="info" />
```

### SelectableButton

```tsx
// ❌ Before
<Pressable
  onPress={onPress}
  style={[styles.button, { borderColor: isSelected ? primary : border }]}
>
  <Feather name={icon} size={24} color={isSelected ? primary : border} />
  <ThemedText>{label}</ThemedText>
</Pressable>

// ✅ After
<SelectableButton label={label} icon={icon} isSelected={isSelected} onPress={onPress} />
```

### CharacterCounter

```tsx
// ❌ Before
<ThemedText style={styles.charCount}>{text.length}/100</ThemedText>

// ✅ After
<CharacterCounter count={text.length} maxLength={100} />
```

---

## Hook Replacements

### Form Submission

```tsx
// ❌ Before
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  try {
    await submitData();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showSuccess("Success", "Submitted");
    router.back();
  } catch (error) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    showError(error);
  } finally {
    setIsSubmitting(false);
  }
};

// ✅ After
const { submit, isSubmitting } = useFormSubmit(async () => await submitData(), {
  successTitle: "Success",
  successMessage: "Submitted",
  onSuccess: () => router.back()
});
```

### Navigation with Haptics

```tsx
// ❌ Before
const handlePress = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  router.push("/settings");
};

// ✅ After
const { push } = useHapticNavigation();
const handlePress = () => push("/settings");
```

### Loading States

```tsx
// ❌ Before
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const loadData = async () => {
  setLoading(true);
  try {
    const data = await fetchData();
    setData(data);
  } catch (err) {
    setError(err);
    showError(err);
  } finally {
    setLoading(false);
  }
};

// ✅ After
const { loading, execute } = useLoadingState();

const loadData = async () => {
  const { success, data } = await execute(() => fetchData());
  if (success) setData(data);
};
```

---

## Utility Replacements

### Form Validation

```tsx
// ❌ Before
if (!subject.trim()) {
  showAlert("Error", "Subject is required");
  return false;
}
if (subject.length < 3) {
  showAlert("Error", "Subject too short");
  return false;
}

// ✅ After
const result = validateLengthRange(subject, 3, 100, "Subject");
if (!result.isValid) {
  showAlert("Error", result.error);
  return false;
}
```

### Mailto Links

```tsx
// ❌ Before
const email = "support@example.com";
const subject = encodeURIComponent("Support Request");
const body = encodeURIComponent(
  `App: ${appVersion}\nPlatform: ${platform}\n\n`
);
const url = `mailto:${email}?subject=${subject}&body=${body}`;
await Linking.openURL(url);

// ✅ After
await openMailto({
  to: "support@example.com",
  subject: "Support Request",
  includeDeviceInfo: true
});
```

---

## Import Statements

### Components

```tsx
import { InfoBox } from "@/components/ui/info-box";
import { SelectableButton } from "@/components/ui/selectable-button";
import { CharacterCounter } from "@/components/ui/character-counter";
import { QuickActionCard } from "@/components/ui/quick-action-card";
import { SettingRow } from "@/components/ui/setting-row";
```

### Hooks

```tsx
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useHapticNavigation } from "@/hooks/use-haptic-navigation";
import { useLoadingState } from "@/hooks/use-loading-state";
```

### Utilities

```tsx
import { openMailto, getDeviceInfo } from "@/utils/mailto";
import {
  validateLengthRange,
  validateMinLength,
  validateMaxLength,
  validateRequiredField
} from "@/utils/form-validation";
```

---

## Common Patterns by Screen Type

### Feedback/Rating Screens

```tsx
import { InfoBox } from "@/components/ui/info-box";
import { SelectableButton } from "@/components/ui/selectable-button";
import { CharacterCounter } from "@/components/ui/character-counter";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { validateLengthRange } from "@/utils/form-validation";
```

### Settings Screens

```tsx
import { SettingRow } from "@/components/ui/setting-row";
import { useLoadingState } from "@/hooks/use-loading-state";
import { useHapticNavigation } from "@/hooks/use-haptic-navigation";
```

### Help/Support Screens

```tsx
import { QuickActionCard } from "@/components/ui/quick-action-card";
import { openMailto } from "@/utils/mailto";
import { useHapticNavigation } from "@/hooks/use-haptic-navigation";
```

### Form Screens

```tsx
import { CharacterCounter } from "@/components/ui/character-counter";
import { InfoBox } from "@/components/ui/info-box";
import { useFormSubmit } from "@/hooks/use-form-submit";
import {
  validateRequiredField,
  validateLengthRange
} from "@/utils/form-validation";
```

---

## Checklist for Refactoring a Screen

- [ ] Replace manual info boxes with `<InfoBox>`
- [ ] Replace custom selectable buttons with `<SelectableButton>`
- [ ] Replace character count displays with `<CharacterCounter>`
- [ ] Replace quick action cards with `<QuickActionCard>`
- [ ] Replace setting rows with `<SettingRow>`
- [ ] Replace form submission logic with `useFormSubmit()`
- [ ] Replace navigation + haptics with `useHapticNavigation()`
- [ ] Replace loading state management with `useLoadingState()`
- [ ] Replace inline validation with validation utilities
- [ ] Replace mailto logic with `openMailto()`
- [ ] Remove unused state variables
- [ ] Remove unused style definitions
- [ ] Remove unused imports
- [ ] Test functionality
- [ ] Verify accessibility
- [ ] Check TypeScript errors

---

## Files Reference

### Created Components

- `components/ui/info-box.tsx`
- `components/ui/selectable-button.tsx`
- `components/ui/character-counter.tsx`
- `components/ui/quick-action-card.tsx`
- `components/ui/setting-row.tsx`

### Created Hooks

- `hooks/use-form-submit.tsx`
- `hooks/use-haptic-navigation.tsx`
- `hooks/use-loading-state.tsx`

### Enhanced Utilities

- `utils/mailto.ts` (new)
- `utils/form-validation.ts` (enhanced)

### Example Refactored Screen

- `app/feedback.tsx` (refactored as example)

### Documentation

- `docs/CODE_REFACTORING_SUMMARY.md` (comprehensive guide)
- `docs/REFACTORING_QUICK_REFERENCE.md` (this file)

---

_Last Updated: October 11, 2025_
