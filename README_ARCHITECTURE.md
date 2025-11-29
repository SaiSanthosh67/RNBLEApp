# RNBLEApp — Project Architecture

## High-Level Flow

The app implements a three-step Bluetooth Low Energy (BLE) device management flow:

### Step 1: Discover Devices
- Home screen displays two primary buttons: **"Discover Bluetooth Devices"** and **"View Old Connected Data"**
- Tapping "Discover" triggers a BLE device scan
- Discovered devices are listed and filtered by device name prefix
- User selects a device from the list

### Step 2: Connect, Read & Upload
- Device Detail screen opens for the selected device
- User taps **"Connect"** to establish a BLE connection
- User taps **"Read Data"** to read device data (sensor readings, status, etc.)
- User taps **"Upload"** to send the data to the cloud backend
- Data is packaged with device ID, name, timestamp, and sensor values, then posted to the API

### Step 3: View Cloud History
- History screen displays all previously uploaded device records
- Records are fetched from the cloud API and displayed in chronological order (newest first)
- User can refresh to pull latest records

## Project Structure

### Services
- **`src/services/bleService.ts`** — Core BLE operations: device scanning, connection, characteristic reads, disconnection
- **`src/services/apiService.ts`** — HTTP client (Axios-based) for cloud communication with retry logic and error handling

### Hooks (State Management)
- **`src/hooks/useBleScanner.ts`** — Manages BLE scan lifecycle; exposes discovered devices, scanning status, and errors
- **`src/hooks/useDeviceHistory.ts`** — Manages cloud history data fetch; exposes records, loading state, and refresh function

### Screens (UI)
- **`src/screens/HomeScreen`** — Entry point; displays discover and history buttons; lists discovered devices
- **`src/screens/DeviceDetailScreen`** — Device connection/interaction screen; manages connect, read, upload flows; displays device info and read data
- **`src/screens/HistoryScreen`** — History view; displays cloud records in a scrollable list with refresh capability

### Components
- **`src/components/Button.tsx`** — Reusable button component (primary, secondary, outline variants)
- **`src/components/DeviceListItem.tsx`** — List item for discovered devices
- **`src/components/HistoryListItem.tsx`** — List item for history records
- **`src/components/LoadingSpinner.tsx`** — Loading indicator
- **`src/components/EmptyState.tsx`** — Empty state placeholder
- **`src/components/ErrorMessage.tsx`** — Error display with retry option

### Types
- **`src/types/Device.ts`** — Device interface (id, name, RSSI, service UUIDs)
- **`src/types/DeviceRecord.ts`** — Device data record interface (device ID, name, timestamp, sensor values)

### Utilities & Config
- **`src/utils/constants.ts`** — BLE constants, colors, spacing
- **`src/utils/dateFormatter.ts`** — Date/time formatting helpers
- **`src/utils/logger.ts`** — Production-friendly logger (suppresses debug logs in production)
- **`src/config/apiConfig.ts`** — API configuration (base URL, endpoints, headers)

### Internationalization
- **`src/i18n/`** — Translation files (English `en.json`, Hindi `hi.json`)

### Navigation
- **`src/navigation/RootNavigator.tsx`** — React Navigation setup for screen stack

## Data Flow

```
HomeScreen (Discover Button)
  
useBleScanner Hook  BleService.scanForDevices()
  
[List of Devices Displayed]
  
User taps Device  DeviceDetailScreen
  
DeviceDetailScreen (Connect)
  
BleService.connectToDevice()
  
DeviceDetailScreen (Read Data)
  
BleService.readDeviceData()
  
DeviceDetailScreen (Upload)
  
ApiService.saveDeviceData()
  
Cloud Backend (Supabase)

HomeScreen (View Old Connected Data)
  
HistoryScreen
  
useDeviceHistory Hook  ApiService.getDeviceDataList()
  
[History Records Displayed]
```

## Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Native Stack)
- **BLE:** react-native-ble-plx
- **HTTP:** Axios
- **Internationalization:** i18next
- **Styling:** React Native StyleSheet
- **Language:** TypeScript

## Getting Started

### Prerequisites
- Node.js and npm (or yarn)
- Xcode (for iOS) or Android Studio (for Android)
- A physical device (BLE does not work reliably on emulators)

### Installation & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure API (edit `src/config/apiConfig.ts`):
   - Set your backend base URL
   - Provide API key and headers
   - Configure endpoint paths

3. Type-check:
   ```bash
   npm run type-check
   ```

4. Start the Metro bundler:
   ```bash
   npm start
   ```

5. Run on Android or iOS:
   ```bash
   npm run android
   # or
   npm run ios
   ```

6. Ensure Bluetooth is enabled on the physical device.
