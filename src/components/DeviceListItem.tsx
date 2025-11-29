/**
 * Device List Item Component
 * Displays a single BLE device in a list with signal strength
 */

import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { COLORS, SPACING, FONTS } from "../utils/constants";
import { Device } from "../types/Device";

interface DeviceListItemProps {
  device: Device;
  onPress: (device: Device) => void;
}

export const DeviceListItem: React.FC<DeviceListItemProps> = ({
  device,
  onPress,
}) => {
  const getSignalStrength = (rssi: number | null | undefined): string => {
    if (!rssi) return "Unknown";
    if (rssi > -60) return "Excellent";
    if (rssi > -70) return "Good";
    if (rssi > -80) return "Fair";
    return "Weak";
  };

  const getSignalColor = (rssi: number | null | undefined): string => {
    if (!rssi) return COLORS.gray.dark;
    if (rssi > -60) return COLORS.success;
    if (rssi > -70) return COLORS.primary;
    if (rssi > -80) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(device)}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.deviceName} numberOfLines={1}>
            {device.name || "Unknown Device"}
          </Text>
          <Text style={styles.deviceId} numberOfLines={1}>
            {device.id}
          </Text>
        </View>

        <View style={styles.signalContainer}>
          <Text
            style={[
              styles.signalStrength,
              { color: getSignalColor(device.rssi) },
            ]}
          >
            {getSignalStrength(device.rssi)}
          </Text>
          <Text style={styles.rssi}>
            {device.rssi ? `${device.rssi} dBm` : "N/A"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  deviceName: {
    fontSize: FONTS.sizes.md,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  deviceId: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.tertiary,
  },
  signalContainer: {
    alignItems: "flex-end",
  },
  signalStrength: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  rssi: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.tertiary,
  },
});
