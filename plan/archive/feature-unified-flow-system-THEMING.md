# Flow System Advanced Theming & Visual Customization

## Overview

Every step in the flow system supports **multiple themes, images, animations, and visual variants**. This allows you to create highly customized, branded experiences that can adapt to user preferences, seasonal events, or A/B testing scenarios.

---

## 🎨 Step-Level Theming

### Basic Theme Override

```typescript
{
  id: 'welcome',
  type: 'display',
  title: 'Welcome',

  // Override theme colors for this step only
  theme: {
    backgroundColor: '#F0F9FF',
    primaryColor: '#0EA5E9',
    textColor: '#0C4A6E',
    accentColor: '#7DD3FC',
  },
}
```

### Multiple Theme Variants

```typescript
{
  id: 'welcome',
  type: 'display',
  title: 'Welcome',

  // Define multiple theme variants
  themes: {
    default: {
      backgroundColor: '#FFFFFF',
      primaryColor: '#007AFF',
      image: require('@/assets/welcome-light.png'),
    },
    dark: {
      backgroundColor: '#000000',
      primaryColor: '#0A84FF',
      image: require('@/assets/welcome-dark.png'),
    },
    ocean: {
      backgroundColor: '#E0F2FE',
      primaryColor: '#0EA5E9',
      image: require('@/assets/welcome-ocean.png'),
    },
    sunset: {
      backgroundColor: '#FFF7ED',
      primaryColor: '#F97316',
      image: require('@/assets/welcome-sunset.png'),
    },
  },

  // Active theme (can be dynamic)
  activeTheme: 'default', // or use function: (userTheme) => userTheme
}
```

### Dynamic Theme Selection

```typescript
{
  id: 'welcome',
  type: 'display',
  title: 'Welcome',

  themes: {
    light: { /* ... */ },
    dark: { /* ... */ },
  },

  // Dynamically select theme based on user preference
  activeTheme: (flowData, appTheme) => {
    return appTheme === 'dark' ? 'dark' : 'light';
  },
}
```

---

## 🖼️ Multiple Images Per Step

### Image Variants by Theme

```typescript
{
  id: 'features',
  type: 'display',
  title: 'Key Features',

  images: {
    // Different images for different themes
    light: require('@/assets/features-light.png'),
    dark: require('@/assets/features-dark.png'),
    ocean: require('@/assets/features-ocean.png'),

    // Responsive images for different screen sizes
    light_small: require('@/assets/features-light-sm.png'),
    light_large: require('@/assets/features-light-lg.png'),
  },

  // Image selection logic
  getImage: (theme, screenSize) => {
    const size = screenSize.width > 768 ? 'large' : 'small';
    return images[`${theme}_${size}`] || images[theme];
  },
}
```

### Multiple Images in Carousel

```typescript
{
  id: 'tutorial',
  type: 'display',
  title: 'How It Works',

  // Array of images for carousel/slideshow
  images: [
    {
      source: require('@/assets/tutorial-1.png'),
      caption: 'Step 1: Sign up',
      theme: 'default',
    },
    {
      source: require('@/assets/tutorial-2.png'),
      caption: 'Step 2: Verify email',
      theme: 'default',
    },
    {
      source: require('@/assets/tutorial-3.png'),
      caption: 'Step 3: Start using',
      theme: 'default',
    },
  ],

  // Carousel configuration
  carousel: {
    autoPlay: true,
    interval: 3000,
    showIndicators: true,
  },
}
```

### Animated Images (Lottie)

```typescript
{
  id: 'loading',
  type: 'display',
  title: 'Setting Up',

  animation: {
    source: require('@/assets/animations/setup.json'),
    autoPlay: true,
    loop: true,

    // Multiple animation variants
    variants: {
      light: require('@/assets/animations/setup-light.json'),
      dark: require('@/assets/animations/setup-dark.json'),
    },
  },
}
```

---

## 🎭 Visual Variants for Each Step Type

### Display Step Variants

```typescript
{
  id: 'welcome',
  type: 'display',

  // Visual variant
  variant: 'hero' | 'card' | 'fullscreen' | 'minimal' | 'split',

  variants: {
    hero: {
      layout: 'center-aligned',
      imageSize: 'large',
      titleSize: 'extra-large',
      backgroundColor: 'gradient',
    },
    card: {
      layout: 'card-centered',
      imageSize: 'medium',
      titleSize: 'large',
      elevation: 3,
    },
    fullscreen: {
      layout: 'fullscreen-cover',
      imageSize: 'cover',
      textOverlay: true,
    },
    minimal: {
      layout: 'text-only',
      imageSize: 'small-icon',
      titleSize: 'medium',
    },
    split: {
      layout: 'split-screen',
      imagePosition: 'left',
      contentPosition: 'right',
    },
  },
}
```

### Form Step Variants

```typescript
{
  id: 'profile',
  type: 'form',

  // Form visual style
  variant: 'standard' | 'material' | 'minimal' | 'card' | 'floating',

  variants: {
    standard: {
      inputStyle: 'outlined',
      spacing: 'comfortable',
      labelPosition: 'above',
    },
    material: {
      inputStyle: 'filled',
      rippleEffect: true,
      floatingLabel: true,
    },
    minimal: {
      inputStyle: 'underlined',
      spacing: 'compact',
      labelPosition: 'inline',
    },
    card: {
      inputStyle: 'card',
      elevation: 2,
      spacing: 'comfortable',
    },
    floating: {
      inputStyle: 'outlined',
      labelPosition: 'floating',
      helperText: 'persistent',
    },
  },
}
```

### Selection Step Variants

```typescript
{
  id: 'theme-selection',
  type: 'selection',

  // Selection UI variant
  variant: 'grid' | 'list' | 'cards' | 'buttons' | 'pills',

  variants: {
    grid: {
      columns: 2,
      spacing: 16,
      aspectRatio: 1,
    },
    list: {
      itemHeight: 72,
      showDividers: true,
      iconPosition: 'left',
    },
    cards: {
      elevation: 2,
      borderRadius: 12,
      columns: 'auto',
    },
    buttons: {
      style: 'outlined',
      fullWidth: true,
      spacing: 8,
    },
    pills: {
      style: 'rounded-full',
      compact: true,
      multiline: true,
    },
  },
}
```

---

## 🌈 Complete Themed Step Example

### Multi-Theme Welcome Step

```typescript
{
  id: 'welcome',
  type: 'display',
  title: 'Welcome to LoginX',
  subtitle: 'Secure authentication made simple',

  // Multiple complete themes
  themes: {
    // Default Blue Theme
    default: {
      colors: {
        background: '#F0F9FF',
        surface: '#FFFFFF',
        primary: '#0EA5E9',
        text: '#0C4A6E',
        accent: '#7DD3FC',
      },
      images: {
        hero: require('@/assets/welcome-blue.png'),
        icon: require('@/assets/icon-blue.png'),
        background: require('@/assets/bg-blue.png'),
      },
      animations: {
        entrance: 'fadeInUp',
        exit: 'fadeOutDown',
      },
      typography: {
        titleSize: 32,
        titleWeight: 'bold',
        subtitleSize: 18,
      },
    },

    // Ocean Theme
    ocean: {
      colors: {
        background: '#E0F2FE',
        surface: '#FFFFFF',
        primary: '#0891B2',
        text: '#164E63',
        accent: '#22D3EE',
      },
      images: {
        hero: require('@/assets/welcome-ocean.png'),
        icon: require('@/assets/icon-ocean.png'),
        background: require('@/assets/bg-ocean.png'),
      },
      animations: {
        entrance: 'slideInRight',
        exit: 'slideOutLeft',
      },
      typography: {
        titleSize: 32,
        titleWeight: 'bold',
        subtitleSize: 18,
      },
    },

    // Sunset Theme
    sunset: {
      colors: {
        background: '#FFF7ED',
        surface: '#FFFFFF',
        primary: '#EA580C',
        text: '#7C2D12',
        accent: '#FB923C',
      },
      images: {
        hero: require('@/assets/welcome-sunset.png'),
        icon: require('@/assets/icon-sunset.png'),
        background: require('@/assets/bg-sunset.png'),
      },
      animations: {
        entrance: 'zoomIn',
        exit: 'zoomOut',
      },
      typography: {
        titleSize: 32,
        titleWeight: 'bold',
        subtitleSize: 18,
      },
    },

    // Dark Theme
    dark: {
      colors: {
        background: '#0B1220',
        surface: '#1E293B',
        primary: '#3B82F6',
        text: '#F1F5F9',
        accent: '#60A5FA',
      },
      images: {
        hero: require('@/assets/welcome-dark.png'),
        icon: require('@/assets/icon-dark.png'),
        background: require('@/assets/bg-dark.png'),
      },
      animations: {
        entrance: 'fadeIn',
        exit: 'fadeOut',
      },
      typography: {
        titleSize: 32,
        titleWeight: 'bold',
        subtitleSize: 18,
      },
    },
  },

  // Dynamic theme selection
  activeTheme: (flowData, userPrefs) => {
    // Check user's app theme preference
    if (userPrefs.theme === 'dark') return 'dark';

    // Check selected brand theme
    if (flowData.selectedTheme) return flowData.selectedTheme;

    // Default
    return 'default';
  },

  // Layout variant
  variant: 'hero',

  // Content that adapts to theme
  content: [
    {
      icon: 'shield-checkmark',
      title: 'Enterprise Security',
      description: 'Bank-level encryption',
      iconColor: (theme) => theme.colors.primary,
    },
    {
      icon: 'finger-print',
      title: 'Biometric Login',
      description: 'Face ID & Touch ID',
      iconColor: (theme) => theme.colors.primary,
    },
    {
      icon: 'lock-closed',
      title: 'Zero Trust',
      description: 'End-to-end encryption',
      iconColor: (theme) => theme.colors.primary,
    },
  ],
}
```

---

## 🎬 Animation Variants

### Step Transition Animations

```typescript
{
  id: 'features',
  type: 'display',

  // Transition animations
  animations: {
    enter: {
      type: 'spring',
      from: { opacity: 0, translateY: 50 },
      to: { opacity: 1, translateY: 0 },
      duration: 300,
      spring: { damping: 15, stiffness: 150 },
    },
    exit: {
      type: 'timing',
      from: { opacity: 1, translateX: 0 },
      to: { opacity: 0, translateX: -50 },
      duration: 200,
    },
  },

  // Element-level animations
  elementAnimations: {
    title: {
      delay: 100,
      type: 'fadeInUp',
    },
    subtitle: {
      delay: 200,
      type: 'fadeInUp',
    },
    image: {
      delay: 0,
      type: 'zoomIn',
    },
    content: {
      delay: 300,
      type: 'fadeIn',
      stagger: 100, // Stagger each item by 100ms
    },
  },
}
```

### Micro-interactions

```typescript
{
  id: 'selection',
  type: 'selection',

  // Interaction animations
  interactions: {
    onPress: {
      scale: 0.95,
      duration: 100,
    },
    onHover: {
      scale: 1.05,
      elevation: 4,
      duration: 150,
    },
    onSelect: {
      backgroundColor: (theme) => theme.colors.primary,
      borderColor: (theme) => theme.colors.accent,
      icon: 'checkmark-circle',
      haptic: 'light',
    },
  },
}
```

---

## 📱 Responsive Visual Variants

### Screen Size Based Theming

```typescript
{
  id: 'welcome',
  type: 'display',

  // Different layouts for different screen sizes
  responsive: {
    small: {
      variant: 'minimal',
      imageSize: 'small',
      titleSize: 24,
      spacing: 16,
    },
    medium: {
      variant: 'card',
      imageSize: 'medium',
      titleSize: 28,
      spacing: 20,
    },
    large: {
      variant: 'hero',
      imageSize: 'large',
      titleSize: 36,
      spacing: 32,
    },
    xlarge: {
      variant: 'split',
      imageSize: 'extra-large',
      titleSize: 42,
      spacing: 40,
    },
  },

  // Breakpoints
  breakpoints: {
    small: 0,
    medium: 375,
    large: 768,
    xlarge: 1024,
  },
}
```

### Orientation Based Variants

```typescript
{
  id: 'features',
  type: 'display',

  // Different layouts for portrait vs landscape
  orientation: {
    portrait: {
      layout: 'vertical',
      imagePosition: 'top',
      contentPosition: 'bottom',
    },
    landscape: {
      layout: 'horizontal',
      imagePosition: 'left',
      contentPosition: 'right',
    },
  },
}
```

---

## 🎨 Seasonal & Event Themes

### Time-Based Theme Switching

```typescript
{
  id: 'welcome',
  type: 'display',

  themes: {
    default: { /* ... */ },
    halloween: {
      colors: {
        background: '#1A0B2E',
        primary: '#FF6B35',
        accent: '#F7931E',
      },
      images: {
        hero: require('@/assets/halloween-welcome.png'),
      },
    },
    christmas: {
      colors: {
        background: '#FAFAFA',
        primary: '#C41E3A',
        accent: '#0C6B58',
      },
      images: {
        hero: require('@/assets/christmas-welcome.png'),
      },
    },
  },

  // Auto-select theme based on date
  activeTheme: () => {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    // Halloween (October 15-31)
    if (month === 9 && day >= 15) return 'halloween';

    // Christmas (December 1-31)
    if (month === 11) return 'christmas';

    return 'default';
  },
}
```

---

## 🔄 A/B Testing Visual Variants

### Multiple Variants for Testing

```typescript
{
  id: 'welcome',
  type: 'display',

  // A/B test variants
  experiments: {
    welcome_screen_test: {
      variants: {
        control: {
          image: require('@/assets/welcome-control.png'),
          title: 'Welcome to LoginX',
          subtitle: 'Secure authentication',
          layout: 'hero',
        },
        variant_a: {
          image: require('@/assets/welcome-variant-a.png'),
          title: 'Get Started with LoginX',
          subtitle: 'Authentication made easy',
          layout: 'card',
        },
        variant_b: {
          image: require('@/assets/welcome-variant-b.png'),
          title: 'Your Secure Login Solution',
          subtitle: 'Enterprise-grade security',
          layout: 'split',
        },
      },

      // Variant selection logic
      selectVariant: (userId) => {
        const hash = hashUserId(userId);
        if (hash % 3 === 0) return 'control';
        if (hash % 3 === 1) return 'variant_a';
        return 'variant_b';
      },

      // Track experiment results
      onComplete: (variant, data) => {
        analytics.track('experiment_complete', {
          experiment: 'welcome_screen_test',
          variant,
          ...data,
        });
      },
    },
  },
}
```

---

## 🎯 Brand Customization

### Multi-Brand Support

```typescript
{
  id: 'welcome',
  type: 'display',

  // Different branding for different clients
  brands: {
    acme: {
      logo: require('@/assets/brands/acme-logo.png'),
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
      },
      images: {
        hero: require('@/assets/brands/acme-hero.png'),
      },
      typography: {
        fontFamily: 'Acme-Bold',
      },
    },
    globex: {
      logo: require('@/assets/brands/globex-logo.png'),
      colors: {
        primary: '#2E7D32',
        secondary: '#FBC02D',
      },
      images: {
        hero: require('@/assets/brands/globex-hero.png'),
      },
      typography: {
        fontFamily: 'Globex-Regular',
      },
    },
  },

  // Select brand dynamically
  activeBrand: (flowData) => {
    return flowData.brandId || 'acme';
  },
}
```

---

## 🛠️ Implementation in Flow Engine

### Enhanced Flow Configuration Type

```typescript
interface StepTheme {
  colors?: {
    background?: string;
    surface?: string;
    primary?: string;
    text?: string;
    accent?: string;
    [key: string]: string | undefined;
  };
  images?: {
    [key: string]: ImageSourcePropType;
  };
  animations?: {
    entrance?: string;
    exit?: string;
    [key: string]: string | undefined;
  };
  typography?: {
    titleSize?: number;
    titleWeight?: string;
    subtitleSize?: number;
    [key: string]: number | string | undefined;
  };
}

interface Step {
  id: string;
  type: StepType;
  title: string;

  // Single theme override
  theme?: StepTheme;

  // Multiple theme variants
  themes?: {
    [themeName: string]: StepTheme;
  };

  // Active theme selector
  activeTheme?: string | ((flowData: any, userPrefs: any) => string);

  // Visual variant
  variant?: string;

  // Multiple visual variants
  variants?: {
    [variantName: string]: any;
  };

  // Images
  image?: ImageSourcePropType;
  images?:
    | ImageSourcePropType[]
    | {
        [key: string]: ImageSourcePropType;
      };

  // Animations
  animation?: LottieAnimation;
  animations?: {
    enter?: Animation;
    exit?: Animation;
    [key: string]: Animation | undefined;
  };

  // Responsive configurations
  responsive?: {
    [breakpoint: string]: Partial<Step>;
  };

  // Orientation configurations
  orientation?: {
    portrait?: Partial<Step>;
    landscape?: Partial<Step>;
  };

  // A/B testing
  experiments?: {
    [experimentId: string]: Experiment;
  };

  // Brand customization
  brands?: {
    [brandId: string]: StepTheme;
  };
  activeBrand?: string | ((flowData: any) => string);
}
```

### Usage in Flow Container

```typescript
<FlowContainer
  flow={myFlow}

  // Global theme (can be overridden per step)
  theme="ocean"

  // User preferences for theme selection
  userPreferences={{
    theme: 'dark',
    colorScheme: 'ocean',
  }}

  // Brand selection
  brandId="acme"

  // Experiment tracking
  onExperimentView={(experimentId, variant) => {
    analytics.track('experiment_view', { experimentId, variant });
  }}
/>
```

---

## 📊 Complete Example: Multi-Themed Onboarding Flow

```typescript
export const advancedOnboardingFlow: FlowConfig = {
  id: "advanced-onboarding",
  title: "Welcome",
  version: "2.0",

  // Global themes for the flow
  themes: {
    light: {
      /* ... */
    },
    dark: {
      /* ... */
    },
    ocean: {
      /* ... */
    }
  },

  steps: [
    // Step 1: Hero Welcome with Multiple Themes
    {
      id: "welcome",
      type: "display",
      title: "Welcome to LoginX",
      subtitle: "Secure authentication made simple",

      themes: {
        light: {
          colors: {
            background: "#F0F9FF",
            primary: "#0EA5E9"
          },
          images: {
            hero: require("@/assets/onboarding/welcome-light.png")
          }
        },
        dark: {
          colors: {
            background: "#0B1220",
            primary: "#3B82F6"
          },
          images: {
            hero: require("@/assets/onboarding/welcome-dark.png")
          }
        },
        ocean: {
          colors: {
            background: "#E0F2FE",
            primary: "#0891B2"
          },
          images: {
            hero: require("@/assets/onboarding/welcome-ocean.png")
          }
        }
      },

      variant: "hero",

      responsive: {
        small: { variant: "minimal" },
        large: { variant: "hero" }
      }
    },

    // Step 2: Features with Carousel
    {
      id: "features",
      type: "display",
      title: "Key Features",

      images: [
        {
          source: require("@/assets/onboarding/feature-1.png"),
          darkSource: require("@/assets/onboarding/feature-1-dark.png")
        },
        {
          source: require("@/assets/onboarding/feature-2.png"),
          darkSource: require("@/assets/onboarding/feature-2-dark.png")
        },
        {
          source: require("@/assets/onboarding/feature-3.png"),
          darkSource: require("@/assets/onboarding/feature-3-dark.png")
        }
      ],

      carousel: {
        autoPlay: true,
        interval: 3000
      }
    },

    // Step 3: Theme Selection
    {
      id: "theme-selection",
      type: "selection",
      title: "Choose Your Theme",

      variant: "cards",

      options: [
        {
          id: "light",
          title: "Light",
          preview: require("@/assets/themes/light-preview.png")
        },
        {
          id: "dark",
          title: "Dark",
          preview: require("@/assets/themes/dark-preview.png")
        },
        {
          id: "ocean",
          title: "Ocean",
          preview: require("@/assets/themes/ocean-preview.png")
        }
      ]
    }
  ]
};
```

---

## 🎉 Summary

With this enhanced theming system, every step can have:

✅ **Multiple color themes** - Light, dark, custom brand colors
✅ **Multiple images** - Per theme, per screen size, carousel
✅ **Multiple animations** - Entrance, exit, micro-interactions
✅ **Multiple layouts** - Hero, card, split, minimal, etc.
✅ **Responsive variants** - Different looks for different screen sizes
✅ **A/B test variants** - Test different designs
✅ **Brand customization** - Multi-tenant support
✅ **Seasonal themes** - Auto-switch based on date/events

This creates an incredibly flexible system that can adapt to any design requirement!
