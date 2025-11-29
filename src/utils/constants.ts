/**
 * Application Constants
 * Central location for all app-wide constants
 */

export const BLE_CONSTANTS = {
  // Device prefix filter - only devices starting with this will be shown
  DEVICE_PREFIX: "SOPH-",

  // Scan timeout in milliseconds
  SCAN_TIMEOUT: 10000,

  // Connection timeout in milliseconds
  CONNECTION_TIMEOUT: 5000,

  // Data read timeout in milliseconds
  READ_TIMEOUT: 3000,
};

export const PERMISSIONS = {
  BLUETOOTH_SCAN: "android.permission.BLUETOOTH_SCAN",
  BLUETOOTH_CONNECT: "android.permission.BLUETOOTH_CONNECT",
  ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
};

export const COLORS = {
  primary: "#007AFF",
  secondary: "#5856D6",
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  background: "#F2F2F7",
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    light: "#E5E5EA",
    medium: "#C7C7CC",
    dark: "#8E8E93",
  },
  text: {
    primary: "#000000",
    secondary: "#3C3C43",
    tertiary: "#8E8E93",
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};
