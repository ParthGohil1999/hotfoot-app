import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GetPlaceDetailsById } from '../../services/GlobalApi'
import placeDetails from '../../constants/placeDetails'
import Animated, {
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window')
const Page = () => {

    
    
    const { id } = useLocalSearchParams()
    const [placeDetails, setPlaceDetails] = useState()
    // console.log("placeDetails: ", placeDetails.photos[0].name)
    
    useEffect(() => {
        fetchData(id)
    }, [id]);

    const fetchData = async (placeId) => {
        try {
            const placeDetails = await GetPlaceDetailsById(placeId);
            console.log('placeDetails:', JSON.stringify(placeDetails, null, 2));

            setPlaceDetails(placeDetails);
        } catch (error) {
            console.error("Error during ExploreFlatList city list:", error);
        }
    };


    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            {/* <Animated.ScrollView>
                <Animated.Image source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${placeDetails.photos[0].name.split("/photos/")[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY}` }} style={styles.image} />
            </Animated.ScrollView> */}
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