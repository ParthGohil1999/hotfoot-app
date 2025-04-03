import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import useTripSearchStore from '../store/trpiSearchZustandStore';
import useTravelPreferencesStore from '../store/travelPreferencesZustandStore';
import TopBar from '../../components/topBar';
import BottomBarContinueBtn from '../../components/buttons/bottomBarContinueBtn';

const ReviewSummaryScreen = ({ navigation }) => {
  // Get data from trip search store
  const { 
    fromLocation,
    toLocation,
    dates,
    travelers,
    tripType
  } = useTripSearchStore();

  console.log(tripType)
  
  // Get data from travel preferences store
  const { 
    selectedButtons, 
    budgetPreference 
  } = useTravelPreferencesStore();

  const generateTrip = () => {
    
};

  const totalTravelers = travelers.adults + travelers.children + travelers.infants;
  const partyText = totalTravelers === 2 ? 'A Couple' : 
    `${totalTravelers} ${totalTravelers === 1 ? 'Person' : 'People'}`;

  // Format dates
  const formattedStartDate = dates.startDate ? new Date(dates.startDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';
  
  const formattedEndDate = dates.endDate ? new Date(dates.endDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  const dateDisplay = dates.startDate && dates.endDate 
    ? `${formattedStartDate} to ${formattedEndDate}`
    : formattedStartDate || 'Not set';

  // Map interest buttons to emojis
  const interestEmojis = {
    'Adventure Travel': '🏞️',
    'Beach Vacations': '🏖️',
    'Road Trips': '🚗',
    'Food Tourism': '🍔',
    'Art Galleries': '🖼️'
  };

  // Map budget preferences to emojis
  const budgetEmojis = {
    'Budget': '💲',
    'Moderate': '💲💲',
    'Luxury': '💎'
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1, }}>
        <TopBar backarrow text={'Review Summary'} />
      <ScrollView style={{ marginVertical: 20 }}>

        {/* Destination Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
            <Ionicons name="location-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>Destination</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('DestinationSelection')}>
            <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {toLocation && (
            <View style={styles.destinationContent}>
              <View style={styles.destinationImageContainer}>
                <View style={styles.destinationImage} />
              </View>
              <View style={styles.destinationDetails}>
                <Text style={styles.destinationName}>{toLocation.name}</Text>
                <View style={styles.countryContainer}>
                  <View style={styles.countryDot} />
                  <Text style={styles.countryName}>{tripType}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Party Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
              <Ionicons name="people-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>Party</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('TravelersSelection')}>
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionContent}>{partyText} ❤️</Text>
        </View>

        {/* Trip Dates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
              <Ionicons name="calendar-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>Trip Dates</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('DateSelection')}>
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionContent}>{dateDisplay}</Text>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
              <Ionicons name="star-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>{selectedButtons.length} Interests</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('InterestsSelection')}>
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.interestsContainer}>
            {selectedButtons.map((interest, index) => (
              <View key={index} style={styles.interestButton}>
                <Text style={styles.interestText}>
                  {interest} {interestEmojis[interest] || ''}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Budget Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconLabelContainer}>
              <Ionicons name="cash-outline" size={24} color="#000" />
              <Text style={styles.sectionLabel}>Budget</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('BudgetSelection')}>
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionContent}>
            {budgetPreference || 'Not set'} {budgetPreference ? budgetEmojis[budgetPreference] || '' : ''}
          </Text>
        </View>

      </ScrollView>
      <BottomBarContinueBtn handleDone={generateTrip} buttonText={'Generate Trip'}  />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 24,
  },
  section: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 10,
  },
  sectionContent: {
    fontSize: 15,
    color: '#333',
    marginLeft: 34,
  },
  destinationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 34,
  },
  destinationImageContainer: {
    marginRight: 15,
  },
  destinationImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  destinationDetails: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginRight: 6,
  },
  countryName: {
    fontSize: 14,
    color: '#555',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 34,
  },
  interestButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  interestText: {
    fontSize: 14,
    color: '#333',
  },
  buildButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    margin: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buildButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewSummaryScreen;