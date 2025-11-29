/**
 * API Service
 * Handles all HTTP requests to the backend API (Supabase)
 * Includes retry logic and comprehensive error handling
 */

import axios, { AxiosError, AxiosInstance } from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { DeviceDataPayload, DeviceRecord } from "../types/DeviceRecord";
import logger from "../utils/logger";

class ApiService {
  private client: AxiosInstance;
  private retryCount: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        "Content-Type": API_CONFIG.headers.contentType,
        apikey: API_CONFIG.headers.apiKey,
        Authorization: `Bearer ${API_CONFIG.headers.apiKey}`,
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error("[API] Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`[API] Response: ${response.status}`);
        return response;
      },
      async (error) => {
        return this.handleError(error);
      }
    );
  }

  /**
   * Handle API errors with retry logic
   */
  private async handleError(error: AxiosError): Promise<any> {
    if (error.response) {
      // Server responded with error status
      logger.error(
        "[API] Server Error:",
        error.response.status,
        error.response.data
      );

      // Retry logic for 5xx errors
      if (
        error.response.status >= 500 &&
        this.retryCount < API_CONFIG.retryAttempts
      ) {
        this.retryCount++;
        logger.info(`[API] Retrying... Attempt ${this.retryCount}`);
        await this.delay(API_CONFIG.retryDelay * this.retryCount);
        return this.client.request(error.config!);
      }

      this.retryCount = 0;
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      // Request made but no response received
      logger.error("[API] Network Error:", error.message);
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      logger.error("[API] Error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Save device data to the API
   * POST /device-data
   */
  async saveDeviceData(payload: DeviceDataPayload): Promise<DeviceRecord> {
    try {
      logger.info("[API] Saving device data:", payload);

      const response = await this.client.post<DeviceRecord[]>(
        API_CONFIG.endpoints.deviceData,
        payload,
        {
          headers: {
            Prefer: API_CONFIG.headers.prefer,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        logger.info(
          "[API] Device data saved successfully:",
          response.data[0].id
        );
        return response.data[0];
      }

      throw new Error("No data returned from server");
    } catch (error) {
      logger.error("[API] Failed to save device data:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to save device data");
    }
  }

  /**
   * Get all device data from the API
   * GET /device-data
   */
  async getDeviceDataList(): Promise<DeviceRecord[]> {
    try {
      logger.info("[API] Fetching device data list");

      const response = await this.client.get<DeviceRecord[]>(
        API_CONFIG.endpoints.deviceData,
        {
          params: {
            select: "*",
            order: "timestamp.desc",
          },
        }
      );

      logger.info(`[API] Retrieved ${response.data.length} device records`);
      return response.data;
    } catch (error) {
      logger.error("[API] Failed to fetch device data:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch device data");
    }
  }

  /**
   * Get device data by device ID
   */
  async getDeviceDataById(deviceId: string): Promise<DeviceRecord[]> {
    try {
      logger.info("[API] Fetching device data for device:", deviceId);

      const response = await this.client.get<DeviceRecord[]>(
        API_CONFIG.endpoints.deviceData,
        {
          params: {
            select: "*",
            device_id: `eq.${deviceId}`,
            order: "timestamp.desc",
          },
        }
      );

      logger.info(
        `[API] Retrieved ${response.data.length} records for device ${deviceId}`
      );
      return response.data;
    } catch (error) {
      logger.error("[API] Failed to fetch device data by ID:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch device data by ID");
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get(API_CONFIG.endpoints.deviceData, {
        params: { select: "id", limit: 1 },
      });
      return true;
    } catch (error) {
      logger.error("[API] Connection test failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export default new ApiService();
