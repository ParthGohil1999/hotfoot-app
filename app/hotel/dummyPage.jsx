import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    Modal,
    Dimensions,
    Platform,
    Animated
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import ReviewBreakdown from '../../components/reviews/reviewBreakDown';
import HotelPricingScreen from './hotelPrice';
import { hotelDetails } from '../../constants/hoteldetails'

const { width, height } = Dimensions.get('window');

export default function HotelDetailsScreen() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [galleryModalVisible, setGalleryModalVisible] = useState(false);
    const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);
    const [readMoreExpanded, setReadMoreExpanded] = useState(false);
    const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
    const flatListRef = useRef(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [barStyle, setBarStyle] = useState("light-content");

    useEffect(() => {
        const listener = scrollY.addListener(({ value }) => {
            setBarStyle(value > 0 ? "dark-content" : "light-content");
        });

        return () => scrollY.removeListener(listener);
    }, [scrollY]);




    // Sample data for images
    const hotelImages = [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1760&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1770&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1770&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1770&auto=format&fit=crop',
    ];

    const galleryImages = [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1760&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1770&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1770&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1770&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1770&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540304453527-62f979142a17?q=80&w=1770&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1932&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1770&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1770&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1770&auto=format&fit=crop',
    ];

    // Sample data for facilities
    const facilities = [
        { name: 'Wi-Fi', icon: 'wifi', component: 'MaterialIcons' },
        { name: 'Swimming Pool', icon: 'pool', component: 'MaterialIcons' },
        { name: 'Gym', icon: 'fitness-center', component: 'MaterialIcons' },
        { name: 'Restaurant', icon: 'restaurant', component: 'MaterialIcons' },
        { name: 'Spa', icon: 'spa', component: 'MaterialIcons' },
        { name: 'Parking', icon: 'local-parking', component: 'MaterialIcons' },
        { name: 'Room Service', icon: 'room-service', component: 'MaterialIcons' },
        { name: 'Air Conditioning', icon: 'air', component: 'FontAwesome5' },
    ];

    // Sample data for reviews
    const reviews = [
        {
            id: '1',
            name: 'Sophia Miller',
            date: 'March 2, 2025',
            rating: 4.9,
            comment: 'Absolutely stunning hotel with incredible service! The rooms are spacious and beautifully designed. The location is perfect for exploring the city. Will definitely stay here again.',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
        },
        {
            id: '2',
            name: 'Michael Johnson',
            date: 'February 24, 2025',
            rating: 4.7,
            comment: 'Great experience overall. The staff was attentive and the amenities were top-notch. The only minor issue was the slow Wi-Fi in the evenings.',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',
        },
        {
            id: '3',
            name: 'Michael Johnson',
            date: 'February 24, 2025',
            rating: 4.7,
            comment: 'Great experience overall. The staff was attentive and the amenities were top-notch. The only minor issue was the slow Wi-Fi in the evenings.',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',
        },
    ];

    // Function to navigate through main image carousel
    const navigateImages = (direction) => {
        let newIndex;
        if (direction === 'next') {
            newIndex = (currentImageIndex + 1) % hotelImages.length;
        } else {
            newIndex = (currentImageIndex - 1 + hotelImages.length) % hotelImages.length;
        }
        setCurrentImageIndex(newIndex);
    };

    const renderImageDot = (index) => (
        <TouchableOpacity
            key={index}
            onPress={() => setCurrentImageIndex(index)}
            style={[
                styles.imageDot,
                { backgroundColor: currentImageIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.5)' }
            ]}
        />
    );

    const renderFacility = ({ item }) => {
        let icon;
        switch (item.component) {
            case 'MaterialIcons':
                icon = <MaterialIcons name={item.icon} size={24} color="black" />;
                break;
            case 'FontAwesome':
                icon = <FontAwesome name={item.icon} size={24} color="black" />;
                break;
            case 'FontAwesome5':
                icon = <FontAwesome5 name={item.icon} size={24} color="black" />;
                break;
            default:
                icon = <Ionicons name={item.icon} size={24} color="black" />;
        }

        return (
            <View style={styles.facilityItem}>
                <View style={styles.facilityIconContainer}>
                    {icon}
                </View>
                <Text style={styles.facilityText}>{item.name}</Text>
            </View>
        );
    };

    const renderRatingBar = (percentage) => (
        <View style={styles.ratingBarContainer}>
            <View style={[styles.ratingBar, { width: `${percentage}%` }]} />
        </View>
    );

    const renderReview = ({ item }) => (
        <Animated.View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <Image source={{ uri: item.avatar }} style={styles.reviewAvatar} />
                <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{item.name}</Text>
                    <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
        </Animated.View>
    );

    const renderGalleryItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.galleryGridItem}
            onPress={() => {
                setSelectedGalleryImage(index);
                setGalleryModalVisible(true);
            }}
        >
            <Image source={{ uri: item }} style={styles.galleryGridImage} />
            <View style={styles.galleryImageOverlay} />
        </TouchableOpacity>
    );

    // Navigate back functionality
    const handleBack = () => {
        // This would typically use navigation.goBack() with React Navigation
        console.log('Navigate back');
    };

    const fullDescription = `Nestled in the heart of Paris, the Royale President Hotel is a luxurious sanctuary of refined elegance and unparalleled comfort. 

Our meticulously designed rooms blend contemporary aesthetics with classic Parisian charm, featuring plush bedding, marble bathrooms, and breathtaking views of the city's iconic skyline.

Indulge your palate at our Michelin-starred restaurant, where our renowned chef crafts exquisite culinary masterpieces using the finest local ingredients. For relaxation, our spa offers a tranquil retreat with innovative treatments designed to rejuvenate body and mind.

Just steps away from the famous Place de la Madeleine, you'll find yourself perfectly positioned to explore the city's most treasured landmarks, boutique shops, and hidden gems. Whether you're visiting for business or pleasure, our dedicated concierge team stands ready to curate unforgettable experiences tailored to your preferences.`;

    const shortDescription = `${fullDescription.slice(0, 170)}...`;

    // Animated header opacity based on scroll position
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 10],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle={barStyle} translucent backgroundColor="transparent" />

            {/* Animated Header */}
            <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity, }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Royale President Hotel</Text>
                    <TouchableOpacity style={styles.headerButton}>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Gallery Modal */}
            <Modal
                animationType="fade"
                transparent={false}
                visible={galleryModalVisible}
                onRequestClose={() => setGalleryModalVisible(false)}
            >
                <SafeAreaView style={styles.galleryModalContainer}>
                    <View style={styles.galleryModalHeader}>
                        <TouchableOpacity
                            style={styles.galleryModalBackButton}
                            onPress={() => setGalleryModalVisible(false)}
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.galleryModalTitle}>Hotel Gallery</Text>
                        <TouchableOpacity style={styles.galleryModalShareButton}>
                            <Ionicons name="share-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={galleryImages}
                        renderItem={({ item, index }) => (
                            <View style={styles.galleryModalImageContainer}>
                                <Image
                                    source={{ uri: item }}
                                    style={styles.galleryModalImage}
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                        keyExtractor={(_, index) => index.toString()}
                        initialNumToRender={6}
                        maxToRenderPerBatch={8}
                        windowSize={5}
                        removeClippedSubviews={true}
                        getItemLayout={(data, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        pagingEnabled
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.galleryModalContent}
                        onLayout={() => {
                            if (selectedGalleryImage > 0 && flatListRef.current) {
                                flatListRef.current.scrollToIndex({
                                    index: selectedGalleryImage,
                                    animated: false
                                });
                            }
                        }}
                    />
                    <View style={styles.galleryPagination}>
                        <Text style={styles.galleryPaginationText}>
                            {selectedGalleryImage + 1} / {galleryImages.length}
                        </Text>
                    </View>
                </SafeAreaView>
            </Modal>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Main Image Carousel */}
                <View style={styles.imageCarousel}>
                    <Image
                        source={{ uri: hotelImages[currentImageIndex] }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent']}
                        style={styles.imageGradientTop}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                        style={styles.imageGradientBottom}
                    />
                    <View style={styles.imageOverlay}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                        >
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={styles.rightButtons}>
                            <TouchableOpacity style={styles.bookmarkButton}>
                                <Ionicons name="heart-outline" size={22} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareButton}>
                                <Ionicons name="share-social-outline" size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Image navigation controls */}
                    <TouchableOpacity
                        style={[styles.imageNavButton, styles.imageNavButtonLeft]}
                        onPress={() => navigateImages('prev')}
                    >
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.imageNavButton, styles.imageNavButtonRight]}
                        onPress={() => navigateImages('next')}
                    >
                        <Ionicons name="chevron-forward" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={styles.imageDots}>
                        {hotelImages.map((_, index) => renderImageDot(index))}
                    </View>
                </View>

                {/* Hotel Name and Location */}
                <View style={styles.hotelInfo}>
                    <Text style={styles.hotelName}>Royale President Hotel</Text>
                    <View style={styles.locationContainer}>
                        <MaterialIcons name="location-on" size={18} color="black" />
                        <Text style={styles.locationText}>79 Place de la Madeleine, Paris, 75009, France</Text>
                    </View>

                    {/* Rating Badge */}
                    <View style={styles.ratingBadge}>
                        <View style={styles.ratingStarContainer}>
                            <Ionicons name="star" size={16} color="#fff" />
                            <Text style={styles.ratingBadgeText}>4.8</Text>
                        </View>
                        <Text style={styles.reviewCountBadge}>(4,781)</Text>
                    </View>
                </View>

                {/* Price and quick info */}
                <View style={styles.section}>

                    <View style={styles.quickInfoContainer}>
                        <View style={styles.infoCard}>
                            <FontAwesome name="calendar-check-o" size={24} color="black" />

                            <Text style={styles.infoLabel}>Check-in</Text>
                            <Text style={styles.infoValue}>3:00 PM</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <MaterialCommunityIcons name="exit-run" size={24} color="black" />
                            <Text style={styles.infoLabel}>Check-out</Text>
                            <Text style={styles.infoValue}>12:00 PM</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Ionicons name="people-outline" size={24} color="black" />
                            <Text style={styles.infoLabel}>Guests</Text>
                            <Text style={styles.infoValue}>2 Adults</Text>
                        </View>
                    </View>

                </View>


                {/* Gallery Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Gallery Photos</Text>
                        <TouchableOpacity
                            onPress={() => setGalleryModalVisible(true)}
                            style={styles.seeAllButton}
                        >
                            <Text style={styles.seeAllText}>See All</Text>
                            <Ionicons name="chevron-forward" size={16} color="black" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={galleryImages.slice(0, 5)}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedGalleryImage(index);
                                    setGalleryModalVisible(true);
                                }}
                                style={styles.galleryImageContainer}
                            >
                                <Image
                                    source={{ uri: item }}
                                    style={styles.galleryImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.galleryList}
                    />
                </View>

                {/* Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Details</Text>
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconContainer}>
                                <MaterialIcons name="apartment" size={20} color="black" />
                            </View>
                            <Text style={styles.detailText}>Luxury Hotel</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconContainer}>
                                <MaterialIcons name="hotel" size={20} color="black" />
                            </View>
                            <Text style={styles.detailText}>4 Bedrooms</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconContainer}>
                                <MaterialIcons name="bathtub" size={20} color="black" />
                            </View>
                            <Text style={styles.detailText}>2 Bathrooms</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconContainer}>
                                <MaterialIcons name="straighten" size={20} color="black" />
                            </View>
                            <Text style={styles.detailText}>4000 sqft</Text>
                        </View>
                    </View>
                </View>

                {/* Description Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                        {readMoreExpanded ? fullDescription : shortDescription}
                    </Text>
                    <TouchableOpacity
                        style={styles.readMoreButton}
                        onPress={() => setReadMoreExpanded(!readMoreExpanded)}
                    >
                        <Text style={styles.readMoreText}>
                            {readMoreExpanded ? "Read less" : "Read more"}
                        </Text>
                        <Ionicons
                            name={readMoreExpanded ? "chevron-up" : "chevron-down"}
                            size={14}
                            color="black"
                            style={{ marginLeft: 4 }}
                        />
                    </TouchableOpacity>
                </View>

                {/* Facilities Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Facilities</Text>
                    <FlatList
                        data={facilities}
                        renderItem={renderFacility}
                        keyExtractor={(item) => item.name}
                        numColumns={4}
                        scrollEnabled={false}
                        contentContainerStyle={styles.facilitiesContainer}
                    />
                </View>

                {/* Location Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>Directions</Text>
                            <MaterialIcons name="directions" size={16} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.mapContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?q=80&w=2031&auto=format&fit=crop' }}
                            style={styles.mapImage}
                            resizeMode="cover"
                        />
                        <View style={styles.mapOverlay} />
                        <View style={styles.mapPinContainer}>
                            <MaterialIcons name="location-on" size={28} color="black" />
                        </View>
                        <View style={styles.mapLocationInfo}>
                            <Text style={styles.mapLocationTitle}>Paris, France</Text>
                            <Text style={styles.mapLocationSubtitle}>Heart of the city</Text>
                        </View>
                    </View>
                </View>

                {/* Reviews Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.reviewHeaderContainer}>
                            <Text style={styles.sectionTitle}>Reviews</Text>
                            <View style={styles.ratingDisplay}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.ratingNumber}>4.8</Text>
                                <Text style={styles.reviewCount}>(4,781 reviews)</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setReviewsModalVisible(true)} style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>See All</Text>
                            <Ionicons name="chevron-forward" size={16} color="black" />
                        </TouchableOpacity>
                    </View>

                    <Modal
                        visible={reviewsModalVisible}
                        animationType="slide"
                        onRequestClose={() => setReviewsModalVisible(false)}
                    >
                        <SafeAreaView style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity
                                    onPress={() => setReviewsModalVisible(false)}
                                    style={styles.modalCloseButton}
                                >
                                    <Ionicons name="close" size={24} color="#1F2937" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>All Reviews</Text>
                                <View style={styles.modalHeaderRight} />
                            </View>
                            <ScrollView className="flex container  h-full " showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Guest Reviews</Text>
                                    <View style={styles.overallRating}>
                                        <Text style={styles.overallRatingNumber}>3.8</Text>
                                        <View style={styles.ratingDetails}>
                                            <Text style={styles.ratingCount}>Based on {5647} reviews</Text>
                                            <View style={styles.ratingStars}>
                                                <Star size={16} color="black" />
                                                <Star size={16} color="black" />
                                                <Star size={16} color="black" />
                                                <Star size={16} color="black" />
                                                <Star size={16} color="#DDD" />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.ratingBars}>
                                        <View style={styles.ratingBarRow}>
                                            <Text style={styles.ratingBarLabel}>5</Text>
                                            {renderRatingBar(42)}
                                            <Text style={styles.ratingBarCount}>2,354</Text>
                                        </View>
                                        <View style={styles.ratingBarRow}>
                                            <Text style={styles.ratingBarLabel}>4</Text>
                                            {renderRatingBar(27)}
                                            <Text style={styles.ratingBarCount}>1,542</Text>
                                        </View>
                                        <View style={styles.ratingBarRow}>
                                            <Text style={styles.ratingBarLabel}>3</Text>
                                            {renderRatingBar(13)}
                                            <Text style={styles.ratingBarCount}>747</Text>
                                        </View>
                                        <View style={styles.ratingBarRow}>
                                            <Text style={styles.ratingBarLabel}>2</Text>
                                            {renderRatingBar(7)}
                                            <Text style={styles.ratingBarCount}>389</Text>
                                        </View>
                                        <View style={styles.ratingBarRow}>
                                            <Text style={styles.ratingBarLabel}>1</Text>
                                            {renderRatingBar(11)}
                                            <Text style={styles.ratingBarCount}>615</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.section}>
                                    <ReviewBreakdown />
                                </View>
                                <FlatList
                                    data={reviews}
                                    renderItem={renderReview}
                                    keyExtractor={(item) => item.id}
                                    contentContainerStyle={styles.modalContent}
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={false}
                                />
                            </ScrollView>
                        </SafeAreaView>
                    </Modal>

                    <FlatList
                        data={reviews}
                        renderItem={renderReview}
                        keyExtractor={(item) => item.id}
                    />

                    <TouchableOpacity style={styles.writeReviewButton}>
                        <Ionicons name="create-outline" size={18} color="#FFF" />
                        <Text style={styles.writeReviewText}>Write a Review</Text>
                    </TouchableOpacity>


                </View>
                <View style={styles.section}>

                <HotelPricingScreen hotelData={hotelDetails} />
                </View>


                {/* Bottom spacer for content to be visible above bottom bar */}
                <View style={styles.bottomSpacer} />
            </Animated.ScrollView>

            {/* Bottom Booking Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <View>
                        <Text style={styles.priceLabel}>Starting from</Text>
                        <Text style={styles.priceValue}>$183 <Text style={styles.priceSubtext}>/ per night</Text></Text>
                        {/* <Text style={styles.priceSubtext}>per night</Text> */}
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                    activeOpacity={0.8}
                >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        backgroundColor: '#F8FAFC',
    },
    animatedHeader: {
        // display: "none",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 100 : 70,
        backgroundColor: 'white',
        zIndex: 10,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        height: 100
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        color: 'black',
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        color: 'black',
    },
    headerTitle: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageCarousel: {
        height: 360,
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    imageGradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    imageGradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 48 : 36,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    imageNavButton: {
        position: 'absolute',
        top: '50%',
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    imageNavButtonLeft: {
        left: 16,
    },
    imageNavButtonRight: {
        right: 16,
    },
    rightButtons: {
        flexDirection: 'row',
        color: 'black',
    },
    bookmarkButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    shareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    imageDots: {
        position: 'absolute',
        bottom: 24,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    imageDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    hotelInfo: {
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 20,
        marginTop: -20,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1,
    },
    hotelName: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1E293B',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 15,
        color: '#64748B',
        marginLeft: 4,
    },
    ratingBadge: {
        position: 'absolute',
        top: -15,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'green',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    ratingStarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBadgeText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 15,
    },
    reviewCountBadge: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        marginLeft: 3,
    },

    ratingBreakdown: {
        marginBottom: 24,
    },
    overallRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    overallRatingNumber: {
        fontSize: 48,
        fontWeight: '700',
        color: '#1a1a1a',
        marginRight: 16,
    },
    ratingDetails: {
        flex: 1,
    },
    ratingStars: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 4,
    },
    ratingBars: {
        gap: 8,
    },
    ratingBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingBarLabel: {
        width: 20,
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
    },
    ratingBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    ratingBar: {
        height: '100%',
        backgroundColor: 'black',
    },
    ratingBarCount: {
        width: 50,
        fontSize: 14,
        color: '#666',
    },
    quickInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginVertical: 24,
    },
    infoCard: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '31%',
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
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
    priceContainerTop: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    priceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    priceUnit: {
        fontSize: 14,
        color: '#64748B',
        marginLeft: 2,
        marginBottom: 2,
    },
    quickInfoDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#E2E8F0',
    },
    quickInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quickInfoText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#64748B',
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
        justifyContent: 'space-around',
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        fontSize: 14,
        color: 'black',
        fontWeight: '500',
    },
    galleryList: {
        paddingRight: 16,
    },
    galleryImageContainer: {
        marginRight: 12,
    },
    galleryImage: {
        width: 110,
        height: 110,
        borderRadius: 12,
    },
    galleryGridItem: {
        width: (width - 48) / 3,
        height: (width - 48) / 3,
        margin: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    galleryGridImage: {
        width: '100%',
        height: '100%',
    },
    galleryImageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    galleryModalContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    galleryModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1,
    },
    galleryModalBackButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    galleryModalTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
    },
    galleryModalShareButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    galleryModalImageContainer: {
        width,
        height: height * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryModalImage: {
        width: '100%',
        height: '100%',
    },
    galleryModalContent: {
        flexGrow: 1,
    },
    galleryPagination: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    galleryPaginationText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    detailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginBottom: 16,
    },
    detailIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailText: {
        fontSize: 15,
        color: '#334155',
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#334155',
    },
    readMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    readMoreText: {
        fontSize: 14,
        color: 'black',
        fontWeight: '500',
    },
    facilitiesContainer: {
        marginTop: 8,
    },
    facilityItem: {
        width: '25%',
        alignItems: 'center',
        marginBottom: 20,
    },
    facilityIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    facilityText: {
        fontSize: 13,
        color: '#334155',
        textAlign: 'center',
    },
    mapContainer: {
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    mapPinContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -14,
        marginTop: -28,
    },
    mapLocationInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    mapLocationTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    mapLocationSubtitle: {
        fontSize: 12,
        color: '#64748B',
    },
    reviewHeaderContainer: {
        flex: 1,
    },
    ratingDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 4,
    },
    reviewCount: {
        fontSize: 13,
        color: '#64748B',
        marginLeft: 4,
    },
    reviewItem: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    reviewInfo: {
        flex: 1,
        marginLeft: 12,
    },
    reviewName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    reviewDate: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    ratingContainer: {
        backgroundColor: 'black',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    ratingText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
    },
    reviewComment: {
        fontSize: 14,
        lineHeight: 22,
        color: '#334155',
    },
    reviewSeparator: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 12,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalCloseButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1F2937',
    },
    modalHeaderRight: {
        width: 40,
    },
    modalContent: {
        padding: 16,
    },
    writeReviewButton: {
        flexDirection: 'row',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 16,
    },
    writeReviewText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    bottomSpacer: {
        height: 100,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    // priceContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'flex-end',
    // },
    bookButton: {
        backgroundColor: 'black',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});