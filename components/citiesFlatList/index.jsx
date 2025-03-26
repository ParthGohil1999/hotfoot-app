import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { GetPixabayImageByCityName } from '../../services/PixabayApi';
import { GetPlaceDetails, GetPlaceDetailsByTextSearch } from '../../services/GlobalApi'
import { TopPicksOnlyForYou, TopTrendsFromYourCityApi } from '../../services/AmadeusApi'
import { cityCodes } from '../../constants/iataCityCodes';
import { Link } from 'expo-router';
import { hotelDetails } from "../../constants/hotels"
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import { HotelCard } from '../hotelCard/hotelCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export const CityList = ({ data }) => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        fetchData()
        // console.log('places:', places)
    }, []);

    const fetchData = async () => {
        try {
            const popularDestinations = await GetPlaceDetailsByTextSearch();
            console.log('popularDestinations:', popularDestinations);

            setPlaces(popularDestinations.results);
        } catch (error) {
            console.error("Error during fetching city list:", error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity className="flex items-center justify-center" style={{ marginRight: 10 }}>
            {item.photos && item.photos.length > 0 && (
                <View style={{
                    padding: 2,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                    <Image
                        source={{
                            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${item.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY}`,
                        }}
                        style={{ width: 80, height: 80, borderRadius: 100, objectFit: 'none' }}
                        className="object-contain"
                    />
                </View>
            )}
            <View style={{ marginVertical: 5, marginLeft: 2 }}>
                <Text className="font-normal text-lg text-gray-900">
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1">
            <FlatList
                data={places}
                renderItem={renderItem}
                keyExtractor={(item) => item.place_id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export const TopPicksCityList = ({ data }) => {
    const [cities, setCities] = useState([]);

    // console.log('TopPicksCityList console.log: ', cities)
    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const topPicks = await TopPicksOnlyForYou();
            // console.log('TopPicksOnlyForYou:',topPicks);
            await fetchCitiesWithImages(topPicks.data)
        } catch (error) {
            console.error("Error during fetching top picks city list:", error);
        }
    };

    const fetchCitiesWithImages = async (data) => {
        // if (!data) return;
        // console.log('data: ', data)

        try {
            const citiesWithImages = await Promise.all(
                data?.data?.map(async (city) => {
                    try {
                        const imageResponse = await GetPixabayImageByCityName(city.name);
                        const parsedData = await JSON.parse(imageResponse);
                        const image = parsedData.hits?.[0]?.largeImageURL || null;
                        // console.log("citiesWithImages: ", parsedData)
                        return { ...city, imageUrl: image };
                    } catch (error) {
                        console.error(`Failed to fetch image for ${city.name}:`, error);
                        return { ...city, imageUrl: null };
                    }
                })
            );
            // console.log("citiesWithImages: ", citiesWithImages)
            setCities(citiesWithImages);
        } catch (error) {
            console.error("Error fetching cities with images:", error);
        }
    };

    const renderItem = ({ item }) => {

        // const data = GetPixabayImageByCityName(item.name)

        // console.log('GetPixabayImageByCityName console.log: ', data)

        return (
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.trendingContainer}
            contentContainerStyle={{ paddingRight: 20 }}
        >

                <TouchableOpacity
                    key={item.imageUrl}
                    style={styles.destinationCard}
                    onPress={() => {
                        // setQuery(`Exploring ${destination.name}, ${destination.country}`);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                >
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.destinationImage}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                        style={styles.destinationGradient}
                    />
                    <View style={styles.destinationContent}>
                        {/* <Text style={styles.destinationName}>{item.name}</Text> */}
                        <View style={styles.destinationDetails}>
                            <View style={styles.locationContainer}>
                                <MapPin size={12} color="#FFFFFF" />
                                <Text style={styles.destinationCountry}>{item?.name}</Text>
                            </View>
                            <View style={styles.ratingContainer}>
                                <Heart size={12} color="#FF6B6B" fill="#FF6B6B" />
                                <Text style={styles.destinationRating}>4.5</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

        </ScrollView>
        )

    };

    return (
        <View className="flex-1">
            <FlatList
                data={cities}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};


export const TopTrendsFromYourCity = ({ data }) => {
    const [cities, setCities] = useState([]);

    // console.log('TopPicksCityList console.log: ', cities)
    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const topTrends = await TopTrendsFromYourCityApi();
            // console.log('TopPicksOnlyForYou:',topPicks);
            const data = enrichDataWithCityNames(topTrends.data)
            // console.log('data: ', data)
            await fetchCitiesWithImages(data)
        } catch (error) {
            console.error("Error during fetching top trends city list:", error);
        }
    };

    const enrichDataWithCityNames = (apiResponse) => {
        // console.log('data enrichDataWithCityNames: ', apiResponse)
        return {
            data: apiResponse?.data?.map((item) => ({
                ...item,
                cityName: cityCodes[item.destination] || "Unknown City",
            }))
        };
    };

    const fetchCitiesWithImages = async (data) => {
        // if (!data) return;
        // console.log('data: ', data)

        try {
            const citiesWithImages = await Promise.all(
                data?.data?.map(async (city) => {
                    try {
                        const imageResponse = await GetPixabayImageByCityName(city.cityName);
                        const parsedData = await JSON.parse(imageResponse);
                        const image = parsedData.hits?.[0]?.largeImageURL || null;
                        return { ...city, imageUrl: image };
                    } catch (error) {
                        console.error(`Failed to fetch image for ${city.cityName}:`, error);
                        return { ...city, imageUrl: null };
                    }
                })
            );
            setCities(citiesWithImages);
        } catch (error) {
            console.error("Error fetching cities with images:", error);
        }
    };


    const renderItem = ({ item }) => {

        // const data = GetPixabayImageByCityName(item.name)

        // console.log('GetPixabayImageByCityName console.log: ', data)

        return (
            <TouchableOpacity className="">
                {item.cityName && (
                    <Image
                        source={{
                            uri: item?.imageUrl || 'https://pixabay.com/get/g287906a7b5515377d1ba198513b0c7e39375da25c6a28dcbdac56afe7fcd3d4a24e45abeffb17b4a0dcac2ee8c2f09a45bd25eefb4919c55c143f57d36c67e11_1280.jpg',
                        }}
                        style={{ width: 250, height: 150, borderRadius: 10, marginRight: 10, objectFit: 'none' }}
                        className="object-contain"
                    />
                )}
                <View style={{ marginVertical: 5, marginLeft: 2 }}>
                    <Text className="font-normal text-lg text-gray-900">
                        {item.cityName}
                    </Text>
                </View>
            </TouchableOpacity>
        )

    };

    return (
        <View className="flex-1">
            <FlatList
                data={cities}
                renderItem={renderItem}
                keyExtractor={(item) => item.destination}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};


export const ExploreFlatList = ({ category, onLoading }) => {
    const [places, setPlaces] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const width = Dimensions.get('window').width



    // types for google api
    const body = {
        "includedPrimaryTypes": [
            category,
        ],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": 51.50887172852202,
                    "longitude": -0.13662853272365194,
                },
                "radius": 15000
            }
        }
    }

    // onLoading(true)
    useEffect(() => {
        // console.log('category:', hotelDetails);
        fetchData()
        // setTimeout(() => {
            
        //     onLoading(false);
        // }, 2000);
    }, [category]);

    const fetchData = async () => {
        try {
            if (category === "hotel") {

                setPlaces(hotelDetails.properties)

                // console.log('popularDestinations:', hotelDetails.properties);

            } else {
                const popularDestinations = await GetPlaceDetails(body);

                setPlaces(popularDestinations.places);
            }
            // console.log('popularDestinations:', popularDestinations.places);

        } catch (error) {
            console.error("Error during ExploreFlatList city list:", error);
        }
    };

    const renderItem = ({ item }) => (
            // <View>
            //     <TouchableOpacity style={styles.card}>
            //         {item.images && item.images.length > 0 && (
            //             <View>

            //                 <Carousel
            //                     loop
            //                     width={width - 35}
            //                     height={200}
            //                     autoPlay={false}
            //                     data={item.images}
            //                     scrollAnimationDuration={1000}
            //                     renderItem={({ item }) => (
            //                         <Image
            //                             source={{ uri: item.original_image }}
            //                             style={{ width: width - 35, height: 200, borderRadius: 12, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            //                             className="object-cover"
            //                         />
            //                     )}
            //                 />
            //                 <View style={styles.ratingContainer}>
            //                     <Text style={styles.ratingText}>★ {item.location_rating} {item.reviews && `(${item.reviews})`}</Text>
            //                 </View>

            //             </View>
            //         )}

            //         {/* Hotel Info */}
            //         <View>
            //             <View style={{ padding: 10 }}>
            //                 {/* Hotel Info */}
            //                 {/* Amenities */}
            //                 <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5 px-2">
            //                     {item?.amenities?.map((amenity, index) => (
            //                         <View key={index} style={styles.aminityContainer}>
            //                             <Text style={styles.aminityText}>{amenity}</Text>
            //                         </View>
            //                     ))}
            //                 </ScrollView>


            //                 <View className="mt-2" style={{ marginLeft: 10 }}>
            //                     <Text style={styles.sourceName} >{item.name}</Text>
            //                 </View>

            //                 {/* Pricing & Deals */}

            //                 <View style={styles.priceContainer}>
            //                     <View>
            //                         <Text style={styles.priceLabel}>Starting from</Text>
            //                         <Text style={styles.priceValue}>{item?.rate_per_night?.lowest || "N/A"}</Text>
            //                         <Text style={styles.priceSubtext}>per night</Text>
            //                     </View>
            //                     <TouchableOpacity style={styles.bookButton} onPress={() => router.push(`/${category}/${item?.id}`)}>
            //                         <Text style={styles.bookButtonText}>Book Now</Text>
            //                     </TouchableOpacity>
            //                 </View>

            //             </View>
            //         </View>



            //     </TouchableOpacity>
            // </View>

        category?.toString() === "hotel" ? (<View className="p-3">
            <HotelCard hotel={item} />
        </View>) :
            (<View className="p-3">
                <Link href={{ pathname: `/${category}/${item?.id}`, params: { name: item?.displayName?.text, phoneNumber: item?.internationalPhoneNumber, latitude: item?.location?.latitude, longitude: item?.location?.longitude } }} asChild>
                    <TouchableOpacity className="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl">
                        {item.photos && item.photos.length > 0 && (
                            <View
                            >
                                <Image
                                    source={{
                                        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${item.photos[0].name.split("/photos/")[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY}`,
                                    }}
                                    style={{ width: Dimensions.get('window').width - 35, height: 200, borderRadius: 10, objectFit: 'none' }}
                                    className="object-contain"
                                />
                                <View style={styles.ratingContainer}>
                                    <Text style={styles.ratingText}>★ {item.rating || "N/A"}</Text>
                                </View>
                            </View>
                        )}
                        <View style={{ marginVertical: 5, marginLeft: 2 }}>
                            <View style={styles.container}>
                                {/* Display Name */}
                                <Text style={styles.displayName}>
                                    {item?.displayName?.text || "Unknown Place"}
                                </Text>

                                {/* Address */}
                                {item.formattedAddress && (
                                    <View>
                                        <Text style={styles.address}>{item.formattedAddress}</Text>
                                        <Text style={styles.address}>Category: {category}</Text>
                                    </View>
                                )}




                            </View>
                        </View>
                    </TouchableOpacity>
                </Link>
            </View>)
    );

    return (
        <View className="flex-1">
            <FlatList
                data={places}
                renderItem={renderItem}
                keyExtractor={(item) => Date.now().toString() + Math.random().toString(36).substring(7)}
                vertical={true}
                showsVerticalScrollIndicator={false}
                className="mr-5"
            />
        </View>
    );



};

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        marginBottom: 30,
    },
    sourceName: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
        marginTop: 20
    },
    card: {
        borderRadius: 12, // rounded-xl
        marginBottom: 20, // p-3
        borderWidth: 1, // border
        borderColor: "#f3f4f6", // border-gray-100
        backgroundColor: '#f8f8f8',
    },
    displayName: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1f2937", // gray-900
    },
    address: {
        fontSize: 14,
        color: "#6b7280", // gray-600
        marginTop: 4,
    },
    ratingContainer: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "white", // Semi-transparent background
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    ratingText: {
        color: "black", // Gold/yellow color for stars
        fontWeight: "600",
        fontSize: 16,
    },
    aminityContainer: {
        backgroundColor: "#f1f1f1", // Semi-transparent background
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 7,
        marginTop: 7,
    },
    aminityText: {
        color: "black", // Gold/yellow color for stars
        fontWeight: "600",
        fontSize: 12,
    },
    viewDetails: {
        backgroundColor: "black", // Semi-transparent background
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginRight: 7,
        marginTop: 7,
    },
    viewDetailsText: {
        color: "white", // Semi-transparent background
        fontWeight: "bold"
    },
    viewDealContainer: {
        display: "flex", // Semi-transparent background
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15
    },
    reviewCount: {
        color: "#fff", // gray-600
        fontSize: 14,
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 12,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    websiteButton: {
        backgroundColor: "#3b82f6", // blue-500
    },
    mapsButton: {
        backgroundColor: "#1f2937", // gray-800
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: '#f8f8f8',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 16,
        // marginBottom: 24,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    priceSubtext: {
        fontSize: 14,
        color: '#666',
    },
    bookButton: {
        backgroundColor: '#1a1a1a',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    trendingContainer: {
        // marginBottom: 20,
    },
    destinationCard: {
        width: 150,
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        // marginLeft: 5,
        // marginBottom: 10,
        position: 'relative',
    },
    destinationImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    destinationGradient: {
        position: 'absolute',
        width: '100%',
        height: '70%',
        bottom: 0,
        zIndex: 1,
    },
    destinationContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        zIndex: 2,
    },
    destinationName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    destinationDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    destinationCountry: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    destinationRating: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 4,
    },
});
