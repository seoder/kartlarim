import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '../src/context/ThemeContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { CardProvider } from '../src/context/CardContext';
import { LockScreen } from '../src/components/LockScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootContent() {
  const { tokens, isDark } = useAppTheme();
  const { isAuthenticated } = useAuth();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    if (isAuthenticated) {
      // Specification: "Başarılı doğrulamada içerik 200 ms'de belirir (fade + 8 px yukarı kayma)"
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
      translateY.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    } else {
      opacity.value = 0;
      translateY.value = 8;
    }
  }, [isAuthenticated, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={[styles.root, { backgroundColor: tokens.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {!isAuthenticated ? (
        <LockScreen />
      ) : (
        <Animated.View style={[styles.authenticatedWrapper, animatedStyle]}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: tokens.bg },
              animation: 'slide_from_right',
              animationDuration: 280, // Specification: 280ms screen transition
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="detail" />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </Animated.View>
      )}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'IBMPlexMono-Medium': require('../assets/fonts/IBMPlexMono-Medium.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CardProvider>
            <RootContent />
          </CardProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  authenticatedWrapper: {
    flex: 1,
  },
});
