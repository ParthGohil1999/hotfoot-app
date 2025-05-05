import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const TravelersDropdown = ({ travelers, setTravelers }) => {
  const updateTravelerCount = (type, increment) => {
    const newCount = increment ? travelers[type] + 1 : travelers[type] - 1;
    if (newCount < 0) return;
    if (type === "adults" && newCount === 0) return;
    if (type === "infants" && newCount > travelers.adults) return;

    setTravelers({
      ...travelers,
      [type]: newCount,
    });
  };

  return (
    <View style={styles.travelersDropdown}>
      <View style={styles.travelerContent}>
        <View style={styles.travelerType}>
          <View>
            <Text style={styles.travelerTitle}>Adults</Text>
            <Text style={styles.travelerSubtitle}>Age 13+</Text>
          </View>
          <View style={styles.counter}>
            <Pressable
              style={[
                styles.counterButton,
                travelers.adults <= 1 && styles.buttonDisabled,
              ]}
              onPress={() => updateTravelerCount("adults", false)}
              disabled={travelers.adults <= 1}
            >
              <Text
                style={
                  travelers.adults <= 1
                    ? styles.counterButtonTextDisabled
                    : styles.counterButtonText
                }
              >
                -
              </Text>
            </Pressable>
            <Text style={styles.count}>{travelers.adults}</Text>
            <Pressable
              style={styles.counterButton}
              onPress={() => updateTravelerCount("adults", true)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.travelerType}>
          <View>
            <Text style={styles.travelerTitle}>Children</Text>
            <Text style={styles.travelerSubtitle}>Age 2-12</Text>
          </View>
          <View style={styles.counter}>
            <Pressable
              style={[
                styles.counterButton,
                travelers.children === 0 && styles.buttonDisabled,
              ]}
              onPress={() => updateTravelerCount("children", false)}
              disabled={travelers.children === 0}
            >
              <Text
                style={
                  travelers.children === 0
                    ? styles.counterButtonTextDisabled
                    : styles.counterButtonText
                }
              >
                -
              </Text>
            </Pressable>
            <Text style={styles.count}>{travelers.children}</Text>
            <Pressable
              style={styles.counterButton}
              onPress={() => updateTravelerCount("children", true)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.travelerType}>
          <View>
            <Text style={styles.travelerTitle}>Infants</Text>
            <Text style={styles.travelerSubtitle}>Under 2</Text>
          </View>
          <View style={styles.counter}>
            <Pressable
              style={[
                styles.counterButton,
                travelers.infants === 0 && styles.buttonDisabled,
              ]}
              onPress={() => updateTravelerCount("infants", false)}
              disabled={travelers.infants === 0}
            >
              <Text
                style={
                  travelers.infants === 0
                    ? styles.counterButtonTextDisabled
                    : styles.counterButtonText
                }
              >
                -
              </Text>
            </Pressable>
            <Text style={styles.count}>{travelers.infants}</Text>
            <Pressable
              style={[
                styles.counterButton,
                travelers.infants >= travelers.adults && styles.buttonDisabled,
              ]}
              onPress={() => updateTravelerCount("infants", true)}
              disabled={travelers.infants >= travelers.adults}
            >
              <Text
                style={
                  travelers.infants >= travelers.adults
                    ? styles.counterButtonTextDisabled
                    : styles.counterButtonText
                }
              >
                +
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  travelersDropdown: {
    marginTop: 8,
    position: "relative",
    zIndex: 4,
  },
  travelerContent: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  travelerType: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  travelerTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  travelerSubtitle: {
    color: "black",
    fontSize: 14,
    marginTop: 4,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    zIndex: 5,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {},
  counterButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  counterButtonTextDisabled: {
    color: "#999",
    fontSize: 20,
    fontWeight: "bold",
  },
  count: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
});

export default TravelersDropdown;
