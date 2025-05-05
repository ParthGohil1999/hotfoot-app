import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { HotelCardResults } from "../../components/hotelCard/hotelCardResults";
import TopBar from "../../components/topBar";

const PAGE_SIZE = 10;

export default function HotelSearchResultsScreen() {
  const { hotelResults, searchData } = useLocalSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [allHotels, setAllHotels] = useState([]);
  const [displayedHotels, setDisplayedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (hotelResults) {
        const parsedResults = JSON.parse(hotelResults);
        setSearchResults(parsedResults.properties || []);
        setSearchParams(parsedResults.search_parameters || {});
        setAllHotels(parsedResults.properties || []);
        setDisplayedHotels(
          (parsedResults.properties || []).slice(0, PAGE_SIZE)
        );
        setHasMore((parsedResults.properties || []).length > PAGE_SIZE);
        if (searchData) {
          const parsedSearchData = JSON.parse(searchData);
          setSearchParams((prev) => ({ ...prev, ...parsedSearchData }));
        }
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

  const loadMoreHotels = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const nextBatch = allHotels.slice(
        displayedHotels.length,
        displayedHotels.length + PAGE_SIZE
      );

      setDisplayedHotels((prev) => [...prev, ...nextBatch]);
      setHasMore(displayedHotels.length + nextBatch.length < allHotels.length);
      setLoadingMore(false);
    }, 1000);
  }, [loadingMore, hasMore, displayedHotels.length, allHotels]);

  const handleEndReached = () => {
    if (!loadingMore && hasMore) {
      loadMoreHotels();
    }
  };

  const renderHotelItem = ({ item }) => (
    <HotelCardResults
      hotel={item}
      searchParams={JSON.parse(searchData)}
      amenities={item.amenities || []}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#000" />
        <Text style={styles.footerText}>Loading more hotels...</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar logo text="Hotels" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
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

      <FlatList
        data={displayedHotels}
        renderItem={renderHotelItem}
        keyExtractor={(item, index) => `${item.property_token}-${index}`}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
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
  listContent: {
    padding: 16,
  },
  footer: {
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
