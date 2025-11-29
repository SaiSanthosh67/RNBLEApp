/**
 * API Configuration
 * Central configuration for API endpoints and base URL
 */

export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  endpoints: {
    deviceData: "/rest/v1/device_data",
  },
  headers: {
    apiKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
    contentType: "application/json",
    prefer: "return=representation",
  },
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};
