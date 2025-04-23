import { SafeAreaView, ScrollView } from "react-native";
import React, { useEffect } from "react";
import ButtonMultiselect, {
  ButtonLayout,
} from "react-native-button-multiselect";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SelectActivityPreferencesReactNative } from "../../constants/options";
import TopBar from "../../components/topBar";
import BottomBarContinueBtn from "../../components/buttons/bottomBarContinueBtn";
import TitleSubtitle from "../../components/titleSubtitle";
import useUserStore from "../store/userZustandStore";
import { useAuth } from "@clerk/clerk-expo";
import useTravelPreferencesStore from "../store/travelPreferencesZustandStore";

const TravelPreferences = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, getToken } = useAuth();
  const { updatePreferences, userData, fetchUserData } = useUserStore();

  const { selectedButtons, setSelectedButtons } = useTravelPreferencesStore();

  // const [selectedButtons, setSelectedButtons] = useState(
  //   userData?.preferences?.activities || []
  // );

  useEffect(() => {
    const loadUserData = async () => {
      if (userId) {
        await fetchUserData(userId, getToken);
      }
    };
    loadUserData();
  }, [userId]);

  useEffect(() => {
    if (userData?.preferences?.activities) {
      const storedSelections = userData.preferences.activities.map(
        (activity) => {
          return activity.toLowerCase();
        }
      );
      setSelectedButtons(storedSelections);
    }
  }, [userData]);

  const handleButtonSelected = (selectedValues) => {
    setSelectedButtons(selectedValues);
  };

  const handleDone = async () => {
    try {
      if (!selectedButtons || selectedButtons.length === 0) {
        alert("Please select at least one preference");
        return;
      }

      const result = await updatePreferences(userId, getToken, {
        activities: selectedButtons.map((activity) => activity.toLowerCase()),
      });

      if (result.success) {
        if (params.flow === "onboarding") {
          router.push({
            pathname: "/preferences/personalTouch",
            params: { flow: "onboarding" },
          });
        } else if (params.flow === "itinerary") {
          router.push("/preferences/budgetSelection");
        } else if (params.returnPath) {
          router.push(params.returnPath);
        } else {
          router.back();
        }
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <TopBar backarrow={false} progress={0.25} />
      <ScrollView style={{ paddingLeft: 25, paddingRight: 25 }}>
        <TitleSubtitle
          title={"Travel Preferences"}
          subtitle={
            "Tell us your travel preferences, and we'll tailor recommendations to your style. Don't worry, you can always change it later in the settings."
          }
        />
        <ButtonMultiselect
          buttons={SelectActivityPreferencesReactNative}
          layout={ButtonLayout.GRID}
          onButtonSelected={handleButtonSelected}
          selectedButtons={selectedButtons}
          multiselect={true}
        />
      </ScrollView>
      <BottomBarContinueBtn handleDone={handleDone} />
    </SafeAreaView>
  );
};

export default TravelPreferences;
