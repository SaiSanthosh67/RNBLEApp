/**
 * HomeScreen Component
 * Main screen with two primary actions:
 * 1. Discover Bluetooth Devices - Scans for BLE devices
 * 2. View Old Connected Data - Navigates to history screen
 */

import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBleScanner } from "../../hooks/useBleScanner";
import {
  Button,
  DeviceListItem,
  EmptyState,
  ErrorMessage,
} from "../../components";
import { Device } from "../../types/Device";
import { COLORS } from "../../utils/constants";
import { styles } from "./styles";

type RootStackParamList = {
  Home: undefined;
  DeviceDetail: { device: Device };
  History: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { devices, isScanning, error, startScan, stopScan, clearDevices } =
    useBleScanner();

  const handleDiscoverDevices = async () => {
    clearDevices();
    await startScan();
  };

  const handleViewHistory = () => {
    navigation.navigate("History");
  };

  const handleDevicePress = (device: Device) => {
    stopScan();
    navigation.navigate("DeviceDetail", { device });
  };

  const renderDeviceItem = ({ item }: { item: Device }) => (
    <DeviceListItem device={item} onPress={handleDevicePress} />
  );

  const renderScanningIndicator = () => (
    <View style={styles.scanningContainer}>
      <ActivityIndicator size="small" color={COLORS.primary} />
      <Text style={styles.scanningText}>{t("home.scanning")}</Text>
    </View>
  );

  const renderDevicesList = () => {
    if (error) {
      return <ErrorMessage message={error} onRetry={handleDiscoverDevices} />;
    }

    if (devices.length === 0 && !isScanning) {
      return (
        <EmptyState
          title={t("home.noDevices")}
          message={t("home.noDevicesMessage")}
          icon="📱"
        />
      );
    }

    if (devices.length === 0 && isScanning) {
      return renderScanningIndicator();
    }

    return (
      <>
        {isScanning && renderScanningIndicator()}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t("home.foundDevices", { count: devices.length })}
          </Text>
          <Text style={styles.deviceCount}>{devices.length}</Text>
        </View>
        <FlatList
          data={devices}
          renderItem={renderDeviceItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={styles.deviceList}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("home.title")}</Text>
        <Text style={styles.headerSubtitle}>{t("home.subtitle")}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <Button
            title={t("home.discoverButtonLabel")}
            onPress={handleDiscoverDevices}
            variant="primary"
            loading={isScanning}
            disabled={isScanning}
            fullWidth
          />
          <Button
            title={t("home.historyButtonLabel")}
            onPress={handleViewHistory}
            variant="secondary"
            fullWidth
          />
        </View>

        <View style={styles.devicesSection}>{renderDevicesList()}</View>
      </View>
    </SafeAreaView>
  );
};
