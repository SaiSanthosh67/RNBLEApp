/**
 * History List Item Component
 * Displays a saved device record in the history screen
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONTS } from "../utils/constants";
import { DeviceRecord } from "../types/DeviceRecord";
import { formatDate, formatTime } from "../utils/dateFormatter";

interface HistoryListItemProps {
  record: DeviceRecord;
}

export const HistoryListItem: React.FC<HistoryListItemProps> = ({ record }) => {
  const renderValue = () => {
    if (typeof record.value === "string") {
      return record.value;
    }

    if (typeof record.value === "object" && record.value !== null) {
      return JSON.stringify(record.value, null, 2);
    }

    return "No data";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.deviceName} numberOfLines={1}>
            {record.device_name}
          </Text>
          <Text style={styles.deviceId} numberOfLines={1}>
            ID: {record.device_id}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.date}>{formatDate(record.timestamp)}</Text>
          <Text style={styles.time}>{formatTime(record.timestamp)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>Device Data:</Text>
        <View style={styles.dataContent}>
          <Text style={styles.dataText} numberOfLines={5}>
            {renderValue()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  headerRight: {
    alignItems: "flex-end",
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
  date: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  time: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray.light,
    marginVertical: SPACING.md,
  },
  dataContainer: {
    marginTop: SPACING.sm,
  },
  dataLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  dataContent: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.sm,
  },
  dataText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.primary,
    fontFamily: "monospace",
  },
});
