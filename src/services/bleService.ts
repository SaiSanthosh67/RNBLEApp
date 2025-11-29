/**
 * BLE Service
 * Handles all Bluetooth Low Energy operations
 * - Device scanning with prefix filtering
 * - Device connection and disconnection
 * - Data reading from connected devices
 * - Cleanup and error handling
 */

import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";
import { Device as DeviceType } from "../types/Device";
import { BLE_CONSTANTS } from "../utils/constants";
import logger from "../utils/logger";

class BleService {
  private manager: BleManager;
  private connectedDevice: Device | null = null;

  constructor() {
    this.manager = new BleManager();
  }

  /**
   * Initialize BLE manager and check permissions
   */
  async initialize(): Promise<boolean> {
    try {
      logger.info("[BLE] Initializing BLE Service");

      // Check if Bluetooth is supported
      const state = await this.manager.state();
      logger.debug("[BLE] Bluetooth state:", state);

      if (state !== State.PoweredOn) {
        logger.warn("[BLE] Bluetooth is not powered on");
        return false;
      }

      // Request permissions on Android
      if (Platform.OS === "android") {
        const granted = await this.requestAndroidPermissions();
        if (!granted) {
          logger.error("[BLE] Required permissions not granted");
          return false;
        }
      }

      logger.info("[BLE] BLE Service initialized successfully");
      return true;
    } catch (error) {
      logger.error("[BLE] Failed to initialize BLE Service:", error);
      throw new Error("Failed to initialize Bluetooth");
    }
  }

  /**
   * Request required Android permissions
   */
  private async requestAndroidPermissions(): Promise<boolean> {
    try {
      if (Platform.OS !== "android") return true;

      const apiLevel = Platform.Version;

      if (apiLevel >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      logger.error("[BLE] Permission request failed:", error);
      return false;
    }
  }

  /**
   * Scan for BLE devices with optional prefix filtering
   * Returns devices that match the specified prefix
   */
  async scanForDevices(
    prefix: string = BLE_CONSTANTS.DEVICE_PREFIX,
    onDeviceFound: (device: DeviceType) => void
  ): Promise<void> {
    try {
      logger.info(`[BLE] Starting scan for devices with prefix: ${prefix}`);

      const discoveredDevices = new Map<string, DeviceType>();

      // Start scanning
      this.manager.startDeviceScan(
        null, // UUIDs to filter by (null for all)
        { allowDuplicates: false }, // Options
        (error, device) => {
          if (error) {
            logger.error("[BLE] Scan error:", error);
            return;
          }

          if (device && device.name) {
            // Filter by prefix
            if (prefix && !device.name.startsWith(prefix)) {
              return;
            }

            // Check if device already discovered
            if (!discoveredDevices.has(device.id)) {
              const deviceInfo: DeviceType = {
                id: device.id,
                name: device.name,
                rssi: device.rssi,
                serviceUUIDs: device.serviceUUIDs || [],
              };

              discoveredDevices.set(device.id, deviceInfo);
              logger.debug(
                "[BLE] Device found:",
                deviceInfo.name,
                deviceInfo.id
              );
              onDeviceFound(deviceInfo);
            }
          }
        }
      );

      // Auto-stop scan after timeout
      setTimeout(() => {
        this.stopScan();
        logger.info(
          `[BLE] Scan completed. Found ${discoveredDevices.size} devices`
        );
      }, BLE_CONSTANTS.SCAN_TIMEOUT);
    } catch (error) {
      logger.error("[BLE] Failed to start scan:", error);
      throw new Error("Failed to scan for devices");
    }
  }

  /**
   * Stop device scanning
   */
  stopScan(): void {
    try {
      this.manager.stopDeviceScan();
      logger.info("[BLE] Scan stopped");
    } catch (error) {
      console.error("[BLE] Failed to stop scan:", error);
    }
  }

  /**
   * Connect to a specific BLE device
   */
  async connectToDevice(deviceId: string): Promise<Device> {
    try {
      logger.info("[BLE] Connecting to device:", deviceId);

      // Disconnect any previously connected device
      if (this.connectedDevice) {
        await this.disconnect();
      }

      // Connect to the device with timeout
      const device = await Promise.race([
        this.manager.connectToDevice(deviceId),
        this.connectionTimeout(),
      ]);

      if (!device) {
        throw new Error("Connection timeout");
      }

      // Discover all services and characteristics
      await device.discoverAllServicesAndCharacteristics();

      this.connectedDevice = device;
      logger.info("[BLE] Connected successfully to:", device.name);

      return device;
    } catch (error) {
      logger.error("[BLE] Failed to connect to device:", error);
      throw new Error("Failed to connect to device");
    }
  }

  /**
   * Connection timeout helper
   */
  private connectionTimeout(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Connection timeout"));
      }, BLE_CONSTANTS.CONNECTION_TIMEOUT);
    });
  }

  /**
   * Read data from connected device
   * This simulates reading data from the device
   * In production, you would read from specific characteristics
   */
  async readDeviceData(deviceId: string): Promise<any> {
    try {
      logger.info("[BLE] Reading data from device:", deviceId);

      if (!this.connectedDevice || this.connectedDevice.id !== deviceId) {
        throw new Error("Device not connected");
      }

      // Get all services
      const services = await this.connectedDevice.services();
      logger.debug(`[BLE] Device has ${services.length} services`);

      // Simulate reading data
      // In a real app, you would read from specific characteristics
      const deviceData = {
        deviceId: this.connectedDevice.id,
        deviceName: this.connectedDevice.name,
        rssi: await this.connectedDevice.readRSSI(),
        serviceCount: services.length,
        services: services.map((s) => s.uuid),
        batteryLevel: Math.floor(Math.random() * 100), // Simulated
        temperature: (20 + Math.random() * 15).toFixed(1), // Simulated
        humidity: (40 + Math.random() * 40).toFixed(1), // Simulated
        readAt: new Date().toISOString(),
      };

      logger.info("[BLE] Data read successfully:", deviceData);
      return deviceData;
    } catch (error) {
      logger.error("[BLE] Failed to read device data:", error);
      throw new Error("Failed to read device data");
    }
  }

  /**
   * Disconnect from currently connected device
   */
  async disconnect(): Promise<void> {
    try {
      if (this.connectedDevice) {
        logger.info(
          "[BLE] Disconnecting from device:",
          this.connectedDevice.id
        );
        await this.manager.cancelDeviceConnection(this.connectedDevice.id);
        this.connectedDevice = null;
        logger.info("[BLE] Disconnected successfully");
      }
    } catch (error) {
      logger.error("[BLE] Failed to disconnect:", error);
      this.connectedDevice = null;
    }
  }

  /**
   * Check if device is connected
   */
  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  /**
   * Get currently connected device
   */
  getConnectedDevice(): Device | null {
    return this.connectedDevice;
  }

  /**
   * Cleanup BLE resources
   */
  async cleanup(): Promise<void> {
    try {
      logger.info("[BLE] Cleaning up BLE Service");
      this.stopScan();
      await this.disconnect();
      await this.manager.destroy();
      logger.info("[BLE] Cleanup completed");
    } catch (error) {
      logger.error("[BLE] Failed to cleanup:", error);
    }
  }
}

// Export singleton instance
export default new BleService();
