/**
 * @file tests/mocks/react-native.js
 * @description Mock of React Native for Jest testing
 */
/* eslint-env jest */
/* eslint-disable no-undef */

const mockComponent = (name) => {
  const Component = (props) => props;
  Component.displayName = name;
  return Component;
};

const mockNativeModule = (name) => ({
  [name]: {},
});

module.exports = {
  // Core components
  View: mockComponent('View'),
  Text: mockComponent('Text'),
  TextInput: mockComponent('TextInput'),
  ScrollView: mockComponent('ScrollView'),
  TouchableOpacity: mockComponent('TouchableOpacity'),
  TouchableHighlight: mockComponent('TouchableHighlight'),
  Pressable: mockComponent('Pressable'),
  Image: mockComponent('Image'),
  FlatList: mockComponent('FlatList'),
  ActivityIndicator: mockComponent('ActivityIndicator'),
  Modal: mockComponent('Modal'),

  // StyleSheet
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style,
    compose: (style1, style2) => [style1, style2],
    hairlineWidth: 1,
    absoluteFill: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    absoluteFillObject: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },

  // Platform
  Platform: {
    OS: 'ios',
    Version: '14.0',
    isPad: false,
    isTesting: true,
    select: (obj) => obj.ios || obj.default,
  },

  // Dimensions
  Dimensions: {
    get: () => ({
      width: 375,
      height: 667,
      scale: 2,
      fontScale: 1,
    }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },

  // Alert
  Alert: {
    alert: jest.fn(),
    prompt: jest.fn(),
  },

  // Linking
  Linking: {
    openURL: jest.fn(() => Promise.resolve()),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
    getInitialURL: jest.fn(() => Promise.resolve(null)),
    addEventListener: jest.fn(),
  },

  // AppState
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },

  // Keyboard
  Keyboard: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    dismiss: jest.fn(),
  },

  // Animated
  Animated: {
    View: mockComponent('Animated.View'),
    Text: mockComponent('Animated.Text'),
    ScrollView: mockComponent('Animated.ScrollView'),
    Image: mockComponent('Animated.Image'),
    Value: function (value) {
      this._value = value;
      return this;
    },
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    spring: jest.fn(() => ({
      start: jest.fn(),
    })),
    decay: jest.fn(() => ({
      start: jest.fn(),
    })),
    sequence: jest.fn(),
    parallel: jest.fn(),
    stagger: jest.fn(),
    loop: jest.fn(),
    event: jest.fn(),
    createAnimatedComponent: (component) => component,
  },

  // Easing
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    quad: jest.fn(),
    cubic: jest.fn(),
    poly: jest.fn(),
    sin: jest.fn(),
    circle: jest.fn(),
    exp: jest.fn(),
    elastic: jest.fn(),
    back: jest.fn(),
    bounce: jest.fn(),
    bezier: jest.fn(),
    in: jest.fn(),
    out: jest.fn(),
    inOut: jest.fn(),
  },

  // NativeModules
  NativeModules: {
    ...mockNativeModule('StatusBarManager'),
    ...mockNativeModule('DeviceInfo'),
    ...mockNativeModule('PlatformConstants'),
  },

  // DeviceInfo
  DeviceInfo: {
    getConstants: () => ({}),
  },

  // StatusBar
  StatusBar: {
    setBarStyle: jest.fn(),
    setBackgroundColor: jest.fn(),
    setHidden: jest.fn(),
    setTranslucent: jest.fn(),
  },

  // findNodeHandle
  findNodeHandle: jest.fn(),

  // processColor
  processColor: jest.fn((color) => color),

  // PermissionsAndroid (Android only, but safe to mock)
  PermissionsAndroid: {
    PERMISSIONS: {},
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      NEVER_ASK_AGAIN: 'never_ask_again',
    },
    request: jest.fn(() => Promise.resolve('granted')),
    requestMultiple: jest.fn(() => Promise.resolve({})),
    check: jest.fn(() => Promise.resolve('granted')),
  },
};
