/**
 * Main App Component
 * Entry point of the application
 * Initializes i18n and renders the navigation stack
 */

import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { COLORS } from "./src/utils/constants";

export default function App() {
  const { i18n: i18nInstance } = useTranslation();
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    // Initialize i18n
    i18nInstance.changeLanguage("en").then(() => {
      setIsReady(true);
    });
  }, [i18nInstance]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <RootNavigator />;
}
