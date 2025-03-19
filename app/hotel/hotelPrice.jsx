import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Animated,
    Dimensions,
    Modal,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Main component that displays hotel pricing information
const HotelPricingScreen = ({ hotelData }) => {

    
    const [selectedTab, setSelectedTab] = useState('featured'); // 'featured' or 'all'
    const slideAnim = useState(new Animated.Value(0))[0];

    // Extract data from the imported JSON
    const featuredPrices = hotelData.featured_prices || [];
    const allPrices = hotelData.prices || [];

    // Display data based on selected tab
    const displayData = selectedTab === 'featured' ? featuredPrices : allPrices;

    // Animate tab switch
    const switchTab = (tab) => {
        const toValue = tab === 'featured' ? 0 : width / 2 - 45;

        Animated.spring(slideAnim, {
            toValue,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();

        setSelectedTab(tab);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Title */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hotel Pricing</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Feather name="sliders" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Tab Selector */}
            <View style={styles.tabWrapper}>
                <View style={styles.tabContainer}>
                    <Animated.View
                        style={[
                            styles.tabIndicator,
                            { transform: [{ translateX: slideAnim }] }
                        ]}
                    />
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => switchTab('featured')}
                    >
                        <Text style={[
                            styles.tabText,
                            selectedTab === 'featured' && styles.selectedTabText
                        ]}>
                            Featured
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => switchTab('all')}
                    >
                        <Text style={[
                            styles.tabText,
                            selectedTab === 'all' && styles.selectedTabText
                        ]}>
                            All Prices
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Hotel Pricing List */}
            <FlatList
                data={displayData}
                keyExtractor={(item, index) => `${item.source}-${index}`}
                renderItem={({ item }) => (
                    <PriceCard
                        data={item}
                        showRooms={selectedTab === 'featured'}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// Individual price card component
const PriceCard = ({ data, showRooms }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.card}>
            {/* Header with hotel source and logo */}
            <View style={styles.cardHeader}>
                <View style={styles.sourceContainer}>
                    <Text style={styles.sourceName}>{data.source}</Text>
                    {data.official && (
                        <View style={styles.officialBadge}>
                            <Text style={styles.officialText}>Official</Text>
                        </View>
                    )}
                </View>
                {data.logo && (
                    <Image
                        source={{ uri: data.logo }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                )}
            </View>

            {/* Price information */}
            <View style={styles.priceContainer}>
                <View style={styles.priceMainInfo}>
                    <View>
                        <Text style={styles.priceLabel}>Price per night</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>{data.rate_per_night?.lowest || '-'}</Text>
                        </View>
                    </View>

                    {data.rate_per_night?.before_taxes_fees && (
                        <View style={styles.taxBadge}>
                            <Text style={styles.taxesText}>
                                Before taxes & fees
                            </Text>
                            <Text style={styles.taxAmount}>
                                {data.rate_per_night.before_taxes_fees}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Discount or special remarks */}
                {(data.remarks || data.discount_remarks) && (
                    <View style={styles.remarksContainer}>
                        {(data.remarks || []).concat(data.discount_remarks || []).map((remark, index) => (
                            <View key={index} style={styles.remarkItem}>
                                <Feather name="tag" size={14} color="#000" style={styles.remarkIcon} />
                                <Text style={styles.remarkText}>{remark}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Rooms section button (only for featured prices) */}
            {showRooms && data.rooms && data.rooms.length > 0 && (
                <TouchableOpacity
                    style={styles.roomsToggle}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.roomsToggleText}>View room options</Text>
                    <Feather name="chevron-right" size={18} color="#000" />
                </TouchableOpacity>
            )}

            {/* Room options modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <BlurView intensity={90} style={styles.modalBlurContainer}>
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Room Options</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Feather name="x" size={22} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.cardHeader}>
                                <View style={styles.sourceContainer}>
                                    <Text style={styles.sourceName}>{data.source}</Text>
                                    {data.official && (
                                        <View style={styles.modalOfficialBadge}>
                                            <Text style={styles.modalOfficialText}>Official</Text>
                                        </View>
                                    )}
                                </View>
                                {data.logo && (
                                    <Image
                                        source={{ uri: data.logo }}
                                        style={styles.logo}
                                        resizeMode="contain"
                                    />
                                )}
                            </View>

                            <FlatList
                                data={data.rooms || []}
                                keyExtractor={(item, index) => `room-${index}`}
                                renderItem={({ item }) => (
                                    <RoomOptionCard room={item} />
                                )}
                                ItemSeparatorComponent={() => <View style={styles.roomSeparator} />}
                                contentContainerStyle={styles.roomsListContainer}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </SafeAreaView>
                </BlurView>
            </Modal>

            {/* Book now button */}
            <TouchableOpacity style={styles.bookButton} activeOpacity={0.8}>
                <Text style={styles.bookButtonText}>Book Now</Text>
                <Feather name="arrow-right" size={18} color="#fff" style={styles.bookIcon} />
            </TouchableOpacity>
        </View>
    );
};

// Room option card component for the modal
const RoomOptionCard = ({ room }) => {
    return (
        <View style={styles.roomOptionCard}>
            {/* Room Info Section */}
            <View style={styles.roomOptionDetailsContainer}>
                {/* Room Name and Type Badge */}
                <View style={styles.roomNameContainer}>
                    <Text style={styles.roomOptionName}>{room.name}</Text>
                    <View style={styles.roomTypeBadge}>
                        <Text style={styles.roomTypeText}>
                            {room.type || 'Standard'}
                        </Text>
                    </View>
                </View>

                {/* Features Pills */}
                <View style={styles.roomOptionFeatures}>
                    {room.features?.map((feature, index) => (
                        <View key={index} style={styles.roomFeatureItem}>
                            <Feather
                                name={featureIcons[feature] || "check"}
                                size={14}
                                color="#4A6572"
                            />
                            <Text style={styles.roomFeatureText}>{feature}</Text>
                        </View>
                    )) || (
                            <>
                                <View style={styles.roomFeatureItem}>
                                    <Feather name="wifi" size={14} color="#4A6572" />
                                    <Text style={styles.roomFeatureText}>WiFi</Text>
                                </View>
                                <View style={styles.roomFeatureItem}>
                                    <Feather name="coffee" size={14} color="#4A6572" />
                                    <Text style={styles.roomFeatureText}>Breakfast</Text>
                                </View>
                            </>
                        )}
                </View>

                {/* Room Highlights */}
                <View style={styles.roomHighlights}>
                    {room.highlights?.map((highlight, index) => (
                        <View key={index} style={styles.highlightItem}>
                            <Feather name="check-circle" size={16} color="#4CAF50" style={styles.highlightIcon} />
                            <Text style={styles.highlightText}>{highlight}</Text>
                        </View>
                    )) || (
                            <View style={styles.highlightItem}>
                                <Feather name="check-circle" size={16} color="#4CAF50" style={styles.highlightIcon} />
                                <Text style={styles.highlightText}>Free cancellation until 24hrs before check-in</Text>
                            </View>
                        )}
                </View>

                {/* Room Description with truncation */}
                {room.description && (
                    <Text numberOfLines={3} style={styles.roomDescription}>
                        {room.description}
                    </Text>
                )}
            </View>

            {/* Price and Select Button */}
            <View style={styles.roomActionContainer}>
                <View style={styles.roomPriceContainer}>
                    <Text style={styles.roomPriceLabel}>Price</Text>
                    <View style={styles.roomPriceRow}>
                        <Text style={styles.roomPriceValue}>
                            {room.rate_per_night?.lowest || '-'}
                        </Text>
                        <Text style={styles.roomPriceNight}>/night</Text>
                    </View>
                    {room.rate_per_night?.before_discount && (
                        <Text style={styles.roomOldPrice}>
                            {room.rate_per_night.before_discount}
                        </Text>
                    )}
                </View>

                <TouchableOpacity style={styles.selectRoomButton} activeOpacity={0.7}>
                    <Text style={styles.selectRoomButtonText}>Select</Text>
                    <Feather name="arrow-right" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Icon mapping for room features
const featureIcons = {
    'WiFi': 'wifi',
    'Breakfast': 'coffee',
    'Air Conditioning': 'wind',
    'TV': 'tv',
    'Ocean View': 'eye',
    'Balcony': 'layout',
    'King Bed': 'maximize',
    'Non-smoking': 'slash',
    'Free Parking': 'navigation',
    'Mini Bar': 'archive',
    'Room Service': 'bell',
    'Gym Access': 'activity'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    tabWrapper: {
        backgroundColor: '#fff',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems:"center"
    },
    tabContainer: {
        flexDirection: 'row',
        // marginHorizontal: 20,
        maxWidth:300,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f0f0f0',
        position: 'relative',
        overflow: 'hidden',
        
    },
    tabIndicator: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        backgroundColor: '#000',
        borderRadius: 24,
        zIndex: 0,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        opacity: 0.5,
    },
    selectedTabText: {
        color: '#fff',
        opacity: 1,
    },
    listContainer: {
        marginTop:10
        // padding: 20,
        // paddingBottom: 40,
    },
    separator: {
        height: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#eee',
        
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sourceContainer: {
        flexDirection: 'column',
        alignItems: 'start',
        flex: 1,
    },
    sourceName: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    officialBadge: {
        backgroundColor: '#000',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        width: 60,
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 5
    },
    officialText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    logo: {
        width: 70,
        height: 28,
    },
    priceContainer: {
        padding: 20,
    },
    priceMainInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 22,
        fontWeight: '700',
    },
    taxBadge: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 8,
        maxWidth: '40%',
    },
    taxesText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    taxAmount: {
        fontSize: 14,
        fontWeight: '600',
    },
    remarksContainer: {
        marginTop: 12,
    },
    remarkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    remarkIcon: {
        marginRight: 6,
    },
    remarkText: {
        fontSize: 14,
        color: '#333',
    },
    roomsToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    roomsToggleText: {
        fontSize: 14,
        fontWeight: '600',
    },
    bookButton: {
        flexDirection: 'row',
        backgroundColor: '#000',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    bookIcon: {
        marginLeft: 4,
    },
    modalBlurContainer: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: height * 0.85,
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',

    },
    closeButton: {
        padding: 6,
    },
    modalSourceInfo: {
        flexDirection: 'column',
        alignItems: 'start',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    modalSourceName: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalOfficialBadge: {
        backgroundColor: '#000',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        width: 60,
        alignItems: 'center',
        justifyContent: "center",
        marginVertical: 5
    },
    modalOfficialText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    roomsListContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        marginTop:20
    },
    roomSeparator: {
        height: 16,
    },
    roomOptionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#eee',
        overflow: 'hidden',
    },
    roomOptionDetailsContainer: {
        padding: 16,
    },
    roomNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    roomOptionName: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    roomTypeBadge: {
        backgroundColor: '#e9f5ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    roomTypeText: {
        fontSize: 12,
        color: '#0076ff',
        fontWeight: '600',
    },
    roomOptionFeatures: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    roomFeatureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    roomFeatureText: {
        fontSize: 12,
        color: '#4A6572',
        marginLeft: 4,
    },
    roomHighlights: {
        marginBottom: 12,
    },
    highlightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    highlightIcon: {
        marginRight: 6,
    },
    highlightText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    roomDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    roomActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    roomPriceContainer: {
        flex: 1,
    },
    roomPriceLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    roomPriceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    roomPriceValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    roomPriceNight: {
        fontSize: 14,
        color: '#666',
        marginLeft: 2,
    },
    roomOldPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
        marginTop: 2,
    },
    selectRoomButton: {
        flexDirection: 'row',
        backgroundColor: '#000',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectRoomButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 6,
    }
});

export default HotelPricingScreen