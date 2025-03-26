import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Modal } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';

const PlaceAutocomplete = ({ onCitySelect, apiKey, type, modalVisible, setModalVisible, currentField }) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const handleCitySelect = (data, details) => {
      if (details) {
        setLoading(true);
        
        // Extract city code from address components if available
        let cityCode = "";
        if (details.address_components) {
          const airportComponent = details.address_components.find(
            component => component.types.includes("airport")
          );
          if (airportComponent) {
            cityCode = airportComponent.short_name;
          }
        }
        
        // If no airport code was found, create a placeholder code
        if (!cityCode) {
          // Use first 3 letters of city name as code if no real code is available
          cityCode = details.name.substring(0, 3).toUpperCase();
        }
        
        const cityDetails = {
          name: details.name,
          code: cityCode,
          placeId: details.place_id,
          formattedAddress: details.formatted_address,
          coordinates: {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          },
        };
        
        setSelectedCity(cityDetails);
        
        // Check if onCitySelect exists and is a function before calling it
        if (onCitySelect && typeof onCitySelect === 'function') {
          onCitySelect(cityDetails);
        } else {
          console.warn('onCitySelect is not a function or not provided');
        }
        
        setLoading(false);
        setModalVisible(false);
      }
    };
  
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {currentField === 'from' ? 'Select Departure' : 'Select Destination'}
            </Text>
            <View style={{ width: 24 }} />
          </View>
          
          <GooglePlacesAutocomplete
            placeholder={currentField === 'from' ? "Enter departure city" : "Enter destination city"}
            minLength={2}
            autoFocus={true}
            returnKeyType={'search'}
            fetchDetails={true}
            listViewDisplayed={true}
            styles={{
              container: {
                flex: 1,
                paddingHorizontal: 20,
              },
              textInputContainer: {
                backgroundColor: '#f1f1f1',
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 16,
              },
              textInput: {
                height: 50,
                backgroundColor: 'transparent',
                fontSize: 16,
                fontWeight: '500',
                color: 'black',
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              listView: {
                backgroundColor: '#fff',
              },
              separator: {
                height: 1,
                backgroundColor: '#eee',
              },
              row: {
                padding: 16,
              },
              description: {
                fontSize: 16,
              }
            }}
            enablePoweredByContainer={false}
            onPress={handleCitySelect}
            query={{
              key: apiKey,
              language: 'en',
              types: type,
            }}
            debounce={300}
          />
        </SafeAreaView>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    gap: 20,
  },
  searchField: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 12,
  },
  searchLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  searchValue: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  searchValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  travelerSubtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 28,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PlaceAutocomplete;