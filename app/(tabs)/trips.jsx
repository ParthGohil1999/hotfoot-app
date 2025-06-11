import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookmarkIcon } from "lucide-react-native";
import { SearchModal } from "../../components/animatedExploreBar/SearchModal";
import TopBar from "../../components/topBar/index.js";
import { useRouter } from "expo-router";
import SkeletonLoading from "../../components/skeletonLoading/skeletonLoading.jsx";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { parse } from "date-fns";

const Trips = () => {
  const router = useRouter();
  const { user } = useUser();
  const [userTrips, setUserTrips] = useState([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getUserTrips() {
    if (!user) {
      console.log("No user logged in, skipping Firestore query");
      setUserTrips([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching trips for user:", user.id);
      const tripsQuery = query(
        collection(db, "itineraries"),
        where("clerkUserId", "==", user.id)
      );
      const querySnapshot = await getDocs(tripsQuery);

      const trips = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const startDate = parse(
          data.parameters.dates.start,
          "MMM d, yyyy",
          new Date()
        );
        const endDate = parse(
          data.parameters.dates.end,
          "MMM d, yyyy",
          new Date()
        );
        const totalNoOfDays =
          isNaN(startDate) || isNaN(endDate)
            ? 0
            : Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        const dailyPlan = data.itinerary.dailyItinerary.reduce((acc, day) => {
          acc[`day${day.day}`] = {
            places: day.activities.map((activity) => {
              const matchingPlace = data.places.find(
                (place) =>
                  place.displayName?.text === activity.place ||
                  place.name === activity.place
              );
              console.log(
                "Photo Reference:",
                matchingPlace?.photos?.[0]?.name.split("/photos/")[1]
              );
              return {
                title: activity.place,
                type: activity.type,
                duration: activity.duration,
                description: activity.description,
                travelTime: activity.travelTimeFromPrevious,
                notes: activity.notes,
                rating: matchingPlace?.rating || null,
                reviews: matchingPlace?.userRatingCount || null,
                image: matchingPlace?.photos?.[0]?.name
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${matchingPlace.photos[0].name.split(
                      "/photos/"
                    )[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
                  : "https://via.placeholder.com/400",
                transportTimes: matchingPlace?.transportTimes || null,
              };
            }),
            lunch: day.lunch
              ? {
                  title: day.lunch.place,
                  type: day.lunch.type,
                  duration: day.lunch.duration,
                  description: day.lunch.description,
                  rating:
                    data.places.find(
                      (place) =>
                        place.displayName?.text === day.lunch.place ||
                        place.name === day.lunch.place
                    )?.rating || null,
                  reviews:
                    data.places.find(
                      (place) =>
                        place.displayName?.text === day.lunch.place ||
                        place.name === day.lunch.place
                    )?.userRatingCount || null,
                  image: data.places.find(
                    (place) =>
                      place.displayName?.text === day.lunch.place ||
                      place.name === day.lunch.place
                  )?.photos?.[0]?.name
                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${
                        data.places.find(
                          (place) =>
                            place.displayName?.text === day.lunch.place ||
                            place.name === day.lunch.place
                        ).photos[0].name.split("/photos/")[1]
                      }&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
                    : "https://via.placeholder.com/400",
                  transportTimes:
                    data.places.find(
                      (place) =>
                        place.displayName?.text === day.lunch.place ||
                        place.name === day.lunch.place
                    )?.transportTimes || null,
                }
              : null,
          };
          return acc;
        }, {});

        return {
          id: doc.id,
          tripData: {
            city: {
              name: data.parameters.destination || "",
              country: data.parameters.toLocation?.country || "",
              coverImage: data.places[0]?.photos?.[0]?.name
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.places[0].photos[0].name.split(
                    "/photos/"
                  )[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
                : "https://via.placeholder.com/400",
            },
            startDate: data.parameters.dates.start || "N/A",
            endDate: data.parameters.dates.end || "N/A",
            totalNoOfDays: totalNoOfDays || 0,
            traveler: {
              title:
                getTravelerDescription(data.parameters.travelers) || "Unknown",
            },
            budget: {
              title:
                data.parameters.preferences.budget
                  ?.charAt(0)
                  .toUpperCase()
                  .concat(data.parameters.preferences.budget?.slice(1)) ||
                "Unknown",
            },
          },
          dailyPlan,
        };
      });
      setUserTrips(trips);
    } catch (err) {
      console.error("Error fetching user trips from Firestore:", err);
      setError("Failed to load trips. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const getTravelerDescription = (travelers) => {
    const total = travelers.adults + travelers.children + travelers.infants;
    if (total === 1) return "Solo Traveler";

    let description = `${travelers.adults} Adult${
      travelers.adults > 1 ? "s" : ""
    }`;
    if (travelers.children > 0) {
      description += `, ${travelers.children} Child${
        travelers.children > 1 ? "ren" : ""
      }`;
    }
    if (travelers.infants > 0) {
      description += `, ${travelers.infants} Infant${
        travelers.infants > 1 ? "s" : ""
      }`;
    }
    return description;
  };

  const handleCitySelect = () => {
    console.log("City selected");
    setSearchModalVisible(true);
  };

  const handleTripPress = (trip) => {
    console.log("Navigating to trip-details with:", JSON.stringify(trip, null, 2));
    router.push({
      pathname: "/trip-details",
      params: { tripData: JSON.stringify(trip) },
    });
  };

  useEffect(() => {
    console.log("Current user:", user ? user.id : "Not authenticated");
    getUserTrips();
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar logo text={"My Trips"} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {loading ? (
          <View style={styles.skeletonWrapper}>
            <SkeletonLoading />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={getUserTrips}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {userTrips?.length === 0 ? (
              <View style={styles.noTripsContainer}>
                <View style={styles.noTripsIconWrapper}>
                  <BookmarkIcon size={48} color="#000" />
                </View>
                <View style={styles.noTripsTitleWrapper}>
                  <Text style={styles.noTripsTitle}>No Trips</Text>
                </View>
                <View style={styles.noTripsDescriptionWrapper}>
                  <Text style={styles.noTripsDescription}>
                    Let our AI create personalized trip plans just for you.
                    Start planning now!
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.startTripButton}
                  onPress={handleCitySelect}
                >
                  <Text style={styles.startTripButtonText}>Start a Trip</Text>
                </TouchableOpacity>

                <SearchModal
                  visible={searchModalVisible}
                  onClose={() => setSearchModalVisible(false)}
                  tabName="Places"
                />
              </View>
            ) : (
              <View style={styles.tripsList}>
                {userTrips.map((trip, index) => (
                  <TouchableOpacity
                    onPress={() => handleTripPress(trip)}
                    key={index}
                    style={styles.tripItem}
                  >
                    <View style={styles.imageWrapper}>
                      <Image
                        source={{ uri: trip.tripData.city.coverImage }}
                        style={styles.tripImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.tripHeader}>
                      <Text style={styles.tripTitle}>
                        {trip.tripData.city.name}
                        {trip.tripData.city.country
                          ? `, ${trip.tripData.city.country}`
                          : ""}
                      </Text>
                      <View style={styles.tripEllipsis}>
                        {/* <EllipsisVertical size={24} color="#000" /> */}
                      </View>
                    </View>
                    <View style={styles.tripDatesWrapper}>
                      <Text style={styles.tripDates}>
                        {trip.tripData.startDate} - {trip.tripData.endDate}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 24,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  skeletonWrapper: {
    marginHorizontal: 16,
  },
  errorContainer: {
    minHeight: "95%",
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  retryButton: {
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: "black",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  retryButtonText: {
    color: "white",
  },
  noTripsContainer: {
    minHeight: "95%",
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  noTripsIconWrapper: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 48,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db", // neutral-300
  },
  noTripsTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  noTripsTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  noTripsDescriptionWrapper: {
    marginTop: 8,
    width: "80%",
  },
  noTripsDescription: {
    fontWeight: "300",
    color: "#6b7280", // neutral-500
    textAlign: "center",
  },
  startTripButton: {
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: "black",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  startTripButtonText: {
    color: "white",
  },
  tripsList: {
    width: "100%",
  },
  tripItem: {
    width: "100%",
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 8,
  },
  imageWrapper: {
    position: "relative",
  },
  tripImage: {
    height: 288, // 72 * 4 px
    borderRadius: 12,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  tripEllipsis: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  tripDatesWrapper: {
    marginTop: 8,
  },
  tripDates: {
    fontWeight: "300",
  },
});

export default Trips;
