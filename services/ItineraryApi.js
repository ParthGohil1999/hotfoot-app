import { GoogleGenerativeAI } from "@google/generative-ai";
import { GetPlaceDetails } from "./GlobalApi";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const generateItinerary = async (
  tripData,
  user,
  setGeneratedPlaces,
  setGeneratedItinerary,
  setTripParameters
) => {
  if (!user) {
    throw new Error("User not authenticated");
  }

  if (
    !(
      (tripData.coordinates?.latitude && tripData.coordinates?.longitude) ||
      (tripData.geoCode?.latitude && tripData.geoCode?.longitude)
    )
  ) {
    throw new Error("Destination location not set");
  }

  if (!tripData.dates.startDate || !tripData.dates.endDate) {
    throw new Error("Travel dates not set");
  }

  try {
    // 1. Fetch nearby places
    const places = await fetchNearbyPlaces(tripData);
    if (!places || places.length === 0) {
      throw new Error("No nearby attractions found");
    }
    setGeneratedPlaces(places);

    // 2. Prepare itinerary data
    const itineraryData = {
      destination: tripData.destination || "",
      coordinates: {
        latitude:
          tripData.geoCode?.latitude || tripData.coordinates?.latitude || 0,
        longitude:
          tripData.geoCode?.longitude || tripData.coordinates?.longitude || 0,
      },
      dates: {
        start: tripData.dates.startDate,
        end: tripData.dates.endDate,
        duration: tripData.dates.totalDays,
        totalNights: tripData.dates.totalDays - 1,
      },
      travelers: {
        adults: tripData.travelers.adults,
        children: tripData.travelers.children,
        infants: tripData.travelers.infants,
        description: getTravelerDescription(tripData.travelers),
      },
      preferences: {
        interests: tripData.preferences.interests,
        budget: tripData.preferences.budget,
        tripType: tripData.preferences.tripType,
      },
      places: places,
    };

    // Save trip parameters to store
    setTripParameters({
      destination: tripData.destination,
      dates: tripData.dates,
      travelers: tripData.travelers,
      preferences: tripData.preferences,
    });

    // 3. Generate AI itinerary
    const itinerary = await generateAItinerary(itineraryData);
    const enrichedItinerary = enrichItinerary(itinerary, places);
    setGeneratedItinerary(enrichedItinerary);

    // 4. Save to Firestore
    await saveItineraryToDB({
      places,
      itinerary: enrichedItinerary,
      parameters: itineraryData,
      user,
    });

    return enrichedItinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

const fetchNearbyPlaces = async (tripData) => {
  try {
    const latitude =
      tripData.geoCode?.latitude || tripData.coordinates?.latitude;
    const longitude =
      tripData.geoCode?.longitude || tripData.coordinates?.longitude;

    if (!latitude || !longitude) {
      throw new Error("Destination location not set");
    }

    const interestToPrimaryTypesMap = {
      "Adventure Travel": ["amusement_park", "park", "tourist_attraction"],
      "Beach Vacations": ["park", "tourist_attraction", "restaurant"],
      "Road Trips": ["tourist_attraction", "park"],
      "Food Tourism": ["restaurant", "cafe", "bakery"],
      "Art Galleries": ["art_gallery", "museum"],
    };

    let includedPrimaryTypes = [];
    if (tripData.preferences.interests.length > 0) {
      includedPrimaryTypes = Array.from(
        new Set(
          tripData.preferences.interests
            .flatMap((interest) => interestToPrimaryTypesMap[interest] || [])
            .filter(Boolean)
        )
      );
    }

    if (includedPrimaryTypes.length === 0) {
      includedPrimaryTypes = [
        "tourist_attraction",
        "museum",
        "park",
        "restaurant",
        "cafe",
        "shopping_mall",
        "art_gallery",
        "botanical_garden",
        "historical_landmark",
      ];
    }

    const response = await GetPlaceDetails({
      includedPrimaryTypes,
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: 15000,
        },
      },
    });

    console.log("Places Response:", response?.places);
    return response?.places || [];
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    throw error;
  }
};

const getTravelerDescription = (travelers) => {
  const total = travelers.adults + travelers.children + travelers.infants;
  if (total === 1) return "Only Me";

  let description = `${travelers.adults} Adult${
    travelers.adults > 1 ? "s" : ""
  }`;
  if (travelers.children > 0) {
    description += `, ${travelers.children} Child${
      travelers.children > 1 ? "ren" : ""
    }`;
  }
  if (travelers.infants > 0) {
    description += `, ${travelers.infants} Infant${
      travelers.infants > 1 ? "s" : ""
    }`;
  }
  return description;
};

const generateAItinerary = async (itineraryData) => {
  const placesPerDay = Math.ceil(
    itineraryData.places.length / itineraryData.dates.duration
  );
  const prompt = `
    You are a travel planner generating a detailed itinerary for a trip to ${
      itineraryData.destination
    } for 
    ${itineraryData.dates.duration} days and ${
    itineraryData.dates.totalNights
  } nights 
    for ${itineraryData.travelers.description} with a ${
    itineraryData.preferences.budget
  } budget.

    Trip Type: ${itineraryData.preferences.tripType}
    Interests: ${itineraryData.preferences.interests.join(", ")}

    Create a day-by-day itinerary using the following ${
      itineraryData.places.length
    } places (use all provided details):
    ${JSON.stringify(itineraryData.places, null, 2)}

    Requirements:
    1. Distribute the ${itineraryData.places.length} places evenly across ${
    itineraryData.dates.duration
  } days, with approximately ${placesPerDay} places per day.
    2. Each day should start around 10 AM and end by 8 PM.
    3. Group nearby locations together based on their coordinates (latitude, longitude) to minimize travel time.
    4. Include lunch breaks at appropriate times, selecting restaurants or cafes from the provided places if available.
    5. Consider weather conditions (provide suitable indoor alternatives like museums or cafes if rain is expected).
    6. Ensure the itinerary matches the ${
      itineraryData.preferences.budget
    } budget level (e.g., prioritize free or low-cost activities for Budget, high-end dining and exclusive experiences for Luxury).
    7. Provide transportation tips specific to ${itineraryData.destination}.
    8. Ensure the itinerary is realistic, enjoyable, and aligns with the user's interests.
    9. Use the place names exactly as provided in the places array for matching purposes.

    Output Format (strict JSON, do not deviate):
    {
      "dailyItinerary": [
        {
          "day": 1,
          "date": "${itineraryData.dates.start}",
          "activities": [
            {
              "time": "10:00 AM",
              "place": "Place Name",
              "type": "Attraction/Activity",
              "duration": "2 hours",
              "description": "Brief description of the activity",
              "travelTimeFromPrevious": "15 mins walk",
              "notes": "Any special notes (e.g., ticket booking required)"
            }
          ],
          "lunch": {
            "time": "1:00 PM",
            "place": "Restaurant Name",
            "type": "Lunch",
            "duration": "1 hour",
            "description": "Brief description of the dining experience"
          }
        }
      ],
      "transportationTips": "Specific transportation tips for ${
        itineraryData.destination
      }",
      "additionalNotes": "Any additional notes or recommendations"
    }

    Ensure the response is valid JSON and strictly follows the specified structure. Use all ${
      itineraryData.places.length
    } places provided, and include their names in the dailyItinerary activities.
    Do not include markdown code blocks (e.g., \`\`\`json) or any text outside the JSON object.
  `;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    console.log("Raw AI Response:", responseText);

    let jsonString = responseText.trim();
    jsonString = jsonString
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, "")
      .trim();

    console.log("Cleaned JSON String:", jsonString);

    let parsedItinerary;
    try {
      parsedItinerary = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Problematic JSON String:", jsonString);

      const fixedJsonString = jsonString
        .replace(/,\s*([\]}])/g, "$1")
        .replace(/([\[,{])\s*,/g, "$1");

      try {
        parsedItinerary = JSON.parse(fixedJsonString);
        console.log("Fixed JSON Parsed Successfully");
      } catch (fixedParseError) {
        console.error("Fixed JSON Parse Error:", fixedParseError);
        throw new Error("Failed to parse AI response as valid JSON");
      }
    }

    if (
      !parsedItinerary.dailyItinerary ||
      !parsedItinerary.transportationTips
    ) {
      throw new Error("Invalid itinerary structure in AI response");
    }

    return parsedItinerary;
  } catch (error) {
    console.error("Error generating AI itinerary:", error);
    throw new Error("Failed to generate itinerary with AI");
  }
};

const enrichItinerary = (itinerary, places) => {
  const placeMap = new Map(
    places.map((place) => [
      place.displayName?.text || place.name || "",
      place,
    ])
  );

  const enrichedDailyItinerary = itinerary.dailyItinerary.map((day) => {
    const enrichedActivities = day.activities.map((activity) => {
      const fullPlace = placeMap.get(activity.place);
      if (!fullPlace) {
        console.warn(`Place not found in placeMap: ${activity.place}`);
        return activity;
      }
      return {
        ...activity,
        rating: fullPlace.rating || null,
        userRatingCount: fullPlace.userRatingCount || null,
        photos: fullPlace.photos || [],
        location: fullPlace.location || {},
      };
    });

    let enrichedLunch = day.lunch;
    if (day.lunch?.place) {
      const fullLunchPlace = placeMap.get(day.lunch.place);
      if (!fullLunchPlace) {
        console.warn(`Lunch place not found in placeMap: ${day.lunch.place}`);
      } else {
        enrichedLunch = {
          ...day.lunch,
          rating: fullLunchPlace.rating || null,
          userRatingCount: fullLunchPlace.userRatingCount || null,
          photos: fullLunchPlace.photos || [],
          location: fullLunchPlace.location || {},
        };
      }
    }

    return {
      ...day,
      activities: enrichedActivities,
      lunch: enrichedLunch,
    };
  });

  return {
    ...itinerary,
    dailyItinerary: enrichedDailyItinerary,
  };
};

const saveItineraryToDB = async ({ places, itinerary, parameters, user }) => {
  try {
    const docRef = await addDoc(collection(db, "itineraries"), {
      clerkUserId: user.id,
      userEmail: user.primaryEmailAddress?.emailAddress || "unknown",
      places,
      itinerary: {
        dailyItinerary: itinerary.dailyItinerary,
        transportationTips: itinerary.transportationTips,
        additionalNotes: itinerary.additionalNotes,
      },
      parameters: {
        destination: parameters.destination,
        coordinates: parameters.coordinates,
        dates: parameters.dates,
        travelers: parameters.travelers,
        preferences: parameters.preferences,
      },
      createdAt: serverTimestamp(),
    });
    console.log("Itinerary saved to Firestore with ID:", docRef.id);
  } catch (error) {
    console.error("Error saving itinerary to Firestore:", error);
    throw new Error("Failed to save itinerary to database");
  }
};
