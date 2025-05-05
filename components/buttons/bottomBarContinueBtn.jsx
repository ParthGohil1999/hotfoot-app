import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

const BottomBarContinueBtn = ({
  handleDone,
  customStyles,
  disabled,
  buttonText,
  showCounter,
  currentCount,
  minRequired,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, customStyles, disabled && styles.disabledButton]}
        onPress={handleDone}
        disabled={disabled}
      >
        <View style={styles.content}>
          <Text style={styles.text}>
            {buttonText ? buttonText : "Continue"}
            {showCounter && ` (${currentCount}/${minRequired})`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "black",
    borderRadius: 15,
    paddingVertical: 15,
    width: "90%",
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});

export default BottomBarContinueBtn;
