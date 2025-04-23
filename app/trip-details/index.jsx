import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, parse, addDays, isWithinInterval, isDate } from "date-fns";
import TripHeader from "../../components/trip-details/TripHeader";
import DayLocationCard from "../../components/trip-details/DayLocationCard";
import { PencilLine } from "lucide-react-native";

const formatDate = (date) => {
  if (!isDate(date)) return "";
  return format(date, "MMMM d");
};

const parseTripDate = (dateString) => {
  if (!dateString) return new Date(NaN);
  return parse(dateString, "MMMM d, yyyy", new Date());
};

const getDateRange = (startDate, endDate) => {
  const start = parseTripDate(startDate);
  const end = parseTripDate(endDate);

  if (!isDate(start) || !isDate(end)) return [];

  const dates = [];
  let currentDate = start;

  while (isWithinInterval(currentDate, { start, end })) {
    dates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};

const TripDetails = () => {
  const router = useRouter();

  const { tripData } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("day1");

  useEffect(() => {
    if (tripData) {
      try {
        const parsedTrip = JSON.parse(tripData);
        setTrip(parsedTrip);
        if (parsedTrip.dailyPlan) {
          setSelectedDay(Object.keys(parsedTrip.dailyPlan)[0]);
        }
      } catch (error) {
        console.error("Error parsing trip data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [tripData]);

  if (loading) {
    return (
      <SafeAreaView className="w-full flex-1 bg-white">
        <View className="m-4">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!trip) {
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
    if (!trip || !trip.dailyPlan || !trip.tripData) return null;

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
    if (!trip || !trip.dailyPlan || !selectedDay) return null;

    const dayPlan = trip.dailyPlan[selectedDay];
    if (!dayPlan) return null;

    return dayPlan.places.map((place, index) => (
      <DayLocationCard
        key={`${selectedDay}-${index}`}
        place={place}
        isLast={index === dayPlan.places.length - 1}
      />
    ));
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <TripHeader
          title={trip.tripData.city.name}
          coverImage={trip.tripData.city.coverImage}
          onBack={() => router.back()}
        />

        {/* Trip Overview */}
        <View className="px-6 pt-4">
          <Text className="text-2xl font-bold">
            {trip.tripData.city.name}, {trip.tripData.city.country}
          </Text>
          <Text className="text-gray-500 mt-1">
            {trip.tripData.startDate} - {trip.tripData.endDate} •{" "}
            {trip.tripData.totalNoOfDays} days
          </Text>

          <View className="flex-row mt-4 gap-x-2">
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-sm">{trip.tripData.traveler.title}</Text>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-sm">{trip.tripData.budget.title}</Text>
            </View>
          </View>
        </View>

        <View className="mt-4 w-96 h-72 mx-auto rounded-xl overflow-hidden">
          <Image
            className="w-full h-full rounded-xl"
            source={{
              uri: "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/map/mapImage.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbWFwL21hcEltYWdlLnBuZyIsImlhdCI6MTc0Mzc4NTY2MSwiZXhwIjoxNzc1MzIxNjYxfQ.jjYYSrNx4O24jEdA9J8NV7D3uOpvNBEAyWUqqx8Skmo",
            }}
            resizeMode="cover"
          />
        </View>

        {/* Daily Itinerary */}
        <View className="mt-8">
          <ScrollView className="mb-4" horizontal>
            <View className="flex-row mx-6 gap-x-3">{renderDateButtons()}</View>
          </ScrollView>

          <View className="py-2 w-full">
            <View className="mx-5">{renderSelectedDayItinerary()}</View>
          </View>
        </View>
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
