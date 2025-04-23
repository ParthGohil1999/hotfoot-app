import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
// import 'react-native-reanimated';
import "../global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
    <ClerkProvider tokenCache={tokenCache}>
      <Stack
        initialRouteName="onboarding/index"
        options={{ headerShown: false }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="auth/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="preferences/travelPreferences"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="preferences/personalTouch"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="preferences/locationPermission"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="preferences/budgetSelection"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="preferences/tripReview"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="preferences/allSet"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="trip-details/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="trip-details/edit"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="hotel/[id]"
          options={{ headerShown: false, headerTitle: "" }}
        />
        <Stack.Screen
          name="hotel/dummyPage"
          options={{ headerShown: false, headerTitle: "" }}
        />
        <Stack.Screen
          name="hotel/results"
          options={{ headerShown: false, headerTitle: "" }}
        />
        <Stack.Screen
          name="place/cityDetails"
          options={{ headerShown: false, headerTitle: "" }}
        />
        <Stack.Screen
          name="flightDetails/index"
          options={{ headerShown: false, headerTitle: "" }}
        />
        <Stack.Screen
          name="flightDetails/selectedFlight"
          options={{ headerShown: false, headerTitle: "" }}
        />
        <Stack.Screen
          name="flightDetails/bookingOptions"
          options={{ headerShown: false, headerTitle: "" }}
        />
      </Stack>
    </ClerkProvider>
  );
}
