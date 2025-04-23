import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/topBar";
import { HotelCardResults } from "../../components/hotelCard/hotelCardResults";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function HotelSearchResultsScreen() {
  const { hotelResults, searchData } = useLocalSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (hotelResults) {
        const parsedResults = JSON.parse(hotelResults);
        setSearchResults(parsedResults.properties || []);
        setSearchParams(parsedResults.search_parameters || {});
      }
      if (searchData) {
        const parsedSearchData = JSON.parse(searchData);
        setSearchParams((prev) => ({ ...prev, ...parsedSearchData }));
      }
    } catch (err) {
      setError("Failed to parse hotel results");
      console.error("Parsing error:", err);
    } finally {
      setLoading(false);
    }
  }, [hotelResults, searchData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formattedDates =
    searchParams.check_in_date && searchParams.check_out_date
      ? `${formatDate(searchParams.check_in_date)} - ${formatDate(
          searchParams.check_out_date
        )}`
      : "";

  const location = searchParams.q
    ? searchParams.q.charAt(0).toUpperCase() + searchParams.q.slice(1)
    : "Search Results";

  const renderHotelItem = ({ item }) => (
    <HotelCardResults hotel={item} searchParams={searchParams} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar logo text="Hotels" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading hotels...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar logo text="Hotels" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar logo text="Hotels" />

      {/* Search Summary Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{location}</Text>
        {formattedDates ? (
          <Text style={styles.subtitle}>{formattedDates}</Text>
        ) : null}
        <Text style={styles.guestsInfo}>
          {searchParams.adults || 1} adult{searchParams.adults > 1 ? "s" : ""}
          {searchParams.children ? `, ${searchParams.children} children` : ""}
        </Text>
        <Text style={styles.resultCount}>
          {searchResults.length} propert
          {searchResults.length === 1 ? "y" : "ies"} found
        </Text>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>Price</Text>
        </View>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>Rating</Text>
        </View>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>Type</Text>
        </View>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>Amenities</Text>
        </View>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>Distance</Text>
        </View>
      </ScrollView>

      {/* Results List */}
      <FlatList
        data={searchResults}
        renderItem={renderHotelItem}
        keyExtractor={(item, index) =>
          `${item.property_token || item.name}-${index}`
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No hotels found</Text>
            <Text style={styles.noResultsSubtext}>
              Try adjusting your search criteria
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  guestsInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  resultCount: {
    fontSize: 14,
    color: "#666",
  },
  filterContainer: {
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterPill: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    height: 32,
    justifyContent: "center",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  noResultsContainer: {
    padding: 32,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
