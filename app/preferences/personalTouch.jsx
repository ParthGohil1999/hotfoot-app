import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CountryPickerComponent from "../../components/countryPicker";
import TopBar from "../../components/topBar";
import BottomBarContinueBtn from "../../components/buttons/bottomBarContinueBtn";
import TitleSubtitle from "../../components/titleSubtitle";
import useUserStore from "../store/userZustandStore";
import { useAuth, useUser } from "@clerk/clerk-expo";

const countryData = [
  { cca2: "IN", name: "India", callingCode: "91" },
  { cca2: "US", name: "United States", callingCode: "1" },
  { cca2: "GB", name: "United Kingdom", callingCode: "44" },
  { cca2: "CA", name: "Canada", callingCode: "1" },
];

const findCountryByCode = (cca2) => {
  return countryData.find((country) => country.cca2 === cca2);
};

// const findCountryByCallingCode = (callingCode) => {
//   return countryData.find((country) => country.callingCode === callingCode);
// };

const PersonalTouch = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const { userData, updatePersonalInfo, fetchUserData, loading } =
    useUserStore();
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const loadData = async () => {
      if (userId && !userData) {
        console.log("Fetching user data for:", userId);
        await fetchUserData(userId, getToken);
      }
    };
    loadData();
  }, [userId, userData]);

  useEffect(() => {
    if (userData?.personalInfo) {
      console.log("Populating form with Firestore userData:", userData);
      console.log("userData.personalInfo:", userData.personalInfo);

      let phoneNumber = "";
      let callingCode = "";
      let selectedCountry = null;

      if (userData.personalInfo.countryCode) {
        selectedCountry = findCountryByCode(userData.personalInfo.countryCode);
      }

      if (userData.personalInfo.phoneNumber) {
        const phoneWithCode = userData.personalInfo.phoneNumber.replace(
          /[^\d+]/g,
          ""
        );

        if (phoneWithCode.startsWith("+")) {
          if (selectedCountry) {
            const codeToRemove = `+${selectedCountry.callingCode}`;
            if (phoneWithCode.startsWith(codeToRemove)) {
              phoneNumber = phoneWithCode.substring(codeToRemove.length);
              callingCode = selectedCountry.callingCode;
            } else {
              phoneNumber = phoneWithCode.substring(1);
            }
          } else {
            const possibleCountries = countryData.filter((c) =>
              phoneWithCode.startsWith(`+${c.callingCode}`)
            );

            possibleCountries.sort(
              (a, b) => b.callingCode.length - a.callingCode.length
            );

            if (possibleCountries.length > 0) {
              selectedCountry = possibleCountries[0];
              const codeToRemove = `+${selectedCountry.callingCode}`;
              phoneNumber = phoneWithCode.substring(codeToRemove.length);
              callingCode = selectedCountry.callingCode;
            } else {
              phoneNumber = phoneWithCode.substring(1);
            }
          }
        } else {
          phoneNumber = phoneWithCode;
        }
      }

      reset({
        firstName: userData.personalInfo.firstName || user?.firstName || "",
        lastName: userData.personalInfo.lastName || user?.lastName || "",
        email:
          userData.personalInfo.email ||
          user?.primaryEmailAddress?.emailAddress ||
          "",
        phoneNumber: phoneNumber,
      });

      if (selectedCountry) {
        const countryObj = {
          cca2: selectedCountry.cca2,
          callingCode: selectedCountry.callingCode,
          name: userData.personalInfo.nationality || selectedCountry.name,
        };
        console.log("Setting country:", countryObj);
        setCountry(countryObj);
        setCountryCode(selectedCountry.cca2);
      }
    } else if (user) {
      console.log("Populating form with Clerk user data:", {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.primaryEmailAddress?.emailAddress,
      });
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phoneNumber: "",
      });
      setCountry(null);
      setCountryCode("");
    }
  }, [userData, user, reset]);

  const handleCountrySelect = (selectedCountry) => {
    console.log("Selected country:", selectedCountry);
    const name =
      selectedCountry.name ||
      findCountryByCode(selectedCountry.cca2)?.name ||
      selectedCountry.cca2 ||
      "Unknown";
    setCountryCode(selectedCountry.cca2);
    setCountry({ ...selectedCountry, name });
  };

  const onSubmit = async (data) => {
    try {
      if (!country) {
        alert("Please select your country");
        return;
      }

      if (!/^\d+$/.test(data.phoneNumber)) {
        alert("Please enter a valid phone number (digits only)");
        return;
      }

      const fullPhoneNumber = `+${country.callingCode}${data.phoneNumber}`;

      const personalInfo = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        nationality: country.name,
        phoneNumber: fullPhoneNumber,
        countryCode: country.cca2,
      };

      console.log("Saving personalInfo:", personalInfo);
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

  console.log("CountryPicker props:", {
    value: country,
    countryCode: country?.cca2,
  });

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
            <Image
              style={styles.image}
              source={
                user?.imageUrl
                  ? { uri: user.imageUrl }
                  : require("../../assets/images/icon.png")
              }
            />
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
              countryCode={country?.cca2}
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
      <BottomBarContinueBtn
        handleDone={handleSubmit(onSubmit)}
        disabled={!isValid || !country}
        buttonText="Continue"
      />
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
