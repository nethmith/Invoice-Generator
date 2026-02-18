import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList } from './src/types/navigation';
import HomeScreen from './src/screens/HomeScreen';
import CreateInvoiceScreen from './src/screens/CreateInvoiceScreen';
import InvoicePreviewScreen from './src/screens/InvoicePreviewScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#1a365d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: '',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateInvoice"
          component={CreateInvoiceScreen}
          options={{ title: 'New Invoice' }}
        />
        <Stack.Screen
          name="InvoicePreview"
          component={InvoicePreviewScreen}
          options={{ title: 'Invoice Preview' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Invoice History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
