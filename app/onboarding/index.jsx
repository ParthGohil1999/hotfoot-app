import { View, StyleSheet, Dimensions } from 'react-native'
import React, { useRef } from 'react'
import Onboarding from 'react-native-onboarding-swiper'
import LottieView from 'lottie-react-native';
import { useNavigation } from 'expo-router';

const { width, height } = Dimensions.get('window')

export default function onboardingScreen() {
  const navigation = useNavigation()
  const handleDone = () => {
    navigation.navigate('../(tabs)/home')
  }
  return (
    <View style={styles.container}>
      <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView style={{flex: 1}} source={require('../../assets/images/lottie-onb-1.json')} autoPlay loop />
              </View>
            ),
            title: 'Onboarding',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView style={{flex: 1}} source={require('../../assets/images/lottie-onb-2.json')} autoPlay loop />
              </View>
            ),
            title: 'Onboarding',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView style={{flex: 1}} source={require('../../assets/images/lottie-onb-3.json')} autoPlay loop />
              </View>
            ),
            title: 'Onboarding',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
        ]}
      />
    </View>
  )
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  lottie: {
    width: width * 0.9,
    height: 250,
  }
});