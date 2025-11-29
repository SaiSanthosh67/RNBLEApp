/**
 * useBleScanner Hook
 * Custom hook for managing BLE device scanning
 */

import { useCallback, useEffect, useState } from "react";
import bleService from "../services/bleService";
import { Device } from "../types/Device";
import { BLE_CONSTANTS } from "../utils/constants";
import logger from "../utils/logger";

interface UseBleScanner {
  devices: Device[];
  isScanning: boolean;
  error: string | null;
  startScan: () => Promise<void>;
  stopScan: () => void;
  clearDevices: () => void;
}

export const useBleScanner = (
  prefix: string = BLE_CONSTANTS.DEVICE_PREFIX
): UseBleScanner => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      bleService.stopScan();
    };
  }, []);

  const startScan = useCallback(async () => {
    try {
      setError(null);
      setDevices([]);
      setIsScanning(true);

      const initialized = await bleService.initialize();
      if (!initialized) {
        throw new Error("Failed to initialize Bluetooth");
      }

      await bleService.scanForDevices(prefix, (device) => {
        setDevices((prev) => {
          const exists = prev.some((d) => d.id === device.id);
          if (exists) return prev;
          return [...prev, device];
        });
      });

      setTimeout(() => {
        setIsScanning(false);
      }, BLE_CONSTANTS.SCAN_TIMEOUT);
    } catch (err) {
      logger.error("[useBleScanner] Scan error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to scan for devices"
      );
      setIsScanning(false);
    }
  }, [prefix]);

  const stopScan = useCallback(() => {
    bleService.stopScan();
    setIsScanning(false);
  }, []);

  const clearDevices = useCallback(() => {
    setDevices([]);
    setError(null);
  }, []);

  return {
    devices,
    isScanning,
    error,
    startScan,
    stopScan,
    clearDevices,
  };
};
