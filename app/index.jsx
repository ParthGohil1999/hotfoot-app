import { View } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import useUserStore from "../app/store/userZustandStore";

const home = () => {
  const { userLocation } = useUserStore()
  console.log("userLocation from home: ", userLocation);
  return (
    <View>
      <SignedIn>

        {userLocation ? (
          <Redirect href="/(tabs)/home" />
        ) : (
          <Redirect href="/preferences/locationPermission" />
        )}
        {/* <Redirect href={"/hotel/dummyPage"} /> */}
        {/* < Redirect href={'/hotel/[id]'} /> */}
        {/* < Redirect href={'/place/cityDetails'} /> */}
      </SignedIn>
      <SignedOut>
        <Redirect href={"/onboarding"} />
      </SignedOut>
    </View>
  );
};

export default home;
