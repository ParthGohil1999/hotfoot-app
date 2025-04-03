import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import useTripSearchStore from '../../app/store/trpiSearchZustandStore';
import DatePickerModal from '../datePickerModal/datePickerModal';
import * as Haptics from 'expo-haptics';

// Enhanced Hotel Card Component in Row View with Monochrome Theme - Shorter Version
export const HotelCard = ({ hotel }) => {
    const navigation = useNavigation();
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const {
        setDatesToStore,
        resetSearch
    } = useTripSearchStore();

    const handleDateConfirm = (selectedDates) => {
        console.log('selectedDates:', selectedDates)
        setDatesToStore({ startDate: selectedDates.startDate, endDate: selectedDates.endDate });
        navigation.navigate('hotel/[id]', { property_token: hotel?.property_token });
    };
    // create a function handlePress to handle the press event on the card, when the card is pressed, it will log the hotel name user should redirect to the hotel details page, with the hotel id
    const handlePress = () => {
        console.log('Card Pressed: ', hotel?.name);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        resetSearch();
        setIsDatePickerVisible(true);

    };
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [])
    // console.log(hotel);
    return (
        loading ? (<ActivityIndicator size="large" color="#0000ff" />) : (

            <TouchableOpacity onPress={handlePress}>
                <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                        type: 'timing',
                        duration: 600,
                        delay: 200
                    }}
                    style={styles.hotelCard}
                    onpress={() => console.log('Card Pressed')}
                >

                    {/* Left side image with overlay gradient */}
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: hotel?.images[0]?.original_image }} style={styles.hotelImage} />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.imageGradient}
                        />
                        {hotel?.discount && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>-{hotel?.discount}%</Text>
                            </View>
                        )}
                    </View>

                    {/* Right side content */}
                    <View style={styles.hotelContent} >
                        {/* Header with name and heart icon */}
                        <View style={styles.hotelHeader}>
                            <Text style={styles.hotelName} numberOfLines={1}>{hotel?.name}</Text>
                            {/* <TouchableOpacity style={styles.favoriteButton}>
                        <Text style={styles.heartIcon}>♡</Text>
                    </TouchableOpacity> */}
                        </View>

                        {/* Location with icon */}
                        <View style={styles.locationContainer}>
                            <View style={styles.locationDot} />
                            <Text style={styles.locationText} numberOfLines={1}>
                                {`${hotel?.nearby_places[0]?.name || 'Dublin City Centre'} - ${hotel?.nearby_places[0]?.transportations[0]?.duration || '5 min'}s ${hotel?.nearby_places[0]?.transportations[0]?.type}`}
                            </Text>
                        </View>

                        {/* Rating and price in one row */}
                        <View style={styles.bottomRow}>
                            <View style={styles.ratingContainer}>
                                <View style={styles.ratingBadge}>
                                    <Text style={styles.ratingScore}>{hotel?.location_rating || '4.8'}</Text>
                                </View>
                                <View style={styles.starsContainer}>
                                    {Array(5).fill(0).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={10}
                                            color={i < Math.floor(hotel?.location_rating || 4.8) ? "#CCCCCC" : "#E0E0E0"}
                                        />
                                    ))}
                                </View>
                            </View>
                            <View style={styles.priceContainer}>
                                {hotel?.deal_description && (
                                    <Text style={styles.originalPrice}>{hotel?.deal_description}</Text>
                                )}
                                <Text style={styles.currentPrice}>{hotel?.rate_per_night?.lowest} / night</Text>
                            </View>

                        </View>

                        {/* Book button */}
                        {/* <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity> */}
                    </View>
                </MotiView>
                <DatePickerModal
                    visible={isDatePickerVisible}
                    onClose={() => setIsDatePickerVisible(false)}
                    onSelectDates={handleDateConfirm}
                    activeTab={'Places'}
                    tripType={'Round Trip'}
                // initialDates={dates}
                />
            </TouchableOpacity>
        )
    );
};

// Updated styles with reduced height
const styles = StyleSheet.create({
    hotelCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        overflow: 'hidden',
        height: 90, // Reduced from 170
        borderWidth: 1,
        borderColor: '#f0f0f0',
        // marginRight: 16,
    },
    imageContainer: {
        width: '35%', // Slightly reduced from 40%
        position: 'relative',
    },
    hotelImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#333333',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    hotelContent: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    hotelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hotelName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        flex: 1,
    },
    favoriteButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartIcon: {
        fontSize: 14,
        color: '#666666',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    locationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#AAAAAA',
        marginRight: 4,
    },
    locationText: {
        fontSize: 10,
        color: '#666666',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBadge: {
        backgroundColor: '#444444',
        width: 28,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    ratingScore: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: 10,
        color: '#999999',
        // textDecorationLine: 'line-through',
        marginRight: 4,
    },
    currentPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
    },
    bookButton: {
        backgroundColor: '#222222',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 6,
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

// Implementation in the main component
const renderHotelCards = () => {
    const hotelData = [
        {
            name: 'LATICOUPE Jacobs Inn Dublin',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
            rating: 4.2,
            reviews: '1.1K',
            price: '64',
            originalPrice: '89',
            location: 'Dublin City Centre - 0.5 mi from center',
            verified: true,
            recommended: true
        },
        {
            name: 'The Plaza Hotel',
            image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            rating: 4.5,
            reviews: '1.1K',
            price: '76',
            originalPrice: '105',
            discount: 28,
            location: 'Temple Bar - 0.2 mi from center',
            verified: true
        },
        {
            name: 'Premier Inn Dublin City Centre',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2070&auto=format&fit=crop',
            rating: 4.8,
            reviews: '2.3K',
            price: '82',
            location: 'Grafton Street - 0.3 mi from center',
            recommended: true
        }
    ];

    return (
        <View style={styles.hotelCardsContainer}>
            {hotelData.map((hotel, index) => (
                <HotelCard key={index} hotel={hotel} />
            ))}
        </View>
    );
};

// Add this to your main styles
// styles.hotelCardsContainer = {
//   paddingHorizontal: 16,
//   marginTop: 16,
// };