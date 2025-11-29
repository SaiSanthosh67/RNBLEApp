module.exports = {
  // Use base config instead of react-native preset to avoid importing Flow-typed files
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/@react-navigation/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // Mock problematic ESM modules that cause parse errors
  moduleNameMapper: {
    "^react-native-ble-plx$": "<rootDir>/jest.mocks/react-native-ble-plx.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|@react-navigation|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context)/)",
  ],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react",
        },
      },
    ],
  },
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react",
      },
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/i18n/index.ts",
  ],
};
