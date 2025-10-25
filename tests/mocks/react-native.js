/**
 * React Native Mock for Jest
 *
 * This mock provides a basic implementation of React Native components and APIs
 * for testing purposes.
 */

module.exports = {
  // Platform
  Platform: {
    OS: 'ios',
    Version: '14.0',
    select: (obj) => obj.ios || obj.default,
  },

  // StyleSheet
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style,
    hairlineWidth: 1,
  },

  // Dimensions
  Dimensions: {
    get: jest.fn(() => ({
      width: 375,
      height: 667,
      scale: 2,
      fontScale: 1,
    })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },

  // AppState
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
    removeEventListener: jest.fn(),
  },

  // AsyncStorage (redirects to mock)
  AsyncStorage: require('@react-native-async-storage/async-storage/jest/async-storage-mock'),

  // View
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  ScrollView: 'ScrollView',
  FlatList: 'FlatList',
  SectionList: 'SectionList',
  TouchableOpacity: 'TouchableOpacity',
  TouchableHighlight: 'TouchableHighlight',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  Pressable: 'Pressable',
  Image: 'Image',
  Modal: 'Modal',
  ActivityIndicator: 'ActivityIndicator',
  SafeAreaView: 'SafeAreaView',
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  RefreshControl: 'RefreshControl',
  Switch: 'Switch',
  StatusBar: 'StatusBar',

  // Alert
  Alert: {
    alert: jest.fn(),
    prompt: jest.fn(),
  },

  // Animated
  Animated: {
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      interpolate: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
    })),
    View: 'Animated.View',
    Text: 'Animated.Text',
    Image: 'Animated.Image',
    ScrollView: 'Animated.ScrollView',
    timing: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback({ finished: true })),
      stop: jest.fn(),
      reset: jest.fn(),
    })),
    spring: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback({ finished: true })),
      stop: jest.fn(),
      reset: jest.fn(),
    })),
    decay: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback({ finished: true })),
      stop: jest.fn(),
      reset: jest.fn(),
    })),
    sequence: jest.fn(),
    parallel: jest.fn(),
    stagger: jest.fn(),
    loop: jest.fn(),
    delay: jest.fn(),
    event: jest.fn(),
    createAnimatedComponent: (component) => component,
  },

  // Linking
  Linking: {
    openURL: jest.fn(() => Promise.resolve()),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
    getInitialURL: jest.fn(() => Promise.resolve(null)),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },

  // Keyboard
  Keyboard: {
    addListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    dismiss: jest.fn(),
  },

  // Share
  Share: {
    share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
  },

  // Vibration
  Vibration: {
    vibrate: jest.fn(),
    cancel: jest.fn(),
  },

  // BackHandler
  BackHandler: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
    removeEventListener: jest.fn(),
    exitApp: jest.fn(),
  },

  // PixelRatio
  PixelRatio: {
    get: jest.fn(() => 2),
    getFontScale: jest.fn(() => 1),
    getPixelSizeForLayoutSize: jest.fn((size) => size * 2),
    roundToNearestPixel: jest.fn((size) => Math.round(size)),
  },

  // PermissionsAndroid
  PermissionsAndroid: {
    check: jest.fn(() => Promise.resolve(true)),
    request: jest.fn(() => Promise.resolve('granted')),
    requestMultiple: jest.fn(() => Promise.resolve({})),
    PERMISSIONS: {},
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      NEVER_ASK_AGAIN: 'never_ask_again',
    },
  },

  // NativeModules
  NativeModules: {
    StatusBarManager: {
      HEIGHT: 20,
      getHeight: jest.fn((callback) => callback({ height: 20 })),
    },
    PlatformConstants: {
      forceTouchAvailable: false,
    },
  },

  // NativeEventEmitter
  NativeEventEmitter: jest.fn(() => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
};
