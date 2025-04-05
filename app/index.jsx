import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router';


const home = () => {
  return (
    <View>
      {/* < Redirect href={'/hotel/dummyPage'} /> */}
      {/* < Redirect href={'/hotel/[id]'} /> */}
      {/* < Redirect href={'/place/cityDetails'} /> */}
      {/* < Redirect href={'/preferences/budgetSelection'} /> */}
      {/* < Redirect href={'/onboarding'} /> */}
      < Redirect href={'/(tabs)/home'} />
    </View>
  )
}

export default home