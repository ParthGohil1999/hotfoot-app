import { View, Text, TextInput, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBar from '../../components/topBar'
import { MaterialIcons } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign';
import { CityList, TopPicksCityList, TopTrendsFromYourCity } from '../../components/citiesFlatList'


const HomeScreen = () => {


  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <TopBar logo text={'Hotfoot'} />
      <View className="flex container pl-5">
        <View className='mb-5'>
          <TextInput
            className="border-gray-100 bg-gray-100 border-2 py-4 px-10 rounded-2xl mr-5"
            placeholderTextColor="gray"
            placeholder="Search destinations..."
          />
          <MaterialIcons
            name="search"
            size={20}
            color="#8f8f8f"
            style={{ position: 'absolute', left: 15, bottom: 15, zIndex: 1 }}
          />
        </View>

        <ScrollView className="flex container mb-28 h-full " showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <View>
            <View className="mb-5 mx-1 flex-row justify-between">
              <Text className="subpixel-antialiased text-lg font-bold">
                Popular Destinations
              </Text>
              <View className="flex-row items-center mr-3">
                <Text>View All</Text>
                <AntDesign className="ml-3 font-thin" name="arrowright" size={20} color="black" />
              </View>
            </View>
            <View>
              {/* <CityList data={cities} /> */}
              <CityList />
            </View>
          </View>
          <View>
            <View className="my-5 mx-1 flex-row justify-between">
              <Text className="subpixel-antialiased text-lg font-bold">
                Top picks for you
              </Text>
              <View className="flex-row items-center mr-3">
                <Text>View All</Text>
                <AntDesign className="ml-3 font-thin" name="arrowright" size={20} color="black" />
              </View>
            </View>
            <View>
              {/* <TopPicksCityList data={topPicksCities.data} /> */}
              <TopPicksCityList />
            </View>
          </View>
          {/* <View>
            <View className="my-5 mx-1 flex-row justify-between">
              <Text className="subpixel-antialiased text-lg font-bold">
                Top trends from your city
              </Text>
              <View className="flex-row items-center mr-3">
                <Text>View All</Text>
                <AntDesign className="ml-3 font-thin" name="arrowright" size={20} color="black" />
              </View>
            </View>
            <View>
              <TopTrendsFromYourCity />
            </View>
          </View> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};


export default HomeScreen