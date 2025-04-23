import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockTripsData } from "../../constants/trips.js";
import { ActivityIndicator } from "react-native-web";
import { BookmarkIcon, EllipsisVertical } from "lucide-react-native";
import { SearchModal } from "../../components/animatedExploreBar/SearchModal";
import TopBar from "../../components/topBar/index.js";
import { useRouter } from "expo-router";

const Trips = () => {
  const router = useRouter();

  const [userTrips, setUserTrips] = useState([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getUserTrips() {
    setLoading(true);
    setUserTrips(mockTripsData);
    setLoading(false);
  }

  const handleCitySelect = () => {
    setSearchModalVisible(true);
  };

  const handleTripPress = (trip) => {
    router.push({
      pathname: "/trip-details",
      params: { tripData: JSON.stringify(trip) },
    });
  };

  useEffect(() => {
    getUserTrips();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar logo text={"My Trips"} rightIcons={"search"} />
      <ScrollView
        className="flex-1 bg-white mx-6"
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="mx-4">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            {userTrips?.length == 0 ? (
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
                        {trip.tripData.city.name}, {trip.tripData.city.country}
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

      {/* <StatusBar style="dark" backgroundColor="white" /> */}
    </SafeAreaView>
  );
};

export default Trips;
