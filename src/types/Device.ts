/**
 * BLE Device Type Definitions
 * Defines the structure for BLE devices and their states
 */

import { Device as BLEDevice } from "react-native-ble-plx";

export interface Device {
  id: string;
  name: string | null;
  rssi?: number | null;
  serviceUUIDs?: string[];
}

export interface DeviceWithData extends Device {
  data?: any;
  connectedAt?: Date;
}

export type BLEDeviceType = BLEDevice;
