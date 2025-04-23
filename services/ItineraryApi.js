// services/ItineraryApi.ts
import { GetPlaceDetails } from "./GlobalApi";

export const generateItinerary = async (tripData) => {
  try {
    // First get nearby places
    const nearbyPlaces = await GetPlaceDetails({
      includedPrimaryTypes: [
        "tourist_attraction",
        "museum",
        "park",
        "restaurant",
      ],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: tripData.coordinates.latitude,
            longitude: tripData.coordinates.longitude,
          },
          radius: 15000,
        },
      },
    });

    const response = await fetch("/api/destinations/createDestinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title_of_destination: tripData.destination,
        days: Array(tripData.dates.duration)
          .fill(0)
          .map((_, i) => i + 1),
        nearby_places: nearbyPlaces.places.map((place) => ({
          name: place.displayName.text,
          types: place.types,
        })),
      }),
    });

    const itinerary = await response.json();

    // Save to database
    const saveResponse = await fetch("/api/itineraries/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...tripData,
        itinerary: itinerary,
        status: "generated",
        createdAt: new Date().toISOString(),
      }),
    });

    return await saveResponse.json();
  } catch (error) {
    console.error("Error in generateItinerary:", error);
    throw error;
  }
};
