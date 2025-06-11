import { View } from "react-native";
import React, { useState } from "react";
import {
  ExploreFlatList,
} from "../../components/citiesFlatList";
import ExploreHeader from "../../components/flatLists";

const NearbyFlatLists = () => {
  const [category, setCategory] = useState("hotel");

  const onDataChanged = (category) => {
    setCategory(category);
  };

  return (


          <View>
            <ExploreHeader onCategoryChanged={onDataChanged} />
            <ExploreFlatList category={category} />
          </View>

  );
};

export default NearbyFlatLists;
