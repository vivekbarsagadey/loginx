# Component-Driven Architecture Implementation Guide

## ✅ Completed Work

### Phase 1: Foundation Components (Atoms)

#### 1. **Spacer** - ✅ Completed

- **Location**: `components/atoms/spacer.tsx`
- **Purpose**: Consistent spacing throughout the app
- **Features**:
  - Uses spacing constants from layout
  - Supports both horizontal and vertical spacing
  - Can use preset sizes or custom values
- **Usage**:
  ```tsx
  <Spacer size="lg" />
  <Spacer size={24} horizontal />
  ```

#### 2. **Divider** - ✅ Completed

- **Location**: `components/atoms/divider.tsx`
- **Purpose**: Visual separation of content
- **Features**:
  - Automatically uses theme colors
  - Supports horizontal and vertical orientations
  - Customizable thickness and color
- **Usage**:
  ```tsx
  <Divider />
  <Divider thickness={2} />
  <Divider horizontal={false} style={{ height: 100 }} />
  ```

#### 3. **Badge** - ✅ Completed

- **Location**: `components/atoms/badge.tsx`
- **Purpose**: Status indicators, counts, or labels
- **Features**:
  - Multiple variants (primary, success, warning, error, info, neutral)
  - Three sizes (sm, md, lg)
  - Automatic theme color adaptation
- **Usage**:
  ```tsx
  <Badge label="New" variant="success" />
  <Badge label="3" variant="error" size="sm" />
  ```

#### 4. **Avatar** - ✅ Completed

- **Location**: `components/atoms/avatar.tsx`
- **Purpose**: User profile pictures or initials
- **Features**:
  - Multiple sizes (xs, sm, md, lg, xl, or custom number)
  - Three shapes (circle, rounded, square)
  - Automatic fallback to initials
  - Image loading with default placeholder
- **Usage**:
  ```tsx
  <Avatar uri={user.photoURL} size="lg" />
  <Avatar initials="JD" size="md" shape="rounded" />
  ```

### Phase 2: Combination Components (Molecules)

#### 1. **InfoRow** - ✅ Completed

- **Location**: `components/molecules/info-row.tsx`
- **Purpose**: Label-value pairs with optional icons
- **Features**:
  - Optional icon support
  - Can be made interactive with onPress
  - Custom right element support
  - Automatic chevron for pressable items
- **Usage**:
  ```tsx
  <InfoRow icon="mail" label="Email" value="user@example.com" />
  <InfoRow
    icon="phone"
    label="Phone"
    value="+1 234 567 8900"
    onPress={() => makeCall()}
  />
  ```

#### 2. **SectionHeader** - ✅ Completed

- **Location**: `components/molecules/section-header.tsx`
- **Purpose**: Section titles with optional subtitles and actions
- **Features**:
  - Optional subtitle text
  - Optional action button
  - Optional icon
  - Consistent typography and spacing
- **Usage**:
  ```tsx
  <SectionHeader title="Account Settings" />
  <SectionHeader
    title="Notifications"
    subtitle="Manage your notification preferences"
  />
  <SectionHeader
    title="Recent Activity"
    action={{ label: "View All", onPress: () => navigate('/activity') }}
  />
  ```

#### 3. **PreferenceRow** - ✅ Completed

- **Location**: `components/molecules/preference-row.tsx`
- **Purpose**: Display preference settings in label-value format
- **Features**:
  - Optional icon
  - Can be made pressable for navigation
  - Consistent styling with theme colors
- **Usage**:
  ```tsx
  <PreferenceRow
    icon="bell"
    label="Push Notifications"
    value="Enabled"
  />
  <PreferenceRow
    icon="mail"
    label="Email Updates"
    value="Disabled"
    onPress={() => navigate('/settings/email')}
  />
  ```

#### 4. **SettingItem** - ✅ Completed

- **Location**: `components/molecules/setting-item.tsx`
- **Purpose**: Individual settings list items
- **Features**:
  - Danger variant for destructive actions
  - Loading state support
  - Optional subtitle
  - Custom right element support
  - Disabled state handling
- **Usage**:
  ```tsx
  <SettingItem
    icon="user"
    title="Edit Profile"
    subtitle="Update your information"
    onPress={() => navigate('/profile/edit')}
  />
  <SettingItem
    icon="trash-2"
    title="Delete Account"
    variant="danger"
    onPress={handleDelete}
  />
  ```

### Phase 3: Complex Sections (Organisms)

#### 1. **UserProfileHeader** - ✅ Completed

- **Location**: `components/organisms/user-profile-header.tsx`
- **Purpose**: Profile card with avatar and user information
- **Features**:
  - Avatar with automatic initials fallback
  - Display name and email
  - Optional edit profile action
  - Additional info slot
  - Loading state support
  - Configurable avatar size and card elevation
- **Usage**:
  ```tsx
  <UserProfileHeader
    avatarUrl={user.photoURL}
    displayName={user.displayName}
    email={user.email}
    onEditPress={() => navigate("/profile/edit")}
  />
  ```

#### 2. **UserWelcomeSection** - ✅ Completed

- **Location**: `components/organisms/user-welcome-section.tsx`
- **Purpose**: Personalized welcome message
- **Features**:
  - Displays user's name, email, and optional age
  - Uses i18n for localized welcome message
  - Consistent styling with theme
- **Usage**:
  ```tsx
  <UserWelcomeSection
    displayName="John Doe"
    email="john@example.com"
    age={25}
  />
  ```

#### 3. **NotificationPreferencesCard** - ✅ Completed

- **Location**: `components/organisms/notification-preferences-card.tsx`
- **Purpose**: Display notification preferences
- **Features**:
  - Shows push notifications, email updates, and marketing tips status
  - Optional section header
  - Can be made pressable for navigation
  - Uses PreferenceRow molecules internally
  - Configurable card elevation
- **Usage**:
  ```tsx
  <NotificationPreferencesCard
    pushEnabled={true}
    emailUpdates={false}
    marketingTips={true}
    onPress={() => navigate("/settings/notifications")}
  />
  ```

#### 4. **SettingsSection** - ✅ Completed

- **Location**: `components/organisms/settings-section.tsx`
- **Purpose**: Group of related settings items
- **Features**:
  - Optional section title and subtitle
  - Handles both navigation links and action items
  - Proper dividers between items
  - Supports danger variants
  - Custom right elements
- **Usage**:
  ```tsx
  <SettingsSection
    title="Account Settings"
    items={[
      {
        icon: "user",
        title: "Edit Profile",
        type: "link",
        href: "/profile/edit"
      },
      {
        icon: "mail",
        title: "Update Email",
        type: "link",
        href: "/profile/update-email"
      }
    ]}
    onItemPress={(item) => handleItemPress(item)}
  />
  ```

### Phase 4: Screen Refactoring

#### 1. **Home Screen (index.tsx)** - ✅ Completed

- **Before**: 134 lines with inline JSX and scattered styles
- **After**: 103 lines with clean component composition
- **Improvements**:
  - Removed 31 lines of code (23% reduction)
  - Replaced inline preference rendering with `NotificationPreferencesCard`
  - Replaced inline welcome section with `UserWelcomeSection`
  - Eliminated all StyleSheet definitions
  - Much cleaner and more maintainable code
- **Components Used**:
  - `UserWelcomeSection`
  - `NotificationPreferencesCard`

#### 2. **Settings Screen (settings.tsx)** - ✅ Completed

- **Before**: 210 lines with complex inline rendering and styles
- **After**: 113 lines with clean component composition
- **Improvements**:
  - Removed 97 lines of code (46% reduction)
  - Replaced custom profile card with `UserProfileHeader`
  - Replaced inline settings sections with `SettingsSection`
  - Eliminated all StyleSheet definitions and theme color hooks
  - Significantly improved maintainability
- **Components Used**:
  - `UserProfileHeader`
  - `SettingsSection`

## 📊 Impact Summary

### Code Reduction

- **Home Screen**: 23% reduction (31 lines removed)
- **Settings Screen**: 46% reduction (97 lines removed)
- **Total**: 128 lines of code eliminated across 2 screens

### Maintainability Improvements

1. **Consistency**: UI patterns are now centralized in components
2. **Reusability**: Components can be used across multiple screens
3. **Testability**: Components can be tested in isolation
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Accessibility**: Built-in a11y support in all components
6. **Theme Support**: Automatic light/dark mode adaptation

### Developer Experience

1. **Easier Debugging**: Clear component boundaries
2. **Faster Development**: Reusable components speed up new feature development
3. **Better Organization**: Clear component hierarchy
4. **Documentation**: Each component is well-documented with JSDoc

## 📁 Component Organization

```
components/
├── atoms/                    # Basic UI elements (✅ Completed)
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── divider.tsx
│   ├── spacer.tsx
│   └── index.ts
├── molecules/                # Simple combinations (✅ Completed)
│   ├── info-row.tsx
│   ├── preference-row.tsx
│   ├── section-header.tsx
│   ├── setting-item.tsx
│   └── index.ts
├── organisms/                # Complex sections (✅ Completed)
│   ├── notification-preferences-card.tsx
│   ├── settings-section.tsx
│   ├── user-profile-header.tsx
│   ├── user-welcome-section.tsx
│   └── index.ts
└── [existing folders]        # Keep existing organization
    ├── ui/
    ├── auth/
    ├── brand/
    ├── navigation/
    ├── onboarding/
    ├── profile/
    └── security/
```

## 🚀 Next Steps

### Immediate Opportunities

#### 1. **Feedback Screen** - High Priority

Current state: All form logic in one component Potential components:

- `CategorySelector` - Grid of selectable category buttons
- `FeedbackFormSection` - Complete form with inputs
- Could reduce code by ~30%

#### 2. **Profile Screens** - Medium Priority

Current state: Good separation but can be improved Potential improvements:

- Create `FormSection` molecule for consistent form grouping
- Extract common patterns from ProfileBasicFields and ProfileAddressFields

#### 3. **Notification Settings** - Medium Priority

Can use `SettingsSection` with switch components

#### 4. **About/Help Screens** - Low Priority

Can use `InfoRow` and `SectionHeader` for consistent layouts

### Additional Components to Consider

#### Atoms

- **Icon** - Unified icon wrapper for consistent sizing and colors
- **LoadingSpinner** - Consistent loading indicators

#### Molecules

- **FormField** - Label + input + error message wrapper
- **ListItem** - Generic list item for various list views
- **ActionButton** - Consistent button with icon + text

#### Organisms

- **FormSection** - Form grouping with header and fields
- **EmptyState** - Consistent empty state displays
- **ErrorState** - Consistent error displays

## 📝 Implementation Guidelines

### When to Create a Component

**DO create a component when:**

- The pattern is used 2+ times across the app
- The logic is complex and needs isolation
- The UI section has clear boundaries
- You want consistent behavior across the app

**DON'T create a component when:**

- It's used only once and unlikely to be reused
- It's simpler to inline (e.g., a single View wrapper)
- The abstraction adds more complexity than value

### Component Design Principles

1. **Single Responsibility**: Each component does one thing well
2. **Composability**: Components combine to create complex UIs
3. **Prop-driven**: Behavior controlled via props, not internal state
4. **Type Safety**: Full TypeScript with explicit interfaces
5. **Accessibility**: Built-in a11y support
6. **Documentation**: Clear JSDoc with examples

### Testing Strategy

1. **Unit Tests**: Test component logic in isolation
2. **Snapshot Tests**: Ensure UI doesn't change unexpectedly
3. **Integration Tests**: Test component interactions
4. **Accessibility Tests**: Verify screen reader support

### Performance Optimization

1. **Memoization**: Use `React.memo` for expensive pure components
2. **useCallback**: Memoize handler props passed to children
3. **useMemo**: Memoize expensive computations
4. **Avoid Inline**: Don't create inline functions/objects in render

## 🎯 Migration Checklist

For each screen to migrate:

- [ ] Identify repeated patterns and sections
- [ ] Check if existing components can be used
- [ ] Create new components if needed (atoms → molecules → organisms)
- [ ] Refactor screen to use components
- [ ] Remove inline styles and replace with component props
- [ ] Test thoroughly (functionality, accessibility, themes)
- [ ] Update documentation
- [ ] Create PR with before/after comparison

## 📚 Resources

### Component Examples

See refactored screens for real-world examples:

- `app/(tabs)/index.tsx` - Home screen with organisms
- `app/(tabs)/settings.tsx` - Settings screen with organisms
- `app/profile/edit.tsx` - Profile editing with existing component pattern

### Documentation

- Main architecture doc: `docs/COMPONENT_DRIVEN_ARCHITECTURE.md`
- Design system: `docs/DESIGN_SYSTEM.md`
- Project guidelines: `.github/instructions/rule.instructions.md`

### Tools

- Storybook (future): For component development and testing
- Examples folder: For showcasing components
- TypeScript: For type safety and better DX

## 🔄 Continuous Improvement

### Regular Reviews

- Review component usage patterns monthly
- Identify opportunities for new shared components
- Refactor components that are too complex
- Update documentation as patterns evolve

### Metrics to Track

- Code reduction percentage
- Component reuse count
- Developer satisfaction
- Bug reduction in UI code
- Time to implement new features

---

**Status**: Phase 1-4 Complete ✅  
**Next Phase**: Expand to remaining screens  
**Last Updated**: October 11, 2025
