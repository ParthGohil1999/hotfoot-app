import React from "react";
import { View, StyleSheet } from "react-native";
import CountryPicker from "react-native-country-picker-modal";

const CountryPickerComponent = ({ onSelect, value, countryCode }) => {
  console.log("CountryPickerComponent props:", { value, countryCode });

  return (
    <View style={styles.container}>
      <CountryPicker
        countryCode={countryCode || value?.cca2 || undefined}
        withFilter
        withFlag
        withCountryNameButton
        withAlphaFilter
        withCallingCode
        withEmoji
        withCurrency
        withCurrencyButton
        onSelect={(country) => {
          console.log("CountryPicker selected:", country);
          onSelect({
            cca2: country.cca2,
            callingCode: country.callingCode[0],
            name: country.name.common,
          });
        }}
        flagSize={15}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default CountryPickerComponent;
