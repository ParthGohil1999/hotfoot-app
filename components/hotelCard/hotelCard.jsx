import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { MotiView, MotiText, AnimatePresence } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Star } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import useTripSearchStore from "../../app/store/trpiSearchZustandStore";
import DatePickerModal from "../datePickerModal/datePickerModal";
import * as Haptics from "expo-haptics";
import SkeletonLoading from "../skeletonLoading/skeletonLoading";
import { GetCityAndAirportIataCodes } from "../../services/AmadeusApi";
import useUserStore from "../../app/store/userZustandStore";
import { searchHotels } from "../../services/SerpApi";

// Enhanced Hotel Card Component in Row View with Monochrome Theme - Shorter Version
export const HotelCard = ({ hotel }) => {
  const navigation = useNavigation();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toLocation,
    fromLocation,
    travelers,
    setFromLocationToStore,
    setToLocationToStore, setDatesToStore, resetSearch } = useTripSearchStore();
  const { userLocation } = useUserStore();

  const handleDateConfirm = async (selectedDates) => {
    try {
      console.log("selectedDates:", selectedDates);

      // Store selected dates
      setDatesToStore({
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate,
      });

      




      const searchDataHotels = {
        dates: {
          startDate: selectedDates.startDate,
          endDate: selectedDates.endDate,
          totalDays: selectedDates.totalDays,
        },
        toLocation: toLocation.name,
        travelers,
      };

      // console.log("searchDataHotels:", searchDataHotels);


      const [hotelResults] = await Promise.all([
        searchHotels(formatHotelSearchParams(searchDataHotels)),
      ]);

      router.push({
        pathname: "/hotel/[id]",
        params: {
          id: hotelResults.property_token,
          name: hotelResults?.name || "Hotel",
          image: hotel?.images?.[0]?.original_image || "",
          location: `${hotel?.nearby_places?.[0]?.name || "City Centre"}`,
          searchParams: JSON.stringify(searchParams || {}),
          amenities: JSON.stringify(amenities || []),
        },
      });
    } catch (error) {
      console.error("Search error:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to search. Please try again.");
    }
  };

  const handlePress = () => {
    console.log("Card Pressed: ", hotel?.name);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetSearch();
    setIsDatePickerVisible(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return loading ? (
    <SkeletonLoading />
  ) : (
    <TouchableOpacity onPress={handlePress}>
      {/* <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 600,
          delay: 200,
        }}
        style={styles.hotelCard}
        // onpress={() => console.log("Card Pressed")}
      > */}
      <View style={styles.hotelCard}>
        {/* Left side image with overlay gradient */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: hotel?.images[0]?.original_image }}
            style={styles.hotelImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageGradient}
          />
          {hotel?.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{hotel?.discount}%</Text>
            </View>
          )}
        </View>

        {/* Right side content */}
        <View style={styles.hotelContent}>
          {/* Header with name and heart icon */}
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelName} numberOfLines={1}>
              {hotel?.name}
            </Text>
            {/* <TouchableOpacity style={styles.favoriteButton}>
                        <Text style={styles.heartIcon}>♡</Text>
                    </TouchableOpacity> */}
          </View>

          {/* Location with icon */}
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText} numberOfLines={1}>
              {`${hotel?.nearby_places[0]?.name || "Dublin City Centre"} - ${hotel?.nearby_places[0]?.transportations[0]?.duration || "5 min"
                }s ${hotel?.nearby_places[0]?.transportations[0]?.type}`}
            </Text>
          </View>

          {/* Rating and price in one row */}
          <View style={styles.bottomRow}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingScore}>
                  {hotel?.location_rating || "4.8"}
                </Text>
              </View>
              <View style={styles.starsContainer}>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      color={
                        i < Math.floor(hotel?.location_rating || 4.8)
                          ? "#CCCCCC"
                          : "#E0E0E0"
                      }
                    />
                  ))}
              </View>
            </View>
            <View style={styles.priceContainer}>
              {hotel?.deal_description && (
                <Text style={styles.originalPrice}>
                  {hotel?.deal_description}
                </Text>
              )}
              <Text style={styles.currentPrice}>
                {hotel?.rate_per_night?.lowest} / night
              </Text>
            </View>
          </View>

          {/* Book button */}
          {/* <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity> */}
        </View>
      </View>
      {/* </MotiView> */}
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSelectDates={handleDateConfirm}
        activeTab={"Places"}
        tripType={"Round Trip"}
      // initialDates={dates}
      />
    </TouchableOpacity>
  );
};

// Updated styles with reduced height
const styles = StyleSheet.create({
  hotelCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: "hidden",
    height: 90, // Reduced from 170
    borderWidth: 1,
    borderColor: "#f0f0f0",
    // marginRight: 16,
  },
  imageContainer: {
    width: "35%", // Slightly reduced from 40%
    position: "relative",
  },
  hotelImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#333333",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  hotelContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  hotelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hotelName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    flex: 1,
  },
  favoriteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: {
    fontSize: 14,
    color: "#666666",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#AAAAAA",
    marginRight: 4,
  },
  locationText: {
    fontSize: 10,
    color: "#666666",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBadge: {
    backgroundColor: "#444444",
    width: 28,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  ratingScore: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 10,
    color: "#999999",
    // textDecorationLine: 'line-through',
    marginRight: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  bookButton: {
    backgroundColor: "#222222",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
