export const SelectTravelesList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A lone voyager in search of new horizons.',
        icon: '✈️',
        people: '1'
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'A traveling duo in harmony.',
        icon: '🥂',
        people: '2 People'
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A fun-loving family of adventurers.',
        icon: '🏡',
        people: '3 to 5 People'
    },
    {
        id: 4,
        title: 'Friends',
        desc: 'A squad of pals making memories together.',
        icon: '⛵',
        people: '5 to 10 People'
    },
]


export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💵',
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'Keep cost on the average side',
        icon: '💰',
    },
    {
        id: 3,
        title: 'Luxury',
        desc: 'Dont worry about cost',
        icon: '💸',
    },
]

export const SelectActivityPreferences = [
    {
        id: 8923484572,
        title: 'Kids Friendly',
        types: ["playground", "ski_resort", "art_gallery", "museum", "performing_arts_theater", "amusement_center", "amusement_park", "aquarium", "bowling_alley", "park", "hiking_area", "zoo"],
        desc: 'Affordable adventures for young explorers.',
        icon: '🎈',
    },
    {
        id: 8923484912,
        title: 'Museums',
        types: 'museum',
        desc: 'Uncover the wonders of art and history museums.',
        icon: '🏛️',
    },
    {
        id: 8923484320,
        title: 'Shopping',
        types: 'shopping_mall',
        desc: 'Indulge in a delightful shopping spree.',
        icon: '🛍️',
    },
    {
        id: 8923484836,
        title: 'Historical',
        types: 'historical_landmark',
        desc: 'Journey through time and heritage.',
        icon: '🏰',
    },
    {
        id: 8923484487,
        title: 'Outdoor Adventures',
        types: ["amusement_center", "aquarium", "marina", "hiking_area", "zoo", "bowling_alley", "national_park", "park", "dog_park"],
        desc: 'Thrilling experiences in the great outdoors.',
        icon: '🏞️',
    },
    {
        id: 8923484630,
        title: 'Art & Cultural',
        types: ["cultural_center", "art_gallery", "performing_arts_theater", "dog_park"],
        desc: 'Immerse yourself in art and culture.',
        icon: '🎨',
    },
    {
        id: 8923484051,
        title: 'Amusement Parks',
        types: ['amusement_park', "national_park", "park"],
        desc: 'Endless fun and excitement await.',
        icon: '🎢',
    },
]


export const SelectActivityPreferencesReactNative = [
    { "label": "Amusement Center 🎮", "value": "amusement_center" },
    { "label": "Aquarium 🐠", "value": "aquarium" },
    { "label": "Amusement Park 🎢", "value": "amusement_park" },
    { "label": "Art Gallery 🎨", "value": "art_gallery" },
    { "label": "Bowling Alley 🎳", "value": "bowling_alley" },
    { "label": "Cultural Center 🏛️", "value": "cultural_center" },
    { "label": "Dog Park 🐕", "value": "dog_park" },
    { "label": "Historical Landmark 🏰", "value": "historical_landmark" },
    { "label": "Hiking Area 🥾", "value": "hiking_area" },
    { "label": "Zoo 🦁", "value": "zoo" },
    { "label": "Marina 🚤", "value": "marina" },
    { "label": "National Park 🌲", "value": "national_park" },
    { "label": "Museum 🏛️", "value": "museum" },
    { "label": "Shopping Mall 🛍️", "value": "shopping_mall" },
    { "label": "Playground 🎈", "value": "playground" },
    { "label": "Performing Arts Theater 🎭", "value": "performing_arts_theater" },
    { "label": "Park 🌳", "value": "park" },
    { "label": "Ski Resort ⛷️", "value": "ski_resort" },
]



export const AI_PROMPT2 = 'Generate Travel Plan for Location : {location}, for {totalDays} Days for {traveler} with a {budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and  suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates,Place address, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.'

export const AI_PROMPT = 'Generate Travel Plan for Location : {location}, for {totalDays} Days with {traveler} on a {budget} budget. Suggest an itinerary with places (placeId and name) and plan each day with time slots, including estimated time to travel between places. Finally, structure the itinerary data in JSON format.';
