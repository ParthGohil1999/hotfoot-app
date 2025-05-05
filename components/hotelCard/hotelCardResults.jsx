import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Star } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import SkeletonLoading from "../skeletonLoading/skeletonLoading";

export const HotelCardResults = ({ hotel, searchParams, amenities }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!hotel?.property_token) return;

    router.push({
      pathname: "/hotel/[id]",
      params: {
        id: hotel.property_token,
        name: hotel?.name || "Hotel",
        image: hotel?.images?.[0]?.original_image || "",
        location: `${hotel?.nearby_places?.[0]?.name || "City Centre"}`,
        searchParams: JSON.stringify(searchParams || {}),
        amenities: JSON.stringify(amenities || []),
      },
    });
  };

  if (loading) {
    return <SkeletonLoading />;
  }

  if (!hotel) {
    return (
      <View style={styles.hotelCard}>
        <Text>No hotel data available</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 600,
          delay: 200,
        }}
        style={styles.hotelCard}
      >
        {/* Left side image with overlay gradient */}
        <View style={styles.imageContainer}>
          {hotel?.images?.[0]?.original_image ? (
            <>
              <Image
                source={{ uri: hotel.images[0].original_image }}
                style={styles.hotelImage}
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.imageGradient}
              />
            </>
          ) : (
            <View style={[styles.hotelImage, { backgroundColor: "#f0f0f0" }]} />
          )}

          {hotel?.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{hotel.discount}%</Text>
            </View>
          )}
        </View>

        {/* Right side content */}
        <View style={styles.hotelContent}>
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelName} numberOfLines={1}>
              {hotel?.name || "Hotel Name"}
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText} numberOfLines={1}>
              {`${hotel?.nearby_places?.[0]?.name || "City Centre"} - ${
                hotel?.nearby_places?.[0]?.transportations?.[0]?.duration ||
                "5 min"
              } ${hotel?.nearby_places?.[0]?.transportations?.[0]?.type || ""}`}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingScore}>
                  {hotel?.location_rating || "N/A"}
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
                        i < Math.floor(hotel?.location_rating || 0)
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
                  {hotel.deal_description}
                </Text>
              )}
              <Text style={styles.currentPrice}>
                {hotel?.rate_per_night?.lowest || "N/A"} / night
              </Text>
            </View>
          </View>
        </View>
      </MotiView>
    </TouchableOpacity>
  );
};

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
    height: 90,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  imageContainer: {
    width: "35%",
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
    marginRight: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
});
