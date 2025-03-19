import axios from "axios"

// export const GetPixabayImageByCityName = async (name) => {
//     try {
//         const BASE_URL_FOR_CITY_IMAGE_BY_NAME_SEARCH = `https://fiw0xkkgn1.execute-api.us-east-1.amazonaws.com/dev/pixabay/image`;
//         const response = await axios.post(BASE_URL_FOR_CITY_IMAGE_BY_NAME_SEARCH, body={name});
        
//         // console.log('Pixabay API Response:', response.data); // Debug API response
//         return JSON.stringify(response?.data);
//     } catch (error) {
//         console.error('Error fetching Pixabay image details:', error); // Log detailed error
//         return JSON.stringify({ hits: [] }); // Return empty hits on error
//     }
// };


export const GetPixabayImageByCityName = async (name) => {
    try {
        const BASE_URL_FOR_CITY_IMAGE_BY_NAME_SEARCH = `https://pixabay.com/api/?key=${process.env.EXPO_PUBLIC_PIXABAY_API_KEY}&q=${name}&image_type=photo&orientation=horizontal&category=travel`;
        const response = await axios.get(BASE_URL_FOR_CITY_IMAGE_BY_NAME_SEARCH);
        
        // console.log('Pixabay API Response:', response.data); // Debug API response
        return JSON.stringify(response?.data);
    } catch (error) {
        console.error('Error fetching Pixabay image details:', error); // Log detailed error
        return JSON.stringify({ hits: [] }); // Return empty hits on error
    }
};
