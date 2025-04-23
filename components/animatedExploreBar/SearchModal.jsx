import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Text,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import {
  Search,
  Sparkles,
  MapPin,
  Heart,
  ArrowLeft,
} from "lucide-react-native";
import TripSearchPage from "../tripSearch/tripSearch";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function SearchModal({ visible, onClose, tabName }) {
  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const unsplashImages = {
    maldives:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000",
    bali: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=1000",
    rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000",
    greece:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000",
    kyoto:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000",
    santorini:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000",
    london:
      "https://plus.unsplash.com/premium_photo-1682056762926-d00524d8436f?q=80&w=1000",
  };

  const suggestions = [
    {
      text: "Luxury resorts in Maldives",
      category: "Hotels",
      color: "black",
      popularity: "96% recommended",
      imageUrl: unsplashImages.maldives,
    },
    {
      text: "Direct flights to Bali",
      category: "Flights",
      color: "black",
      popularity: "Trending now",
      imageUrl: unsplashImages.bali,
    },
    {
      text: "Best coffee shops in Rome",
      category: "Experiences",
      color: "black",
      popularity: "Top rated",
      imageUrl: unsplashImages.rome,
    },
    {
      text: "Hidden beaches in Greece",
      category: "Beaches",
      color: "black",
      popularity: "Secret spots",
      imageUrl: unsplashImages.greece,
    },
  ];

  const trendingDestinations = [
    {
      name: "Kyoto",
      country: "Japan",
      rating: 4.8,
      imageUrl: unsplashImages.kyoto,
    },
    {
      name: "Santorini",
      country: "Greece",
      rating: 4.9,
      imageUrl: unsplashImages.santorini,
    },
    {
      name: "London",
      country: "Mexico",
      rating: 4.7,
      imageUrl: unsplashImages.london,
    },
  ];

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                style={styles.closeButton}
              >
                <ArrowLeft size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {/* Categories section with enhanced UI */}
            {/* <Text style={styles.sectionTitle}>Explore by Category</Text> */}
            <TripSearchPage onClose={onClose} tabName={tabName} />

            {/* Popular searches with rich cards */}
            <Text style={styles.sectionTitle}>Trending Searches</Text>
            <View style={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionCard}
                  onPress={() => {
                    setQuery(suggestion.text);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <LinearGradient
                    colors={["rgba(0,0,0,0.6)", "transparent"]}
                    style={styles.suggestionGradient}
                  />
                  <Image
                    source={{ uri: suggestion.imageUrl }}
                    style={styles.suggestionImage}
                  />
                  <View style={styles.suggestionContent}>
                    <View style={styles.suggestionHeader}>
                      <Sparkles size={14} color="#FFD700" />
                      <Text style={styles.popularityTag}>
                        {suggestion.popularity}
                      </Text>
                    </View>
                    <Text style={styles.suggestionText}>{suggestion.text}</Text>
                    <View
                      style={[styles.categoryTag, { backgroundColor: "white" }]}
                    >
                      <Text
                        style={[
                          styles.categoryTagText,
                          { color: suggestion.color },
                        ]}
                      >
                        {suggestion.category}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Trending destinations carousel */}
            <Text style={styles.sectionTitle}>Trending Destinations</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.trendingContainer}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {trendingDestinations.map((destination, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.destinationCard}
                  onPress={() => {
                    setQuery(
                      `Exploring ${destination.name}, ${destination.country}`
                    );
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                >
                  <Image
                    source={{ uri: destination.imageUrl }}
                    style={styles.destinationImage}
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={styles.destinationGradient}
                  />
                  <View style={styles.destinationContent}>
                    <Text style={styles.destinationName}>
                      {destination.name}
                    </Text>
                    <View style={styles.destinationDetails}>
                      <View style={styles.locationContainer}>
                        <MapPin size={12} color="#FFFFFF" />
                        <Text style={styles.destinationCountry}>
                          {destination.country}
                        </Text>
                      </View>
                      <View style={styles.ratingContainer}>
                        <Heart size={12} color="#FF6B6B" fill="#FF6B6B" />
                        <Text style={styles.destinationRating}>
                          {destination.rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Recent searches section */}
            <Text style={styles.sectionTitle}>Your Recent Searches</Text>
            <View style={styles.recentSearches}>
              {[
                "Tokyo luxury hotels",
                "Flights to Paris",
                "Best beaches in Hawaii",
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => {
                    setQuery(item);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <View style={styles.recentItemIcon}>
                    <Search size={14} color="#8f8f8f" />
                  </View>
                  <Text style={styles.recentItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "100%",
    // paddingTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    position: "absolute",
    top: -50,
    left: 0,
    // marginBottom: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#f5f5f5',
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 40,
    right: -10,
    zIndex: 10,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    marginTop: 50,
    // paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryButton: {
    width: "31%",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedCategory: {
    transform: [{ scale: 1.1 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 3,
  },
  categoryDescription: {
    fontSize: 12,
    color: "#8f8f8f",
    textAlign: "center",
  },
  suggestions: {
    marginBottom: 20,
  },
  suggestionCard: {
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 15,
    position: "relative",
  },
  suggestionImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  suggestionGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  suggestionContent: {
    padding: 15,
    flex: 1,
    justifyContent: "space-between",
    zIndex: 2,
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  popularityTag: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
  },
  suggestionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  categoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 5,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  trendingContainer: {
    marginBottom: 20,
  },
  destinationCard: {
    marginRight: 15,
    width: 160,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    // marginLeft: 20,
    marginBottom: 10,
    position: "relative",
  },
  destinationImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  destinationGradient: {
    position: "absolute",
    width: "100%",
    height: "70%",
    bottom: 0,
    zIndex: 1,
  },
  destinationContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    zIndex: 2,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  destinationDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  destinationCountry: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  destinationRating: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 4,
  },
  recentSearches: {
    marginBottom: 20,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  recentItemIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  recentItemText: {
    fontSize: 14,
    color: "#333",
  },
  particle: {
    position: "absolute",
    top: 60,
    left: "50%",
    borderRadius: 4,
    zIndex: 10,
  },
  pulseCircle: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#5f65f7",
    zIndex: -1,
  },
});
