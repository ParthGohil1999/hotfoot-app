import { Text, View } from "react-native";

const SkeletonLoading = () => {
  return (
    <View className="w-full mb-4 rounded-lg py-2 animate-pulse">
      <View className="relative">
        <View className="h-72 rounded-lg bg-neutral-300" />
      </View>
      <View className="flex-row w-full bg-neutral-300 rounded-xl justify-between items-center mt-2">
        <Text className="text-lg font-semibold" />
      </View>
      <View className="mt-2 rounded-xl bg-neutral-300">
        <Text className="font-light" />
      </View>
    </View>
  );
};

export default SkeletonLoading;
