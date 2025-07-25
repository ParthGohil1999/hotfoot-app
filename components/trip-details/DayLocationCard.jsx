import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import {
  Bike,
  CarFront,
  Navigation,
  PersonStanding,
  Plane,
  TrainFront,
  TramFront,
  Utensils,
  MapPin,
} from "lucide-react-native";
import { MaterialIcons } from "@expo/vector-icons";

const DayLocationCard = ({ place, isLast }) => {
  const handlePlacePress = () => {
    // console.log("Opening Google Maps for:", JSON.stringify(place, null, 2));
    const url = `https://www.google.com/maps/search/?api=1&query=${place?.title}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open Google Maps:", err)
    );

  };
  const renderIcon = () => {
    const typeMap = {
      Lunch: "eat",
      Restaurant: "eat",
      Museum: "explore",
      Garden: "explore",
      Park: "explore",
      "Museum/Monument": "explore",
      "Shopping Mall": "explore",
      Activity: "explore",
    };
    const mappedType = typeMap[place.type] || "explore";

    switch (mappedType) {
      case "eat":
        return <Utensils size={24} color="#000" />;
      case "explore":
        return <MapPin size={28} color="#000" />;
      case "sleep":
        return <MaterialIcons name="hotel" size={24} color="#000" />;
      default:
        return <MaterialIcons name="place" size={24} color="#000" />;
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <MaterialIcons key={i} name="star" size={20} color="#FFD700" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <MaterialIcons key={i} name="star-half" size={20} color="#FFD700" />
        );
      } else {
        stars.push(
          <MaterialIcons key={i} name="star-border" size={20} color="#FFD700" />
        );
      }
    }

    return stars;
  };

  return (
    <View className="my-6">
      {/* Location Card */}
      <View className="flex-row w-full h-[520px]">
        <View className="w-[10%] overflow-hidden">
          {renderIcon()}
          <View className="mt-2 h-full ml-4 border-l-2 border-neutral-200"></View>
        </View>
        <View className="w-[90%] flex-1">
          <View className="bg-white rounded-xl border border-neutral-200 w-full h-full max-w-[350px]">
            <View className="w-full h-72 rounded-xl">
              <Image
                className="w-full h-full rounded-tr-xl rounded-tl-xl"
                source={{
                  uri: place.image || "https://via.placeholder.com/350",
                }}
                resizeMode="cover"
              />
            </View>
            {/* Title and Rating */}
            <View className="mx-4 my-2 pb-6 pt-4 flex-1 border-b-2 border-neutral-100">
              <Text className="text-xl font-bold mb-3">
                {place.title || "Unknown Place"}
              </Text>
              <View className="flex-row items-center">
                {place.rating && (
                  <View className="flex-row mr-2">
                    {renderStars(place.rating)}
                  </View>
                )}
                <Text className="text-gray-600 text-sm">
                  {place.rating ? `(${place.rating.toFixed(1)})` : "No rating"}{" "}
                  {place.reviews
                    ? `${place.reviews.toLocaleString()} reviews`
                    : "No reviews"}
                </Text>
              </View>
            </View>

            {/* Details */}
            <View className="mb-4 p-4">
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="schedule" size={16} color="#555" />
                <Text className="ml-2 text-lg text-gray-800">
                  {place.duration || "N/A"}
                </Text>
              </View>
              {place.description && (
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="info" size={16} color="#555" />
                  <Text
                    className="ml-2 text-lg text-gray-800"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {place.description}
                  </Text>
                </View>
              )}
              {place.notes && (
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="note" size={16} color="#555" />
                  <Text
                    className="ml-2 text-lg text-gray-800"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {place.notes}
                  </Text>
                </View>
              )}
              <TouchableOpacity className="flex-row items-center" onPress={handlePlacePress}>
                <MaterialIcons name="location-pin" size={16} color="#16a34a" />
                <Text className="ml-2 text-lg text-green-600 font-medium">
                  View on Google Maps
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Navigation */}
      {!isLast && (
        <View className="flex-row w-full h-[70px] mt-2">
          <View className="flex-row items-center">
            <View className="w-[10%] overflow-hidden">
              <Navigation size={24} color="#000" />
            </View>
            <View className="w-[90%] h-full max-w-[350px]">
              <View className="h-full border border-neutral-200 rounded-xl flex-row items-center justify-around">
                <View className="justify-center items-center">
                  <CarFront size={20} color="#000" />
                  <Text className="text-xs px-2 py-1 rounded">
                    {place.transportTimes?.car || place.travelTime || "-"}
                  </Text>
                </View>
                <View className="justify-center items-center">
                  <Bike size={20} color="#000" />
                  <Text className="text-xs px-2 py-1 rounded">
                    {place.transportTimes?.bike || "-"}
                  </Text>
                </View>
                <View className="justify-center items-center">
                  <TramFront size={20} color="#000" />
                  <Text className="text-xs px-2 py-1 rounded">
                    {place.transportTimes?.tram || "-"}
                  </Text>
                </View>
                <View className="justify-center items-center">
                  <PersonStanding size={20} color="#000" />
                  <Text className="text-xs px-2 py-1 rounded">
                    {place.transportTimes?.walk || place.travelTime || "-"}
                  </Text>
                </View>
                <View className="justify-center items-center">
                  <TrainFront size={20} color="#000" />
                  <Text className="text-xs px-2 py-1 rounded">
                    {place.transportTimes?.train || "-"}
                  </Text>
                </View>
                <View className="justify-center items-center">
                  <Plane size={20} color="#000" />
                  <Text className="text-xs px-2 py-1 rounded">
                    {place.transportTimes?.plane || "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DayLocationCard;
