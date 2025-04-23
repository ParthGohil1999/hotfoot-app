import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import useTravelPreferencesStore from "../store/travelPreferencesZustandStore";
import TopBar from "../../components/topBar";
import TitleSubtitle from "../../components/titleSubtitle";
import BottomBarContinueBtn from "../../components/buttons/bottomBarContinueBtn";

const BudgetSelectionScreen = () => {
  const router = useRouter();
  const [selectedBudget, setSelectedBudget] = useState(null);
  const { budgetPreference, setBudgetPreference } = useTravelPreferencesStore();

  const budgetOptions = [
    {
      id: "cheap",
      label: "Cheap",
      icon: "💰",
      description: "Budget-friendly, economical travel.",
    },
    {
      id: "balanced",
      label: "Balanced",
      icon: "💼",
      description: "Moderate spending for a balanced trip.",
    },
    {
      id: "luxury",
      label: "Luxury",
      icon: "💎",
      description: "High-end, indulgent experiences.",
    },
    {
      id: "flexible",
      label: "Flexible",
      icon: "💫",
      description: "No budget restrictions.",
    },
  ];

  useEffect(() => {
    if (budgetPreference) {
      setSelectedBudget(budgetPreference);
    }
  }, [budgetPreference]);

  const handleBudgetSelect = (budgetId) => {
    setSelectedBudget(budgetId);
  };

  const handleContinue = () => {
    if (selectedBudget) {
      setBudgetPreference(selectedBudget);
      router.push("preferences/tripReview");
    }
  };

  const renderBudgetOption = (option) => {
    const isSelected = selectedBudget === option.id;

    return (
      <TouchableOpacity
        key={option.id}
        style={[styles.optionContainer, isSelected && styles.selectedOption]}
        onPress={() => handleBudgetSelect(option.id)}
      >
        <View style={styles.optionContent}>
          <Text style={styles.optionLabel}>
            {option.label} {option.icon}
          </Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <TopBar backarrow progress={0.4} />
      <ScrollView style={{ paddingHorizontal: 25 }}>
        <TitleSubtitle
          title={"Set your trip budget 💰"}
          subtitle={
            "Let us know your budget preference, and we'll craft an itinerary that suits your financial comfort."
          }
        />

        <View>{budgetOptions.map(renderBudgetOption)}</View>
      </ScrollView>
      <BottomBarContinueBtn
        handleDone={handleContinue}
        customStyles={[!selectedBudget && styles.continueButtonDisabled]}
        disabled={!selectedBudget}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 15,
    marginBottom: 12,
    padding: 20,
  },
  selectedOption: {
    borderColor: "#000000",
    borderWidth: 2,
    backgroundColor: "#f5f5f5",
  },
  optionContent: {
    flexDirection: "column",
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000000",
  },
  optionDescription: {
    fontSize: 14,
    color: "#555555",
  },

  continueButtonDisabled: {
    backgroundColor: "#cccccc",
  },
});

export default BudgetSelectionScreen;
