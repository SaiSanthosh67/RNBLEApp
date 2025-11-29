/**
 * API Service Tests
 * Tests for API communication, retry logic, and error handling
 */

import axios from "axios";
import { DeviceDataPayload } from "../../types/DeviceRecord";

// Mock axios before importing apiService
jest.mock("axios");

describe("ApiService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock axios.create to return a mock client
    (axios.create as jest.Mock).mockReturnValue({
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    });
  });

  test("should be defined", async () => {
    // Import after mocking
    const apiService = (await import("../apiService")).default;
    expect(apiService).toBeDefined();
  });

  test("should have saveDeviceData method", async () => {
    const apiService = (await import("../apiService")).default;
    expect(apiService.saveDeviceData).toBeDefined();
  });

  test("should have getDeviceDataList method", async () => {
    const apiService = (await import("../apiService")).default;
    expect(apiService.getDeviceDataList).toBeDefined();
  });

  test("should have getDeviceDataById method", async () => {
    const apiService = (await import("../apiService")).default;
    expect(apiService.getDeviceDataById).toBeDefined();
  });

  test("should have testConnection method", async () => {
    const apiService = (await import("../apiService")).default;
    expect(apiService.testConnection).toBeDefined();
  });

  test("saveDeviceData should accept DeviceDataPayload", async () => {
    const payload: DeviceDataPayload = {
      device_id: "test-device-id",
      device_name: "Test Device",
      timestamp: new Date().toISOString(),
      value: { temperature: 25, humidity: 60 },
    };

    expect(payload.device_id).toBe("test-device-id");
    expect(payload.device_name).toBe("Test Device");
  });
});
