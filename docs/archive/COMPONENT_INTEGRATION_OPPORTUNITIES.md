# Component Integration Opportunities

**Date:** October 5, 2025  
**Status:** 📋 Analysis Complete  
**Purpose:** Identify opportunities to use newly created design system
components across all app pages

---

## 📊 Executive Summary

After analyzing the codebase, I've identified **multiple opportunities** to
replace custom implementations with our new design system components across
**15+ screens**. This will improve:

- ✅ **Code consistency** - Use standardized components
- ✅ **Maintainability** - Centralized component logic
- ✅ **Accessibility** - Built-in ARIA labels and keyboard support
- ✅ **Performance** - Optimized, memoized components
- ✅ **Developer Experience** - TypeScript types and JSDoc

---

## 🎯 Quick Wins (High Impact, Low Effort)

### 1. Replace Native Switch with Custom Switch Component ⭐⭐⭐

**Current Usage:**

- `app/settings/notifications.tsx` - 3 instances

**Replacement:**

```tsx
// ❌ Before
<Switch
  value={settings[setting.key]}
  onValueChange={(value) => handleToggle(setting.key, value)}
  trackColor={{ false: borderColor, true: tintColor }}
/>;

// ✅ After
import { Switch } from "@/components/ui/inputs/switch";

<Switch
  checked={settings[setting.key]}
  onCheckedChange={(value) => handleToggle(setting.key, value)}
  accessibilityLabel={`Toggle ${setting.title}`}
/>;
```

**Benefits:**

- Consistent theming across platforms
- Better accessibility with proper labels
- Custom styling options

---

### 2. Add Avatar Component to User Profiles ⭐⭐⭐

**Current Usage:**

- `app/(tabs)/settings.tsx` - Profile header with basic Image
- `app/profile/edit.tsx` - Avatar editing with basic Image

**Replacement:**

```tsx
// ❌ Before
<Image
  source={{ uri: user?.photoURL ?? "https://www.gravatar.com/avatar/?d=mp" }}
  style={styles.avatar}
/>;

// ✅ After
import { Avatar } from "@/components/ui/data-display/avatar";

<Avatar
  source={{ uri: user?.photoURL }}
  initials={user?.displayName}
  size="large"
  status="online"
  onPress={handleImagePick}
  accessibilityLabel={`${user?.displayName}'s profile picture`}
/>;
```

**Benefits:**

- Automatic initials fallback
- Status indicators (online/offline/busy)
- Consistent sizing across app
- Built-in press handling

---

### 3. Replace Category Buttons with Chip Component ⭐⭐⭐

**Current Usage:**

- `app/feedback.tsx` - Category selection buttons

**Replacement:**

```tsx
// ❌ Before
<Pressable
  onPress={onPress}
  style={[
    styles.categoryButton,
    { borderColor: isSelected ? primaryColor : borderColor }
  ]}
>
  <Feather name={category.icon} size={24} />
  <ThemedText>{i18n.t(category.labelKey)}</ThemedText>
</Pressable>;

// ✅ After
import { Chip } from "@/components/ui/data-display/chip";

<Chip
  label={i18n.t(category.labelKey)}
  icon={<Feather name={category.icon} size={16} />}
  selected={isSelected}
  onPress={onPress}
  variant="outlined"
  size="large"
/>;
```

**Benefits:**

- Consistent chip styling
- Selected state handling
- Icon integration
- Accessibility built-in

---

### 4. Add Badge Component to Notification Indicators ⭐⭐

**Potential Usage:**

- `app/(tabs)/_layout.tsx` - Tab bar notification counts
- `app/(tabs)/settings.tsx` - Unread notifications badge

**Implementation:**

```tsx
import { Badge } from '@/components/ui/data-display/badge';

// Notification count on tab icon
<Badge content={unreadCount} variant="error" size="small">
  <Feather name="bell" size={24} />
</Badge>

// Status dot
<Badge dot variant="success">
  <Avatar source={{ uri: user.photoURL }} size="medium" />
</Badge>
```

**Benefits:**

- Standardized notification UI
- Multiple variants (count, dot, custom)
- Anchor positioning options

---

## 🚀 Medium Impact Opportunities

### 5. Progress Indicators for Loading States ⭐⭐

**Current Usage:**

- Multiple screens use `ActivityIndicator` directly

**Files to Update:**

- `app/(tabs)/index.tsx` - User profile loading
- `app/profile/edit.tsx` - Image upload progress
- `app/settings/notifications.tsx` - Settings loading

**Replacement:**

```tsx
import { Progress } from '@/components/ui/feedback/progress';

// Linear progress for uploads
<Progress
  value={uploadProgress}
  variant="linear"
  showLabel
  size="medium"
/>

// Circular for general loading
<Progress
  variant="circular"
  indeterminate
  size="large"
/>
```

**Benefits:**

- Determinate progress for uploads
- Consistent loading UI
- Multiple size options

---

### 6. Snackbar for Success/Error Messages ⭐⭐⭐

**Current Usage:**

- Multiple files use `Alert.alert()` for feedback
- Custom success/error handlers in `utils/`

**Files to Update:**

- `app/profile/edit.tsx` - Save success
- `app/feedback.tsx` - Submit feedback
- `app/(tabs)/settings.tsx` - Clear cache, logout

**Replacement:**

```tsx
import { Snackbar } from "@/components/ui/feedback/snackbar";

// Replace Alert.alert with Snackbar
<Snackbar
  visible={snackbarVisible}
  message="Profile updated successfully"
  variant="success"
  action={{ label: "View", onPress: handleView }}
  onDismiss={handleDismiss}
  duration={3000}
/>;
```

**Benefits:**

- Non-blocking feedback
- Action button support
- Auto-dismiss with configurable duration
- Consistent messaging UI

---

### 7. Accordion for Settings Sections ⭐⭐

**Potential Usage:**

- `app/(tabs)/settings.tsx` - Collapsible settings groups
- `app/security/2fa.tsx` - Setup instructions

**Implementation:**

```tsx
import { Accordion } from "@/components/ui/layout/accordion";

<Accordion
  items={[
    {
      id: "1",
      title: "Account Settings",
      content: <AccountSettings />,
      icon: "user"
    },
    {
      id: "2",
      title: "Privacy & Security",
      content: <SecuritySettings />,
      icon: "lock"
    }
  ]}
  allowMultiple={false}
/>;
```

**Benefits:**

- Cleaner UI for grouped content
- Reduced initial screen clutter
- Smooth expand/collapse animations

---

### 8. Search Bar Component ⭐⭐

**Potential Usage:**

- `app/(tabs)/items.tsx` - Search/filter items
- New: Settings search functionality

**Implementation:**

```tsx
import { SearchBar } from "@/components/ui/inputs/search-bar";

<SearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  onSearch={handleSearch}
  placeholder="Search settings..."
  recentSearches={recentSearches}
  suggestions={searchSuggestions}
  debounceMs={300}
/>;
```

**Benefits:**

- Debounced search
- Recent searches history
- Auto-suggestions
- Clear button

---

### 9. Checkbox/Radio Groups for Preferences ⭐⭐

**Potential Usage:**

- `app/settings/notifications.tsx` - Multiple toggle options
- New: Multi-select preferences

**Implementation:**

```tsx
import { CheckboxGroup } from "@/components/ui/inputs/checkbox";

<CheckboxGroup
  items={[
    { id: "1", label: "Push Notifications", checked: settings.push },
    { id: "2", label: "Email Updates", checked: settings.email },
    { id: "3", label: "Marketing Tips", checked: settings.marketing }
  ]}
  onChange={handleSettingsChange}
  accessibilityLabel="Notification preferences"
/>;
```

**Benefits:**

- Group-level state management
- Consistent spacing and styling
- Accessibility for groups

---

## 🎨 Advanced Opportunities

### 10. Divider for Visual Separation ⭐

**Current Usage:**

- Multiple screens use custom borders for separation

**Files to Update:**

- `app/(tabs)/settings.tsx` - Between settings sections
- `app/(tabs)/index.tsx` - Between card sections

**Replacement:**

```tsx
import { Divider } from '@/components/ui/data-display/divider';

// Replace borderBottomWidth styles
<Divider spacing="medium" />

// With label
<Divider label="Account Settings" variant="horizontal" />
```

---

### 11. FAB (Floating Action Button) ⭐⭐

**Potential Usage:**

- `app/(tabs)/items.tsx` - Add new item
- `app/feedback.tsx` - Quick feedback

**Implementation:**

```tsx
import { FAB } from "@/components/ui/layout/fab";

<FAB
  icon={<Feather name="plus" size={24} />}
  label="Add Item"
  onPress={handleAddItem}
  position="bottom-right"
  size="medium"
/>;
```

---

### 12. Tabs Navigation ⭐⭐

**Potential Usage:**

- `app/security/_layout.tsx` - Security options tabs
- `app/profile/edit.tsx` - Profile sections (Basic, Address, etc.)

**Implementation:**

```tsx
import { Tabs } from "@/components/ui/navigation/tabs";

<Tabs
  items={[
    { id: "1", label: "Basic Info", icon: "user" },
    { id: "2", label: "Address", icon: "map-pin" },
    { id: "3", label: "Privacy", icon: "lock" }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  variant="horizontal"
/>;
```

---

### 13. Modal Enhanced ⭐⭐

**Current Usage:**

- `app/modal.tsx` - Basic modal implementation

**Replacement:**

```tsx
import { Modal } from "@/components/ui/overlays/modal-enhanced";

<Modal
  visible={modalVisible}
  onClose={handleClose}
  title="Confirm Action"
  size="medium"
  scrollable
  footer={
    <>
      <ThemedButton title="Cancel" onPress={handleClose} variant="secondary" />
      <ThemedButton title="Confirm" onPress={handleConfirm} />
    </>
  }
>
  <ThemedText>Modal content here</ThemedText>
</Modal>;
```

---

### 14. Empty State Component ⭐⭐⭐

**Potential Usage:**

- `app/(tabs)/items.tsx` - No items yet
- `app/(tabs)/index.tsx` - No profile data

**Implementation:**

```tsx
import { EmptyState } from "@/components/ui/data-display/empty-state";

<EmptyState
  variant="no-data"
  title="No notifications yet"
  description="When you receive notifications, they'll appear here."
  actionLabel="Refresh"
  onAction={handleRefresh}
  illustration="empty-box"
/>;
```

---

### 15. Data Table ⭐

**Potential Usage:**

- `app/security/sessions.tsx` - Active sessions list
- New: Activity logs

**Implementation:**

```tsx
import { DataTable } from "@/components/ui/data-display/data-table";

<DataTable
  columns={[
    { key: "device", label: "Device", sortable: true },
    { key: "location", label: "Location", sortable: true },
    { key: "date", label: "Last Active", sortable: true }
  ]}
  data={sessions}
  onRowPress={handleRowPress}
  selectable
  pagination
  sortable
/>;
```

---

### 16. Slider for Value Selection ⭐

**Potential Usage:**

- `app/settings/text-size.tsx` - Font size adjustment

**Replacement:**

```tsx
import { Slider } from "@/components/ui/inputs/slider";

<Slider
  value={fontSize}
  onValueChange={setFontSize}
  min={12}
  max={24}
  step={1}
  showValue
  showMarks
  accessibilityLabel="Adjust font size"
/>;
```

---

### 17. Tooltip for Helpful Hints ⭐

**Potential Usage:**

- Throughout the app for feature explanations

**Implementation:**

```tsx
import { Tooltip } from "@/components/ui/overlays/tooltip";

<Tooltip content="This setting controls push notifications" position="top">
  <Feather name="info" size={16} color={colors.text} />
</Tooltip>;
```

---

### 18. Alert Banner ⭐⭐

**Potential Usage:**

- `app/(tabs)/index.tsx` - Important announcements
- `app/security/2fa.tsx` - Security warnings

**Implementation:**

```tsx
import { AlertBanner } from "@/components/ui/feedback/alert-banner";

<AlertBanner
  variant="warning"
  title="Two-Factor Authentication"
  message="Enable 2FA to secure your account"
  action={{ label: "Enable Now", onPress: handleEnable2FA }}
  dismissible
  onDismiss={handleDismiss}
/>;
```

---

### 19. Stepper for Multi-Step Flows ⭐⭐

**Potential Usage:**

- `app/onboarding/*` - Onboarding flow
- `app/security/2fa.tsx` - 2FA setup steps

**Implementation:**

```tsx
import { Stepper } from "@/components/ui/navigation/stepper";

<Stepper
  steps={[
    { label: "Personal Info", completed: true },
    { label: "Verify Email", completed: true },
    { label: "Enable 2FA", completed: false },
    { label: "Complete", completed: false }
  ]}
  currentStep={2}
  variant="horizontal"
/>;
```

---

### 20. Menu for Contextual Actions ⭐

**Potential Usage:**

- `app/(tabs)/items.tsx` - Item actions menu
- `app/(tabs)/settings.tsx` - Profile options

**Implementation:**

```tsx
import { Menu } from "@/components/ui/overlays/menu";

<Menu
  trigger={<Feather name="more-vertical" size={24} />}
  items={[
    { id: "1", label: "Edit", icon: "edit", onPress: handleEdit },
    { id: "2", label: "Share", icon: "share", onPress: handleShare },
    {
      id: "3",
      label: "Delete",
      icon: "trash",
      onPress: handleDelete,
      variant: "danger"
    }
  ]}
  position="bottom-right"
/>;
```

---

## 📋 Implementation Priority Matrix

| Priority | Component      | Impact | Effort | Files Affected |
| -------- | -------------- | ------ | ------ | -------------- |
| **P0**   | Switch         | High   | Low    | 1 file         |
| **P0**   | Avatar         | High   | Low    | 2 files        |
| **P0**   | Chip           | High   | Low    | 1 file         |
| **P0**   | Snackbar       | High   | Medium | 5+ files       |
| **P1**   | Badge          | Medium | Low    | 2 files        |
| **P1**   | Progress       | Medium | Low    | 3 files        |
| **P1**   | Empty State    | High   | Medium | 2 files        |
| **P2**   | Search Bar     | Medium | Medium | 1-2 files      |
| **P2**   | Accordion      | Medium | Medium | 1-2 files      |
| **P2**   | Alert Banner   | Medium | Low    | 2 files        |
| **P3**   | Divider        | Low    | Low    | Multiple       |
| **P3**   | Slider         | Low    | Low    | 1 file         |
| **P3**   | Checkbox Group | Medium | Medium | 1 file         |
| **P3**   | FAB            | Low    | Low    | 1-2 files      |
| **P4**   | Tabs           | Medium | High   | 2 files        |
| **P4**   | Stepper        | Low    | Medium | 2 files        |
| **P4**   | Modal Enhanced | Medium | Medium | 1 file         |
| **P4**   | Menu           | Low    | Medium | 2 files        |
| **P4**   | Tooltip        | Low    | Low    | Multiple       |
| **P4**   | Data Table     | Low    | High   | 1 file         |

---

## 📝 Implementation Checklist

### Phase 1: Quick Wins (1-2 days)

- [ ] Replace Switch in notifications.tsx
- [ ] Add Avatar to settings.tsx
- [ ] Add Avatar to profile/edit.tsx
- [ ] Replace category buttons with Chip in feedback.tsx
- [ ] Add Badge to tab navigation

### Phase 2: High Impact (3-5 days)

- [ ] Replace Alert.alert with Snackbar (5+ files)
- [ ] Add Progress indicators for loading states
- [ ] Add Empty State to items.tsx and index.tsx
- [ ] Add Alert Banner for warnings/announcements

### Phase 3: Enhanced UX (1 week)

- [ ] Add Search Bar to items.tsx
- [ ] Implement Accordion in settings
- [ ] Add Checkbox Group to notifications
- [ ] Add Slider to text-size.tsx
- [ ] Add Dividers throughout

### Phase 4: Advanced Features (1-2 weeks)

- [ ] Implement Tabs navigation
- [ ] Add Stepper to onboarding
- [ ] Replace modal.tsx with Modal Enhanced
- [ ] Add Menu for contextual actions
- [ ] Add Tooltips for help text
- [ ] Implement FAB where appropriate

---

## 🎯 Success Metrics

After implementing these components, we should see:

1. **Code Reduction:** ~20-30% less custom styling code
2. **Consistency:** 100% of similar UI patterns use same components
3. **Accessibility:** All interactive elements have proper labels
4. **Type Safety:** Zero TypeScript errors for component props
5. **Performance:** Maintained or improved (60fps animations)
6. **Developer Velocity:** Faster feature development with reusable components

---

## 🔄 Migration Strategy

### Step-by-Step Process

1. **Identify** - Find usage in specific file
2. **Import** - Add design system component import
3. **Replace** - Swap custom implementation
4. **Test** - Verify functionality (light/dark mode, accessibility)
5. **Cleanup** - Remove old custom styles
6. **Document** - Update component if needed

### Example Migration

```tsx
// ❌ OLD CODE (Before)
const CategoryButton = ({ category, isSelected, onPress }) => {
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.categoryButton,
        {
          borderColor: isSelected ? primaryColor : borderColor,
          backgroundColor: isSelected ? `${primaryColor}15` : surfaceColor
        }
      ]}
    >
      <Feather name={category.icon} size={24} />
      <ThemedText>{category.label}</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    flex: 1,
    minWidth: "47%",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    gap: Spacing.xs
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center"
  }
});

// ✅ NEW CODE (After)
import { Chip } from "@/components/ui/data-display/chip";

<Chip
  label={category.label}
  icon={<Feather name={category.icon} size={16} />}
  selected={isSelected}
  onPress={onPress}
  variant="outlined"
  size="large"
/>;

// ✅ Removed ~30 lines of custom code!
```

---

## 💡 Additional Recommendations

### Create Compound Components

For complex UI patterns, create compound components that compose multiple design
system components:

```tsx
// components/settings-section.tsx
export function SettingsSection({ title, items }) {
  return (
    <ThemedView>
      <ThemedText type="h2">{title}</ThemedText>
      <Divider spacing="small" />
      {items.map((item) => (
        <SettingsItem key={item.id} {...item} />
      ))}
    </ThemedView>
  );
}

// Usage in settings.tsx
<SettingsSection title="Notifications" items={notificationSettings} />;
```

### Create Feature-Specific Wrappers

Wrap design system components with app-specific logic:

```tsx
// components/profile-avatar.tsx
export function ProfileAvatar({ user, editable, onEdit }) {
  return (
    <Avatar
      source={{ uri: user.photoURL }}
      initials={user.displayName}
      size="large"
      status={user.isOnline ? "online" : "offline"}
      onPress={editable ? onEdit : undefined}
      accessibilityLabel={`${user.displayName}'s profile picture`}
    />
  );
}
```

---

## 🎉 Expected Outcomes

### Before Integration

- ❌ Inconsistent UI patterns
- ❌ Duplicate styling code
- ❌ Manual accessibility implementation
- ❌ Different loading states across screens
- ❌ Harder to maintain

### After Integration

- ✅ Consistent design language
- ✅ DRY (Don't Repeat Yourself) codebase
- ✅ Accessibility built-in
- ✅ Standardized loading/empty/error states
- ✅ Faster development velocity
- ✅ Better TypeScript support
- ✅ Reduced bundle size (shared components)

---

## 📚 Next Steps

1. **Review** this document with the team
2. **Prioritize** which components to integrate first
3. **Create** integration tasks in project board
4. **Implement** in priority order
5. **Test** thoroughly on both iOS and Android
6. **Document** any component enhancements needed
7. **Monitor** performance and user feedback

---

_Document created: October 5, 2025_  
_Status: Ready for Implementation_  
_Estimated Total Effort: 2-3 weeks_  
_Expected Impact: High_
