# Component-Driven Architecture - Quick Reference

## 📦 Available Components

### Atoms (Basic Building Blocks)

| Component   | Purpose              | Key Props                          |
| ----------- | -------------------- | ---------------------------------- |
| **Spacer**  | Consistent spacing   | `size`, `horizontal`               |
| **Divider** | Visual separation    | `thickness`, `horizontal`, `color` |
| **Badge**   | Status indicators    | `label`, `variant`, `size`         |
| **Avatar**  | User images/initials | `uri`, `initials`, `size`, `shape` |

### Molecules (Simple Combinations)

| Component         | Purpose            | Key Props                              |
| ----------------- | ------------------ | -------------------------------------- |
| **InfoRow**       | Label-value pairs  | `icon`, `label`, `value`, `onPress`    |
| **SectionHeader** | Section titles     | `title`, `subtitle`, `action`          |
| **PreferenceRow** | Preference display | `icon`, `label`, `value`, `onPress`    |
| **SettingItem**   | Settings list item | `icon`, `title`, `subtitle`, `variant` |

### Organisms (Complex Sections)

| Component                       | Purpose               | Key Props                                          |
| ------------------------------- | --------------------- | -------------------------------------------------- |
| **UserProfileHeader**           | Profile card          | `avatarUrl`, `displayName`, `email`, `onEditPress` |
| **UserWelcomeSection**          | Welcome message       | `displayName`, `email`, `age`                      |
| **NotificationPreferencesCard** | Notification settings | `pushEnabled`, `emailUpdates`, `marketingTips`     |
| **SettingsSection**             | Settings group        | `title`, `items`, `onItemPress`                    |

## 🎨 Common Usage Patterns

### User Profile Display

```tsx
<UserProfileHeader
  avatarUrl={user.photoURL}
  displayName={user.displayName}
  email={user.email}
  onEditPress={() => navigate("/profile/edit")}
/>
```

### Welcome Section

```tsx
<UserWelcomeSection
  displayName={user.displayName}
  email={user.email}
  age={user.age}
/>
```

### Settings List

```tsx
<SettingsSection
  title="Account"
  items={[
    {
      icon: "user",
      title: "Edit Profile",
      type: "link",
      href: "/profile/edit"
    },
    { icon: "lock", title: "Change Password", type: "link", href: "/security" }
  ]}
  onItemPress={handlePress}
/>
```

### Preferences Display

```tsx
<NotificationPreferencesCard
  pushEnabled={profile.pushEnabled}
  emailUpdates={profile.emailUpdates}
  marketingTips={profile.marketingTips}
  onPress={() => navigate("/settings/notifications")}
/>
```

### Info Display

```tsx
<InfoRow
  icon="mail"
  label="Email"
  value={user.email}
  onPress={() => navigate("/update-email")}
/>
```

## 📁 Import Patterns

### Individual Imports

```tsx
import { Avatar } from "@/components/atoms/avatar";
import { InfoRow } from "@/components/molecules/info-row";
import { UserProfileHeader } from "@/components/organisms/user-profile-header";
```

### Bulk Imports

```tsx
import { Avatar, Badge, Spacer, Divider } from "@/components/atoms";
import { InfoRow, PreferenceRow, SectionHeader } from "@/components/molecules";
import { UserProfileHeader, SettingsSection } from "@/components/organisms";
```

## ✅ Best Practices

### 1. Use Components Over Inline JSX

❌ **Don't:**

```tsx
<View style={styles.row}>
  <Text>{label}</Text>
  <Text>{value}</Text>
</View>
```

✅ **Do:**

```tsx
<PreferenceRow label={label} value={value} />
```

### 2. Compose Components

❌ **Don't:**

```tsx
<Card>
  <View>
    <Text>Title</Text>
  </View>
  <View>
    <Text>Content</Text>
  </View>
</Card>
```

✅ **Do:**

```tsx
<SectionHeader title="Title" />
<PreferenceRow label="Label" value="Value" />
```

### 3. Use Theme Colors

❌ **Don't:**

```tsx
<Text style={{ color: "#333" }}>Text</Text>
```

✅ **Do:**

```tsx
<ThemedText>Text</ThemedText>
// Or use components that handle theming
<Badge variant="primary" label="New" />
```

### 4. Provide Accessibility

❌ **Don't:**

```tsx
<TouchableOpacity onPress={handlePress}>
  <Text>Press Me</Text>
</TouchableOpacity>
```

✅ **Do:**

```tsx
<SettingItem
  icon="settings"
  title="Press Me"
  onPress={handlePress}
  // accessibilityLabel and accessibilityHint built-in
/>
```

## 🚀 Migration Checklist

When refactoring a screen:

- [ ] Identify repeated patterns
- [ ] Replace inline sections with organism components
- [ ] Replace repeated rows with molecule components
- [ ] Remove StyleSheet definitions that are now in components
- [ ] Remove theme color hooks that components handle internally
- [ ] Test all interactions (press, navigation, etc.)
- [ ] Verify accessibility
- [ ] Test both light and dark modes
- [ ] Compare before/after line count

## 📊 Benefits Demonstrated

### Home Screen

- **Before**: 134 lines
- **After**: 103 lines
- **Reduction**: 23% (31 lines)

### Settings Screen

- **Before**: 210 lines
- **After**: 113 lines
- **Reduction**: 46% (97 lines)

### Total Impact

- **128 lines removed** across 2 screens
- **Improved maintainability**: Changes happen in one place
- **Better consistency**: Same component = same behavior
- **Easier testing**: Test components in isolation

## 🔄 Continuous Improvement

### When to Add New Components

1. Pattern used 2+ times
2. Complex logic needs isolation
3. Want consistency across app
4. Clear UI boundaries exist

### Component Evolution

1. Start with atoms
2. Combine into molecules
3. Group into organisms
4. Refactor screens
5. Identify new patterns
6. Repeat

---

**Quick Links:**

- Full Architecture: `docs/COMPONENT_DRIVEN_ARCHITECTURE.md`
- Implementation Guide: `docs/COMPONENT_IMPLEMENTATION_GUIDE.md`
- Design System: `docs/DESIGN_SYSTEM.md`

**Last Updated**: October 11, 2025
