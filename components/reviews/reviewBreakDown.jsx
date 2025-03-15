import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

const ReviewBreakdown = () => {
  const reviewData = [
    {
      "name": "Service",
      "description": "Service",
      "total_mentioned": 1327,
      "positive": 823,
      "negative": 436,
      "neutral": 68
    },
    {
      "name": "Property",
      "description": "Property",
      "total_mentioned": 1325,
      "positive": 752,
      "negative": 461,
      "neutral": 112
    },
    {
      "name": "Bathroom",
      "description": "Bathroom and toiletries",
      "total_mentioned": 385,
      "positive": 84,
      "negative": 263,
      "neutral": 38
    }
  ];

  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Review Breakdown</Text>
      <ScrollView>
        {reviewData.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.totalMentions}>
                {category.total_mentioned} mentions
              </Text>
            </View>
            <Text style={styles.categoryDescription}>{category.description}</Text>
            
            
            
            {/* Legend and statistics */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.legendBox, styles.positiveBox]} />
                <Text style={styles.statText}>
                  Positive: {category.positive} ({calculatePercentage(category.positive, category.total_mentioned)}%)
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.legendBox, styles.neutralBox]} />
                <Text style={styles.statText}>
                  Neutral: {category.neutral} ({calculatePercentage(category.neutral, category.total_mentioned)}%)
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.legendBox, styles.negativeBox]} />
                <Text style={styles.statText}>
                  Negative: {category.negative} ({calculatePercentage(category.negative, category.total_mentioned)}%)
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalMentions: {
    fontSize: 14,
    color: '#666',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  barContainer: {
    marginVertical: 12,
  },
  progressBar: {
    height: 10,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  positiveBar: {
    backgroundColor: '#4CAF50', // Green
  },
  neutralBar: {
    backgroundColor: '#9E9E9E', // Gray
  },
  negativeBar: {
    backgroundColor: 'red', // Red
  },
  statsContainer: {
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  positiveBox: {
    backgroundColor: '#4CAF50',
  },
  neutralBox: {
    backgroundColor: '#9E9E9E',
  },
  negativeBox: {
    backgroundColor: '#F44336',
  },
  statText: {
    fontSize: 14,
    color: '#333',
  },
});

export default ReviewBreakdown;