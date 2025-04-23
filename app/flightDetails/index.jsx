import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/topBar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const FlightDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("best");
  // const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    if (params.flightResults) {
      try {
        let parsedData;

        if (typeof params.flightResults === "object") {
          parsedData = params.flightResults;
        } else if (typeof params.flightResults === "string") {
          parsedData = JSON.parse(params.flightResults);
          console.log("Parsed flight results:", parsedData);
        } else {
          throw new Error("Invalid flight results format");
        }

        setFlightData(parsedData);

        setLoading(false);
      } catch (error) {
        console.error("Error processing flight data:", error);
        Alert.alert("Error", "Failed to load flight data");
        router.back();
      }
    }
  }, [params.flightResults]);

  const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: "short", month: "short", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const handleFlightPress = (flight) => {
    if (flightData.search_parameters.type === "2") {
      router.push({
        pathname: "/flightDetails/bookingOptions",
        params: {
          outboundFlight: JSON.stringify(flight),
          bookingToken: flight.booking_token,
          searchParams: JSON.stringify(flightData.search_parameters),
          isOneWay: "true",
        },
      });
    } else {
      router.push({
        pathname: "/flightDetails/selectedFlight",
        params: {
          flightData: JSON.stringify(flight),
          departureToken: flight.departure_token,
          searchParams: JSON.stringify(flightData.search_parameters),
          isOneWay: "false",
        },
      });
    }
  };

  const renderFlightSegment = (segment, isLastSegment) => {
    return (
      <View
        key={`${segment.departure_airport.id}-${segment.arrival_airport.id}`}
      >
        <View style={styles.flightSegment}>
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
            <View style={styles.durationLineContainer}>
              <View style={styles.durationLineDot} />
              <View style={styles.durationLine} />
              <MaterialIcons name="flight" size={18} color="#666" />
            </View>
            <Text style={styles.flightNumber}>
              {segment.airline} {segment.flight_number}
            </Text>
          </View>

          <View style={styles.timeInfo}>
            <Text style={styles.timeText}>
              {formatTime(segment.arrival_airport.time)}
            </Text>
            <Text style={styles.airportCode}>{segment.arrival_airport.id}</Text>
          </View>
        </View>

        {!isLastSegment && segment.layover && (
          <View style={styles.layoverInfo}>
            <Text style={styles.layoverText}>
              {segment.layover.duration > 60 ? "Long " : ""}
              Layover: {formatDuration(segment.layover.duration)} at{" "}
              {segment.layover.name} ({segment.layover.id})
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderFlightCard = (flight, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleFlightPress(flight)}
        style={styles.flightCard}
      >
        <View style={styles.airlineHeader}>
          {flight.airline_logo && (
            <Image
              source={{ uri: flight.airline_logo }}
              style={styles.airlineLogo}
            />
          )}
          <View style={styles.airlineTextContainer}>
            <Text style={styles.airlineName}>
              {flight.flights[0]?.airline || "Multiple Airlines"}
            </Text>
            <Text style={styles.flightType}>{flight.type}</Text>
          </View>
          <Text style={styles.price}>${flight.price}</Text>
        </View>

        {flight.flights.map((segment, idx) =>
          renderFlightSegment(segment, idx === flight.flights.length - 1)
        )}

        <View style={styles.flightFooter}>
          <Text style={styles.totalDuration}>
            Total duration: {formatDuration(flight.total_duration)}
          </Text>

          {flight.carbon_emissions && (
            <View style={styles.carbonContainer}>
              <FontAwesome name="leaf" size={14} color="#4CAF50" />
              <Text style={styles.carbonText}>
                {Math.round(flight.carbon_emissions.this_flight / 1000)} kg CO₂
                {flight.carbon_emissions.difference_percent !== 0 && (
                  <Text>
                    {" "}
                    ({flight.carbon_emissions.difference_percent > 0 ? "+" : ""}
                    {flight.carbon_emissions.difference_percent}%)
                  </Text>
                )}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar logo text={"Available Flights"} />
        <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!flightData) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar logo text={"Available Flights"} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No flight data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar logo text={"Available Flights"} />

      {/* Search Summary */}
      <View style={styles.searchSummary}>
        <Text style={styles.summaryText}>
          {flightData?.search_parameters?.departure_id || "N/A"} →{" "}
          {flightData?.search_parameters?.arrival_id || "N/A"}
        </Text>
        <Text style={styles.summaryDate}>
          {formatDate(flightData?.search_parameters?.outbound_date)}
          {flightData?.search_parameters?.return_date &&
            ` - ${formatDate(flightData?.search_parameters?.return_date)}`}
        </Text>
        <Text style={styles.summaryPassengers}>
          {flightData?.search_parameters?.adults || 1} Adult
          {flightData?.search_parameters?.children
            ? `, ${flightData?.search_parameters?.children} Children`
            : ""}
          {flightData?.search_parameters?.infants
            ? `, ${flightData?.search_parameters?.infants} Infant`
            : ""}
        </Text>
      </View>

      {/* Price Insights */}
      {flightData.price_insights && (
        <View style={styles.priceInsights}>
          <Text style={styles.priceInsightsTitle}>Price Insights</Text>
          <View style={styles.priceRangeContainer}>
            <Text style={styles.priceRangeText}>
              Typical price: ${flightData.price_insights.typical_price_range[0]}{" "}
              - ${flightData.price_insights.typical_price_range[1]}
            </Text>
            <Text
              style={[
                styles.priceLevel,
                flightData.price_insights.price_level === "low" &&
                  styles.priceLevelLow,
                flightData.price_insights.price_level === "high" &&
                  styles.priceLevelHigh,
              ]}
            >
              {flightData.price_insights.price_level} price
            </Text>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "best" && styles.activeTab]}
          onPress={() => setActiveTab("best")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "best" && styles.activeTabText,
            ]}
          >
            Best Flights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "other" && styles.activeTab]}
          onPress={() => setActiveTab("other")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "other" && styles.activeTabText,
            ]}
          >
            Other Options
          </Text>
        </TouchableOpacity>
      </View>

      {/* Flights List */}
      <ScrollView style={styles.scrollView}>
        {activeTab === "best" ? (
          flightData.best_flights?.length > 0 ? (
            flightData.best_flights.map(renderFlightCard)
          ) : (
            <Text style={styles.noFlightsText}>No best flights found</Text>
          )
        ) : flightData.other_flights?.length > 0 ? (
          flightData.other_flights.map(renderFlightCard)
        ) : (
          <Text style={styles.noFlightsText}>
            No other flight options available
          </Text>
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
  searchSummary: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  summaryText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  summaryDate: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  summaryPassengers: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  priceInsights: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  priceInsightsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  priceRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRangeText: {
    fontSize: 14,
    color: "#666",
  },
  priceLevel: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceLevelLow: {
    backgroundColor: "#e6f7ee",
    color: "#28a745",
  },
  priceLevelHigh: {
    backgroundColor: "#fce8e6",
    color: "#dc3545",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0066cc",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#0066cc",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  noFlightsText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#666",
  },
  flightCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  airlineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  airlineLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
    resizeMode: "contain",
  },
  airlineTextContainer: {
    flex: 1,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  flightType: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066cc",
  },
  flightSegment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  timeInfo: {
    alignItems: "center",
    minWidth: 80,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  airportCode: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  durationLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  durationLineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#666",
  },
  durationLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  flightNumber: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  layoverInfo: {
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#ccc",
  },
  layoverText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  flightFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
  },
  totalDuration: {
    fontSize: 14,
    color: "#666",
  },
  carbonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  carbonText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
});

export default FlightDetails;
