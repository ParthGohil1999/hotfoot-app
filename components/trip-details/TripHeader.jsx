import { ArrowLeftIcon, EllipsisVertical, Share2 } from "lucide-react-native";
import { Image, TouchableOpacity, View } from "react-native";

const TripHeader = ({ coverImage, onBack }) => {
  return (
    <View className="relative">
      <Image
        source={{ uri: coverImage }}
        className="h-80 w-full"
        resizeMode="cover"
      />
      {/* Left Side */}
      <View className="absolute top-14 left-0 right-0 flex-row justify-between px-4">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center bg-white rounded-full"
          onPress={onBack}
        >
          <View className="items-center justify-center">
            <ArrowLeftIcon size={24} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Right Side */}
      <View className="absolute top-14 right-20 flex-row justify-between px-4">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center bg-white rounded-full"
          onPress={onBack}
        >
          <View className="items-center justify-center">
            <Share2 size={20} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
      <View className="absolute top-14 right-4 flex-row justify-between px-4">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center bg-white rounded-full"
          onPress={onBack}
        >
          <View className="items-center justify-center">
            <EllipsisVertical size={24} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripHeader;
