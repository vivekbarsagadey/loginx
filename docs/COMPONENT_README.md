# Component Library - README

Welcome to the LoginX Component Library! This is your comprehensive guide to
using the component-driven architecture implemented in this project.

## 🚀 Quick Start

### Installation

Components are already available in your project. No installation needed!

### Basic Usage

```tsx
import { Avatar, Badge } from "@/components/atoms";
import { InfoRow, SectionHeader } from "@/components/molecules";
import { UserProfileHeader } from "@/components/organisms";

function MyScreen() {
  return (
    <>
      <UserProfileHeader
        avatarUrl={user.photoURL}
        displayName={user.displayName}
        email={user.email}
        onEditPress={() => navigate("/profile/edit")}
      />
      <SectionHeader title="My Settings" />
      <InfoRow icon="mail" label="Email" value={user.email} />
    </>
  );
}
```

## 📦 Component Categories

### Atoms (Basic Building Blocks)

Small, indivisible components that form the foundation:

- `Spacer` - Consistent spacing
- `Divider` - Visual separation
- `Badge` - Status indicators
- `Avatar` - User images/initials

### Molecules (Simple Combinations)

Components composed of atoms:

- `InfoRow` - Label-value pairs
- `SectionHeader` - Section titles
- `PreferenceRow` - Preference display
- `SettingItem` - Settings list items

### Organisms (Complex Sections)

Large components composed of molecules and atoms:

- `UserProfileHeader` - Complete profile card
- `UserWelcomeSection` - Welcome message
- `NotificationPreferencesCard` - Notification settings
- `SettingsSection` - Settings group

## 📖 Documentation

### For Daily Use

- **[Quick Reference](./COMPONENT_QUICK_REFERENCE.md)** - Common patterns and
  imports
- **[Component Props](#)** - See TypeScript interfaces in component files

### For Understanding

- **[Architecture Overview](./COMPONENT_DRIVEN_ARCHITECTURE.md)** - Complete
  architecture
- **[Implementation Guide](./COMPONENT_IMPLEMENTATION_GUIDE.md)** - Detailed
  guide
- **[Summary](./COMPONENT_ARCHITECTURE_SUMMARY.md)** - Implementation summary

## 🎨 Component Examples

### User Profile

```tsx
<UserProfileHeader
  avatarUrl="https://example.com/avatar.jpg"
  displayName="John Doe"
  email="john@example.com"
  onEditPress={() => navigate("/profile/edit")}
  avatarSize="lg"
  elevation={1}
/>
```

### Welcome Message

```tsx
<UserWelcomeSection displayName="John Doe" email="john@example.com" age={25} />
```

### Settings List

```tsx
<SettingsSection
  title="Account Settings"
  items={[
    {
      icon: "user",
      title: "Edit Profile",
      subtitle: "Update your information",
      type: "link",
      href: "/profile/edit"
    },
    {
      icon: "lock",
      title: "Change Password",
      type: "link",
      href: "/security"
    }
  ]}
  onItemPress={handleItemPress}
/>
```

### Notification Preferences

```tsx
<NotificationPreferencesCard
  pushEnabled={true}
  emailUpdates={false}
  marketingTips={true}
  onPress={() => navigate("/settings/notifications")}
  elevation={1}
/>
```

### Info Display

```tsx
<InfoRow
  icon="mail"
  label="Email Address"
  value="john@example.com"
  onPress={() => navigate("/update-email")}
/>
```

### Section with Items

```tsx
<SectionHeader
  title="Recent Activity"
  action={{ label: "View All", onPress: handleViewAll }}
/>
<InfoRow icon="clock" label="Last Login" value="2 hours ago" />
<InfoRow icon="map-pin" label="Location" value="San Francisco, CA" />
```

## ✅ Best Practices

### 1. Always Use Components

❌ **Avoid inline JSX for patterns that have components:**

```tsx
<View style={styles.row}>
  <Text>{label}</Text>
  <Text>{value}</Text>
</View>
```

✅ **Use the appropriate component:**

```tsx
<PreferenceRow label={label} value={value} />
```

### 2. Compose, Don't Configure

❌ **Don't pass too many configuration props:**

```tsx
<ComplexComponent
  showHeader={true}
  headerTitle="Title"
  headerIcon="icon"
  showFooter={true}
  footerText="Footer"
  // ... 20 more props
/>
```

✅ **Compose smaller components:**

```tsx
<SectionHeader title="Title" icon="icon" />
<ComponentBody />
<ComponentFooter text="Footer" />
```

### 3. Respect Component Boundaries

Each component should:

- Have a single responsibility
- Be fully self-contained
- Use theme colors (no hardcoded colors)
- Support accessibility
- Work in both light and dark modes

### 4. TypeScript First

Always define interfaces for props:

```tsx
interface MyComponentProps {
  /** Description of the prop */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Handler for press events */
  onPress?: () => void;
}
```

## 🔧 Creating New Components

### 1. Determine the Category

- **Atom**: Basic, indivisible component
- **Molecule**: Combination of 2-3 atoms
- **Organism**: Complex section with multiple molecules

### 2. Follow the Template

```tsx
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View, type ViewStyle } from "react-native";

interface MyComponentProps {
  /**
   * Description of prop
   */
  title: string;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
}

/**
 * Component description and purpose.
 *
 * @example
 * <MyComponent title="Hello" />
 */
export function MyComponent({ title, style }: MyComponentProps) {
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.container, style]}>
      <ThemedText style={{ color: textColor }}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  }
});
```

### 3. Add to Index File

```tsx
// components/[category]/index.ts
export { MyComponent } from "./my-component";
```

### 4. Document Usage

Add examples to `COMPONENT_QUICK_REFERENCE.md`

## 📊 Project Impact

### Code Reduction

- Home Screen: **23% reduction** (31 lines)
- Settings Screen: **46% reduction** (97 lines)
- Total: **128 lines removed**

### Benefits

- ✅ More maintainable code
- ✅ Consistent UI patterns
- ✅ Faster development
- ✅ Better accessibility
- ✅ Easier testing

## 🤝 Contributing

When adding new components:

1. Check if a similar component exists
2. Determine the correct category (atom/molecule/organism)
3. Follow existing patterns and conventions
4. Add TypeScript interfaces
5. Include JSDoc documentation
6. Add usage examples
7. Test in both light and dark modes
8. Verify accessibility

## 🐛 Troubleshooting

### Component Not Found

```tsx
// ❌ Wrong
import { Avatar } from "@/components/avatar";

// ✅ Correct
import { Avatar } from "@/components/atoms/avatar";
// or
import { Avatar } from "@/components/atoms";
```

### Type Errors

Make sure to import types if needed:

```tsx
import {
  SettingsSection,
  type SettingsItemConfig
} from "@/components/organisms";
```

### Theme Colors Not Working

Always use `useThemeColor` hook or `ThemedText/ThemedView` components:

```tsx
// ❌ Wrong
<Text style={{ color: '#333' }}>Text</Text>

// ✅ Correct
<ThemedText>Text</ThemedText>
```

## 📞 Support

- Check **[Quick Reference](./COMPONENT_QUICK_REFERENCE.md)** for common
  patterns
- See **[Implementation Guide](./COMPONENT_IMPLEMENTATION_GUIDE.md)** for
  detailed info
- Review refactored screens for real examples:
  - `app/(tabs)/index.tsx` - Home screen
  - `app/(tabs)/settings.tsx` - Settings screen

## 📝 Changelog

### v1.0.0 - October 11, 2025

- ✅ Initial release
- ✅ 4 atoms created
- ✅ 4 molecules created
- ✅ 4 organisms created
- ✅ 2 screens refactored
- ✅ Complete documentation

---

**Happy Coding! 🚀**

For questions or suggestions, please refer to the documentation or reach out to
the team.
