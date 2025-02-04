import axios from "axios"
import { toast } from "sonner";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY;


// <====================== Get Place Latitude and Longitude Function ===============>

// const location = { lat: 51.5072178, lng: -0.12758619999999998 }; // Example location (San Francisco, CA)

export const GetPlaceLatLng = async (placeid) => {
    try {
        const BASE_URL_FOR_PLACE_LAT_LNG = `https://places.googleapis.com/v1/places/${placeid}?fields=location&key=${apiKey}`

        const { data } = await axios.get(BASE_URL_FOR_PLACE_LAT_LNG)

        const latitude = data.location.latitude
        const longitude = data.location.longitude

        return { latitude, longitude }

    } catch (error) {
        console.error('Error fetching place Latitude and Longitude:', error);
        toast("Oops, something went wrong while fetching place Latitude and Longitude")
    }
}

// <==================== Get Place Details Function ===============>

// PLEASE NOTE!!! Body is being passed as data where the function is being used...

export const GetPlaceDetails = async (body) => {
    try {
        const BASE_URL_FOR_PLACE_DETAILS = `https://places.googleapis.com/v1/places:searchNearby?key=${apiKey}`

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': [
                    'places.displayName',
                    'places.id',
                    'places.accessibilityOptions',
                    'places.restroom',
                    'places.servesCoffee',
                    'places.goodForChildren',
                    'places.businessStatus',
                    'places.editorialSummary',
                    'places.formattedAddress',
                    'places.googleMapsUri',
                    'places.internationalPhoneNumber',
                    'places.location',
                    'places.nationalPhoneNumber',
                    'places.photos',
                    'places.rating',
                    'places.userRatingCount',
                    'places.reviews',
                    'places.regularOpeningHours',
                    'places.types',
                    'places.primaryType',
                    'places.primaryTypeDisplayName',
                    'places.websiteUri',
                    'places.paymentOptions',
                ]
            }
        }

        const { data } = await axios.post(BASE_URL_FOR_PLACE_DETAILS, body, config)

        return data;
    } catch (error) {
        console.error('Error fetching place details:', error);
        toast("Oops, something went wrong while fetching place details")
    }
}


// <==================== Get Place Details By TextSearch Function ===============>

// PLEASE NOTE!!! Body is being passed as data where the function is being used...

export const GetPlaceDetailsByTextSearch = async (data) => {
    try {

        const BASE_URL_FOR_PLACE_DETAILS_BY_TEXT_SEARCH = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=popular+europe+tourists+cities&key=${apiKey}`

        const { data } = await axios.post(BASE_URL_FOR_PLACE_DETAILS_BY_TEXT_SEARCH)

        return data;
    } catch (error) {
        console.error('Error fetching place details:', error);
        toast("Oops, something went wrong while fetching place details")
    }
}

export const getRouteMatrix = async (origin, destinations) => {
    const url = `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix?key=${apiKey}`;

    const requestBody = {
        origins: [
            {
                waypoint: {
                    location: {
                        latLng: {
                            latitude: origin.latitude,
                            longitude: origin.longitude
                        }
                    }
                },
                routeModifiers: { avoid_ferries: true }
            }
        ],
        destinations: destinations.map(destination => ({
            waypoint: {
                location: {
                    latLng: {
                        latitude: destination.latLng.latitude,
                        longitude: destination.latLng.longitude
                    }
                }
            }
        })),
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE"
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': ['originIndex', 'destinationIndex', 'duration', 'distanceMeters', 'status', 'condition'],
        }
    };

    try {
        const response = await axios.post(url, requestBody, config);
        console.log("response.duration: ", response.data)
        return [response.data];
    } catch (error) {
        console.error('Error fetching route matrix:', error);
        return [];
    }
};

export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + apiKey
