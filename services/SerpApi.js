import useUserStore from "@/app/store/userZustandStore";
import axios from "axios";
// const { userLocation } = useUserStore();

const BASE_URL = "https://dhu7rma17e.execute-api.us-east-1.amazonaws.com/serpapi-calls";


// Main function to make API calls
const makeApiCall = async (params) => {

  try {
    const response = await axios.post(BASE_URL, params);
    console.log("API Response Data dfdfdf:", response);
    return response.data.data;
  } catch (error) {
    console.warn("First attempt failed. Retrying once...");
    try {
      const retryResponse = await axios.post(BASE_URL, params);
      return retryResponse.data.data;
    } catch (finalError) {
      console.error("Retry failed.");
      if (finalError.response) {
        console.error("API Response Error:", finalError.response.data);
        console.error("Status:", finalError.response.status);
      } else {
        console.error("API Request Failed:", finalError.message);
      }
      throw finalError;
    }


  }
};

/* ------------------------------------- FLIGHT FUNCTIONS ------------------------------------- */

// Search for flights from "from" location to "to" location
export const searchOutboundFlights = async (params) => {
  // const { userLocation } = useUserStore();
  const travelClassMap = {
    economy: 1,
    business: 3,
    first: 4,
  };

  const typeClassMap = {
    "Round Trip": 1,
    "One Way": 2,
    "Multi-City": 3,
  };

  const apiParams = {
    engine: "google_flights",
    departure_id: params.departureId,
    arrival_id: params.arrivalId,
    outbound_date: params.outboundDate,
    return_date: params.returnDate,
    adults: params.adults,
    children: params.children || 0,
    infants: params.infants || 0,
    travel_class: travelClassMap[params.travelClass?.toLowerCase()] || 1,
    currency: params.currency || "USD",
    type: typeClassMap[params.tripType] || 1,
    show_hidden: true,
    deep_search: true,
  };

  if (params.tripType === "Round Trip" && params.returnDate) {
    apiParams.return_date = params.returnDate;
  }

  return makeApiCall(apiParams);
};

// Search for return flights i.e., from "to" location to "from" location
export const getReturnFlights = async (params) => {
  return makeApiCall({
    engine: "google_flights",
    departure_id: params.departureId,
    arrival_id: params.arrivalId,
    outbound_date: params.outboundDate,
    return_date: params.returnDate,
    departure_token: params.departureToken,
    currency: params.currency || "USD",
    show_hidden: true,
    deep_search: true,
  });
};

// Get details of the flight journey
export const getJourneyDetails = async (params) => {
  const apiParams = {
    engine: "google_flights",
    departure_id: params.departureId,
    arrival_id: params.arrivalId,
    outbound_date: params.outboundDate,
    return_date: params.returnDate,
    currency: params.currency || "USD",
    booking_token: params.bookingToken,
    type: params.type,
  };

  if (params.type === "1" && params.returnDate) {
    apiParams.return_date = params.returnDate;
  }

  return makeApiCall(apiParams);
};

export const formatFlightSearchParams = (searchData) => {
  // const { userLocation } = useUserStore();
  console.log("CONSOLE LOG FROM formatFlightSearchParams: ", searchData);
  const parseDateString = (dateStr) => {
    if (!dateStr) return null;

    if (dateStr instanceof Date) {
      return format(dateStr, "yyyy-MM-dd");
    }

    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const parts = dateStr.split(" ");
    if (parts.length !== 3) return null;

    const month = months[parts[0]];
    const day = parts[1].replace(",", "").padStart(2, "0");
    const year = parts[2];

    return `${year}-${month}-${day}`;
  };

  if (!searchData.fromLocation || !searchData.toLocation) {
    throw new Error("Please select valid departure and arrival locations");
  }

  const params = {
    departureId: searchData.fromLocation,
    arrivalId: searchData.toLocation,
    outboundDate: parseDateString(searchData.dates.startDate),
    adults: searchData.travelers.adults || 1,
    children: searchData.travelers.children || 0,
    infants: searchData.travelers.infants || 0,
    travelClass: (searchData.cabinClass || "economy").toLowerCase(),
    currency: searchData.currency || "USD",
    tripType: searchData.tripType || "Round Trip",
  };

  if (searchData.tripType === "Round Trip" && searchData.dates.endDate) {
    params.returnDate = parseDateString(searchData.dates.endDate);
  }

  return params;
};

/* ------------------------------------- HOTEL FUNCTIONS ------------------------------------- */
export const searchHotels = async (params) => {
  // const { userLocation } = useUserStore();
  const apiParams = {
    engine: "google_hotels",
    q: params.q,
    check_in_date: params.outboundDate,
    check_out_date: params.returnDate,
    adults: params.adults,
    children: params.children || 0,
    currency: params.currency || "USD",
  };

  return makeApiCall(apiParams);
};

export const getHotel = async (params) => {
  // const { userLocation } = useUserStore();
  const apiParams = {
    engine: "google_hotels",
    q: params.q,
    property_token: params.propertyToken,
    check_in_date: params.checkInDate,
    check_out_date: params.checkOutDate,
    adults: params.adults,
    children: params.children || 0,
    currency: params.currency || "USD",
  };

  return makeApiCall(apiParams);
};

export const formatHotelSearchParams = (searchData) => {
  // const { userLocation } = useUserStore();
  console.log("searchData from serpAPI: ", searchData);
  const parseDateString = (dateStr) => {
    if (!dateStr) return null;

    if (dateStr instanceof Date) {
      return format(dateStr, "yyyy-MM-dd");
    }

    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const parts = dateStr.split(" ");
    if (parts.length !== 3) return null;

    const month = months[parts[0]];
    const day = parts[1].replace(",", "").padStart(2, "0");
    const year = parts[2];

    return `${year}-${month}-${day}`;
  };

  if (!searchData.toLocation) {
    throw new Error("Please select valid destination location");
  }

  const params = {
    q: searchData.toLocation.toLowerCase(),
    outboundDate: parseDateString(searchData.dates.startDate),
    returnDate: parseDateString(searchData.dates.endDate),
    adults: searchData.travelers.adults || 1,
    children: searchData.travelers.children || 0,
    infants: searchData.travelers.infants || 0,
    currency: searchData.currency || "USD",
  };

  return params;
};

/* ------------------------------------- REVIEWS FUNCTIONS ------------------------------------- */
export const getGoogleMapsPlace = async (params) => {
  const apiParams = {
    engine: "google_maps",
    type: "search",
    google_domain: "google.com",
    q: params.query,
    ll: `@${params.latitude},${params.longitude},14z`,
    hl: "en",
  };

  return makeApiCall(apiParams);
};

export const getGoogleMapsReviews = async (params) => {
  const apiParams = {
    engine: "google_maps_reviews",
    hl: "en",
    place_id: params.placeId,
  };

  return makeApiCall(apiParams);
};
