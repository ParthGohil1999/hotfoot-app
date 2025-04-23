import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Bookmark, Search, MoreVertical } from "lucide-react-native";

const mockWishlistItems = [
  {
    id: "1",
    name: "Tokyo, Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000",
  },
  {
    id: "2",
    name: "Prague, Prague",
    country: "Czech Republic",
    image:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1000",
  },
  {
    id: "3",
    name: "Paris, Île-de-France",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000",
  },
  {
    id: "4",
    name: "Santorini, South Aegean",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000",
  },
  {
    id: "5",
    name: "Venice, Veneto",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000",
  },
  {
    id: "6",
    name: "Barcelona, Catalonia",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000",
  },
  {
    id: "7",
    name: "Amsterdam, North Holland",
    country: "Netherlands",
    image:
      "https://images.unsplash.com/photo-1576924542622-772281dba2e4?q=80&w=1000",
  },
  {
    id: "8",
    name: "Dubai, Dubai",
    country: "United Arab Emirates",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000",
  },
  {
    id: "9",
    name: "Seoul, Seoul",
    country: "South Korea",
    image:
      "https://images.unsplash.com/photo-1538485399081-7c8ed7c189a6?q=80&w=1000",
  },
  {
    id: "10",
    name: "Sydney, New South Wales",
    country: "Australia",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000",
  },
];

const WishlistItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <Image source={{ uri: item.image }} style={styles.itemImage} />
    <TouchableOpacity style={styles.saveButton}>
      <Bookmark size={20} color="#000" fill="#000" />
    </TouchableOpacity>
    <View style={styles.itemContent}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.countryContainer}>
        <View style={styles.dot} />
        <Text style={styles.countryName}>{item.country}</Text>
      </View>
    </View>
  </View>
);

const Wishlists = () => {
  const [wishlistItems] = useState(mockWishlistItems);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Saved</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishlistItems}
        renderItem={({ item }) => <WishlistItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 8,
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    flex: 1,
  },
  searchButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  itemContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
  },
  itemImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  saveButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    zIndex: 1,
  },
  itemContent: {
    padding: 12,
    paddingTop: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF385C",
    marginRight: 8,
  },
  countryName: {
    fontSize: 14,
    color: "#666",
  },
  moreButton: {
    padding: 4,
    marginRight: -4,
  },
});

export default Wishlists;
