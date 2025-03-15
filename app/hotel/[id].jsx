import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView,Pressable,  } from 'react-native'
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

//new
import { MapPin, Star, Clock, Phone, Calendar, Users, ChevronRight, Award, Leaf } from 'lucide-react-native';

const { width } = Dimensions.get('window')

const RoomCard = ({ room }) => (
    <View style={styles.roomCard}>
      <Image 
        source={{ uri: room.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000' }}
        style={styles.roomImage}
      />
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.roomPrice}>From ${room.rate_per_night?.extracted_lowest}</Text>
        <Pressable style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select</Text>
        </Pressable>
      </View>
    </View>
  );
  
  const NearbyPlaceCard = ({ place }) => (
    <View style={styles.nearbyCard}>
      {place.thumbnail && (
        <Image 
          source={{ uri: place.thumbnail }}
          style={styles.nearbyImage}
        />
      )}
      <View style={styles.nearbyInfo}>
        <Text style={styles.nearbyName}>{place.name}</Text>
        {place.description && (
          <Text style={styles.nearbyDescription} numberOfLines={2}>
            {place.description}
          </Text>
        )}
        <View style={styles.nearbyMeta}>
          {place.rating && (
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" />
              <Text style={styles.nearbyRating}>{place.rating}</Text>
            </View>
          )}
          {place.transportations?.[0] && (
            <Text style={styles.transportationInfo}>
              {place.transportations[0].duration} away
            </Text>
          )}
        </View>
      </View>
    </View>
  );

const Page = () => {

    const { id, name, phoneNumber, latitude, longitude } = useLocalSearchParams()
    const [placeDetails, setPlaceDetails] = useState()
    const [loading, setLoading] = useState(true)
    

    useEffect(() => {
        const fetch = async () => {

            // await fetchData()
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

    

    const renderRatingBar = (percentage) => (
        <View style={styles.ratingBarContainer}>
          <View style={[styles.ratingBar, { width: `${percentage}%` }]} />
        </View>
      );


    return (
        // <View style={{ backgroundColor: '#fff', flex: 1 }}>
        //     {loading ? <Text className="text-center text-lg mt-10">Loading...</Text> :
        //     <Animated.ScrollView>
        //         <Animated.Image source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${placeDetails?.photos[0]?.name?.split("/photos/")[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY}` }} style={styles.image} />
        //         {/* <Carousel
        //             loop
        //             width={350}
        //             height={200}
        //             autoPlay
        //             data={placeDetails?.photos || []}
        //             renderItem={({ item }) => (
        //                 <Image
        //                     source={{ uri: item.name }}
        //                     className="w-full h-48 rounded-lg"
        //                 />
        //             )}
        //         /> */}

        //         {/* Hotel Info */}
        //         <View className="p-4 ">
        //             <Text className="text-2xl font-bold text-gray-800">{placeDetails?.displayName?.text}</Text>
        //             <Text className="text-gray-600 mt-1">{placeDetails.formattedAddress}</Text>
        //             <View className="flex-row items-center mt-2">
        //                 <FontAwesome name="star" size={20} color="gold" />
        //                 <Text className="text-gray-800 text-lg ml-1">{placeDetails.rating} ({placeDetails.userRatingCount} Reviews)</Text>
        //             </View>
        //         </View>

        //         {/* Amenities */}
        //         <View className="mt-4 p-4 ">
        //             <Text className="text-lg font-semibold mb-2">Amenities</Text>
        //             <FlatList
        //                 data={placeDetails.amenities}
        //                 keyExtractor={(item, index) => index.toString()}
        //                 numColumns={2}
        //                 renderItem={({ item }) => (
        //                     <Text className="text-gray-600 w-1/2 mb-1">- {item}</Text>
        //                 )}
        //             />
        //         </View>

        //         {/* Reviews */}
        //         <View className="mt-4 p-4 ">
        //             <Text className="text-lg font-semibold mb-2">Guest Reviews</Text>
        //             {placeDetails.reviews.map((review, index) => (
        //                 <View key={index} className="mb-4 border-b pb-2 border-gray-300">
        //                     <View className="flex-row items-center">
        //                         <Image
        //                             source={{ uri: review.authorAttribution.photoUri }}
        //                             className="w-10 h-10 rounded-full mr-2"
        //                         />
        //                         <Text className="font-semibold text-gray-800">{review.authorAttribution.displayName}</Text>
        //                     </View>
        //                     <Text className="text-gray-600 mt-1">{review.text.text}</Text>
        //                 </View>
        //             ))}
        //         </View>
        //     </Animated.ScrollView>}
        // </View>
        <ScrollView style={styles.container}>
      {/* Hero Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://lh5.googleusercontent.com/p/AF1QipMq2AjlXziXL5qmInJJNHHtSdb8wrfo9D26thyX=s10000' }}
          style={styles.heroImage}
        />
        <View style={styles.imageOverlay} />
        <View style={styles.ratingBadge}>
          <Star size={16} color="#FFD700" />
          <Text style={styles.ratingText}>4.6</Text>
        </View>
        {/* Hotel Class Badge */}
        <View style={styles.classBadge}>
          <Award size={16} color="#1a1a1a" />
          <Text style={styles.classText}>4-Star Hotel</Text>
        </View>
      </View>

      {/* Hotel Info Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.hotelName}>Millennium Hotel and Conference Centre</Text>
        <View style={styles.locationContainer}>
          <MapPin size={18} color="#666" />
          <Text style={styles.locationText}>South Kensington, London</Text>
        </View>

        {/* Badges Section */}
        <View style={styles.badgesContainer}>
          {/* Eco-certified Badge */}
          <View style={styles.ecoBadge}>
            <Leaf size={14} color="#4CAF50" />
            <Text style={styles.ecoBadgeText}>Eco-certified</Text>
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoContainer}>
          <View style={styles.infoCard}>
            <Clock size={20} color="#333" />
            <Text style={styles.infoLabel}>Check-in</Text>
            <Text style={styles.infoValue}>3:00 PM</Text>
          </View>
          <View style={styles.infoCard}>
            <Clock size={20} color="#333" />
            <Text style={styles.infoLabel}>Check-out</Text>
            <Text style={styles.infoValue}>12:00 PM</Text>
          </View>
          <View style={styles.infoCard}>
            <Users size={20} color="#333" />
            <Text style={styles.infoLabel}>Guests</Text>
            <Text style={styles.infoValue}>2 Adults</Text>
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.priceValue}>$183</Text>
            <Text style={styles.priceSubtext}>per night</Text>
          </View>
          <Pressable style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </Pressable>
        </View>

        {/* Rating Breakdown */}
        <View style={styles.ratingBreakdown}>
          <Text style={styles.sectionTitle}>Guest Reviews</Text>
          <View style={styles.overallRating}>
            <Text style={styles.overallRatingNumber}>3.8</Text>
            <View style={styles.ratingDetails}>
              <Text style={styles.ratingText}>Based on {5647} reviews</Text>
              <View style={styles.ratingStars}>
                <Star size={16} color="#FFD700" />
                <Star size={16} color="#FFD700" />
                <Star size={16} color="#FFD700" />
                <Star size={16} color="#FFD700" />
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

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descriptionText}>
            A 3-minute walk from Gloucester Road tube station, this genteel hotel in the upscale Kensington area is 17 minutes' walk from the Royal Albert Hall and 2 miles from Hyde Park.
          </Text>
        </View>

        {/* Rooms Section */}
        <View style={styles.roomsSection}>
          <Text style={styles.sectionTitle}>Available Rooms</Text>
          <FlatList
            data={[
              {
                name: "Deluxe Double Room",
                rate_per_night: { extracted_lowest: 202 },
                images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000"]
              },
              {
                name: "Club Double Room",
                rate_per_night: { extracted_lowest: 294 },
                images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000"]
              },
              {
                name: "Luxury Suite",
                rate_per_night: { extracted_lowest: 503 },
                images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000"]
              }
            ]}
            renderItem={({ item }) => <RoomCard room={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.roomsList}
          />
        </View>

        {/* Nearby Places */}
        <View style={styles.nearbyPlaces}>
          <Text style={styles.sectionTitle}>Nearby Places</Text>
          <FlatList
            data={[
              {
                name: "Natural History Museum",
                thumbnail: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQW1TYOwvAfXMy2Bgnw7iK1bffWH6EwSvxV-tvXP9TFVMF4qzCD",
                description: "Landmark museum of animals and natural phenomena, with hands-on exhibits and animatronic dinosaurs.",
                rating: 4.7,
                transportations: [{ duration: "9 min" }]
              },
              {
                name: "Victoria and Albert Museum",
                thumbnail: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRoaqUWfVwgtUOojFq1leK_qMuO_eRaOVvMMw1I-nN6d3swb9yQ",
                description: "Blockbuster exhibitions and permanent decorative arts collection, with design shop and ornate cafe.",
                rating: 4.7,
                transportations: [{ duration: "9 min" }]
              }
            ]}
            renderItem={({ item }) => <NearbyPlaceCard place={item} />}
            style={styles.nearbyList}
          />
        </View>

        {/* Contact */}
        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Phone size={20} color="#666" />
            <Text style={styles.contactText}>+44 20 7373 6030</Text>
          </View>
          <View style={styles.contactItem}>
            <MapPin size={20} color="#666" />
            <Text style={styles.contactText}>4-18 Harrington Gardens, South Kensington, London SW7 4LH</Text>
          </View>
        </View>
      </View>
    </ScrollView>
    )
}

// const styles = StyleSheet.create({
//     image: {
//         height: '300',
//         width
//     }
// })

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    imageContainer: {
      width: width,
      height: 300,
      position: 'relative',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    ratingBadge: {
      position: 'absolute',
      top: 50,
      right: 16,
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: 20,
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    classBadge: {
      position: 'absolute',
      top: 50,
      left: 16,
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: 20,
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    classText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1a1a1a',
    },
    ratingText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
    },
    contentContainer: {
      padding: 20,
    },
    hotelName: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 8,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 16,
    },
    locationText: {
      fontSize: 16,
      color: '#666',
    },
    badgesContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 24,
    },
    ecoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E8F5E9',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 4,
    },
    ecoBadgeText: {
      color: '#4CAF50',
      fontSize: 12,
      fontWeight: '500',
    },
    quickInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    infoCard: {
      backgroundColor: '#f5f5f5',
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
      marginBottom: 24,
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
      backgroundColor: '#FFD700',
    },
    ratingBarCount: {
      width: 50,
      fontSize: 14,
      color: '#666',
    },
    descriptionContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: 12,
    },
    descriptionText: {
      fontSize: 16,
      lineHeight: 24,
      color: '#666',
    },
    roomsSection: {
      marginBottom: 24,
    },
    roomsList: {
      marginTop: 12,
    },
    roomCard: {
      width: 280,
      marginRight: 16,
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    roomImage: {
      width: '100%',
      height: 160,
    },
    roomInfo: {
      padding: 16,
    },
    roomName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: 8,
    },
    roomPrice: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 12,
    },
    selectButton: {
      backgroundColor: '#1a1a1a',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignItems: 'center',
    },
    selectButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    nearbyPlaces: {
      marginBottom: 24,
    },
    nearbyList: {
      marginTop: 12,
    },
    nearbyCard: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    nearbyImage: {
      width: 100,
      height: 100,
    },
    nearbyInfo: {
      flex: 1,
      padding: 12,
    },
    nearbyName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    nearbyDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
    },
    nearbyMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    nearbyRating: {
      fontSize: 14,
      color: '#1a1a1a',
      fontWeight: '500',
    },
    transportationInfo: {
      fontSize: 14,
      color: '#666',
    },
    contactContainer: {
      gap: 16,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    contactText: {
      fontSize: 14,
      color: '#666',
      flex: 1,
    },
  });


export default Page