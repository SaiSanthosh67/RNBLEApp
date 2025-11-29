/**
 * Root Navigator
 * Configures navigation stack for the entire application
 * Three main screens: Home, DeviceDetail, History
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen/HomeScreen";
import { DeviceDetailScreen } from "../screens/DeviceDetailScreen/DeviceDetailScreen";
import { HistoryScreen } from "../screens/HistoryScreen/HistoryScreen";
import { Device } from "../types/Device";

export type RootStackParamList = {
  Home: undefined;
  DeviceDetail: { device: Device };
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
