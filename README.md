# Herath Tours Invoice Generator Mobile App

Professional Invoice Generator App for Herath Tours.

## Features
- Create professional invoices with auto-generated numbers (HK-2026-XXX).
- Hardcoded driver details (U.K Herath).
- PDF Generation and Sharing.
- History of all invoices.
- Offline storage using AsyncStorage.

## Project Structure
- `src/screens`: UI Screens (Home, Create, Preview, History).
- `src/components`: Reusable components.
- `src/utils`: PDF generation logic.
- `src/storage`: AsyncStorage helpers.
- `src/types`: TypeScript definitions.

## How to Run

1. **Install Dependencies** (if not already installed)
   ```sh
   npm install
   ```

2. **Start the App**
   ```sh
   npx expo start
   ```
   - Scan the QR code with **Expo Go** on your phone (Android/iOS).
   - Press `a` for Android Emulator or `i` for iOS Simulator.

## Building Android APK
To generate an APK for your Android device, follow the instructions in [BUILD_GUIDE.md](./BUILD_GUIDE.md).

## Tech Stack
- React Native (Expo)
- TypeScript
- React Navigation
- AsyncStorage
- Expo Print & Sharing
