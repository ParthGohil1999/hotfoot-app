import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router';


const home = () => {
  return (
    <View>
      < Redirect href={'/(tabs)/home'} />
      {/* < Redirect href={'/preferences/travelPreferences'} /> */}
    </View>
  )
}

export default home