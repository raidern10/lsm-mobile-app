// app/_layout.tsx
import 'react-native-reanimated';
import React from 'react';
import { Slot, useRouter, useSegments, type Href } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Figtree_400Regular, Figtree_500Medium,
  Figtree_600SemiBold, Figtree_700Bold,
} from '@expo-google-fonts/figtree';

import { AuthProvider, useAuth } from '../src/auth/AuthContext';
import { colors } from '../src/theme';

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

// Route dijadikan konstanta bertipe Href agar lolos typed-routes Router v6
const LOGIN: Href = '/login';
const HOME: Href = '/(app)/dashboard';

function AuthGate() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    const inApp = segments[0] === '(app)';
    if (!user && inApp) router.replace(LOGIN);
    else if (user && !inApp) router.replace(HOME);
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style= fontFamily: fonts.semibold, color: colors.text >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }
  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <AuthGate />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}