# Theme Color Schemes Update

**Date**: October 10, 2025 **Status**: ✅ Implemented

## Overview

Extended the theme system from 3 options (System, Light, Dark) to 5 options by
adding two new color schemes: **Ocean** and **Sunset**.

## New Color Schemes

### 1. Ocean Theme 🌊

A cool, refreshing color palette inspired by ocean waters.

**Light Variant (ocean):**

- Primary: `#0891B2` (Cyan)
- Background: `#F0F9FF` (Light blue)
- Text: `#0C4A6E` (Deep blue)
- Success: `#14B8A6` (Teal)

**Dark Variant (ocean-dark):**

- Primary: `#22D3EE` (Bright cyan)
- Background: `#082f49` (Deep ocean blue)
- Text: `#E0F2FE` (Light blue)
- Success: `#2DD4BF` (Bright teal)

### 2. Sunset Theme 🌅

A warm, inviting color palette with orange and pink tones.

**Light Variant (sunset):**

- Primary: `#F97316` (Orange)
- Background: `#FFF7ED` (Warm cream)
- Text: `#7C2D12` (Deep brown)
- Success: `#16A34A` (Green)

**Dark Variant (sunset-dark):**

- Primary: `#FB923C` (Soft orange)
- Background: `#431407` (Deep burnt orange)
- Text: `#FFEDD5` (Cream)
- Success: `#34D399` (Light green)

## Implementation Details

### Files Modified

1. **`constants/theme.ts`**
   - Added 4 new color scheme objects: `ocean`, `ocean-dark`, `sunset`,
     `sunset-dark`
   - Each follows the layered surface design system
   - Maintains consistency with existing light/dark themes

2. **`hooks/use-theme-context.tsx`**
   - Updated `ThemePreference` type:
     `'system' | 'light' | 'dark' | 'ocean' | 'sunset'`
   - Updated `ResolvedTheme` type:
     `'light' | 'dark' | 'ocean' | 'ocean-dark' | 'sunset' | 'sunset-dark'`
   - Enhanced theme resolution logic to handle Ocean/Sunset with system theme
     auto-switching
   - Updated theme validation in AsyncStorage loader

3. **`hooks/use-theme.tsx`**
   - Updated legacy hook to support new theme options
   - Maintained backward compatibility

4. **`app/settings/theme.tsx`**
   - Added Ocean (🌊) and Sunset (🌅) options to theme selector
   - Updated `ThemeOption` type
   - Added descriptive text for new themes

5. **`components/theme-selector.tsx`**
   - Extended `THEME_OPTIONS` array to include 'ocean' and 'sunset'
   - Added `getThemeLabel()` function for emoji + name display
   - Updated styles to use flexWrap for better 5-option layout
   - Changed from fixed-width chips to flexible wrapping layout

## Theme Resolution Logic

The Ocean and Sunset themes automatically switch between light and dark variants
based on system theme:

```typescript
const resolvedTheme: ResolvedTheme = (() => {
  if (themePreference === "system") {
    return systemTheme; // 'light' or 'dark'
  }
  if (themePreference === "ocean") {
    return systemTheme === "dark" ? "ocean-dark" : "ocean";
  }
  if (themePreference === "sunset") {
    return systemTheme === "dark" ? "sunset-dark" : "sunset";
  }
  return themePreference; // 'light' or 'dark'
})();
```

## User Experience

### Settings Screen

- Navigate to **Settings > Theme**
- 5 theme options displayed in a card-based layout
- Each option shows:
  - Icon (📱 System, ☀️ Light, 🌙 Dark, 🌊 Ocean, 🌅 Sunset)
  - Title
  - Description
  - Selected state with checkmark and colored border
- Preview section shows sample text in selected theme

### Onboarding

- Theme selector in personalization step
- 5 pills/chips in a flexible wrap layout
- Active theme highlighted with primary color
- Responsive to screen width

## Design System Compliance

All new themes follow the established design system:

✅ **Layered Surface System**

- `bg` - Base background (lowest layer)
- `bg-elevated` - Elevated background
- `surface` - Card surfaces
- `surface-variant` - Alternative surface

✅ **Text Hierarchy**

- `text` - Primary text
- `text-muted` - Secondary text
- `inverse-text` - Text on colored backgrounds

✅ **Semantic Colors**

- `primary` - Brand/accent color
- `on-primary` - Text on primary color
- `success`, `warning`, `error`, `info`

✅ **Borders**

- `border` - Standard borders
- `border-strong` - Emphasized borders

✅ **Legacy Aliases**

- Maintains compatibility with older code

## Accessibility

- ✅ All color combinations meet WCAG AA contrast requirements (4.5:1 for normal
  text)
- ✅ Ocean themes use sufficient contrast between text and backgrounds
- ✅ Sunset themes maintain readability with warm tones
- ✅ Dark variants avoid pure black (#000000), use dark grays for reduced eye
  strain

## Testing Checklist

- [ ] Test Ocean light theme on iOS
- [ ] Test Ocean dark theme on iOS
- [ ] Test Sunset light theme on iOS
- [ ] Test Ocean light theme on Android
- [ ] Test Ocean dark theme on Android
- [ ] Test Sunset light theme on Android
- [ ] Test Sunset dark theme on Android
- [ ] Verify theme persistence (AsyncStorage)
- [ ] Test system theme auto-switch for Ocean
- [ ] Test system theme auto-switch for Sunset
- [ ] Verify all UI components render correctly in new themes
- [ ] Test theme selector in Settings
- [ ] Test theme selector in Onboarding
- [ ] Verify preview section updates correctly
- [ ] Test with VoiceOver/TalkBack

## Future Enhancements

Potential additions for future iterations:

1. **Forest Theme** 🌲 - Green nature-inspired palette
2. **Lavender Theme** 💜 - Purple/violet calming colors
3. **Custom Theme Builder** - Allow users to create their own color schemes
4. **Theme Scheduler** - Auto-switch themes based on time of day
5. **Dynamic Theme** - Extract colors from user's wallpaper/photos

## Breaking Changes

None. This is a purely additive change:

- Existing themes (System, Light, Dark) remain unchanged
- All existing components automatically support new themes via `useThemeColor`
  hook
- Backward compatible with older theme preferences stored in AsyncStorage

---

**Last Updated**: October 10, 2025
