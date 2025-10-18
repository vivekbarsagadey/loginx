# Flow System Advanced Animation Guide

## Overview

Animation is crucial for creating smooth, delightful user experiences. The flow system supports **multiple animations per step** with fine-grained control over every animated element.

---

## 🎬 Animation Architecture

### Animation Layers

Every step can have animations at multiple levels:

1. **Step-Level Animations** - Overall step transitions
2. **Container Animations** - Step wrapper animations
3. **Content Animations** - Individual element animations
4. **Progress Animations** - Progress indicator transitions
5. **Navigation Animations** - Button and control animations
6. **Micro-interactions** - User interaction feedback

---

## 🎯 Step-Level Animations

### Basic Step Transitions

```typescript
{
  id: 'welcome',
  type: 'display',
  title: 'Welcome',
  
  // Step entrance animation
  enterAnimation: {
    type: 'spring',
    preset: 'gentle',
    from: { opacity: 0, translateY: 50 },
    to: { opacity: 1, translateY: 0 },
    duration: 400,
  },
  
  // Step exit animation
  exitAnimation: {
    type: 'timing',
    preset: 'quick',
    from: { opacity: 1, scale: 1 },
    to: { opacity: 0, scale: 0.95 },
    duration: 200,
  },
}
```

### Multiple Animation Variants

```typescript
{
  id: 'features',
  type: 'display',
  
  // Different animations based on direction
  animations: {
    enterFromRight: {
      type: 'spring',
      from: { translateX: 300, opacity: 0 },
      to: { translateX: 0, opacity: 1 },
    },
    enterFromLeft: {
      type: 'spring',
      from: { translateX: -300, opacity: 0 },
      to: { translateX: 0, opacity: 1 },
    },
    enterFromBottom: {
      type: 'spring',
      from: { translateY: 300, opacity: 0 },
      to: { translateY: 0, opacity: 1 },
    },
    exit: {
      type: 'timing',
      to: { opacity: 0, scale: 0.9 },
      duration: 200,
    },
  },
  
  // Select animation based on navigation direction
  selectAnimation: (direction: 'forward' | 'backward') => {
    if (direction === 'forward') return 'enterFromRight';
    return 'enterFromLeft';
  },
}
```

---

## 🎨 Content-Level Animations

### Staggered Element Animations

Animate individual elements with delays for a cascading effect:

```typescript
{
  id: 'welcome',
  type: 'display',
  
  // Element-specific animations
  elementAnimations: {
    // Image animates first
    image: {
      type: 'spring',
      preset: 'bouncy',
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      delay: 0,
      duration: 600,
    },
    
    // Title animates 100ms after image
    title: {
      type: 'spring',
      from: { translateY: 30, opacity: 0 },
      to: { translateY: 0, opacity: 1 },
      delay: 100,
      duration: 400,
    },
    
    // Subtitle animates 200ms after image
    subtitle: {
      type: 'spring',
      from: { translateY: 30, opacity: 0 },
      to: { translateY: 0, opacity: 1 },
      delay: 200,
      duration: 400,
    },
    
    // Description animates 300ms after image
    description: {
      type: 'timing',
      from: { opacity: 0 },
      to: { opacity: 1 },
      delay: 300,
      duration: 300,
    },
    
    // Features list with stagger
    featuresList: {
      type: 'spring',
      from: { translateX: -20, opacity: 0 },
      to: { translateX: 0, opacity: 1 },
      stagger: 100, // Each item delayed by 100ms
      delay: 400,
    },
    
    // Button animates last
    button: {
      type: 'spring',
      preset: 'gentle',
      from: { scale: 0.8, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      delay: 700,
    },
  },
}
```

### Parallel vs Sequential Animations

```typescript
{
  id: 'info',
  type: 'display',
  
  animationSequence: {
    // Parallel animations (run simultaneously)
    parallel: [
      {
        target: 'background',
        animation: { type: 'fade', duration: 300 },
      },
      {
        target: 'image',
        animation: { type: 'zoom', duration: 400 },
      },
    ],
    
    // Then sequential animations (one after another)
    sequential: [
      {
        target: 'title',
        animation: { type: 'slideUp', duration: 300 },
      },
      {
        target: 'subtitle',
        animation: { type: 'slideUp', duration: 300 },
      },
      {
        target: 'content',
        animation: { type: 'fadeIn', duration: 200 },
      },
    ],
  },
}
```

---

## 🔄 Progress Indicator Animations

### Animated Progress Transitions

```typescript
{
  // Progress indicator animations
  progressAnimations: {
    // Dot progress animations
    dots: {
      // Current dot grows and pulses
      activeDot: {
        type: 'spring',
        from: { scale: 1 },
        to: { scale: 1.3 },
        loop: true,
        duration: 800,
      },
      
      // Completed dot check mark
      completedDot: {
        type: 'spring',
        preset: 'bouncy',
        from: { scale: 0, rotate: '-45deg' },
        to: { scale: 1, rotate: '0deg' },
      },
      
      // Inactive dot subtle pulse
      inactiveDot: {
        type: 'timing',
        from: { opacity: 0.3 },
        to: { opacity: 0.5 },
        loop: true,
        duration: 1500,
      },
      
      // Transition between dots
      dotTransition: {
        type: 'spring',
        preset: 'gentle',
        duration: 300,
      },
    },
    
    // Stepper animations
    stepper: {
      // Number to checkmark transition
      completeStep: {
        type: 'sequence',
        animations: [
          {
            type: 'spring',
            from: { scale: 1 },
            to: { scale: 1.2 },
            duration: 150,
          },
          {
            type: 'timing',
            from: { rotate: '0deg' },
            to: { rotate: '360deg' },
            duration: 300,
          },
          {
            type: 'spring',
            to: { scale: 1 },
            duration: 150,
          },
        ],
      },
      
      // Line fill animation
      lineFill: {
        type: 'timing',
        easing: 'easeInOut',
        duration: 400,
      },
    },
    
    // Progress bar animations
    bar: {
      // Bar fill animation
      fill: {
        type: 'spring',
        preset: 'gentle',
        duration: 500,
      },
      
      // Percentage counter animation
      counter: {
        type: 'timing',
        easing: 'easeOut',
        duration: 500,
      },
      
      // Shimmer effect
      shimmer: {
        type: 'timing',
        from: { translateX: -100 },
        to: { translateX: 100 },
        loop: true,
        duration: 2000,
      },
    },
    
    // Circular progress animations
    circular: {
      // Circle stroke animation
      stroke: {
        type: 'timing',
        easing: 'easeInOut',
        duration: 600,
      },
      
      // Center number counting
      counter: {
        type: 'timing',
        easing: 'easeOut',
        duration: 600,
      },
      
      // Completion celebration
      complete: {
        type: 'spring',
        preset: 'bouncy',
        from: { scale: 1 },
        to: { scale: 1.1 },
        duration: 400,
      },
    },
  },
}
```

---

## 🎮 Micro-interactions

### User Interaction Animations

```typescript
{
  id: 'selection',
  type: 'selection',
  
  // Interaction animations
  interactions: {
    // Button press animation
    press: {
      type: 'spring',
      from: { scale: 1 },
      to: { scale: 0.95 },
      duration: 100,
      haptic: 'light',
    },
    
    // Button release animation
    release: {
      type: 'spring',
      preset: 'bouncy',
      to: { scale: 1 },
      duration: 200,
    },
    
    // Hover effect (web/tablet)
    hover: {
      type: 'timing',
      to: { scale: 1.05, elevation: 4 },
      duration: 150,
    },
    
    // Selection animation
    select: {
      type: 'spring',
      preset: 'gentle',
      from: { 
        scale: 1, 
        borderWidth: 2,
        borderColor: 'transparent',
      },
      to: { 
        scale: 1.02, 
        borderWidth: 3,
        borderColor: colors.primary,
      },
      duration: 200,
      haptic: 'medium',
    },
    
    // Deselection animation
    deselect: {
      type: 'timing',
      to: { 
        scale: 1, 
        borderWidth: 2,
        borderColor: 'transparent',
      },
      duration: 150,
    },
    
    // Error shake animation
    error: {
      type: 'spring',
      preset: 'stiff',
      keyframes: [
        { translateX: 0 },
        { translateX: -10 },
        { translateX: 10 },
        { translateX: -10 },
        { translateX: 10 },
        { translateX: 0 },
      ],
      duration: 400,
      haptic: 'error',
    },
    
    // Success animation
    success: {
      type: 'spring',
      preset: 'bouncy',
      from: { scale: 1 },
      to: { scale: 1.1 },
      duration: 300,
      haptic: 'success',
    },
    
    // Loading pulse
    loading: {
      type: 'timing',
      from: { opacity: 1 },
      to: { opacity: 0.5 },
      loop: true,
      yoyo: true,
      duration: 800,
    },
    
    // Swipe gesture
    swipe: {
      type: 'spring',
      preset: 'gentle',
      followGesture: true,
      snapPoints: [-100, 0],
    },
  },
}
```

---

## 🎭 Form Field Animations

### Input Field Animations

```typescript
{
  id: 'registration',
  type: 'form',
  
  fieldAnimations: {
    // Field focus animation
    focus: {
      type: 'spring',
      to: {
        borderColor: colors.primary,
        borderWidth: 2,
        scale: 1.01,
      },
      duration: 200,
    },
    
    // Field blur animation
    blur: {
      type: 'timing',
      to: {
        borderColor: colors.border,
        borderWidth: 1,
        scale: 1,
      },
      duration: 150,
    },
    
    // Label float animation
    labelFloat: {
      type: 'timing',
      easing: 'easeOut',
      from: { translateY: 0, fontSize: 16 },
      to: { translateY: -20, fontSize: 12 },
      duration: 200,
    },
    
    // Validation success
    validationSuccess: {
      type: 'spring',
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      duration: 300,
    },
    
    // Validation error
    validationError: {
      type: 'sequence',
      animations: [
        {
          type: 'spring',
          keyframes: [
            { translateX: 0 },
            { translateX: -5 },
            { translateX: 5 },
            { translateX: -5 },
            { translateX: 0 },
          ],
          duration: 300,
        },
        {
          type: 'timing',
          to: { borderColor: colors.error },
          duration: 200,
        },
      ],
      haptic: 'error',
    },
    
    // Error message slide in
    errorMessageEnter: {
      type: 'spring',
      from: { 
        translateY: -10, 
        opacity: 0,
        maxHeight: 0,
      },
      to: { 
        translateY: 0, 
        opacity: 1,
        maxHeight: 100,
      },
      duration: 300,
    },
    
    // Password visibility toggle
    toggleVisibility: {
      type: 'spring',
      from: { rotate: '0deg' },
      to: { rotate: '180deg' },
      duration: 300,
    },
  },
}
```

---

## 🌊 Loading & State Animations

### Async Operation Animations

```typescript
{
  id: 'verification',
  type: 'verification',
  
  stateAnimations: {
    // Initial loading
    loading: {
      type: 'loop',
      animation: {
        type: 'timing',
        from: { rotate: '0deg' },
        to: { rotate: '360deg' },
        duration: 1000,
      },
    },
    
    // Skeleton shimmer
    skeleton: {
      type: 'loop',
      animation: {
        type: 'timing',
        from: { translateX: -100, opacity: 0.3 },
        to: { translateX: 100, opacity: 0.7 },
        duration: 1500,
      },
    },
    
    // Loading to success transition
    loadingToSuccess: {
      type: 'sequence',
      animations: [
        {
          type: 'spring',
          to: { scale: 1.2 },
          duration: 200,
        },
        {
          type: 'timing',
          to: { rotate: '360deg' },
          duration: 300,
        },
        {
          type: 'spring',
          to: { scale: 1 },
          duration: 200,
        },
      ],
      haptic: 'success',
    },
    
    // Loading to error transition
    loadingToError: {
      type: 'sequence',
      animations: [
        {
          type: 'spring',
          keyframes: [
            { scale: 1 },
            { scale: 1.1 },
            { scale: 0.9 },
            { scale: 1.05 },
            { scale: 1 },
          ],
          duration: 400,
        },
      ],
      haptic: 'error',
    },
    
    // Retry button animation
    retry: {
      type: 'spring',
      from: { scale: 0.8, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      duration: 300,
    },
    
    // Success checkmark animation
    successCheck: {
      type: 'spring',
      preset: 'bouncy',
      from: { scale: 0, rotate: '-45deg' },
      to: { scale: 1, rotate: '0deg' },
      duration: 500,
    },
    
    // Error icon animation
    errorIcon: {
      type: 'spring',
      from: { scale: 0 },
      to: { scale: 1 },
      duration: 400,
    },
  },
}
```

---

## 🎪 Special Effect Animations

### Advanced Animation Effects

```typescript
{
  id: 'celebration',
  type: 'display',
  
  specialEffects: {
    // Confetti animation
    confetti: {
      type: 'particles',
      count: 50,
      duration: 3000,
      colors: [colors.primary, colors.success, colors.warning],
      gravity: 0.5,
      velocity: { x: [-2, 2], y: [-10, -5] },
    },
    
    // Ripple effect
    ripple: {
      type: 'ripple',
      from: { scale: 0, opacity: 0.5 },
      to: { scale: 2, opacity: 0 },
      duration: 800,
    },
    
    // Particles floating
    floatingParticles: {
      type: 'loop',
      animation: {
        type: 'timing',
        from: { translateY: 0 },
        to: { translateY: -20 },
        yoyo: true,
        duration: 2000,
        stagger: 200,
      },
    },
    
    // Shimmer effect
    shimmer: {
      type: 'loop',
      animation: {
        type: 'timing',
        from: { 
          translateX: -100, 
          opacity: 0,
        },
        to: { 
          translateX: 100, 
          opacity: 0.5,
        },
        duration: 1500,
      },
    },
    
    // Glow pulse
    glow: {
      type: 'loop',
      animation: {
        type: 'timing',
        from: { shadowOpacity: 0.3 },
        to: { shadowOpacity: 0.8 },
        yoyo: true,
        duration: 1000,
      },
    },
    
    // Parallax effect
    parallax: {
      type: 'gesture',
      followScroll: true,
      layers: [
        { translateY: 0.1 }, // Background (slow)
        { translateY: 0.3 }, // Middle layer
        { translateY: 0.5 }, // Foreground (fast)
      ],
    },
  },
}
```

---

## 🎼 Animation Presets

### Pre-configured Animation Styles

```typescript
// Built-in animation presets
const ANIMATION_PRESETS = {
  // Spring presets
  gentle: {
    type: 'spring',
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  
  bouncy: {
    type: 'spring',
    damping: 8,
    stiffness: 200,
    mass: 0.8,
  },
  
  stiff: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
    mass: 1,
  },
  
  // Timing presets
  quick: {
    type: 'timing',
    duration: 200,
    easing: 'easeOut',
  },
  
  smooth: {
    type: 'timing',
    duration: 400,
    easing: 'easeInOut',
  },
  
  slow: {
    type: 'timing',
    duration: 600,
    easing: 'easeInOut',
  },
  
  // Named animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 300,
  },
  
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: 200,
  },
  
  slideUp: {
    from: { translateY: 50, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
    type: 'spring',
    preset: 'gentle',
  },
  
  slideDown: {
    from: { translateY: -50, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
    type: 'spring',
    preset: 'gentle',
  },
  
  slideRight: {
    from: { translateX: -50, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
    type: 'spring',
    preset: 'gentle',
  },
  
  slideLeft: {
    from: { translateX: 50, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
    type: 'spring',
    preset: 'gentle',
  },
  
  zoom: {
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    type: 'spring',
    preset: 'bouncy',
  },
  
  shake: {
    keyframes: [
      { translateX: 0 },
      { translateX: -10 },
      { translateX: 10 },
      { translateX: -10 },
      { translateX: 10 },
      { translateX: 0 },
    ],
    type: 'spring',
    preset: 'stiff',
    duration: 400,
  },
  
  bounce: {
    keyframes: [
      { translateY: 0 },
      { translateY: -10 },
      { translateY: 0 },
      { translateY: -5 },
      { translateY: 0 },
    ],
    type: 'spring',
    preset: 'bouncy',
    duration: 500,
  },
  
  pulse: {
    from: { scale: 1 },
    to: { scale: 1.05 },
    yoyo: true,
    loop: true,
    duration: 800,
  },
  
  rotate: {
    from: { rotate: '0deg' },
    to: { rotate: '360deg' },
    duration: 1000,
  },
  
  flip: {
    from: { rotateY: '0deg' },
    to: { rotateY: '180deg' },
    duration: 600,
  },
};

// Usage
{
  enterAnimation: 'fadeIn', // Use preset name
  exitAnimation: 'slideLeft',
  
  // Or customize preset
  enterAnimation: {
    ...ANIMATION_PRESETS.slideUp,
    duration: 500, // Override duration
  },
}
```

---

## 🎯 Complete Animated Step Example

```typescript
{
  id: 'animated-welcome',
  type: 'display',
  title: 'Welcome to LoginX',
  subtitle: 'Secure authentication made simple',
  
  // Overall step animation
  enterAnimation: {
    type: 'spring',
    preset: 'gentle',
    from: { opacity: 0, translateY: 50 },
    to: { opacity: 1, translateY: 0 },
    duration: 400,
  },
  
  exitAnimation: {
    type: 'timing',
    to: { opacity: 0, scale: 0.95 },
    duration: 200,
  },
  
  // Element-specific animations with stagger
  elementAnimations: {
    background: {
      type: 'timing',
      from: { opacity: 0 },
      to: { opacity: 1 },
      delay: 0,
      duration: 400,
    },
    
    image: {
      type: 'spring',
      preset: 'bouncy',
      from: { scale: 0, rotate: '-180deg' },
      to: { scale: 1, rotate: '0deg' },
      delay: 100,
      duration: 600,
    },
    
    title: {
      type: 'spring',
      from: { translateY: 30, opacity: 0 },
      to: { translateY: 0, opacity: 1 },
      delay: 200,
      duration: 400,
    },
    
    subtitle: {
      type: 'spring',
      from: { translateY: 30, opacity: 0 },
      to: { translateY: 0, opacity: 1 },
      delay: 300,
      duration: 400,
    },
    
    features: {
      type: 'spring',
      from: { translateX: -20, opacity: 0 },
      to: { translateX: 0, opacity: 1 },
      stagger: 100,
      delay: 400,
    },
    
    button: {
      type: 'spring',
      preset: 'bouncy',
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      delay: 800,
    },
  },
  
  // Interaction animations
  interactions: {
    buttonPress: {
      type: 'spring',
      to: { scale: 0.95 },
      duration: 100,
      haptic: 'light',
    },
    
    buttonRelease: {
      type: 'spring',
      preset: 'bouncy',
      to: { scale: 1 },
      duration: 200,
    },
  },
  
  // Special effects
  specialEffects: {
    shimmer: {
      type: 'loop',
      animation: {
        from: { translateX: -100 },
        to: { translateX: 100 },
        duration: 2000,
      },
    },
    
    glow: {
      type: 'loop',
      animation: {
        from: { shadowOpacity: 0.3 },
        to: { shadowOpacity: 0.7 },
        yoyo: true,
        duration: 1500,
      },
    },
  },
}
```

---

## 🎬 Animation Performance

### Best Practices

1. **Use Native Driver** - Enable `useNativeDriver: true` for better performance
2. **Limit Concurrent Animations** - Max 5-7 simultaneous animations
3. **Optimize Heavy Animations** - Use `removeClippedSubviews` for lists
4. **Debounce Rapid Animations** - Prevent animation overload
5. **Test on Real Devices** - Emulators don't reflect real performance

### Performance Optimization

```typescript
{
  animations: {
    // Optimize for performance
    enterAnimation: {
      useNativeDriver: true, // Run on UI thread
      skipAnimationFrame: false, // Don't skip frames
      reduceMotion: 'auto', // Respect system settings
    },
  },
  
  // Conditional animations based on device
  deviceOptimization: {
    lowEnd: {
      // Simpler animations for low-end devices
      duration: 200,
      skipSecondary: true,
    },
    midEnd: {
      duration: 300,
      skipSecondary: false,
    },
    highEnd: {
      duration: 400,
      allEffects: true,
    },
  },
}
```

---

## ♿ Accessibility

### Respecting User Preferences

```typescript
import { useReducedMotion } from 'react-native-reanimated';

{
  animations: {
    // Check if user prefers reduced motion
    respectReducedMotion: true,
    
    // Fallback animations for reduced motion
    reducedMotionAlternative: {
      type: 'timing',
      duration: 0, // Instant
      // or simple fade
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 150,
    },
  },
}
```

---

## 🎯 Summary

With this animation system, you can:

✅ **Multiple animations per step** - Step, element, progress, interaction levels
✅ **Staggered animations** - Cascading effects for smooth reveals
✅ **Micro-interactions** - Haptic feedback for every interaction
✅ **Progress animations** - Animated dots, steppers, bars, circles
✅ **Form animations** - Floating labels, validation feedback
✅ **Loading states** - Skeletons, spinners, shimmers
✅ **Special effects** - Confetti, ripples, particles, parallax
✅ **Performance optimized** - Native driver, reduced motion support
✅ **Accessible** - Respects user motion preferences

**Every element can be animated independently with perfect timing control!** 🎬
