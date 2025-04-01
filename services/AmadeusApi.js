import axios from "axios"

const getAmadeusAccessToken = async () => {

    try {
        const BASE_URL_FOR_ACCESS_TOKEN = `https://test.api.amadeus.com/v1/security/oauth2/token`

        const accessTokenConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }

        const body = {
            'grant_type': 'client_credentials',
            'client_id': process.env.EXPO_PUBLIC_AMADEUS_API_KEY,
            'client_secret': process.env.EXPO_PUBLIC_AMADEUS_API_SECRET,
        }
        const { data } = await axios.post(BASE_URL_FOR_ACCESS_TOKEN, body, accessTokenConfig)

        return data
    } catch (error) {
        console.error("Error fetching Amadeus Access Token:", error);
    }

}

export const TopPicksOnlyForYou = async () => {

    try {
        
        // const data = await getAmadeusAccessToken()

        // console.log('access token: ', data.access_token)

        const BASE_URL_FOR_TOP_PICK_CITIES = 'https://olec7zq74a.execute-api.us-east-1.amazonaws.com/dev/toppicks'

        // const topPicksconfig = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${data?.access_token}`,
        //     }
        // };
        // Recommended locations similar to PAR
        // const topPicks = await axios.get(BASE_URL_FOR_TOP_PICK_CITIES, topPicksconfig)
        const topPicks = await axios.get(BASE_URL_FOR_TOP_PICK_CITIES)

        // console.log('topPicks from A-apiii:', JSON.stringify(topPicks, null, 2))

        return topPicks
    } catch (error) {
        console.log('Error from TopPicksOnlyForYou (Amadeus): ',error);
    }

}

export const TopTrendsFromYourCityApi = async () => {

    try {
        
        // const data = await getAmadeusAccessToken()

        // console.log('access token: ', data.access_token)

        const BASE_URL_FOR_TOP_TRENDS_FROM_YOUR_CITY = 'https://olec7zq74a.execute-api.us-east-1.amazonaws.com/dev/toptrends'

        // const topTrendsFromYourCityconfig = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${data?.access_token}`,
        //     }
        // };
        // Recommended locations similar to PAR
        const topTrends = await axios.get(BASE_URL_FOR_TOP_TRENDS_FROM_YOUR_CITY)
        // const topTrends = await axios.get(BASE_URL_FOR_TOP_TRENDS_FROM_YOUR_CITY, topTrendsFromYourCityconfig)

        // console.log('topPicks from A-api:')

        return topTrends
    } catch (error) {
        console.log('Error from TopTrendsFromYourCityApi (Amadeus): ',error);
    }

}

