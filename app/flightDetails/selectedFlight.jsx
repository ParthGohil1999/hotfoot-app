import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/topBar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { getReturnFlights } from "../../services/SerpApi";
import SkeletonLoading from "../../components/skeletonLoading/skeletonLoading";

const SelectedFlight = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [returnFlights, setReturnFlights] = useState([]);
  const [activeReturnTab, setActiveReturnTab] = useState("best");
  const [expandedAmenities, setExpandedAmenities] = useState({});

  useEffect(() => {
    if (params.flightData) {
      setLoading(true);
      try {
        const flightData = JSON.parse(params.flightData);
        setFlight(flightData);

        if (params.departureToken) {
          fetchReturnFlights(params.departureToken);
        }
      } catch (e) {
        console.error("Error parsing flight data:", e);
      } finally {
        setLoading(false);
      }
    }
  }, [params.flightData, params.departureToken]);

  const fetchReturnFlights = async (departureToken) => {
    try {
      setLoading(true);

      const searchParams = params.searchParams
        ? JSON.parse(params.searchParams)
        : null;
      if (!searchParams) {
        Alert.alert("Error", "Missing search parameters");
        return;
      }

      if (!searchParams.return_date) {
        Alert.alert("Error", "Return date is required for round trip flights");
        return;
      }

      const apiParams = {
        departureId: searchParams.departure_id,
        arrivalId: searchParams.arrival_id,
        outboundDate: searchParams.outbound_date,
        returnDate: searchParams.return_date,
        departureToken: departureToken,
      };

      const response = await getReturnFlights(apiParams);

      if (!response) {
        throw new Error("No response from server");
      }

      if (response.error) {
        throw new Error(response.error);
      }

      const flights = [
        ...(response.best_flights || []),
        ...(response.other_flights || []),
      ];

      setReturnFlights(flights);

      if (flights.length === 0) {
        Alert.alert("Info", "No return flights found for the selected date");
      }
    } catch (error) {
      console.error("Error fetching return flights:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to fetch return flight options"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toDateString();
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const toggleAmenities = (segmentIndex) => {
    setExpandedAmenities((prev) => ({
      ...prev,
      [segmentIndex]: !prev[segmentIndex],
    }));
  };

  const handleBookFlight = (returnFlight) => {
    if (!flight || !returnFlight) return;

    router.push({
      pathname: "/flightDetails/bookingOptions",
      params: {
        outboundFlight: JSON.stringify(flight),
        returnFlight: JSON.stringify(returnFlight),
        bookingToken: returnFlight.booking_token,
        searchParams: params.searchParams,
      },
    });
  };

  const renderFlightSegment = (segment, index) => (
    <View key={index} style={styles.segmentContainer}>
      <View style={styles.segmentHeader}>
        <Image
          source={{ uri: segment.airline_logo }}
          style={styles.airlineLogoSmall}
        />
        <Text style={styles.airlineName}>{segment.airline}</Text>
        <Text style={styles.flightNumber}>{segment.flight_number}</Text>
      </View>

      <View style={styles.segmentTimeline}>
        <View style={styles.timePlace}>
          <Text style={styles.timeText}>
            {formatTime(segment.departure_airport.time)}
          </Text>
          <Text style={styles.airportCode}>{segment.departure_airport.id}</Text>
          <Text style={styles.airportName}>
            {segment.departure_airport.name}
          </Text>
        </View>

        <View style={styles.durationLineContainer}>
          <Text style={styles.durationText}>
            {formatDuration(segment.duration)}
          </Text>
          <View style={styles.durationLine} />
          <Text style={styles.aircraftText}>{segment.airplane}</Text>
        </View>

        <View style={styles.timePlace}>
          <Text style={styles.timeText}>
            {formatTime(segment.arrival_airport.time)}
          </Text>
          <Text style={styles.airportCode}>{segment.arrival_airport.id}</Text>
          <Text style={styles.airportName}>{segment.arrival_airport.name}</Text>
        </View>
      </View>

      {segment.overnight && (
        <View style={styles.overnightBadge}>
          <Text style={styles.overnightText}>Overnight</Text>
        </View>
      )}

      {segment.extensions?.length > 0 && (
        <View>
          <TouchableOpacity
            onPress={() => toggleAmenities(index)}
            style={styles.showMoreButton}
          >
            <Text style={styles.showMoreText}>
              {expandedAmenities[index] ? "Show less" : "Show more"}
            </Text>
            <MaterialIcons
              name={
                expandedAmenities[index]
                  ? "keyboard-arrow-up"
                  : "keyboard-arrow-down"
              }
              size={20}
              color="#0066cc"
            />
          </TouchableOpacity>

          {expandedAmenities[index] && (
            <View style={styles.amenitiesContainer}>
              {segment.extensions.map((amenity, idx) => (
                <View key={idx} style={styles.amenityItem}>
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#4CAF50"
                  />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderReturnFlightOption = (returnFlight, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleBookFlight(returnFlight)}
      style={styles.flightCard}
    >
      <View style={styles.airlineInfo}>
        <Image
          source={{ uri: returnFlight.airline_logo }}
          style={styles.airlineLogo}
        />
        <Text style={styles.airlineName}>{returnFlight.airline}</Text>
      </View>

      {returnFlight.flights.map((segment, segIndex) => (
        <View key={segIndex} style={styles.flightSegment}>
          <View style={styles.timeInfo}>
            <Text style={styles.timeText}>
              {formatTime(segment.departure_airport.time)}
            </Text>
            <Text style={styles.airportCode}>
              {segment.departure_airport.id}
            </Text>
          </View>

          <View style={styles.durationInfo}>
            <Text style={styles.durationText}>
              {formatDuration(segment.duration)}
            </Text>
            <View style={styles.durationLine} />
            <Text style={styles.airplaneText}>{segment.airplane}</Text>
          </View>

          <View style={styles.timeInfo}>
            <Text style={styles.timeText}>
              {formatTime(segment.arrival_airport.time)}
            </Text>
            <Text style={styles.airportCode}>{segment.arrival_airport.id}</Text>
          </View>
        </View>
      ))}

      {returnFlight.layovers?.map((layover, layoverIndex) => (
        <View key={layoverIndex} style={styles.layoverInfo}>
          <Text style={styles.layoverText}>
            {layover.overnight ? "Overnight " : ""}Layover:{" "}
            {formatDuration(layover.duration)} at {layover.name} ({layover.id})
          </Text>
        </View>
      ))}

      <View style={styles.footerInfo}>
        <Text style={styles.totalDuration}>
          Total: {formatDuration(returnFlight.total_duration)}
        </Text>
        <Text style={styles.price}>${returnFlight.price}</Text>
      </View>

      <View style={styles.carbonInfo}>
        <Text style={styles.carbonText}>
          Carbon: {Math.round(returnFlight.carbon_emissions.this_flight / 1000)}
          kg ({returnFlight.carbon_emissions.difference_percent > 0 ? "+" : ""}
          {returnFlight.carbon_emissions.difference_percent}%)
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <SkeletonLoading />
      </SafeAreaView>
    );
  }

  if (!flight) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No flight data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar logo text="Flight Details" onBack={() => router.back()} />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.summaryContainer}>
          <Text style={styles.routeText}>
            {flight.flights[0].departure_airport.id} →{" "}
            {flight.flights[flight.flights.length - 1].arrival_airport.id}
          </Text>
          <Text style={styles.dateText}>
            {formatDate(flight.flights[0].departure_airport.time)}
          </Text>
          <Text style={styles.totalDuration}>
            Total Duration: {formatDuration(flight.total_duration)}
          </Text>
          <Text style={styles.priceText}>${flight.price}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Outbound Flight</Text>
          <Text style={styles.flightClass}>
            {flight.flights[0].travel_class}
          </Text>
        </View>

        {flight.flights.map((segment, index) =>
          renderFlightSegment(segment, index)
        )}

        {flight.layovers?.map((layover, index) => (
          <View key={index} style={styles.layoverContainer}>
            <Text style={styles.layoverText}>
              {layover.overnight ? "Overnight " : ""}Layover:{" "}
              {formatDuration(layover.duration)} at {layover.name}
            </Text>
          </View>
        ))}

        <View style={styles.carbonContainer}>
          <FontAwesome name="leaf" size={20} color="#4CAF50" />
          <Text style={styles.carbonText}>
            Carbon emissions:{" "}
            {Math.round(flight.carbon_emissions.this_flight / 1000)}kg
            {flight.carbon_emissions.difference_percent !== 0 && (
              <Text
                style={
                  flight.carbon_emissions.difference_percent > 0
                    ? styles.carbonNegative
                    : styles.carbonPositive
                }
              >
                ({flight.carbon_emissions.difference_percent > 0 ? "+" : ""}
                {flight.carbon_emissions.difference_percent}%{" "}
                {flight.carbon_emissions.difference_percent > 0
                  ? "more"
                  : "less"}{" "}
                than average)
              </Text>
            )}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Return Flight Options</Text>
        </View>

        <View style={styles.returnTabs}>
          <TouchableOpacity
            style={[
              styles.returnTab,
              activeReturnTab === "best" && styles.activeReturnTab,
            ]}
            onPress={() => setActiveReturnTab("best")}
          >
            <Text
              style={[
                styles.returnTabText,
                activeReturnTab === "best" && styles.activeReturnTabText,
              ]}
            >
              Best Options
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.returnTab,
              activeReturnTab === "other" && styles.activeReturnTab,
            ]}
            onPress={() => setActiveReturnTab("other")}
          >
            <Text
              style={[
                styles.returnTabText,
                activeReturnTab === "other" && styles.activeReturnTabText,
              ]}
            >
              Other Flights
            </Text>
          </TouchableOpacity>
        </View>

        {returnFlights.length > 0 ? (
          returnFlights.map((returnFlight, index) =>
            renderReturnFlightOption(returnFlight, index)
          )
        ) : (
          <Text style={styles.noFlightsText}>No return flights available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: "#f5f9ff",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  routeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0066cc",
  },
  dateText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 4,
  },
  totalDuration: {
    fontSize: 16,
    color: "#333",
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0066cc",
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  flightClass: {
    fontSize: 14,
    color: "#fff",
    backgroundColor: "#0066cc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  segmentContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  segmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  airlineLogoSmall: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  flightNumber: {
    fontSize: 14,
    color: "#666",
  },
  segmentTimeline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timePlace: {
    alignItems: "center",
    width: "30%",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  airportCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066cc",
  },
  airportName: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  durationLineContainer: {
    alignItems: "center",
    width: "40%",
  },
  durationText: {
    fontSize: 12,
    color: "#666",
  },
  durationLine: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 4,
  },
  aircraftText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  overnightBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ffeb3b",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  overnightText: {
    fontSize: 12,
    color: "#333",
  },
  amenitiesContainer: {
    marginTop: 8,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 4,
  },
  layoverContainer: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  layoverText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  carbonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  carbonText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  carbonPositive: {
    color: "#4CAF50",
  },
  carbonNegative: {
    color: "#F44336",
  },
  returnTabs: {
    flexDirection: "row",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  returnTab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  activeReturnTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0066cc",
  },
  returnTabText: {
    fontSize: 16,
    color: "#666",
  },
  activeReturnTabText: {
    color: "#0066cc",
    fontWeight: "bold",
  },
  flightCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  airlineInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  airlineLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  flightClass: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  flightSegment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeInfo: {
    alignItems: "center",
    width: 80,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  airportCode: {
    fontSize: 14,
    color: "#666",
  },
  durationInfo: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  durationLine: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 4,
  },
  airplaneText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  layoverInfo: {
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  layoverText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  totalDuration: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066cc",
  },
  carbonInfo: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  carbonText: {
    fontSize: 12,
    color: "#666",
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginTop: 8,
  },
  showMoreText: {
    color: "#0066cc",
    marginRight: 4,
    fontWeight: "500",
  },
  amenitiesContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 4,
  },
});

export default SelectedFlight;
