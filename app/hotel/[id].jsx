import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { GetPlaceDetailsById } from '../../services/GlobalApi'
import { TripAdvisorLocationDetailsApi } from '../../services/TripAdvisorApi'
// import placeDetails from '../../constants/placeDetails'
import Animated, {
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';
import { Carousel } from "react-native-reanimated-carousel";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get('window')
const Page = () => {

    const { id, name, phoneNumber, latitude, longitude } = useLocalSearchParams()
    const [placeDetails, setPlaceDetails] = useState()
    const [loading, setLoading] = useState(true)
    

    useEffect(() => {
        const fetch = async () => {

            await fetchData()
            setLoading(false)
        }
        fetch()
    }, []);



    const fetchData = async () => {
        try {
            const [placeDetailsResult, tripAdvisorResult] = await Promise.allSettled([
                GetPlaceDetailsById(id),
                TripAdvisorLocationDetailsApi({
                    name,
                    phoneNumber,
                    latitude,
                    longitude,
                    category: "hotels",
                }),
            ]);

            // const placeDetailsResult = await GetPlaceDetailsById(id)

            // Extract successful results or provide fallback values
            const placeDetails = placeDetailsResult.status === "fulfilled" ? placeDetailsResult.value : {};
            const tripAdvisorData = tripAdvisorResult.status === "fulfilled" ? tripAdvisorResult.value : [];

            const combinedData = {
                ...placeDetails, // Spread existing place details
                amenities: tripAdvisorData?.amenities || [] // Add amenities, default to empty array if undefined
            };

            // console.log('placeDetails:', JSON.stringify(placeDetailsResult, null, 2));

            setPlaceDetails(combinedData);
        } catch (error) {
            console.error("Error during rendering hotel details page:", error);
        }
    };


    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            {loading ? <Text className="text-center text-lg mt-10">Loading...</Text> :
            <Animated.ScrollView>
                <Animated.Image source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${placeDetails?.photos[0]?.name?.split("/photos/")[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY}` }} style={styles.image} />
                {/* <Carousel
                    loop
                    width={350}
                    height={200}
                    autoPlay
                    data={placeDetails?.photos || []}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item.name }}
                            className="w-full h-48 rounded-lg"
                        />
                    )}
                /> */}

                {/* Hotel Info */}
                <View className="p-4 ">
                    <Text className="text-2xl font-bold text-gray-800">{placeDetails?.displayName?.text}</Text>
                    <Text className="text-gray-600 mt-1">{placeDetails.formattedAddress}</Text>
                    <View className="flex-row items-center mt-2">
                        <FontAwesome name="star" size={20} color="gold" />
                        <Text className="text-gray-800 text-lg ml-1">{placeDetails.rating} ({placeDetails.userRatingCount} Reviews)</Text>
                    </View>
                </View>

                {/* Amenities */}
                <View className="mt-4 p-4 ">
                    <Text className="text-lg font-semibold mb-2">Amenities</Text>
                    <FlatList
                        data={placeDetails.amenities}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <Text className="text-gray-600 w-1/2 mb-1">- {item}</Text>
                        )}
                    />
                </View>

                {/* Reviews */}
                <View className="mt-4 p-4 ">
                    <Text className="text-lg font-semibold mb-2">Guest Reviews</Text>
                    {placeDetails.reviews.map((review, index) => (
                        <View key={index} className="mb-4 border-b pb-2 border-gray-300">
                            <View className="flex-row items-center">
                                <Image
                                    source={{ uri: review.authorAttribution.photoUri }}
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                <Text className="font-semibold text-gray-800">{review.authorAttribution.displayName}</Text>
                            </View>
                            <Text className="text-gray-600 mt-1">{review.text.text}</Text>
                        </View>
                    ))}
                </View>
            </Animated.ScrollView>}
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: '300',
        width
    }
})


export default Page