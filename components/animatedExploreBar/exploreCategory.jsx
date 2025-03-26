import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import {
    Mic,
    Search,
    X,
    Sparkles,
    Plane,
    Hotel,
    Castle,
    Palmtree,
    MapPin,
    Compass,
    Utensils,
    Heart,
    ArrowLeft
} from 'lucide-react-native';
import TripSearchPage from '../tripSearch/tripSearch';
import modalVisibility from '../modalVisiblity/modalvisiblity';
import * as Haptics from 'expo-haptics';
import { SearchModal } from './SearchModal';

// Create an AnimatedLinearGradient component
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ExploreCategory = ({

    onCategorySelect,
    //   selectedCategory,
    //   style
}) => {
    const handleCategorySelect = (category) => {
        if (onCategorySelect) {
            onCategorySelect(category);
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('');

    const handlePress = (tabName) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedTab(tabName);
        setModalVisible(true);
    };


    const categories = [
        {
            icon: Castle,
            label: 'Experiences',
            tab: 'Places',
            // color: 'black',
            gradient: ['white', 'wwhite'],
            description: 'Unforgettable moments',
        },
        {
            icon: Plane,
            label: 'Flights',
            tab: 'Flights',
            // color: 'white',
            gradient: ['white', 'wwhite'],
            description: 'Find the best deals',
        },
        {
            icon: Hotel,
            label: 'Hotels',
            tab: 'Hotels',
            // color: 'black',
            gradient: ['white', 'wwhite'],
            description: 'Luxury to budget stays',
        },
        // {
        //     icon: Palmtree,
        //     label: 'Beaches',
        //     color: 'black',
        //     gradient: ['black'],
        //     description: 'Perfect getaways',
        // },
        // {
        //     icon: Utensils,
        //     label: 'Dining',
        //     color: 'black',
        //     gradient: ['black'],
        //     description: 'Culinary adventures',
        // },
        // {
        //     icon: Compass,
        //     label: 'Tours',
        //     color: 'black',
        //     gradient: ['black'],
        //     description: 'Guided explorations',
        // },
    ];


    return (
        <View style={[styles.categoriesContainer]}>

            {categories.map((category, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.categoryButton}
                    onPress={() => handlePress(category.tab)}

                >
                    <AnimatedLinearGradient
                        colors={category.gradient}
                        style={[
                            styles.categoryGradient,
                            //   selectedCategory?.label === category.label && styles.selectedCategory,
                        ]}
                    >
                        {category.icon && <category.icon size={24} color="black" />}
                    </AnimatedLinearGradient>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                </TouchableOpacity>
            ))}

            <SearchModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                tabName={selectedTab} />
        </View>
    );
};

const styles = StyleSheet.create({
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingRight: 15,
        marginVertical: 15,
    },
    categoryButton: {
        justifyContentc: 'center',
        alignItems: 'center',
        marginBottom: 15,
        width: '30%', // Adjust based on how many items you want per row
    },
    categoryGradient: {
        width: 60,
        height: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    selectedCategory: {
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    categoryDescription: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});

export default ExploreCategory;