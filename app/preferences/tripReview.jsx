import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import useTripSearchStore from "../store/trpiSearchZustandStore";
import useTravelPreferencesStore from "../store/travelPreferencesZustandStore";
import useItineraryStore from "../store/itineraryZustandStore";
import TopBar from "../../components/topBar";
import BottomBarContinueBtn from "../../components/buttons/bottomBarContinueBtn";
import { useRouter } from "expo-router";
import DatePickerModal from "../../components/datePickerModal/datePickerModal";
import SkeletonLoading from "../../components/skeletonLoading/skeletonLoading";
import { useUser } from "@clerk/clerk-expo";
import TravelersDropdown from "../../components/travelersDropdown";
import { generateItinerary } from "../../services/ItineraryApi";

const ReviewSummaryScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTravelersDropdownOpen, setIsTravelersDropdownOpen] = useState(false);

  const {
    toLocation,
    dates,
    travelers,
    tripType,
    setDatesToStore,
    setTravelersToStore,
  } = useTripSearchStore();
  const { selectedButtons, budgetPreference } = useTravelPreferencesStore();
  const { setGeneratedPlaces, setGeneratedItinerary, setTripParameters } =
    useItineraryStore();

  useEffect(() => {
    if (
      !(
        (toLocation?.geoCode?.latitude && toLocation?.geoCode?.longitude) ||
        (toLocation?.coordinates?.latitude &&
          toLocation?.coordinates?.longitude)
      )
    ) {
      console.warn("Invalid toLocation on mount:", toLocation);
      Alert.alert(
        "Error",
        "Destination data is incomplete. Please select a destination."
      );
    }
  }, [toLocation]);

  const generateTrip = async () => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to generate an itinerary.",
        [
          { text: "Sign In", onPress: () => router.push("/login") },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    if (
      !(
        (toLocation?.geoCode?.latitude && toLocation?.geoCode?.longitude) ||
        (toLocation?.coordinates?.latitude &&
          toLocation?.coordinates?.longitude)
      )
    ) {
      Alert.alert("Error", "Please select a destination");
      return;
    }
    if (!dates.startDate || !dates.endDate) {
      Alert.alert("Error", "Please select travel dates");
      return;
    }

    setIsGenerating(true);

    try {
      const tripData = {
        destination: toLocation?.name || "",
        geoCode: toLocation?.geoCode || {},
        coordinates: toLocation?.coordinates || {},
        dates: {
          startDate: dates.startDate,
          endDate: dates.endDate,
          totalDays: dates.totalDays,
        },
        travelers: {
          adults: travelers.adults,
          children: travelers.children,
          infants: travelers.infants,
        },
        preferences: {
          interests: selectedButtons,
          budget: budgetPreference,
          tripType: tripType,
        },
      };

      await generateItinerary(
        tripData,
        user,
        setGeneratedPlaces,
        setGeneratedItinerary,
        setTripParameters
      );

      router.replace({
        pathname: "(tabs)/trips",
        params: {
          newlyGenerated: "true",
        },
      });
    } catch (error) {
      console.error("Error generating itinerary:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to generate itinerary. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDateConfirm = (selectedDates) => {
    setDatesToStore({
      startDate: selectedDates.startDate,
      endDate: selectedDates.endDate,
    });
    setIsDatePickerVisible(false);
  };

  const getTotalTravelers = () => {
    return travelers.adults + travelers.children + travelers.infants;
  };

  const interestEmojis = {
    "Adventure Travel": "🏞️",
    "Beach Vacations": "🏖️",
    "Road Trips": "🚗",
    "Food Tourism": "🍔",
    "Art Galleries": "🖼️",
  };

  const budgetEmojis = {
    Budget: "💲",
    Moderate: "💲💲",
    Luxury: "💎",
  };

  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonLoading />
        <Text style={styles.loadingText}>
          Finding the best places in {toLocation?.name}...
        </Text>
        <Text>We're creating your perfect itinerary based on:</Text>
        <Text>- {selectedButtons.join(", ")}</Text>
        <Text>- {budgetPreference} budget</Text>
        <Text>- {getTotalTravelers()} travelers</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <TopBar backarrow text={"Review Summary"} />

      <ScrollView style={{ marginVertical: 20 }}>
        {/* Destination Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
              <Ionicons name="location-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>Destination</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/search/destination")}
            >
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {toLocation && (
            <View style={styles.destinationContent}>
              <View style={styles.destinationDetails}>
                <Text style={styles.destinationName}>{toLocation.name}</Text>
                <View style={styles.countryContainer}>
                  <Text style={styles.countryName}>
                    {toLocation.country || tripType}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Party Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
              <Ionicons name="people-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>Party</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                setIsTravelersDropdownOpen(!isTravelersDropdownOpen)
              }
            >
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionContent}>
            {getTotalTravelers()}{" "}
            {getTotalTravelers() === 1 ? "Person" : "People"}
          </Text>

          {isTravelersDropdownOpen && (
            <View style={styles.dropdownContainer}>
              <TravelersDropdown
                travelers={travelers}
                setTravelers={(updated) => {
                  setTravelersToStore(updated);
                  setIsTravelersDropdownOpen(false);
                }}
              />
            </View>
          )}
        </View>

        {/* Trip Dates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
              <Ionicons name="calendar-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>Trip Dates</Text>
            </View>
            <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionContent}>
            {dates.startDate} to {dates.endDate}
          </Text>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
              <Ionicons name="star-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>
                {selectedButtons.length} Interests
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/preferences/travelPreferences",
                  params: { returnPath: "/preferences/tripReview" },
                })
              }
            >
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.interestsContainer}>
            {selectedButtons.map((interest, index) => (
              <View key={index} style={styles.interestButton}>
                <Text style={styles.interestText}>
                  {interest} {interestEmojis[interest] || ""}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Budget Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
              <Ionicons name="cash-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>Budget</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/preferences/budgetSelection",
                  params: { returnPath: "/preferences/tripReview" },
                })
              }
            >
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionContent}>
            {budgetPreference
              ? `${
                  budgetPreference.charAt(0).toUpperCase() +
                  budgetPreference.slice(1)
                } ${budgetEmojis[budgetPreference] || ""}`
              : "Not set"}
          </Text>
        </View>
      </ScrollView>

      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSelectDates={handleDateConfirm}
        activeTab="Places"
        tripType={tripType}
        initialDates={dates}
      />

      <BottomBarContinueBtn
        handleDone={generateTrip}
        buttonText={"Generate Trip"}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionIconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 10,
  },
  sectionContent: {
    fontSize: 15,
    color: "#333",
    marginLeft: 34,
  },
  destinationContent: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 34,
  },
  destinationDetails: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 5,
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryName: {
    fontSize: 14,
    color: "#555",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 34,
  },
  interestButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  interestText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownContainer: {
    marginLeft: 34,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 20,
    textAlign: "center",
  },
});

export default ReviewSummaryScreen;
