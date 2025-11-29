/**
 * DeviceDetailScreen Component
 * Handles device connection, data reading, and uploading to server
 * Flow: Connect -> Read Data -> Upload to Server
 */

import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, ErrorMessage } from "../../components";
import apiService from "../../services/apiService";
import bleService from "../../services/bleService";
import { Device } from "../../types/Device";
import { COLORS, SPACING } from "../../utils/constants";
import logger from "../../utils/logger";
import { styles } from "./styles";

type RootStackParamList = {
  Home: undefined;
  DeviceDetail: { device: Device };
  History: undefined;
};

type DeviceDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "DeviceDetail">;
  route: RouteProp<RootStackParamList, "DeviceDetail">;
};

type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reading"
  | "uploading";

export const DeviceDetailScreen: React.FC<DeviceDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { device } = route.params;

  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [deviceData, setDeviceData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    return () => {
      bleService.disconnect();
    };
  }, []);

  const handleConnect = async () => {
    try {
      setError(null);
      setConnectionState("connecting");

      await bleService.connectToDevice(device.id);
      setConnectionState("connected");
    } catch (err) {
      logger.error("[DeviceDetailScreen] Connection error:", err);
      setError(
        err instanceof Error ? err.message : t("deviceDetail.connectionError")
      );
      setConnectionState("disconnected");
    }
  };

  const handleReadData = async () => {
    try {
      setError(null);
      setConnectionState("reading");

      const data = await bleService.readDeviceData(device.id);
      setDeviceData(data);
      setConnectionState("connected");
    } catch (err) {
      logger.error("[DeviceDetailScreen] Read error:", err);
      setError(
        err instanceof Error ? err.message : t("deviceDetail.readError")
      );
      setConnectionState("connected");
    }
  };

  const handleUploadData = async () => {
    if (!deviceData) return;

    try {
      setError(null);
      setUploadSuccess(false);
      setConnectionState("uploading");

      const payload = {
        device_id: device.id,
        device_name: device.name || "Unknown Device",
        timestamp: new Date().toISOString(),
        value: deviceData,
      };

      await apiService.saveDeviceData(payload);
      setUploadSuccess(true);
      setConnectionState("connected");

      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      logger.error("[DeviceDetailScreen] Upload error:", err);
      setError(
        err instanceof Error ? err.message : t("deviceDetail.uploadError")
      );
      setConnectionState("connected");
    }
  };

  const handleDisconnect = async () => {
    await bleService.disconnect();
    setConnectionState("disconnected");
    setDeviceData(null);
  };

  const handleBack = () => {
    bleService.disconnect();
    navigation.goBack();
  };

  const renderStatusIndicator = () => {
    if (connectionState === "connecting") {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.statusText}>{t("deviceDetail.connecting")}</Text>
        </View>
      );
    }

    if (connectionState === "reading") {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.statusText}>{t("deviceDetail.readingData")}</Text>
        </View>
      );
    }

    if (connectionState === "uploading") {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.statusText}>{t("deviceDetail.uploading")}</Text>
        </View>
      );
    }

    if (connectionState === "connected") {
      return (
        <View
          style={[styles.statusContainer, { backgroundColor: COLORS.success }]}
        >
          <Text style={{ ...styles.statusText, color: COLORS.white }}>
            ✓ {t("deviceDetail.connected")}
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderDeviceInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("deviceDetail.deviceInfo")}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{t("deviceDetail.deviceName")}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {device.name || "Unknown"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{t("deviceDetail.deviceId")}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {device.id}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>
          {t("deviceDetail.connectionStatus")}
        </Text>
        <Text
          style={[
            styles.infoValue,
            {
              color:
                connectionState === "connected" ? COLORS.success : COLORS.error,
            },
          ]}
        >
          {connectionState === "connected" ? "✓ Connected" : "Disconnected"}
        </Text>
      </View>
    </View>
  );

  const renderDeviceData = () =>
    deviceData && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("deviceDetail.deviceData")}</Text>
        <ScrollView style={styles.dataContainer}>
          <Text style={styles.dataText}>
            {JSON.stringify(deviceData, null, 2)}
          </Text>
        </ScrollView>
      </View>
    );

  const renderActions = () => (
    <View style={styles.buttonContainer}>
      {connectionState === "disconnected" ? (
        <Button
          title={t("deviceDetail.connectButtonLabel")}
          onPress={handleConnect}
          variant="primary"
          fullWidth
        />
      ) : (
        <>
          <Button
            title={t("deviceDetail.readDataButtonLabel")}
            onPress={handleReadData}
            variant="primary"
            loading={connectionState === "reading"}
            disabled={
              connectionState === "reading" || connectionState === "uploading"
            }
            fullWidth
          />
          {deviceData && (
            <Button
              title={t("deviceDetail.uploadButtonLabel")}
              onPress={handleUploadData}
              variant="secondary"
              loading={connectionState === "uploading"}
              disabled={
                connectionState === "uploading" || connectionState === "reading"
              }
              fullWidth
            />
          )}
          <Button
            title={t("deviceDetail.disconnectButtonLabel")}
            onPress={handleDisconnect}
            variant="outline"
            fullWidth
          />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={{ marginBottom: SPACING.md }}
        >
          <Text style={{ fontSize: 18, color: COLORS.primary }}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("deviceDetail.title")}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContainer}
      >
        {renderStatusIndicator()}

        {uploadSuccess && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>
              ✓ {t("deviceDetail.uploadSuccess")}
            </Text>
          </View>
        )}

        {error && <ErrorMessage message={error} onRetry={handleConnect} />}

        {renderDeviceInfo()}
        {renderDeviceData()}
        {renderActions()}
      </ScrollView>
    </SafeAreaView>
  );
};
