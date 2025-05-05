import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import TopBar from "../../components/topBar";
import { StatusBar } from "expo-status-bar";
import { Grip, Trash2 } from "lucide-react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useItineraryStore from "../../app/store/itineraryZustandStore";
import { db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import SkeletonLoading from "../../components/skeletonLoading/skeletonLoading";

export default function Edit() {
  const router = useRouter();
  const { tripData } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const initialTripData = useRef(null);

  const { generatedItinerary, setGeneratedItinerary, updateDailyPlan } =
    useItineraryStore();

  useEffect(() => {
    if (tripData) {
      try {
        if (typeof tripData === "string") {
          const parsedTrip = JSON.parse(tripData);
          initialTripData.current = JSON.parse(JSON.stringify(parsedTrip));
          setTrip(parsedTrip);
          setGeneratedItinerary(parsedTrip);
        } else {
          throw new Error("Invalid trip data format");
        }
      } catch (err) {
        console.error("Error parsing trip data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError("No trip data provided");
      setLoading(false);
    }
  }, [tripData, setGeneratedItinerary]);

  useEffect(() => {
    if (generatedItinerary) {
      setTrip(generatedItinerary);
    }
  }, [generatedItinerary]);

  const handleDayPlanChange = async (dayKey, newPlaces) => {
    setTrip((prevTrip) => {
      const updatedDailyPlan = {
        ...prevTrip.dailyPlan,
        [dayKey]: {
          ...prevTrip.dailyPlan[dayKey],
          places: newPlaces,
        },
      };

      const updatedTrip = {
        ...prevTrip,
        dailyPlan: updatedDailyPlan,
      };

      updateDailyPlan(dayKey, newPlaces);

      const updateFirebase = async () => {
        try {
          const tripDocRef = doc(db, "itineraries", updatedTrip.id);
          await setDoc(
            tripDocRef,
            { dailyPlan: updatedDailyPlan },
            { merge: true }
          );
          console.log("Firebase updated successfully with new place order");
        } catch (error) {
          console.error("Error updating Firebase:", error);
        }
      };
      updateFirebase();

      const hasChanges =
        JSON.stringify(updatedTrip.dailyPlan) !==
        JSON.stringify(initialTripData.current.dailyPlan);
      setHasChanges(hasChanges);

      return updatedTrip;
    });
  };

  const saveChanges = () => {
    if (trip) {
      router.replace({
        pathname: "/trip-details",
        params: { tripData: JSON.stringify(trip) },
      });
    }
  };

  const deletePlace = (dayKey, index) => {
    setTrip((prevTrip) => {
      const newPlaces = prevTrip.dailyPlan[dayKey].places.filter(
        (_, i) => i !== index
      );

      const updatedDailyPlan = {
        ...prevTrip.dailyPlan,
        [dayKey]: {
          ...prevTrip.dailyPlan[dayKey],
          places: newPlaces,
        },
      };

      const updatedTrip = {
        ...prevTrip,
        dailyPlan: updatedDailyPlan,
      };

      updateDailyPlan(dayKey, newPlaces);

      const updateFirebase = async () => {
        try {
          const tripDocRef = doc(db, "itineraries", updatedTrip.id);
          await setDoc(
            tripDocRef,
            { dailyPlan: updatedDailyPlan },
            { merge: true }
          );
          console.log("Firebase updated successfully after deleting place");
        } catch (error) {
          console.error("Error updating Firebase:", error);
        }
      };
      updateFirebase();

      const hasChanges =
        JSON.stringify(updatedTrip.dailyPlan) !==
        JSON.stringify(initialTripData.current.dailyPlan);
      setHasChanges(hasChanges);

      return updatedTrip;
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <SkeletonLoading />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 mb-4">Error: {error}</Text>
        <TouchableOpacity
          className="px-4 py-2 bg-gray-200 rounded"
          onPress={() => router.back()}
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!trip || !trip.dailyPlan) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="mb-4">No trip data available</Text>
        <TouchableOpacity
          className="px-4 py-2 bg-gray-200 rounded"
          onPress={() => router.back()}
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white p-4 pt-12">
        <TopBar text="Edit Itinerary" backarrow={true} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hasChanges ? 100 : 80 }}
        >
          {Object.entries(trip.dailyPlan).map(([dayKey, dayPlan]) => {
            const dayPlaces = dayPlan.places || [];
            console.log(
              `Day ${dayKey} places:`,
              JSON.stringify(dayPlaces, null, 2)
            );
            return (
              <View key={dayKey} className="mb-8">
                <Text className="text-xl font-semibold mb-4">
                  {dayKey.replace("day", "Day ")}
                </Text>

                <DraggableFlatList
                  data={dayPlaces}
                  keyExtractor={(item, index) => `place-${dayKey}-${index}`}
                  onDragEnd={({ data }) => handleDayPlanChange(dayKey, data)}
                  renderItem={({ item, drag, isActive, getIndex }) => {
                    const index = getIndex();
                    console.log(
                      `Rendering item at index ${index}:`,
                      JSON.stringify(item, null, 2)
                    );
                    return (
                      <TouchableOpacity
                        onLongPress={drag}
                        disabled={isActive}
                        className={`flex-row mb-4 items-center p-3 rounded-lg ${
                          isActive ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        <View className="mr-3">
                          <Grip size={20} color="black" />
                        </View>
                        {item.image ? (
                          <Image
                            source={{ uri: item.image }}
                            className="w-20 h-16 rounded-lg mr-3"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-20 h-16 rounded-lg mr-3 bg-gray-200" />
                        )}
                        <View className="flex-1">
                          <Text
                            className="text-lg font-bold"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.title || "No Name"}
                          </Text>
                          <Text className="text-gray-500 text-sm">
                            {item.duration || "No Time"}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => deletePlace(dayKey, index)}
                        >
                          <Trash2 size={20} color="red" />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  }}
                  contentContainerStyle={{ paddingBottom: 0 }}
                />
              </View>
            );
          })}
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-white pt-2 pb-4 px-4">
          {hasChanges && (
            <TouchableOpacity
              className="bg-black rounded-full py-3 items-center justify-center mb-2"
              onPress={saveChanges}
            >
              <Text className="text-white font-medium">Save Changes</Text>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity className="bg-green-100 rounded-full py-3 items-center justify-center">
            <Text className="text-green-500 font-medium">Add More Events</Text>
          </TouchableOpacity> */}
        </View>

        <StatusBar style="light" backgroundColor="black" />
      </View>
    </GestureHandlerRootView>
  );
}
