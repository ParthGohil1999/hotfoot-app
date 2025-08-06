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
import AiModal from "@/components/animatedExploreBar/AiModal";

export default function HomeScreen() {
  const [micPermission, setMicPermission] = useState(false);

  const requestMicrophonePermission = async () => {
    try {
      console.log("Requesting microphone permission from index");
      const status = await AudioModule.getRecordingPermissionsAsync();
      console.log("Microphone permission status from index:", status);
      if (!status.granted) {
        const newStatus = await AudioModule.requestRecordingPermissionsAsync();
        console.log("Microphone permission request status from index:", newStatus);
        setMicPermission(newStatus.granted);
        return newStatus.granted;
      }
      setMicPermission(true);
      return true;
    } catch (error) {
      console.error("Microphone permission error from index:", error);
      setMicPermission(false);
      return false;
    }
  };

  return (
    <View style={{ flex: 1}}>
      {/* <TopBar logo text="Hotfoot" /> */}
      <AiModal
        // visible={modalVisible}
        // onClose={() => setModalVisible(false)}
        requestMicrophonePermission={requestMicrophonePermission}
        micPermission={micPermission}
      />
    </View>
  );
};