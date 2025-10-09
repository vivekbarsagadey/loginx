# Typography Quick Reference

Quick guide for using the LoginX Typography System.

## Type Variants

```tsx
<ThemedText type="display">     {/* 40px - Hero text */}
<ThemedText type="title">       {/* 32px - Page titles */}
<ThemedText type="heading">     {/* 28px - Section headers */}
<ThemedText type="subheading">  {/* 24px - Subsections */}
<ThemedText type="subtitle1">   {/* 20px - Emphasized */}
<ThemedText type="subtitle2">   {/* 18px - Secondary */}
<ThemedText type="body">        {/* 16px - Main content (default) */}
<ThemedText type="bodyBold">    {/* 16px - Bold body */}
<ThemedText type="bodySmall">   {/* 14px - Dense content */}
<ThemedText type="button">      {/* 14px - Buttons */}
<ThemedText type="caption">     {/* 12px - Supporting */}
<ThemedText type="label">       {/* 10px - Labels */}
<ThemedText type="overline">    {/* 10px - All caps */}
```

## Typography Presets

```tsx
import { TypographyPresets } from "@/utils/typography";

TypographyPresets.hero; // Hero section with centering
TypographyPresets.pageTitle; // Title with bottom spacing
TypographyPresets.sectionHeader; // Header with spacing
TypographyPresets.cardTitle; // Card title with spacing
TypographyPresets.formLabel; // Form label with spacing
TypographyPresets.helperText; // Helper text with opacity
TypographyPresets.errorMessage; // Error message with spacing
TypographyPresets.link; // Link with underline
```

## Text Utilities

```tsx
import { typography } from "@/utils/typography";

// Alignment
typography.align.left;
typography.align.center;
typography.align.right;

// Decoration
typography.decoration.underline;
typography.decoration.lineThrough;

// Transform
typography.transform.uppercase;
typography.transform.lowercase;
typography.transform.capitalize;

// Truncation
typography.truncate(2); // Truncate after 2 lines

// Code
typography.code(14); // Monospace font
```

## Dynamic Type (Accessibility)

```tsx
import { useWindowDimensions } from "react-native";
import { createScaledTextStyle } from "@/utils/typography";

const { fontScale } = useWindowDimensions();
const textStyle = createScaledTextStyle(16, fontScale, {
  weight: "medium",
  maxScale: 1.3
});
```

## Responsive Sizing

```tsx
import { useWindowDimensions } from "react-native";
import { getResponsiveFontSize } from "@/utils/typography";

const { width } = useWindowDimensions();
const fontSize = getResponsiveFontSize(16, width);
```

## Platform Fonts

```tsx
import { FontFamily, FontWeight } from '@/constants/layout';

// iOS: San Francisco, Android: Roboto
fontFamily: FontFamily.regular,  // 400 weight
fontFamily: FontFamily.medium,   // 500 weight
fontFamily: FontFamily.bold,     // 700 weight

// Numeric weights
fontWeight: FontWeight.light,    // '300'
fontWeight: FontWeight.regular,  // '400'
fontWeight: FontWeight.medium,   // '500'
fontWeight: FontWeight.semibold, // '600'
fontWeight: FontWeight.bold,     // '700'
```

## Common Patterns

### Screen Title

```tsx
<ThemedText type="title" style={TypographyPresets.pageTitle}>
  My Screen
</ThemedText>
```

### Section Header

```tsx
<ThemedText type="heading" style={TypographyPresets.sectionHeader}>
  Recent Activity
</ThemedText>
```

### Form Label

```tsx
<ThemedText type="label" style={TypographyPresets.formLabel}>
  EMAIL ADDRESS
</ThemedText>
```

### Helper Text

```tsx
<ThemedText type="caption" style={TypographyPresets.helperText}>
  We'll send you a code
</ThemedText>
```

### Error Message

```tsx
<ThemedText
  type="caption"
  style={[TypographyPresets.errorMessage, { color: errorColor }]}
>
  Invalid email address
</ThemedText>
```

### Link

```tsx
<ThemedText
  type="body"
  style={[TypographyPresets.link, { color: primaryColor }]}
>
  Forgot password?
</ThemedText>
```

---

**Full Documentation:** `docs/TYPOGRAPHY_SYSTEM.md`  
**Examples:** `examples/typography-examples.tsx`  
**Showcase:** `components/ui/typography-showcase.tsx`
