// Mock for react-native-ble-plx
module.exports = {
  BleManager: jest.fn(),
  Device: jest.fn(),
  State: {
    Unknown: 0,
    Resetting: 1,
    Unsupported: 2,
    Unauthorized: 3,
    PoweredOff: 4,
    PoweredOn: 5,
  },
  BleError: Error,
  BleErrorCode: {},
  BleAndroidErrorCode: {},
  BleIOSErrorCode: {},
  BleATTErrorCode: {},
};
