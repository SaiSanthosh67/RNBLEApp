/**
 * Device Record Type Definitions
 * Defines the structure for stored device data records
 */

export interface DeviceRecord {
  id: string;
  device_id: string;
  device_name: string;
  timestamp: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}

export interface DeviceDataPayload {
  device_id: string;
  device_name: string;
  timestamp: string;
  value: any;
}
