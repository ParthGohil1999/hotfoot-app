import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import "react-native-get-random-values";
import { GetCityAndAirportIataCodes } from "../../services/AmadeusApi";

const PlaceAutocomplete = ({
  onCitySelect,
  apiKey,
  type,
  modalVisible,
  setModalVisible,
  currentField,
  activeTab,
}) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCitySelect = async (data, details) => {
    if (details) {
      // console.log("Selected city data:", JSON.stringify(details, null, 2));
      // console.log("Selected city details:", details);
      setLoading(true);

      // Extract city code from address components if available
      let countryCode = "";
      if (details.address_components) {
        const setCountryCode = details.address_components.find((component) =>
          component.types.includes("country")
        );
        // if (airportComponent) {
        //   cityCode = airportComponent.short_name;
        // }
        if (setCountryCode) {
          countryCode = setCountryCode.short_name;
        }
      }

      console.log("Country Code:", countryCode);

      const response = await GetCityAndAirportIataCodes({
        keyword: details.name,
        countryCode: countryCode,
      });

      // Check if response is valid
      console.log("API Response:", response);

      // Get city IATA code
      const cityIataCode = response.data?.[0]?.iataCode;

      // Get airport IATA codes
      const airportData = response.included?.airports;
      const airportIataCodes = airportData ? Object.keys(airportData) : [];

      console.log("City IATA Code:", cityIataCode);
      console.log("Airport IATA Codes:", airportIataCodes);

      const cityDetails = {
        name: details.name,
        cityCode: cityIataCode,
        airportIataCodes: airportIataCodes,
        placeId: details.place_id,
        formattedAddress: details.formatted_address,
        coordinates: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        },
      };

      setSelectedCity(cityDetails);

      // Check if onCitySelect exists and is a function before calling it
      if (onCitySelect && typeof onCitySelect === "function") {
        onCitySelect(cityDetails);
      } else {
        console.warn("onCitySelect is not a function or not provided");
      }

      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      keyboardShouldPersistTaps="always"
    >
      <SafeAreaView
        style={styles.modalContainer}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.modalHeader} keyboardShouldPersistTaps="always">
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {currentField === "from"
              ? "Select Departure"
              : "Select Destination"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <GooglePlacesAutocomplete
          placeholder={
            currentField === "from"
              ? "Enter departure city"
              : "Enter destination city"
          }
          minLength={2}
          autoFocus={true}
          returnKeyType={"search"}
          fetchDetails={true}
          listViewDisplayed={false}
          keepResultsAfterBlur={true}
          styles={{
            container: {
              flex: 1,
              paddingHorizontal: 20,
            },
            textInputContainer: {
              backgroundColor: "#f1f1f1",
              borderRadius: 12,
              paddingHorizontal: 12,
              marginBottom: 16,
            },
            textInput: {
              height: 50,
              backgroundColor: "transparent",
              fontSize: 16,
              fontWeight: "500",
              color: "black",
            },
            predefinedPlacesDescription: {
              color: "#1faadb",
            },
            listView: {
              backgroundColor: "#fff",
            },
            separator: {
              height: 1,
              backgroundColor: "#eee",
            },
            row: {
              padding: 16,
            },
            description: {
              fontSize: 16,
            },
          }}
          enablePoweredByContainer={false}
          onPress={handleCitySelect}
          query={{
            key: apiKey,
            language: "en",
            types: type,
          }}
          debounce={300}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    gap: 20,
  },
  searchField: {
    backgroundColor: "#f1f1f1",
    padding: 16,
    borderRadius: 12,
  },
  searchLabel: {
    color: "#666",
    fontSize: 12,
    marginBottom: 4,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  searchValue: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  searchValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  travelerSubtitle: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
    marginLeft: 28,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    height: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default PlaceAutocomplete;
