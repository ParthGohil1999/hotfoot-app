import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CountryPickerComponent from "../../components/countryPicker";
import TopBar from "../../components/topBar";
import BottomBarContinueBtn from "../../components/buttons/bottomBarContinueBtn";
import TitleSubtitle from "../../components/titleSubtitle";
import useUserStore from "../store/userZustandStore";
import { useAuth } from "@clerk/clerk-expo";

const PersonalTouch = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, getToken } = useAuth();
  const { userData, updatePersonalInfo, fetchUserData, loading } =
    useUserStore();
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState(null);

  const fromOnboarding = params.fromOnboarding === "true";

  const returnPath = params.returnPath;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        await fetchUserData(userId, getToken);
      }
    };
    loadData();
  }, [userId]);

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber:
          userData.personalInfo?.phoneNumber
            ?.replace(/[^\d]/g, "")
            .replace(
              new RegExp(
                `^${
                  userData.personalInfo?.phoneNumber
                    ?.split("+")[1]
                    ?.split(" ")[0]
                }`
              ),
              ""
            ) || "",
      });
      if (userData.personalInfo?.countryCode) {
        setCountry({
          cca2: userData.personalInfo.countryCode,
          callingCode:
            userData.personalInfo.phoneNumber?.split("+")[1]?.split(" ")[0] ||
            "",
          name: userData.personalInfo.nationality || "",
        });
      }
    }
  }, [userData]);

  const handleCountrySelect = (selectedCountry) => {
    setCountryCode(selectedCountry?.cca2);
    setCountry(selectedCountry);
  };

  const onSubmit = async (data) => {
    try {
      const fullPhoneNumber = country?.callingCode
        ? `+${country.callingCode}${data.phoneNumber}`
        : data.phoneNumber;

      const personalInfo = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        nationality: country?.name || "",
        phoneNumber: fullPhoneNumber,
        countryCode: country?.cca2 || "",
      };

      await updatePersonalInfo(userId, getToken, personalInfo);

      if (params.flow === "onboarding") {
        router.push("/preferences/locationPermission");
      } else if (params.returnPath) {
        router.push(params.returnPath);
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Failed to save personal info:", error);
      alert("Failed to save personal info. Please try again.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <TopBar backarrow progress={0.5} />
      <ScrollView className="flex container px-7">
        <TitleSubtitle
          title={"Add a personal touch"}
          subtitle={
            "To enhance your travel journey, we'd love to know more about you."
          }
        />
        <View className="container">
          <View style={styles.imageContainer}>
            <View>
              <Image
                style={styles.image}
                source={require("../../assets/images/icon.png")}
              />
              <Image
                style={styles.imageEditIcon}
                source={require("../../assets/images/edit-icon.png")}
              />
            </View>
          </View>

          <Text style={styles.label}>First Name</Text>
          <Controller
            control={control}
            rules={{ required: "First name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your first name"
              />
            )}
            name="firstName"
          />
          {errors.firstName && (
            <Text style={styles.error}>{errors.firstName.message}</Text>
          )}

          <Text style={styles.label}>Last Name</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your last name"
              />
            )}
            name="lastName"
          />

          <Text style={styles.label}>Email</Text>
          <View style={{ position: "relative" }}>
            <MaterialIcons
              name="alternate-email"
              size={16}
              color="#8f8f8f"
              style={{ position: "absolute", left: 15, top: 15, zIndex: 1 }}
            />
            <Controller
              control={control}
              render={({ field: { value } }) => (
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  value={value}
                  editable={false}
                />
              )}
              name="email"
            />
          </View>

          <Text style={styles.label}>Nationality</Text>
          <View style={styles.input}>
            <CountryPickerComponent
              onSelect={handleCountrySelect}
              value={country}
            />
          </View>

          {country && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  styles.input,
                  { flex: 0.3, marginRight: 10, justifyContent: "center" },
                ]}
              >
                <Text>+{country.callingCode}</Text>
              </View>
              <View style={{ flex: 0.7 }}>
                <Controller
                  control={control}
                  rules={{ required: "Phone number is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Phone number"
                      keyboardType="phone-pad"
                    />
                  )}
                  name="phoneNumber"
                />
                {errors.phoneNumber && (
                  <Text style={styles.error}>{errors.phoneNumber.message}</Text>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomBarContinueBtn handleDone={handleSubmit(onSubmit)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
    borderColor: "#f1f1f1",
    borderWidth: 1,
  },
  imageEditIcon: {
    position: "absolute",
    height: 25,
    width: 25,
    right: 10,
    bottom: 10,
    borderRadius: 100,
  },
  input: {
    borderColor: "#f1f1f1",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
    fontSize: 15,
  },
  label: {
    fontSize: 13,
    marginBottom: 5,
    color: "black",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 15,
    marginTop: -10,
  },
});

export default PersonalTouch;
