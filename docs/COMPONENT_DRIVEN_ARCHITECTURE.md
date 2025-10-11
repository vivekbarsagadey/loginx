# Component-Driven Architecture Implementation

## Overview

This document outlines the comprehensive component-driven architecture for the
LoginX project, breaking down screens into reusable, composable components
following atomic design principles.

## Architecture Principles

### 1. Component Hierarchy (Atomic Design)

```
Atoms (Basic building blocks)
  ├── ThemedText, ThemedButton, ThemedInput
  └── Icon, Spacer, Divider

Molecules (Simple combinations)
  ├── InfoRow (icon + label + value)
  ├── SectionHeader (title + optional subtitle)
  └── PreferenceRow (label + value display)

Organisms (Complex UI sections)
  ├── UserProfileHeader (avatar + name + email + actions)
  ├── NotificationPreferencesCard
  └── SettingsSection (header + list of items)

Templates (Page layouts)
  ├── ScreenWithHeader
  └── FormScreen

Pages (Final screens)
  ├── HomeScreen
  └── SettingsScreen
```

### 2. Component Organization

```
components/
  atoms/               # Basic UI elements
    spacer.tsx
    divider.tsx
    badge.tsx
  molecules/           # Simple combinations
    info-row.tsx
    section-header.tsx
    preference-row.tsx
    setting-item.tsx
    list-item.tsx
  organisms/           # Complex sections
    user-profile-header.tsx
    notification-preferences-card.tsx
    settings-section.tsx
    user-welcome-section.tsx
    feedback-form-section.tsx
  templates/           # Page layouts
    screen-with-header.tsx
    form-screen.tsx
  [existing folders]   # Keep existing organization
```

### 3. Component Design Principles

1. **Single Responsibility**: Each component does one thing well
2. **Composability**: Components can be combined to create complex UIs
3. **Reusability**: Components are generic and configurable via props
4. **Prop-driven**: Behavior controlled via props, not internal state
5. **Type Safety**: Full TypeScript support with explicit interfaces
6. **Accessibility**: Built-in a11y support
7. **Testability**: Easy to unit test in isolation

## Component Breakdown by Screen

### Home Screen (index.tsx)

**Current Issues:**

- Loading state mixed with render logic
- Inline preference rendering
- Styles scattered throughout

**Refactored Components:**

```
HomeScreen
  ├── TabHeader (existing)
  ├── ScreenContainer (existing)
  ├── UserWelcomeSection
  │   ├── ThemedText (title)
  │   ├── ThemedText (email)
  │   └── ThemedText (age)
  └── NotificationPreferencesCard
      ├── SectionHeader
      └── PreferenceRow (x3)
          ├── Icon
          ├── Label
          └── Value
```

### Settings Screen

**Current Issues:**

- Profile card mixed with settings logic
- Repeated row rendering
- Complex dialog management

**Refactored Components:**

```
SettingsScreen
  ├── TabHeader (existing)
  ├── ScreenContainer (existing)
  ├── UserProfileHeader
  │   ├── Avatar
  │   ├── UserInfo
  │   │   ├── DisplayName
  │   │   ├── Email
  │   │   └── EditProfileLink
  └── SettingsSection (multiple)
      ├── SectionHeader
      └── SettingsList
          └── SettingItem (multiple)
              ├── Icon
              ├── Content
              │   ├── Title
              │   └── Subtitle (optional)
              └── Chevron
```

### Feedback Screen

**Current Issues:**

- All form logic in one component
- Category selection, inputs, and submission mixed together

**Refactored Components:**

```
FeedbackScreen
  ├── ScreenContainer (existing)
  ├── CategorySelector
  │   └── SelectableButton (multiple)
  ├── FeedbackFormSection
  │   ├── SubjectInput
  │   │   ├── ThemedTextInput
  │   │   └── CharacterCounter
  │   ├── MessageInput
  │   │   ├── ThemedTextInput
  │   │   └── CharacterCounter
  │   └── RatingSection
  │       └── StarRating
  ├── InfoBox (existing)
  └── SubmitButton
```

### Edit Profile Screen

**Current Issues:**

- Good component separation already (ProfilePhotoSection, ProfileBasicFields,
  ProfileAddressFields)
- Can improve with form sections

**Enhancement:**

```
EditProfileScreen
  ├── ThemedScrollView (existing)
  ├── ProfilePhotoSection (existing) ✓
  ├── FormSection
  │   ├── SectionHeader
  │   ├── ProfileBasicFields (existing) ✓
  │   ├── EmailField (read-only)
  │   └── ProfileAddressFields (existing) ✓
  └── ActionButton
```

## Implementation Plan

### Phase 1: Atoms (Week 1)

Create foundational components:

1. **Spacer** - Flexible spacing component
2. **Divider** - Horizontal/vertical divider
3. **Badge** - Status badges
4. **Avatar** - User avatar component
5. **Icon** - Unified icon wrapper

### Phase 2: Molecules (Week 1-2)

Build simple combinations:

1. **InfoRow** - Label + value display
2. **SectionHeader** - Section title + optional subtitle/action
3. **PreferenceRow** - Setting display with label/value
4. **SettingItem** - Settings list item
5. **ListItem** - Generic list item
6. **FormField** - Label + input + error message wrapper

### Phase 3: Organisms (Week 2-3)

Complex UI sections:

1. **UserProfileHeader** - Profile card with avatar and info
2. **UserWelcomeSection** - Welcome message with user details
3. **NotificationPreferencesCard** - Notification settings display
4. **SettingsSection** - Settings group with header and items
5. **CategorySelector** - Category selection grid
6. **FeedbackFormSection** - Complete feedback form
7. **ProfileFormSection** - Profile editing form

### Phase 4: Templates (Week 3)

Page layouts:

1. **ScreenWithHeader** - Standard screen with header
2. **FormScreen** - Form layout with sections
3. **ListScreen** - List-based screen layout

### Phase 5: Screen Refactoring (Week 4)

Refactor existing screens to use new components:

1. Home Screen
2. Settings Screen
3. Feedback Screen
4. Notification Settings
5. Profile Screens
6. About/Help Screens

## Component Specifications

### Atoms

#### Spacer

```typescript
interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | number;
  horizontal?: boolean;
}
```

#### Divider

```typescript
interface DividerProps {
  thickness?: number;
  horizontal?: boolean;
  color?: string;
  style?: ViewStyle;
}
```

#### Badge

```typescript
interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
}
```

### Molecules

#### InfoRow

```typescript
interface InfoRowProps {
  icon?: string;
  label: string;
  value: string;
  iconColor?: string;
  onPress?: () => void;
  rightElement?: ReactNode;
}
```

#### SectionHeader

```typescript
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  icon?: string;
  style?: ViewStyle;
}
```

#### PreferenceRow

```typescript
interface PreferenceRowProps {
  label: string;
  value: string;
  icon?: string;
  iconColor?: string;
  onPress?: () => void;
}
```

#### SettingItem

```typescript
interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  variant?: "default" | "danger";
  showChevron?: boolean;
  rightElement?: ReactNode;
  testID?: string;
}
```

#### ListItem

```typescript
interface ListItemProps {
  title: string;
  subtitle?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}
```

### Organisms

#### UserProfileHeader

```typescript
interface UserProfileHeaderProps {
  avatarUrl?: string;
  displayName: string;
  email: string;
  onEditPress?: () => void;
  additionalInfo?: ReactNode;
  loading?: boolean;
}
```

#### UserWelcomeSection

```typescript
interface UserWelcomeSectionProps {
  displayName: string;
  email: string;
  age?: number;
  loading?: boolean;
}
```

#### NotificationPreferencesCard

```typescript
interface NotificationPreferencesCardProps {
  pushEnabled: boolean;
  emailUpdates: boolean;
  marketingTips: boolean;
  onPress?: () => void;
}
```

#### SettingsSection

```typescript
interface SettingsSectionProps {
  title?: string;
  items: SettingItem[];
  onItemPress: (item: SettingItem) => void;
}
```

#### CategorySelector

```typescript
interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  disabled?: boolean;
}
```

## Benefits

### 1. **Maintainability**

- Changes to UI patterns happen in one place
- Clear component boundaries
- Easier to find and fix bugs

### 2. **Reusability**

- Components can be used across multiple screens
- Consistent UI patterns
- Less code duplication

### 3. **Testability**

- Components can be tested in isolation
- Clear props interface
- Easier to mock dependencies

### 4. **Developer Experience**

- Easier to onboard new developers
- Clear component hierarchy
- Better code organization

### 5. **Performance**

- Easier to optimize specific components
- Better memoization opportunities
- Clearer render cycles

### 6. **Consistency**

- Uniform UI patterns
- Design system enforcement
- Predictable behavior

## Migration Strategy

### Step 1: Create Component Library

- Build atoms, molecules, organisms
- Test each component thoroughly
- Document props and usage

### Step 2: Create Storybook/Examples

- Add to examples folder
- Document common patterns
- Provide usage examples

### Step 3: Gradual Screen Migration

- Start with high-traffic screens
- Migrate one screen at a time
- Test thoroughly after each migration

### Step 4: Deprecate Old Patterns

- Mark old inline code for refactoring
- Update documentation
- Remove duplicate code

## Best Practices

### 1. Component Naming

- Use descriptive names: `UserProfileHeader` not `Header`
- Prefix with domain when needed: `SettingItem`, `ProfileField`
- Suffix with type: `Section`, `Card`, `Row`, `Button`

### 2. Props Design

- Use explicit interfaces
- Provide sensible defaults
- Document complex props with JSDoc
- Use discriminated unions for variants

### 3. Composition Over Configuration

- Prefer `children` and `renderXxx` props over complex configuration
- Allow custom rendering for flexibility
- Provide default implementations

### 4. Performance

- Memoize expensive components with `React.memo`
- Use `useCallback` for handler props
- Avoid inline functions in render
- Use `useMemo` for complex computations

### 5. Accessibility

- Add proper accessibility labels
- Support keyboard navigation
- Ensure proper focus management
- Test with screen readers

### 6. Styling

- Use theme colors exclusively
- Support both light and dark modes
- Follow spacing constants
- Allow style overrides via props

## Examples

### Before: Inline Implementation

```typescript
// Old approach - everything inline
<View style={styles.preferenceRow}>
  <ThemedText type="body">{i18n.t('screens.home.pushNotifications')}</ThemedText>
  <ThemedText type="body" style={styles.preferenceValue}>
    {userProfile.pushEnabled ? i18n.t('screens.home.enabled') : i18n.t('screens.home.disabled')}
  </ThemedText>
</View>
```

### After: Component-Driven

```typescript
// New approach - reusable component
<PreferenceRow
  label={i18n.t('screens.home.pushNotifications')}
  value={userProfile.pushEnabled ? i18n.t('screens.home.enabled') : i18n.t('screens.home.disabled')}
  icon="bell"
/>
```

### Benefits Demonstrated:

1. ✅ Less code to maintain
2. ✅ Consistent styling across app
3. ✅ Easy to add features (icons, press handlers)
4. ✅ Better accessibility built-in
5. ✅ Easier to test
6. ✅ Clear intent

## Next Steps

1. Review and approve this architecture
2. Create GitHub issues for each phase
3. Start with Phase 1 (Atoms)
4. Iterate and improve based on feedback

---

**Last Updated:** October 11, 2025
