import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';

const categories = [
    {
        categoryName: 'hotel',
        name: 'Hotel',
        icon: 'hotel',
    },
    {
        categoryName: 'tourist_attraction',
        name: 'Attraction',
        icon: 'attractions',
    },
    // {
    //     name: 'Activities',
    //     icon: 'local-activity',
    // },
    //   {
    //     name: 'Trending',
    //     icon: 'local-fire-department',
    //   },
    // {
    //     name: 'Events',
    //     icon: 'event',
    // },
    {
        categoryName: 'restaurant',
        name: 'Restaurants',
        icon: 'local-restaurant',
    },
    {
        categoryName: 'pub',
        name: 'Local Bar',
        icon: 'local-bar',
    },
    {
        categoryName: 'cafe',
        name: 'Local Cafe',
        icon: 'local-cafe',
    },
    {
        categoryName: 'atm',
        name: 'Local ATM',
        icon: 'local-atm',
    },
    {
        categoryName: 'airport',
        name: 'Airports',
        icon: 'local-airport',
    },
    {
        categoryName: 'gas_station',
        name: 'Gas Station',
        icon: 'local-gas-station',
    },
    {
        categoryName: 'grocery_store',
        name: 'Grocery store',
        icon: 'local-grocery-store',
    },
    {
        categoryName: 'hospital',
        name: 'Hospital',
        icon: 'local-hospital',
    },
    {
        categoryName: 'shopping_mall',
        name: 'Shopping mall',
        icon: 'local-mall',
    },
    {
        categoryName: 'movie_theater',
        name: 'Movies',
        icon: 'local-movies',
    },
    {
        categoryName: 'parking',
        name: 'Parking',
        icon: 'local-parking',
    },
    {
        categoryName: 'pharmacy',
        name: 'Pharmacy',
        icon: 'local-pharmacy',
    },
];



const ExploreHeader = ({ onCategoryChanged }) => {

    const scrollRef = useRef(null);
    const itemsRef = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const selectCategory = (index) => {
        const selected = itemsRef.current[index];
        if (!selected) return; // Prevents errors if the reference is missing
        setActiveIndex(index);
        selected?.measure((x) => {
            scrollRef.current?.scrollTo({ x: x - 2, y: 0, animated: true });
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onCategoryChanged(categories[index].categoryName);
    };

    return (

        <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                alignItems: 'center',
                gap: 30,
                paddingVertical: 15,
                paddingRight: 20,

            }}>
            {categories.map((item, index) => (
                <TouchableOpacity
                    ref={(el) => (itemsRef.current[index] = el)}
                    key={index}
                    style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                    onPress={() => selectCategory(index)}>
                    <MaterialIcons
                        name={item.icon}
                        size={24}
                        color={activeIndex === index ? '#000' : 'grey'}
                    />
                    <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: 130,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 10,
        },
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 16,
    },

    searchBtn: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 10,
        padding: 14,
        alignItems: 'center',
        width: 280,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#c2c2c2',
        borderRadius: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 1,
            height: 1,
        },
    },
    filterBtn: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#A2A0A2',
        borderRadius: 24,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'mon-sb',
        color: 'grey',
    },
    categoryTextActive: {
        fontSize: 14,
        fontFamily: 'mon-sb',
        color: '#000',
    },
    categoriesBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
    },
    categoriesBtnActive: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#000',
        borderBottomWidth: 2,
        paddingBottom: 8,
    },
});

export default ExploreHeader;