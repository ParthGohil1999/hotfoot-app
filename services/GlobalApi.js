import axios from "axios"
import { toast } from "sonner";

// const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY;


// <====================== Get Place Latitude and Longitude Function ===============>

// const location = { lat: 51.5072178, lng: -0.12758619999999998 }; // Example location (San Francisco, CA)

export const GetPlaceLatLng = async (placeid) => {
    try {
        const BASE_URL_FOR_PLACE_LAT_LNG = `https://owr0q96ay7.execute-api.us-east-1.amazonaws.com/place-latlng`

        const { data } = await axios.post(BASE_URL_FOR_PLACE_LAT_LNG,{placeid})

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
        const BASE_URL_FOR_PLACE_DETAILS = `https://owr0q96ay7.execute-api.us-east-1.amazonaws.com/place-details`

        // const config = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY,
        //         'X-Goog-FieldMask': [
        //             'places.displayName',
        //             'places.id',
        //             // 'places.accessibilityOptions',
        //             // 'places.restroom',
        //             // 'places.servesCoffee',
        //             // 'places.goodForChildren',
        //             // 'places.businessStatus',
        //             'places.editorialSummary',
        //             'places.formattedAddress',
        //             'places.googleMapsUri',
        //             'places.internationalPhoneNumber',
        //             'places.location',
        //             'places.nationalPhoneNumber',
        //             'places.photos',
        //             'places.rating',
        //             'places.userRatingCount',
        //             'places.reviews',
        //             'places.regularOpeningHours',
        //             'places.types',
        //             // 'places.primaryType',
        //             // 'places.primaryTypeDisplayName',
        //             'places.websiteUri',
        //             'places.paymentOptions',
        //         ]
        //     }
        // }

        const { data } = await axios.post(BASE_URL_FOR_PLACE_DETAILS, body)

        return data;
    } catch (error) {
        console.error('Error fetching nearby place details:', error);
        toast("Oops, something went wrong while fetching nearby place details")
    }
}


// <==================== Get Place Details By TextSearch Function ===============>

// PLEASE NOTE!!! Body is being passed as data where the function is being used...

export const GetPlaceDetailsByTextSearch = async () => {
    try {

        const BASE_URL_FOR_PLACE_DETAILS_BY_TEXT_SEARCH = `https://owr0q96ay7.execute-api.us-east-1.amazonaws.com/place-details-text-search`

        const { data } = await axios.get(BASE_URL_FOR_PLACE_DETAILS_BY_TEXT_SEARCH)

        return data;
    } catch (error) {
        console.error('Error fetching place details by text search:', error);
        toast("Oops, something went wrong while fetching place details by text search")
    }
}

// <====================== Get Place Details by Place ID Function =====================>


export const GetPlaceDetailsById = async (placeid) => {
    try {
        // console.log("placeid: ", placeid)
        const BASE_URL_FOR_PLACE_DETAILS = `https://owr0q96ay7.execute-api.us-east-1.amazonaws.com/place-details-by-id`

        // const fieldMask = [
        //     'displayName',
        //     'id',
        //     'accessibilityOptions',
        //     'restroom',
        //     'servesCoffee',
        //     'goodForChildren',
        //     'businessStatus',
        //     'editorialSummary',
        //     'formattedAddress',
        //     'googleMapsUri',
        //     'internationalPhoneNumber',
        //     'location',
        //     'nationalPhoneNumber',
        //     'photos',
        //     'rating',
        //     'userRatingCount',
        //     'reviews',
        //     'regularOpeningHours',
        //     'types',
        //     'primaryType',
        //     'primaryTypeDisplayName',
        //     'websiteUri',
        //     'paymentOptions',
        // ].join(',');

        // const config = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY,
        //         'X-Goog-FieldMask': fieldMask, // Use the comma-separated string here
        //     },
        // };

        const { data } = await axios.post(BASE_URL_FOR_PLACE_DETAILS, {placeid})

        // console.log("placeid data: ", data)

        return data 

    } catch (error) {
        console.error('Error fetching place details by ID :', error);
        toast("Oops, something went wrong while fetching place details by ID")
    }
}

export const getRouteMatrix = async (origin, destinations) => {
    const url = `https://owr0q96ay7.execute-api.us-east-1.amazonaws.com/route-matrix`;

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
            'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY,
            'X-Goog-FieldMask': ['originIndex', 'destinationIndex', 'duration', 'distanceMeters', 'status', 'condition'],
        }
    };

    try {
        const response = await axios.post(url, [{origin}, {destinations}]);
        console.log("response.duration: ", response.data)
        return [response.data];
    } catch (error) {
        console.error('Error fetching route matrix:', error);
        return [];
    }
};

export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY
