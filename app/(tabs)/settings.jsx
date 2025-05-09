import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  User,
  Map,
  LogOut,
  Siren,
  Handshake,
} from "lucide-react-native";
import { useAuth } from "@clerk/clerk-expo";
import TopBar from "../../components/topBar";
import useUserStore from "../store/userZustandStore";

const Settings = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleTravelPreferences = () => {
    router.push({
      pathname: "/preferences/travelPreferences",
      params: {
        returnPath: "/(tabs)/settings",
      },
    });
  };

  const handlePersonalInfo = () => {
    router.push({
      pathname: "/preferences/personalTouch",
      params: {
        returnPath: "/(tabs)/settings",
      },
    });
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await signOut();
      useUserStore.getState().clearUserData();

      console.log("User logged out successfully");
      router.replace("/auth");
    } catch (err) {
      console.error("Failed to log out:", err);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar logo text={"Settings"} />
      <View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleTravelPreferences}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <Map size={22} color="#000" />
            </View>
            <Text style={styles.menuItemText}>Travel Preferences</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handlePersonalInfo}>
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <User size={22} color="#000" />
            </View>
            <Text style={styles.menuItemText}>Personal Info</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Linking.openURL("https://www.hotfoot.ai/terms-of-service")
          }
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <Handshake size={22} color="#000" />
            </View>
            <Text style={styles.menuItemText}>Terms of Service</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Linking.openURL("https://www.hotfoot.ai/privacy-policy")
          }
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <Siren size={22} color="#000" />
            </View>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <View style={styles.menuItemLeft}>
          <View style={styles.logoutIconContainer}>
            <LogOut size={22} color="#FF4444" />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: "auto",
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 18,
    color: "#FF4444",
    fontWeight: "500",
    marginLeft: 6,
  },
});

export default Settings;
