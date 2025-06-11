import { View, Text, ScrollView, FlatList } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/topBar";
import {
  CityList,
  ExploreFlatList,
  TopPicksCityList,
} from "../../components/citiesFlatList";
import ExploreHeader from "../../components/flatLists";
import AnimatedExploreBar from "../../components/animatedExploreBar";
import ExploreCategory from "../../components/animatedExploreBar/exploreCategory";
import NearbyFlatLists from "@/components/nearbyFlatlists/nearbyFlatlists";

const HomeScreen = () => {
  const renderHeader = () => (
    <View className="flex container pl-5 pb-32">
      <View className="mb-5">
        <AnimatedExploreBar />
      </View>

      <ExploreCategory />

      {/* --- Popular Destinations Section --- */}
      <View className="mb-5 mx-1 flex-row justify-between">
        <Text className="subpixel-antialiased text-lg font-bold">
          Popular Destinations
        </Text>
      </View>
      <CityList />

      {/* --- Top Picks Section --- */}
      <View className="my-5 mx-1 flex-row justify-between">
        <Text className="subpixel-antialiased text-lg font-bold">
          Top picks for you
        </Text>
      </View>
      <TopPicksCityList />

      {/* You can add more sections like NearbyFlatLists, etc., here */}
       <NearbyFlatLists />
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: "white",  }}>
      <TopBar logo text="Hotfoot" />
      <FlatList
        data={[]} // We don’t need actual data
        renderItem={null}
        keyExtractor={() => "scroll-container"}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
