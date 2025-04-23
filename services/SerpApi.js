import axios from "axios";

const BASE_URL = "https://serpapi.com/search.json";
const API_KEY = process.env.EXPO_PUBLIC_SERP_API_KEY;

// Main function to make API calls
const makeApiCall = async (params) => {
  const fullParams = {
    ...params,
    api_key: API_KEY,
    gl: "us",
    hl: "en",
  };

  const queryString = new URLSearchParams(fullParams).toString();
  console.log("Final API Request URL:", `${BASE_URL}?${queryString}`);

  try {
    const response = await axios.get(BASE_URL, { params: fullParams });
    console.log("API Response Data:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Response Error:", error.response.data);
      console.error("Status:", error.response.status);
    } else {
      console.error("API Request Failed:", error.message);
    }
    throw error;
  }
};

/* ------------------------------------- FLIGHT FUNCTIONS ------------------------------------- */

// Search for flights from "from" location to "to" location
export const searchOutboundFlights = async (params) => {
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
    booking_token: params.bookingToken,
    type: params.type,
  };

  if (params.type === "1" && params.returnDate) {
    apiParams.return_date = params.returnDate;
  }

  return makeApiCall(apiParams);
};

export const formatFlightSearchParams = (searchData) => {
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

  if (!searchData.fromLocation?.code || !searchData.toLocation?.code) {
    throw new Error("Please select valid departure and arrival locations");
  }

  const params = {
    departureId: searchData.fromLocation.code,
    arrivalId: searchData.toLocation.code,
    outboundDate: parseDateString(searchData.dates.startDate),
    adults: searchData.travelers.adults || 1,
    children: searchData.travelers.children || 0,
    infants: searchData.travelers.infants || 0,
    travelClass: (searchData.cabinClass || "economy").toLowerCase(),
    currency: "USD",
    tripType: searchData.tripType || "Round Trip",
  };

  if (searchData.tripType === "Round Trip" && searchData.dates.endDate) {
    params.returnDate = parseDateString(searchData.dates.endDate);
  }

  return params;
};

/* ------------------------------------- HOTEL FUNCTIONS ------------------------------------- */
export const searchHotels = async (params) => {
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
  console.log(searchData);
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

  if (!searchData.toLocation?.name) {
    throw new Error("Please select valid destination location");
  }

  const params = {
    q: searchData.toLocation.name.toLowerCase(),
    outboundDate: parseDateString(searchData.dates.startDate),
    returnDate: parseDateString(searchData.dates.endDate),
    adults: searchData.travelers.adults || 1,
    children: searchData.travelers.children || 0,
    infants: searchData.travelers.infants || 0,
    currency: "USD",
  };

  return params;
};
