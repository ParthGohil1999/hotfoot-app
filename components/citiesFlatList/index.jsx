import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from "axios"
import { GetPixabayImageByCityName } from '../../services/PixabayApi';

export const CityList = ({ data }) => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        if (data && data.results) {
            setPlaces(data.results);
        }
    }, [data]);

    const renderItem = ({ item }) => (
        <TouchableOpacity className="flex items-center justify-center" style={{marginRight: 10}}>
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
        const fetchCitiesWithImages = async () => {
            if (!data) return;

            try {
                const citiesWithImages = await Promise.all(
                    data.data.map(async (city) => {
                        try {
                            const imageResponse = await GetPixabayImageByCityName(city.name);
                            const parsedData = JSON.parse(imageResponse);
                            const image = parsedData.hits?.[0]?.largeImageURL || null;
                            return { ...city, imageUrl: image };
                        } catch (error) {
                            console.error(`Failed to fetch image for ${city.name}:`, error);
                            return { ...city, imageUrl: null };
                        }
                    })
                );
                setCities(citiesWithImages);
            } catch (error) {
                console.error("Error fetching cities with images:", error);
            }
        };

        fetchCitiesWithImages();
    }, [data]);

    const renderItem = ({ item }) => {

        // const data = GetPixabayImageByCityName(item.name)

        // console.log('GetPixabayImageByCityName console.log: ', data)

        return (
            <TouchableOpacity className="">
                {item.name && (
                    <Image
                        source={{
                            uri: item.imageUrl,
                        }}
                        style={{ width: 250, height: 150, borderRadius: 10, marginRight: 10, objectFit: 'none' }}
                        className="object-contain"
                    />
                )}
                <View style={{ marginVertical: 5, marginLeft: 2 }}>
                    <Text className="font-normal text-lg text-gray-900">
                        {item.name}
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
        const fetchCitiesWithImages = async () => {
            if (!data) return;

            try {
                const citiesWithImages = await Promise.all(
                    data.data.map(async (city) => {
                        try {
                            const imageResponse = await GetPixabayImageByCityName(city.cityName);
                            const parsedData = JSON.parse(imageResponse);
                            const image = parsedData.hits?.[0]?.largeImageURL || null;
                            return { ...city, imageUrl: image };
                        } catch (error) {
                            console.error(`Failed to fetch image for ${city.destination}:`, error);
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

        fetchCitiesWithImages();
    }, [data]);

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

