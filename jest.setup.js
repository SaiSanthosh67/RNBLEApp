// Jest setup file
// Configure testing environment

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str) => str,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

// Mock react-native (complete mock without trying to require actual)
jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
    Version: 31,
    select: (obj) => obj.android,
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      BLUETOOTH_SCAN: "android.permission.BLUETOOTH_SCAN",
      BLUETOOTH_CONNECT: "android.permission.BLUETOOTH_CONNECT",
      ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
    },
    RESULTS: {
      GRANTED: "granted",
      DENIED: "denied",
      BLOCKED: "blocked",
    },
    requestMultiple: jest.fn(() => Promise.resolve({})),
    request: jest.fn(() => Promise.resolve("granted")),
    check: jest.fn(() => Promise.resolve("granted")),
  },
  Alert: {
    alert: jest.fn(),
  },
  useWindowDimensions: () => ({
    width: 375,
    height: 812,
  }),
  StyleSheet: {
    create: (styles) => styles,
  },
  View: "View",
  Text: "Text",
  Button: "Button",
  ScrollView: "ScrollView",
  ActivityIndicator: "ActivityIndicator",
  TouchableOpacity: "TouchableOpacity",
  AppRegistry: {
    registerComponent: jest.fn(),
  },
}));
