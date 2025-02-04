import React, { useState } from 'react'
import { View, Text, StyleSheet, PixelRatio, Switch } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'


const CountryPickerComponent = (props) => {


  const [countryCode, setCountryCode] = useState('')
  const [country, setCountry] = useState(null)
  const [withCountryNameButton, setWithCountryNameButton] = useState(
    true,
  )
  const [withFlag, setWithFlag] = useState(true)
  const [withEmoji, setWithEmoji] = useState(true)
  const [withFilter, setWithFilter] = useState(true)
  const [withCurrency, setWithCurrency] = useState(true)
  const [withCurrencyButton, setWithCurrencyButton] = useState(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState(true)
  const [withCallingCode, setWithCallingCode] = useState(true)
  const onSelect = (country) => {
    setCountryCode(country.cca2)
    setCountry(country)
    props.onSelect(country);
  }


  return (
    <View >

      
      <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          withCountryNameButton,
          withAlphaFilter,
          withCallingCode,
          withEmoji,
          withCurrency,
          withCurrencyButton,
          onSelect,
        }}
        flagSize="15"
        // visible
        
      />

      
    </View>

  )
}

export default CountryPickerComponent