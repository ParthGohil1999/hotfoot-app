import axios from "axios";

export const TripAdvisorLocationSearchApi = async ({ name, phoneNumber, latitude, longitude, category }) => {

    try {

        const BASE_URL_FOR_TRIPADVISOR_LOCATION_SEARCH_API = `https://l052ljo3kk.execute-api.us-east-1.amazonaws.com/dev/tripadvisor/search`

        // const tripAdvisorLocationSearchconfig = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }
        // };
        // Recommended locations similar to PAR
        const { data } = await axios.post(BASE_URL_FOR_TRIPADVISOR_LOCATION_SEARCH_API, { name, phoneNumber, latitude, longitude, category })

        // console.log('data from TripAdvisorLocationSearchApi:', searchPlaceData)

        return data
    } catch (error) {
        console.log('Error from TripAdvisorLocationSearchApi (TripAdvisor): ', error);
    }

}


export const TripAdvisorLocationDetailsApi = async ({ name, phoneNumber, latitude, longitude, category }) => {

    try {

        // const body = { 'name': name, 'phoneNumber': phoneNumber, 'latitude': latitude, 'longitude': longitude, 'category': category }

        const BASE_URL_FOR_TRIPADVISOR_LOCATION_SEARCH_BY_ID_API = `https://l052ljo3kk.execute-api.us-east-1.amazonaws.com/dev/tripadvisor/details`

        // const tripAdvisorLocationSearchByIdconfig = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }
        // };


        const { data } = await axios.post(BASE_URL_FOR_TRIPADVISOR_LOCATION_SEARCH_BY_ID_API, { name, phoneNumber, latitude, longitude, category })


        // console.log('data from TRIPADVISOR_LOCATION_SEARCH_BY_ID_API:', data.amenities)

        return data

    } catch (error) {
        console.log('Error from TripAdvisorLocationDetailsApi -> LocationSearchById (TripAdvisor): ', error);
    }

}

