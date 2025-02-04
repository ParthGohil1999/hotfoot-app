import { View, StyleSheet, Dimensions } from 'react-native'
import React, { useRef } from 'react'
import Onboarding from 'react-native-onboarding-swiper'
import LottieView from 'lottie-react-native';
import { useNavigation } from 'expo-router';

const { width, height } = Dimensions.get('window')

export default function onboardingScreen() {
  const navigation = useNavigation()
  const handleDone = () => {
    navigation.navigate('auth/index')
  }
  return (
    <View style={styles.container}>
      <Onboarding
      bottomBarHighlight={false}
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
            title: 'Intelligent trip planning with Hotfoot AI',
            subtitle: 'Let our AI plan a detailed trip tailored to you preferences. Easy planning for you unforgettable experience',
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView style={{flex: 1}} source={require('../../assets/images/lottie-onb-2.json')} autoPlay loop />
              </View>
            ),
            title: 'Stay Up-To-Date',
            subtitle: 'Planning a getaway? Don’t worry—AI will keep your itinerary fully optimized with every work ping, just in case you miss those sweet Email notifications.',
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView style={{flex: 1}} source={require('../../assets/images/lottie-onb-3.json')} autoPlay loop />
              </View>
            ),
            title: "What's nearby?",
            subtitle: "Because nothing screams excitement like AI guiding you to both a concert and a can opener within a 5-mile radius?",
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