# Consistency Patterns Quick Reference

**Principle:** Consistency = Predictability  
Users learn the app faster when elements behave the same way everywhere.

---

## 🔴 Destructive Actions (Delete/Remove)

**Pattern:** Red button + Confirmation dialog + Heavy haptic

```tsx
import { ThemedButton } from "@/components/themed-button";
import { useAlert } from "@/hooks/use-alert";

function DeleteExample() {
  const alert = useAlert();

  const handleDelete = () => {
    alert.show(
      "Delete Item",
      "Are you sure you want to delete this item? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive", // Red button + heavy haptic
          onPress: async () => {
            // Delete logic here
          }
        }
      ]
    );
  };

  return (
    <>
      <ThemedButton
        title="Delete"
        variant="destructive"
        onPress={handleDelete}
      />
      {alert.AlertComponent}
    </>
  );
}
```

---

## 🔵 Primary Actions (Save/Submit)

**Pattern:** Primary color + Light haptic + Loading state

```tsx
function SaveExample() {
  const alert = useAlert();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save logic here
      await saveData();

      // Success feedback
      alert.show(
        "Saved",
        "Your changes have been saved successfully.",
        [{ text: "OK" }],
        { variant: "success" }
      );
    } catch (error) {
      alert.show(
        "Error",
        "Failed to save changes. Please try again.",
        [{ text: "OK" }],
        { variant: "error" }
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ThemedButton
        title="Save Changes"
        variant="primary"
        onPress={handleSave}
        loading={saving}
        disabled={saving}
      />
      {alert.AlertComponent}
    </>
  );
}
```

---

## ⚠️ Warning Actions (Sign Out/Reset)

**Pattern:** Confirmation dialog + Medium haptic

```tsx
function SignOutExample() {
  const alert = useAlert();

  const handleSignOut = () => {
    alert.show("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        onPress: async () => {
          // Sign out logic here
        }
      }
    ]);
  };

  return (
    <>
      <ThemedButton
        title="Sign Out"
        variant="secondary"
        onPress={handleSignOut}
      />
      {alert.AlertComponent}
    </>
  );
}
```

---

## 🗑️ Clear All Pattern

**Pattern:** Count in message + Destructive confirmation

```tsx
function ClearAllExample() {
  const alert = useAlert();
  const items = ["Item 1", "Item 2", "Item 3"];

  const handleClearAll = () => {
    alert.show(
      "Clear All Items",
      `Are you sure you want to delete all ${items.length} items? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            // Clear all logic here
          }
        }
      ]
    );
  };

  return (
    <>
      <ThemedButton
        title="Clear All"
        variant="destructive"
        onPress={handleClearAll}
        disabled={items.length === 0}
      />
      {alert.AlertComponent}
    </>
  );
}
```

---

## 💾 Discard Changes Pattern

**Pattern:** Destructive because losing work is destructive

```tsx
function DiscardChangesExample() {
  const alert = useAlert();
  const hasUnsavedChanges = true;

  const handleBack = () => {
    if (hasUnsavedChanges) {
      alert.show(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to discard them?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive", // Red because losing work is destructive
            onPress: () => {
              // Navigate back
            }
          }
        ]
      );
    } else {
      // Navigate back directly
    }
  };

  return (
    <>
      <ThemedButton title="Back" variant="secondary" onPress={handleBack} />
      {alert.AlertComponent}
    </>
  );
}
```

---

## 📸 Remove Photo Pattern

**Pattern:** Small X button + Confirmation for single item

```tsx
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function RemovePhotoExample() {
  const alert = useAlert();
  const errorColor = useThemeColor({}, "error");

  const handleRemove = (index: number) => {
    alert.show("Remove Photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          // Remove photo logic
        }
      }
    ]);
  };

  return (
    <Pressable
      onPress={() => handleRemove(0)}
      style={[styles.removeButton, { backgroundColor: errorColor }]}
      accessibilityLabel="Remove photo"
      accessibilityRole="button"
    >
      <Ionicons name="close" size={16} color="white" />
    </Pressable>
  );
}
```

---

## ✅ Success Feedback Pattern

**Pattern:** Success alert with green indicator

```tsx
function showSuccessFeedback() {
  alert.show(
    "Success!",
    "Your action completed successfully.",
    [{ text: "OK" }],
    { variant: "success" }
  );
}
```

---

## ❌ Error Feedback Pattern

**Pattern:** Error alert with red indicator

```tsx
function showErrorFeedback() {
  alert.show(
    "Error",
    "Something went wrong. Please try again.",
    [{ text: "OK" }],
    { variant: "error" }
  );
}
```

---

## ⚠️ Warning Feedback Pattern

**Pattern:** Warning alert with orange indicator

```tsx
function showWarningFeedback() {
  alert.show(
    "Warning",
    "This action may have unintended consequences.",
    [{ text: "OK" }],
    { variant: "warning" }
  );
}
```

---

## Button Hierarchy Cheat Sheet

```tsx
// 1. DESTRUCTIVE - Delete, Remove (RED)
<ThemedButton title="Delete Account" variant="destructive" />

// 2. PRIMARY - Main action (BRAND COLOR)
<ThemedButton title="Save Changes" variant="primary" />

// 3. SECONDARY - Alternative action (OUTLINED)
<ThemedButton title="Cancel" variant="secondary" />

// 4. TERTIARY - Subtle action (SURFACE)
<ThemedButton title="Learn More" variant="tertiary" />

// 5. LINK - Inline action (TEXT ONLY)
<ThemedButton title="Skip" variant="link" />
```

---

## Color Meaning Cheat Sheet

### 🔴 RED (error)

- Destructive actions
- Errors
- Critical alerts
- **Examples:** Delete, Remove, Clear

### 🟠 ORANGE (warning)

- Warnings
- Caution
- Important notices
- **Examples:** Sign Out, Reset

### 🟢 GREEN (success)

- Success states
- Confirmations
- Positive actions
- **Examples:** Saved, Completed

### 🔵 BLUE (primary)

- Primary actions
- Links
- Brand identity
- **Examples:** Save, Submit, Confirm

### ⚪ GRAY (text-muted)

- Secondary info
- Disabled states
- Borders
- **Examples:** Cancel, Back

---

## Confirmation Dialog Rules

### ✅ ALWAYS REQUIRE CONFIRMATION FOR:

- Destructive actions (delete, remove, clear)
- Data loss (discard changes, sign out)
- Financial transactions
- Permanent changes
- Account modifications

### ❌ DON'T REQUIRE CONFIRMATION FOR:

- Saving data
- Canceling an action
- Navigating back
- Closing modals
- Non-destructive changes

---

## Haptic Feedback Guidelines

```tsx
import * as Haptics from "expo-haptics";

// Light - Success actions, selections, taps
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium - Warning actions, important selections
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Heavy - Destructive actions (delete, remove)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Success notification
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Warning notification
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

// Error notification
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

## Benefits of Consistency

### 🚀 Faster Learning

Users recognize patterns and know what to expect

### 🛡️ Fewer Errors

Confirmation dialogs prevent accidental destructive actions

### 💪 Increased Confidence

Predictable behavior makes users feel in control

### ♿ Better Accessibility

Consistent patterns work better with screen readers

### ⚡ Easier Maintenance

Reusable patterns mean faster development

---

**Last Updated:** October 10, 2025
