import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Calendar, ChevronDown, Users } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import PlaceAutocomplete from "../googleAutocomplete/placeAutocomplete";
import useTripSearchStore from "../../app/store/trpiSearchZustandStore";
import { useNavigation } from "expo-router";
import DatePickerModal from "../datePickerModal/datePickerModal";
import {
  formatFlightSearchParams,
  formatHotelSearchParams,
  searchHotels,
  searchOutboundFlights,
} from "../../services/SerpApi";
import TravelersDropdown from "../travelersDropdown";

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = ["Places", "Flights", "Hotels"];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

// Unified Search Form Component
const UnifiedSearchForm = ({ activeTab, onClose }) => {
  // Common state for all tabs
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [travelers, setTravelers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [cabinClass, setCabinClass] = useState("Economy");
  const [tripType, setTripType] = useState("Round Trip");
  const [isTravelersDropdownOpen, setIsTravelersDropdownOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { setTripTypeToStore, setDatesToStore } = useTripSearchStore();

  // Use Zustand store, rename selectedTripType to storeTripType
  const {
    setFromLocationToStore,
    setToLocationToStore,
    setTravelersToStore,
    setCabinClassToStore,
    fromLocation: selectedFromLocation,
    toLocation: selectedToLocation,
    dates: { startDate, endDate },
    travelers: { adults, children, infants },
    cabinClass: selectedCabinClass,
    tripType: storeTripType,
  } = useTripSearchStore();

  useEffect(() => {
    setTripTypeToStore(tripType);
    if (tripType === "One Way") {
      setDates((prev) => ({ ...prev, endDate: null }));
      setDatesToStore({ ...dates, endDate: null });
    }
  }, [tripType]);

  useEffect(() => {
    if (storeTripType && storeTripType !== tripType) {
      setTripType(storeTripType);
    }
  }, [storeTripType]);

  useEffect(() => {
    if (activeTab === "Hotels" || activeTab === "Places") {
      setTripType("Round Trip");
      setTripTypeToStore("Round Trip");
    }
  }, [activeTab]);

  const handleDateSelect = () => {
    setIsTravelersDropdownOpen(false);
    setIsDatePickerVisible(true);
  };

  const handleDateConfirm = (selectedDates) => {
    setDates({
      startDate: selectedDates.startDate,
      endDate: selectedDates.endDate,
    });
    setDatesToStore({
      startDate: selectedDates.startDate,
      endDate: selectedDates.endDate,
    });
    setIsDatePickerVisible(false);
  };

  const navigation = useNavigation();

  useEffect(() => {
    console.log("Selected From Location:", selectedFromLocation);
    console.log("Selected To Location:", selectedToLocation);
    console.log("Selected Dates:", { startDate, endDate });
    console.log("Selected Travelers:", { adults, children, infants });
    console.log("Selected Cabin Class:", selectedCabinClass);
    console.log("Selected Trip Type:", storeTripType);
  }, [
    selectedFromLocation,
    selectedToLocation,
    startDate,
    endDate,
    adults,
    children,
    infants,
    selectedCabinClass,
    storeTripType,
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null); // 'from' or 'to'

  const tripTypes = ["One Way", "Round Trip"];
  const cabinClasses = ["Economy", "Business", "First"];

  useEffect(() => {
    if (tripType === "One Way" && dates.endDate) {
      setDates({ ...dates, endDate: null });
    }
  }, [tripType]);

  useEffect(() => {
    return () => {
      setIsDatePickerVisible(false);
    };
  }, []);

  const getTotalTravelers = () => {
    return travelers.adults + travelers.children + travelers.infants;
  };

  const handleLocationSelect = (cityData) => {
    console.log(`Selected ${currentField}:`, cityData);
    if (currentField === "from") {
      setFromLocation(cityData);
      console.log("From Location (handleLocationSelect): ", cityData);
    } else if (currentField === "to") {
      setToLocation(cityData);
      console.log("To Location (handleLocationSelect): ", cityData);
    }
  };

  const openLocationModal = (field) => {
    setCurrentField(field);
    setIsModalVisible(true);
    setIsTravelersDropdownOpen(false);
  };

  const handleTravelersPress = () => {
    setIsTravelersDropdownOpen(!isTravelersDropdownOpen);
  };

  const isSearchDisabled = () => {
    const commonRequirements =
      !toLocation ||
      !dates.startDate ||
      (tripType === "Round Trip" && !dates.endDate);

    if (activeTab === "Flights") {
      return !fromLocation || !toLocation || commonRequirements;
    } else if (activeTab === "Places") {
      return !toLocation || !dates.startDate || !dates.endDate || !travelers;
    } else if (activeTab === "Hotels") {
      return !toLocation || !dates.startDate || !dates.endDate || !travelers;
    }

    return true;
  };

  const getSearchButtonText = () => {
    switch (activeTab) {
      case "Places":
        return "Continue";
      case "Flights":
        return "Search Flights";
      case "Hotels":
        return "Search Hotels";
      default:
        return "Search";
    }
  };

  const shouldShowField = (fieldName) => {
    switch (fieldName) {
      case "tripType":
        return activeTab === "Flights";
      case "from":
        return activeTab === "Flights" || activeTab === "Places";
      case "cabinClass":
        return activeTab === "Flights";
      default:
        return true;
    }
  };

  // Handle search button press
  const handleSearch = async () => {
    setIsTravelersDropdownOpen(false);
    setIsSearching(true);

    // Set all parameters in the Zustand store
    setFromLocationToStore(fromLocation);
    setToLocationToStore(toLocation);
    setDatesToStore(dates);
    setTravelersToStore(travelers);
    setCabinClassToStore(cabinClass);
    setTripTypeToStore(tripType);

    // Navigate based on active tab
    switch (activeTab) {
      case "Places":
        try {
          const apiParamsFlights = formatFlightSearchParams({
            fromLocation: fromLocation
              ? fromLocation.airportIataCodes.join(",")
              : "",
            toLocation: toLocation.airportIataCodes.join(","),
            dates,
            travelers,
            cabinClass,
            tripType,
          });
          const apiParamsHotels = formatHotelSearchParams({
            toLocation: toLocation.formattedAddress,
            dates,
            travelers,
          });
          console.log("API Params Flights:", apiParamsFlights);
          const flightResults = await searchOutboundFlights(apiParamsFlights);
          const hotelResults = await searchHotels(apiParamsHotels);
          navigation.navigate("place/cityDetails", {
            flightResults: JSON.stringify(flightResults),
            hotelResults: JSON.stringify(hotelResults),
            searchDataFlights: JSON.stringify(apiParamsFlights),
            searchDataHotels: JSON.stringify(apiParamsHotels),
          });
          onClose();
        } catch (error) {
          console.error("Flight or Hotel search error:", error);
          Alert.alert(
            "Error",
            "Failed to search for flights or hotels. Please try again."
          );
        } finally {
          setIsSearching(false);
        }
        break;

      case "Flights":
        const searchData = {
          fromLocation: fromLocation.airportIataCodes.join(","),
          toLocation: toLocation.airportIataCodes.join(","),
          dates,
          travelers,
          cabinClass,
          tripType,
        };
        console.log("Search Data:", searchData);
        try {
          const apiParams = formatFlightSearchParams(searchData);
          const flightResults = await searchOutboundFlights(apiParams);
          navigation.navigate("flightDetails/index", {
            flightResults: JSON.stringify(flightResults),
            searchData: JSON.stringify(apiParams),
          });
          onClose();
        } catch (error) {
          console.error("Flight search error:", error);
          Alert.alert(
            "Error",
            "Failed to search for flights. Please try again."
          );
        } finally {
          setIsSearching(false);
        }
        break;

      case "Hotels":
        const searchDataHotels = {
          toLocation: toLocation.formattedAddress,
          dates,
          travelers,
        };
        try {
          const apiParams = formatHotelSearchParams(searchDataHotels);
          const hotelResults = await searchHotels(apiParams);
          navigation.navigate("hotel/results", {
            hotelResults: JSON.stringify(hotelResults),
            searchData: JSON.stringify(apiParams),
          });
          onClose();
        } catch (error) {
          console.error("Hotel search error:", error);
          Alert.alert(
            "Error",
            "Failed to search for hotels. Please try again."
          );
        } finally {
          setIsSearching(false);
        }
        break;

      default:
        console.warn("Unknown tab:", activeTab);
        setIsSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      {isTravelersDropdownOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setIsTravelersDropdownOpen(false);
          }}
        />
      )}
      <ScrollView
        style={styles.scrollView}
        scrollEnabled={!isTravelersDropdownOpen}
      >
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.header}
        >
          <Text style={styles.title}>
            {activeTab === "Places" && "Discover amazing destinations"}
            {activeTab === "Flights" && "Find and book your next flight"}
            {activeTab === "Hotels" && "Find the perfect place to stay"}
          </Text>
        </Animated.View>

        {shouldShowField("tripType") && (
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            style={styles.tripTypeContainer}
          >
            {tripTypes.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.tripTypeButton,
                  tripType === type && styles.selectedTripType,
                ]}
                onPress={() => {
                  setTripType(type);
                  setIsTravelersDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.tripTypeText,
                    tripType === type && styles.selectedTripTypeText,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInUp.delay(600).springify()}
          style={styles.searchContainer}
        >
          {shouldShowField("from") && (
            <Pressable
              style={styles.searchField}
              onPress={() => openLocationModal("from")}
            >
              <Text style={styles.searchLabel}>From</Text>
              <Text style={styles.searchValue}>
                {fromLocation
                  ? `${fromLocation.name} (${fromLocation.cityCode})`
                  : "Select departure"}
              </Text>
            </Pressable>
          )}

          <Pressable
            style={styles.searchField}
            onPress={() => openLocationModal("to")}
          >
            <Text style={styles.searchLabel}>To</Text>
            <Text style={styles.searchValue}>
              {toLocation
                ? `${toLocation.name} (${toLocation.cityCode})`
                : "Select destination"}
            </Text>
          </Pressable>

          <Pressable style={styles.searchField} onPress={handleDateSelect}>
            <Text style={styles.searchLabel}>
              {tripType === "One Way" ? "Departure Date" : "Dates"}
            </Text>
            <View style={styles.searchValueContainer}>
              <Calendar size={20} color="#666" />
              <Text style={styles.searchValue}>
                {dates.startDate
                  ? tripType === "One Way"
                    ? dates.startDate
                    : dates.endDate
                    ? `${dates.startDate} - ${dates.endDate}`
                    : dates.startDate
                  : tripType === "One Way"
                  ? "Select departure"
                  : "Select dates"}
              </Text>
            </View>
          </Pressable>

          <View
            style={[
              styles.travelersContainer,
              isTravelersDropdownOpen && styles.travelersContainerActive,
            ]}
          >
            <Pressable
              style={[styles.searchField]}
              onPress={handleTravelersPress}
            >
              <Text style={styles.searchLabel}>Travelers & Class</Text>
              <View style={styles.searchValueContainer}>
                <Users size={20} color="#666" />
                <Text style={styles.searchValue}>
                  {`${getTotalTravelers()} Traveler${
                    getTotalTravelers() > 1 ? "s" : ""
                  }`}
                </Text>
                <ChevronDown
                  size={20}
                  color="#666"
                  style={[
                    styles.chevron,
                    isTravelersDropdownOpen && styles.chevronUp,
                  ]}
                />
              </View>
            </Pressable>
            {isTravelersDropdownOpen && (
              <TravelersDropdown
                travelers={travelers}
                setTravelers={setTravelers}
              />
            )}
          </View>
        </Animated.View>

        {shouldShowField("cabinClass") && (
          <Animated.View
            entering={FadeInUp.delay(800).springify()}
            style={styles.cabinClassContainer}
          >
            {cabinClasses.map((cabin) => (
              <Pressable
                key={cabin}
                style={[
                  styles.cabinClassButton,
                  cabinClass === cabin && styles.selectedCabinClass,
                ]}
                onPress={() => {
                  setCabinClass(cabin);
                  setIsTravelersDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.cabinClassText,
                    cabinClass === cabin && styles.selectedCabinClassText,
                  ]}
                >
                  {cabin}
                </Text>
              </Pressable>
            ))}
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(1000).springify()}>
          <Pressable
            style={[
              styles.searchButton,
              isSearchDisabled() || isSearching
                ? styles.searchButtonDisabled
                : styles.searchButtonEnabled,
            ]}
            disabled={isSearchDisabled() || isSearching}
            onPress={handleSearch}
          >
            <View style={styles.searchButtonContent}>
              <Text
                style={[
                  styles.searchButtonText,
                  (isSearchDisabled() || isSearching) &&
                    styles.searchButtonTextDisabled,
                ]}
              >
                {getSearchButtonText()}
              </Text>
              {isSearching && (
                <LottieView
                  source={require("../../constants/loading-lottie.json")}
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
              )}
            </View>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Place Autocomplete Modal */}
      {isModalVisible && (
        <PlaceAutocomplete
          apiKey={process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY}
          onCitySelect={handleLocationSelect}
          type={"(cities)"}
          modalVisible={isModalVisible}
          setModalVisible={setIsModalVisible}
          currentField={currentField}
        />
      )}

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSelectDates={handleDateConfirm}
        activeTab={activeTab}
        tripType={tripType}
        initialDates={dates}
      />
    </View>
  );
};

const TripSearchPage = ({ tabName, onClose }) => {
  const [activeTab, setActiveTab] = useState(tabName);
  console.log("Active Tab:", activeTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <UnifiedSearchForm activeTab={activeTab} onClose={onClose} />
    </SafeAreaView>
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
    position: "relative",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    fontWeight: "600",
    color: "black",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    position: "relative",
    zIndex: 2,
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    lineHeight: 40,
  },
  tripTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  tripTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
  },
  selectedTripType: {
    backgroundColor: "black",
  },
  tripTypeText: {
    color: "black",
    fontSize: 14,
  },
  selectedTripTypeText: {
    color: "white",
    fontWeight: "600",
  },
  searchContainer: {
    padding: 20,
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
  travelersContainer: {
    position: "relative",
    zIndex: 3,
  },
  travelersContainerActive: {
    margin: -16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chevron: {
    transform: [{ rotate: "0deg" }],
  },
  chevronUp: {
    transform: [{ rotate: "180deg" }],
  },
  cabinClassContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 10,
  },
  cabinClassButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
  },
  selectedCabinClass: {
    backgroundColor: "#333",
  },
  cabinClassText: {
    color: "#666",
    fontSize: 14,
  },
  selectedCabinClassText: {
    color: "#fff",
    fontWeight: "600",
  },
  searchButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  searchButtonDisabled: {
    backgroundColor: "#f1f1f1",
  },
  searchButtonEnabled: {
    backgroundColor: "black",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  searchButtonTextDisabled: {
    color: "#666",
  },
  searchButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  lottieAnimation: {
    width: 24,
    height: 24,
  },
});

export default TripSearchPage;
