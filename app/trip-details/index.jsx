import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, parse, addDays, isWithinInterval, isDate } from "date-fns";
import TripHeader from "../../components/trip-details/TripHeader";
import DayLocationCard from "../../components/trip-details/DayLocationCard";
import { PencilLine } from "lucide-react-native";
import MapView, { Marker } from "react-native-maps";
import { db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import useItineraryStore from "../../app/store/itineraryZustandStore";
import SkeletonLoading from "../../components/skeletonLoading/skeletonLoading";

const formatDate = (date) => {
  if (!isDate(date)) return "";
  return format(date, "MMMM d");
};

const parseTripDate = (dateString) => {
  if (!dateString || dateString === "N/A") return new Date(NaN);
  return parse(dateString, "MMMM d, yyyy", new Date());
};

const getDateRange = (startDate, endDate) => {
  const start = parseTripDate(startDate);
  const end = parseTripDate(endDate);

  if (!isDate(start) || !isDate(end)) return [];

  const dates = [];
  let currentDate = start;

  while (isWithinInterval(currentDate, { start, end }) || currentDate <= end) {
    dates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};

const TripDetails = () => {
  const router = useRouter();
  const { tripData: tripDataParam } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [fullTripData, setFullTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  const { generatedItinerary, setGeneratedItinerary } = useItineraryStore();

  useEffect(() => {
    const fetchTripData = async () => {
      setLoading(true);
      try {
        const parsedTrip = JSON.parse(tripDataParam);

        const tripId = parsedTrip.id;
        const tripDocRef = doc(db, "itineraries", tripId);
        const tripDoc = await getDoc(tripDocRef);

        if (tripDoc.exists()) {
          const tripDataFromDB = tripDoc.data();
          console.log(
            "Fetched trip data from Firestore:",
            JSON.stringify(tripDataFromDB)
          );

          const updatedTrip = {
            ...parsedTrip,
            parameters: tripDataFromDB.parameters,
            dailyPlan: tripDataFromDB.dailyPlan || parsedTrip.dailyPlan,
          };

          setFullTripData(tripDataFromDB);
          setTrip(updatedTrip);
          setGeneratedItinerary(updatedTrip);

          if (
            updatedTrip.dailyPlan &&
            Object.keys(updatedTrip.dailyPlan).length > 0
          ) {
            setSelectedDay(Object.keys(updatedTrip.dailyPlan)[0]);
          }
        } else {
          console.error("Trip not found in Firestore");
          setTrip(parsedTrip);
          setGeneratedItinerary(parsedTrip);
          if (
            parsedTrip.dailyPlan &&
            Object.keys(parsedTrip.dailyPlan).length > 0
          ) {
            setSelectedDay(Object.keys(parsedTrip.dailyPlan)[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching trip data from Firestore:", error);
        const parsedTrip = JSON.parse(tripDataParam);
        setTrip(parsedTrip);
        setGeneratedItinerary(parsedTrip);
        if (
          parsedTrip.dailyPlan &&
          Object.keys(parsedTrip.dailyPlan).length > 0
        ) {
          setSelectedDay(Object.keys(parsedTrip.dailyPlan)[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (tripDataParam) {
      fetchTripData();
    }
  }, [tripDataParam, setGeneratedItinerary]);

  useEffect(() => {
    if (generatedItinerary) {
      setTrip(generatedItinerary);
      if (
        generatedItinerary.dailyPlan &&
        Object.keys(generatedItinerary.dailyPlan).length > 0 &&
        !selectedDay
      ) {
        setSelectedDay(Object.keys(generatedItinerary.dailyPlan)[0]);
      }
    }
  }, [generatedItinerary, selectedDay]);

  if (loading) {
    return (
      <SafeAreaView className="w-full flex-1 bg-white">
        <View className="m-4">
          <SkeletonLoading />
        </View>
      </SafeAreaView>
    );
  }

  if (!trip || !trip.tripData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <TripHeader title="Itinerary" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center">
          <Text>No trip data found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderDateButtons = () => {
    if (!trip.dailyPlan) {
      console.log("No dailyPlan available");
      return null;
    }

    const dayKeys = Object.keys(trip.dailyPlan);
    const dates = getDateRange(trip.tripData.startDate, trip.tripData.endDate);

    if (dates.length !== dayKeys.length) {
      return dayKeys.map((dayKey) => (
        <TouchableOpacity
          key={dayKey}
          className={`px-6 py-2 border rounded-full ${
            selectedDay === dayKey ? "bg-black" : "border-neutral-400"
          }`}
          onPress={() => setSelectedDay(dayKey)}
        >
          <Text
            className={`font-semibold ${
              selectedDay === dayKey ? "text-white" : ""
            }`}
          >
            {dayKey.replace("day", "Day ")}
          </Text>
        </TouchableOpacity>
      ));
    }

    return dayKeys.map((dayKey, index) => {
      const date = dates[index];
      const buttonText = isDate(date)
        ? formatDate(date)
        : dayKey.replace("day", "Day ");

      return (
        <TouchableOpacity
          key={dayKey}
          className={`px-6 py-2 border rounded-full ${
            selectedDay === dayKey ? "bg-black" : "border-neutral-400"
          }`}
          onPress={() => setSelectedDay(dayKey)}
        >
          <Text
            className={`font-semibold ${
              selectedDay === dayKey ? "text-white" : ""
            }`}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const renderSelectedDayItinerary = () => {
    if (!trip.dailyPlan || !selectedDay) {
      console.log("No dailyPlan or selectedDay");
      return null;
    }

    const dayPlan = trip.dailyPlan[selectedDay];
    if (!dayPlan) {
      console.log("No dayPlan for selectedDay:", selectedDay);
      return null;
    }

    return dayPlan.places.map((place, index) => {
      return (
        <DayLocationCard
          key={`${selectedDay}-${index}`}
          place={place}
          isLast={index === dayPlan.places.length - 1}
        />
      );
    });
  };

  const coordinates = trip.parameters?.coordinates || {
    latitude: 45.764043,
    longitude: 4.835659,
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <TripHeader
          title={trip.tripData.city.name || "Unknown City"}
          coverImage={trip.tripData.city.coverImage}
          onBack={() => router.back()}
        />

        {/* Trip Overview */}
        <View className="px-6 pt-4">
          <Text className="text-2xl font-bold">
            {trip.tripData.city.name || "Unknown City"}
            {trip.tripData.city.country
              ? `, ${trip.tripData.city.country}`
              : ""}
          </Text>
          <Text className="text-gray-500 mt-1">
            {trip.tripData.startDate} - {trip.tripData.endDate} •{" "}
            {trip.tripData.totalNoOfDays || "N/A"} days
          </Text>

          <View className="flex-row mt-4 gap-x-2">
            {trip.tripData.traveler && (
              <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-sm">
                  {trip.tripData.traveler.title || "Unknown Traveler"}
                </Text>
              </View>
            )}
            {trip.tripData.budget && (
              <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-sm">
                  {trip.tripData.budget.title || "Unknown Budget"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* MapView Section */}
        <View className="mt-4 w-96 h-72 mx-auto rounded-xl overflow-hidden">
          <MapView
            style={{ width: "100%", height: "100%" }}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              }}
              title={trip.tripData.city.name || "Destination"}
              description={`Trip to ${trip.tripData.city.name}`}
            />
          </MapView>
        </View>

        {/* Daily Itinerary */}
        {trip.dailyPlan && (
          <View className="mt-8">
            <ScrollView className="mb-4" horizontal>
              <View className="flex-row mx-6 gap-x-3">
                {renderDateButtons()}
              </View>
            </ScrollView>

            <View className="py-2 w-full">
              <View className="mx-5">{renderSelectedDayItinerary()}</View>
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        className="absolute w-16 h-16 bottom-6 right-6 bg-green-500 rounded-full items-center justify-center"
        onPress={() => {
          router.push({
            pathname: "/trip-details/edit",
            params: { tripData: JSON.stringify(trip) },
          });
        }}
      >
        <PencilLine size={24} color="white" />
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

export default TripDetails;
