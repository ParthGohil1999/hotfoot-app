import React from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

const TravelLoadingModal = ({ visible = false }) => {
  let animationContent;
  try {
    animationContent = (
      <LottieView
        source={require("../../constants/modal-loading-animation.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    );
  } catch (error) {
    console.error("LottieView error:", error);
    animationContent = (
      <ActivityIndicator
        size="large"
        color="#2c3e50"
        style={styles.animation}
      />
    );
  }

  return (
    <Modal
      transparent={true}
      visible={!!visible}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={styles.content}
        >
          <View style={styles.innerContent}>
            {animationContent}
            <Text style={styles.title}>Preparing Your Adventure</Text>
            <Text style={styles.subtitle}>
              Discovering the best experiences...
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    width: Dimensions.get("window").width * 0.8,
    borderRadius: 20,
    padding: 4,
  },
  innerContent: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 10,
    textAlign: "center",
  },
});

export default TravelLoadingModal;
