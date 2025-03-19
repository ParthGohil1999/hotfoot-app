import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
// import 'react-native-reanimated';
import "../global.css";



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack initialRouteName='onboarding/index' options={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/index" options={{ headerShown: false }} />
      <Stack.Screen name="preferences/travelPreferences" options={{ headerShown: false }} />
      <Stack.Screen name="preferences/personalTouch" options={{ headerShown: false }} />
      <Stack.Screen name="preferences/allSet" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="hotel/[id]" options={{ headerShown: false, headerTitle: '' }} />
      <Stack.Screen name="hotel/dummyPage" options={{ headerShown: false, headerTitle: '' }} />
      <Stack.Screen name="place/cityDetails" options={{ headerShown: false, headerTitle: '' }} />
    </Stack>


  );
}





