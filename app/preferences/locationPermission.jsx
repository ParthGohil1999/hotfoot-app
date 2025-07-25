import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import useUserStore from "../store/userZustandStore";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/topBar";
import BottomBarContinueBtn from "../../components/buttons/bottomBarContinueBtn";
import { MapPin } from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { getAllInfoByISO } from "iso-country-currency";
import { googleTravelCurrencies } from "@/constants/google-travel-currencies";

const LocationPermission = () => {
  const navigation = useNavigation();
  const { userId, getToken } = useAuth();
  const { setUserLocation, setLocationPermission, updateUserLocation } =
    useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleDone = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      console.log("Location permission status:", status);

      if (status !== "granted") {
        setLocationPermission("denied");
        Alert.alert(
          "Permission Denied",
          "Location permission is needed to provide location-based services.",
          [{ text: "OK" }]
        );
        return;
      }

      setLocationPermission("granted");

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log("my fulll address:", address[0].isoCountryCode);

      const countryInfo = getAllInfoByISO(address[0].isoCountryCode); 

      const userCurrency = googleTravelCurrencies[countryInfo.currency] ? countryInfo.currency : "USD";
      const userCurrencySymbol = googleTravelCurrencies[countryInfo.currency] ? countryInfo.symbol : "$";

      console.log("========>>>Country Info:", userCurrency);

      const userLocation = {
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        city: address[0]?.city || "Unknown city",
        country: address[0]?.country || "Unknown country",
        currency: userCurrency,
        currencySymbol: userCurrencySymbol,
      };

      // Save to Zustand store and Firestore
      setUserLocation(userLocation);
      await updateUserLocation(userId, getToken, userLocation);

      navigation.navigate("preferences/allSet");
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Error",
        "There was an error getting your location. Please try again.",
        [{ text: "OK" }]
      );
      setLocationPermission("denied");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setLocationPermission("denied");
    navigation.navigate("preferences/allSet");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar backarrow progress={0.75} />
      <View style={styles.container}>
        <View className="items-center justify-center my-8">
          <MapPin size={96} color="#000" />
        </View>
        <Text style={styles.title}>Enable Location Services</Text>
        <Text style={styles.description}>
          To provide you with the best experience, we need access to your
          location.
        </Text>
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>

      <BottomBarContinueBtn handleDone={handleDone} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  skipButton: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    marginVertical: 2,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
});

export default LocationPermission;
