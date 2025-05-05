import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Linking,
  Alert,
} from "react-native";
import TopBar from "../../components/topBar";
import { getJourneyDetails } from "../../services/SerpApi";
import SkeletonLoading from "../../components/skeletonLoading/skeletonLoading";

const BookingOptions = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOneWay, setIsOneWay] = useState(false);

  useEffect(() => {
    const fetchBookingOptions = async () => {
      try {
        setLoading(true);

        const oneWay = !params.returnFlight;
        setIsOneWay(oneWay);

        const outboundFlight = JSON.parse(params.outboundFlight);
        const returnFlight = oneWay ? null : JSON.parse(params.returnFlight);
        const searchParams = JSON.parse(params.searchParams);

        const response = await getJourneyDetails({
          departureId: searchParams.departure_id,
          arrivalId: searchParams.arrival_id,
          outboundDate: searchParams.outbound_date,
          returnDate: searchParams.return_date,
          bookingToken: params.bookingToken,
          type: searchParams.type,
        });

        if (!response || !response.booking_options) {
          throw new Error("No booking options available");
        }

        setBookingData({
          outbound: outboundFlight,
          return: returnFlight,
          booking_options: response.booking_options,
          search_metadata: response.search_metadata,
        });
      } catch (error) {
        console.error("Error fetching booking options:", error);
        Alert.alert("Error", error.message || "Failed to load booking options");
      } finally {
        setLoading(false);
      }
    };

    if (params.bookingToken) {
      fetchBookingOptions();
    }
  }, [params.bookingToken]);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleBookNow = () => {
    console.log("[BookingOptions] handleBookNow called");

    if (!bookingData) {
      console.error("[BookingOptions] No bookingData available");
      Alert.alert("Error", "No flight data available");
      return;
    }

    if (
      !bookingData.booking_options ||
      bookingData.booking_options.length === 0
    ) {
      console.error("[BookingOptions] No booking options available");
      Alert.alert("Error", "No booking options available");
      return;
    }

    console.log("[BookingOptions] Selected option index:", selectedOption);
    const option = bookingData.booking_options[selectedOption];
    console.log(
      "[BookingOptions] Selected option data:",
      JSON.stringify(option, null, 2)
    );

    // Handle both cases: option.together or option directly
    let bookingRequest = null;

    // Case 1: Check if booking_request is in the together object
    if (option.together?.booking_request) {
      console.log("[BookingOptions] Found booking request in together object");
      bookingRequest = option.together.booking_request;
    }
    // Case 2: Check if booking_request is in the departing object
    else if (option.departing?.booking_request) {
      console.log("[BookingOptions] Found booking request in departing object");
      bookingRequest = option.departing.booking_request;
    }
    // Case 3: Check if booking_request is in the returning object
    else if (option.returning?.booking_request) {
      console.log("[BookingOptions] Found booking request in returning object");
      bookingRequest = option.returning.booking_request;
    }
    // Case 4: Check if booking_request is directly in the option
    else if (option.booking_request) {
      console.log("[BookingOptions] Found booking request directly in option");
      bookingRequest = option.booking_request;
    }

    if (!bookingRequest) {
      console.error(
        "[BookingOptions] No booking_request found in any location"
      );
      Alert.alert(
        "Error",
        "Booking information is not available for this option"
      );
      return;
    }

    try {
      console.log("[BookingOptions] Constructing booking URL...");
      const baseUrl = bookingRequest.url;
      const postData = bookingRequest.post_data;

      if (!baseUrl) {
        throw new Error("Missing booking URL");
      }

      const fullUrl = postData ? `${baseUrl}?${postData}` : baseUrl;
      console.log("[BookingOptions] Full booking URL:", fullUrl);

      console.log("[BookingOptions] Attempting to open URL...");
      Linking.openURL(fullUrl).catch((err) => {
        console.error("[BookingOptions] Failed to open booking URL:", err);
        Alert.alert("Error", "Could not open booking page");
      });
    } catch (error) {
      console.error("[BookingOptions] Error constructing booking URL:", error);
      Alert.alert("Error", "Failed to process booking request");
    }
  };

  const renderFlightCard = (flight, title) => (
    <View style={styles.flightCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {flight.flights.map((segment, index) => (
        <View key={index} style={styles.segment}>
          <View style={styles.airlineInfo}>
            <Image
              source={{ uri: segment.airline_logo }}
              style={styles.airlineLogo}
            />
            <Text style={styles.airlineName}>{segment.airline}</Text>
            <Text style={styles.flightNumber}>{segment.flight_number}</Text>
          </View>

          <View style={styles.timeline}>
            <View style={styles.timePlace}>
              <Text style={styles.time}>
                {formatTime(segment.departure_airport.time)}
              </Text>
              <Text style={styles.airportCode}>
                {segment.departure_airport.id}
              </Text>
            </View>

            <View style={styles.duration}>
              <Text style={styles.durationText}>
                {formatDuration(segment.duration)}
              </Text>
              <View style={styles.durationLine} />
              <Text style={styles.aircraft}>{segment.airplane}</Text>
            </View>

            <View style={styles.timePlace}>
              <Text style={styles.time}>
                {formatTime(segment.arrival_airport.time)}
              </Text>
              <Text style={styles.airportCode}>
                {segment.arrival_airport.id}
              </Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.flightFooter}>
        <Text style={styles.totalDuration}>
          Total: {formatDuration(flight.total_duration)}
        </Text>
        <Text style={styles.price}>${flight.price}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <SkeletonLoading />
      </SafeAreaView>
    );
  }

  if (!bookingData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No booking options available</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Select Different Flights</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar logo text="Booking Options" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Selected Flights */}
        <Text style={styles.sectionHeader}>Your Selected Flights</Text>
        {renderFlightCard(bookingData.outbound, "Outbound Flight")}
        {!isOneWay && renderFlightCard(bookingData.return, "Return Flight")}

        {/* Booking Options */}
        <Text style={styles.sectionHeader}>Booking Options</Text>
        {bookingData.booking_options.map((option, index) => {
          console.log(`[BookingOptions] Rendering booking option ${index}`);

          // Determine which data to use (together or direct properties)
          const displayOption = option.together || option;
          const price =
            displayOption.price ||
            (option.departing?.price && option.returning?.price
              ? option.departing.price + option.returning.price
              : "N/A");

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                selectedOption === index && styles.selectedOptionCard,
              ]}
              onPress={() => {
                console.log(`[BookingOptions] Selected option ${index}`);
                setSelectedOption(index);
              }}
            >
              <View style={styles.optionHeader}>
                <View style={styles.providerInfo}>
                  {displayOption.airline_logos?.map((logo, i) => (
                    <Image
                      key={i}
                      source={{ uri: logo }}
                      style={styles.optionLogo}
                      onError={(e) =>
                        console.warn(
                          `[BookingOptions] Failed to load option logo: ${e.nativeEvent.error}`
                        )
                      }
                    />
                  ))}
                  <Text style={styles.providerName}>
                    {displayOption.book_with || "Multiple Airlines"}
                  </Text>
                </View>
                <Text style={styles.optionPrice}>${price}</Text>
              </View>

              {displayOption.marketed_as && (
                <Text style={styles.flightNumbers}>
                  {Array.isArray(displayOption.marketed_as)
                    ? displayOption.marketed_as.join(" + ")
                    : displayOption.marketed_as}
                </Text>
              )}

              {(displayOption.baggage_prices ||
                option.departing?.baggage_prices ||
                option.returning?.baggage_prices) && (
                <Text style={styles.baggageInfo}>
                  Baggage:{" "}
                  {[
                    ...(displayOption.baggage_prices || []),
                    ...(option.departing?.baggage_prices || []),
                    ...(option.returning?.baggage_prices || []),
                  ].join(", ")}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Book Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
  },
  flightCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0066cc",
  },
  segment: {
    marginBottom: 16,
  },
  airlineInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  airlineLogo: {
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
  timeline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timePlace: {
    alignItems: "center",
    width: "30%",
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
  },
  airportCode: {
    fontSize: 16,
    color: "#0066cc",
    fontWeight: "bold",
  },
  duration: {
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
  aircraft: {
    fontSize: 12,
    color: "#666",
  },
  flightFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 8,
  },
  totalDuration: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0066cc",
  },
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedOptionCard: {
    borderColor: "#0066cc",
    backgroundColor: "#f5f9ff",
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066cc",
  },
  flightNumbers: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  baggageInfo: {
    fontSize: 14,
    color: "#666",
  },
  bookButton: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#0066cc",
    padding: 15,
    borderRadius: 5,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BookingOptions;
