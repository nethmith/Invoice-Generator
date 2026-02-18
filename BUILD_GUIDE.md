# How to Build an Android APK

Follow these steps to generate an APK file for your Android phone.

## 1. Install EAS CLI
Execute this command in your terminal:
```bash
npm install -g eas-cli
```
*If you don't want to install it globally, you can use `npx eas-cli`.*

## 2. Login to Expo
You need an Expo account to build the app (it's free).
```bash
eas login
```
*If you don't have an account, it will ask you to create one.*

## 3. Configure the Project
Run this command to link your project to EAS:
```bash
eas build:configure
```
*Select "All" or "Android" when asked.*

## 4. Build the APK
Run this command to start the build process:
```bash
eas build -p android --profile preview
```

### What happens next?
1. The build will start on Expo's servers.
2. It will take about **10-15 minutes**.
3. Once finished, it will give you a **link to download a .apk file**.
4. Download the file and install it on your Android phone.

## Troubleshooting
- If the build asks for a **keystore**, select **generate a new keystore**.
- If it fails, check the error logs provided in the link.
