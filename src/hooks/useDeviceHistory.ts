/**
 * useDeviceHistory Hook
 * Custom hook for managing device history data
 */

import { useCallback, useEffect, useState } from "react";
import apiService from "../services/apiService";
import { DeviceRecord } from "../types/DeviceRecord";
import logger from "../utils/logger";

interface UseDeviceHistory {
  records: DeviceRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useDeviceHistory = (): UseDeviceHistory => {
  const [records, setRecords] = useState<DeviceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await apiService.getDeviceDataList();
      setRecords(data);
    } catch (err) {
      logger.error("[useDeviceHistory] Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const refresh = useCallback(async () => {
    await fetchHistory();
  }, [fetchHistory]);

  return {
    records,
    isLoading,
    error,
    refresh,
  };
};
