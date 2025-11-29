/**
 * HistoryScreen Component
 * Displays previously saved device connection records
 * Allows refresh and viewing of all recorded device data
 */

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  EmptyState,
  ErrorMessage,
  HistoryListItem,
  LoadingSpinner,
} from "../../components";
import { useDeviceHistory } from "../../hooks/useDeviceHistory";
import { DeviceRecord } from "../../types/DeviceRecord";
import { styles } from "./styles";

type RootStackParamList = {
  Home: undefined;
  DeviceDetail: { device: any };
  History: undefined;
};

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "History">;
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { records, isLoading, error, refresh } = useDeviceHistory();

  const handleRefresh = async () => {
    await refresh();
  };

  const renderHistoryItem = ({ item }: { item: DeviceRecord }) => (
    <HistoryListItem record={item} />
  );

  const renderContent = () => {
    if (isLoading && records.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner message={t("history.loading")} />
        </View>
      );
    }

    if (error && records.length === 0) {
      return <ErrorMessage message={error} onRetry={handleRefresh} />;
    }

    if (records.length === 0) {
      return (
        <EmptyState
          title={t("history.noHistory")}
          message={t("history.noHistoryMessage")}
          icon="📋"
        />
      );
    }

    return (
      <FlatList
        data={records}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        scrollEnabled
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("history.title")}</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.refreshButton}
          disabled={isLoading}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
};
