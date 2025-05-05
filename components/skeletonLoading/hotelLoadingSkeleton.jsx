import React from "react";
import { View, Text } from "react-native";

const HotelLoadingSkeleton = () => {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Placeholder */}
      <View className="h-16 bg-gray-200 animate-pulse" />

      {/* Image Placeholder */}
      <View className="h-64 bg-gray-300 animate-pulse justify-center items-center">
        <Text className="text-lg font-bold text-gray-600">
          Getting the hotel...
        </Text>
        <Text className="text-sm text-gray-500">
          Loading details and photos
        </Text>
      </View>

      {/* Info Placeholders */}
      <View className="p-4">
        <View className="h-8 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2" />
        <View className="h-6 w-1/2 bg-gray-200 rounded-md animate-pulse mb-6" />
        <View className="flex-row justify-between mb-6">
          <View className="h-20 w-[30%] bg-gray-200 rounded-lg animate-pulse" />
          <View className="h-20 w-[30%] bg-gray-200 rounded-lg animate-pulse" />
          <View className="h-20 w-[30%] bg-gray-200 rounded-lg animate-pulse" />
        </View>

        <View className="mb-6">
          <View className="h-4 w-full bg-gray-200 rounded-md animate-pulse mb-2" />
          <View className="h-4 w-full bg-gray-200 rounded-md animate-pulse mb-2" />
          <View className="h-4 w-2/3 bg-gray-200 rounded-md animate-pulse" />
        </View>

        {/* Facilities Section */}
        <View className="mb-4">
          <View className="h-5 w-1/4 bg-gray-200 rounded-md animate-pulse mb-3" />
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <View
                key={item}
                className="h-20 w-[23%] bg-gray-200 rounded-lg animate-pulse mb-3"
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HotelLoadingSkeleton;
