import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookmarkIcon, EllipsisVertical } from "lucide-react-native";
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
              console.log("Photo Reference:", matchingPlace?.photos?.[0]?.name.split("/photos/")[1]);
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
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${matchingPlace.photos[0].name.split("/photos/")[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
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
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.places[0].photos[0].name.split("/photos/")[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
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
      console.log("Fetched trips:", JSON.stringify(trips, null, 2));
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
    setSearchModalVisible(true);
  };

  const handleTripPress = (trip) => {
    console.log(
      "Navigating to trip-details with:",
      JSON.stringify(trip, null, 2)
    );
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
    <SafeAreaView className="flex-1 bg-white">
      <TopBar logo text={"My Trips"} />
      <ScrollView
        className="flex-1 bg-white mx-6"
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="mx-4">
            <SkeletonLoading />
          </View>
        ) : error ? (
          <View className="min-h-[95%] mx-4 my-2 items-center justify-center">
            <Text className="text-lg text-red-500">{error}</Text>
            <TouchableOpacity
              className="border px-6 py-2 bg-black h-12 rounded-lg items-center justify-center mt-10"
              onPress={getUserTrips}
            >
              <Text className="text-white">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {userTrips?.length === 0 ? (
              <View className="min-h-[95%] mx-4 my-2 items-center justify-center">
                <View className="w-24 h-24 items-center justify-center rounded-full bg-white border border-neutral-300">
                  <View className="items-center justify-center">
                    <BookmarkIcon size={48} color="#000" />
                  </View>
                </View>
                <View className="flex-row justify-between items-center mt-4">
                  <Text className="text-2xl font-semibold">No Trips</Text>
                </View>
                <View className="mt-2 w-4/5">
                  <Text className="font-light text-neutral-500 text-center">
                    Let our AI create personalized trip plans just for you.
                    Start planning now!
                  </Text>
                </View>
                <TouchableOpacity
                  className="border px-6 py-2 bg-black h-12 rounded-lg items-center justify-center mt-10"
                  onPress={handleCitySelect}
                >
                  <Text className="text-white">Start a Trip</Text>
                </TouchableOpacity>

                <SearchModal
                  visible={searchModalVisible}
                  onClose={() => setSearchModalVisible(false)}
                  tabName="Places"
                />
              </View>
            ) : (
              <View className="w-full">
                {userTrips.map((trip, index) => (
                  <TouchableOpacity
                    onPress={() => handleTripPress(trip)}
                    key={index}
                    className="w-full mb-4 rounded-lg py-2"
                  >
                    <View className="relative">
                      <Image
                        source={{ uri: trip.tripData.city.coverImage }}
                        className="h-72 rounded-lg"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="flex-row justify-between items-center mt-2">
                      <Text className="text-lg font-semibold">
                        {trip.tripData.city.name}
                        {trip.tripData.city.country
                          ? `, ${trip.tripData.city.country}`
                          : ""}
                      </Text>
                      <View className="items-center justify-center my-2">
                        <EllipsisVertical size={24} color="#000" />
                      </View>
                    </View>
                    <View className="mt-2">
                      <Text className="font-light">
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

export default Trips;
