export const mockTripsData = [
  {
    docId: "1742057984393",
    tripData: {
      city: {
        name: "Tokyo",
        country: "Japan",
        coverImage:
          "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/tokyo-cover.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vdG9reW8tY292ZXIuanBlZyIsImlhdCI6MTc0MzY5MzIwMCwiZXhwIjoxNzc1MjI5MjAwfQ.rHLTStyCzoMCLh4u1VYSGfH2AOBg4P1ycM7iaVSofNg",
        description:
          "Discover the vibrant culture and modern attractions of Tokyo, Japan's bustling capital.",
        gettingThere:
          "Tokyo is accessible via Narita International Airport (NRT) and Haneda Airport (HND). Direct flights are available from many major cities.",
        bestTimeToVisit:
          "The best time to visit Tokyo is during spring (March to May) for cherry blossoms or autumn (September to November) for pleasant weather.",
        attractions: [
          "Shibuya Crossing",
          "Tokyo Skytree",
          "Meiji Shrine",
          "Asakusa and Senso-ji Temple",
        ],
        localCulture:
          "Experience traditional tea ceremonies, sushi-making classes, and visit local markets like Tsukiji Fish Market.",
        activities: [
          "Visit Akihabara for electronics and anime",
          "Explore Odaiba for shopping and entertainment",
          "Take a day trip to Nikko or Hakone",
        ],
        accommodations:
          "Options range from luxury hotels in Shinjuku to budget-friendly hostels in Asakusa.",
        transportation:
          "Tokyo has an efficient public transportation system, including the JR Yamanote Line and Tokyo Metro.",
        safety:
          "Tokyo is one of the safest cities in the world, but always be aware of your surroundings.",
        language:
          "Japanese is the official language. Learning basic phrases can be helpful.",
        currency: "Japanese Yen (JPY)",
        visaRequirements:
          "Check visa requirements based on your nationality before traveling.",
      },
      traveler: {
        id: 1,
        title: "Only Me",
        desc: "Traveling solo. Just you.",
        icon: "🚶",
        people: 1,
      },
      startDate: "March 22, 2025",
      endDate: "March 24, 2025",
      totalNoOfDays: 3,
      preferences: [
        "Nature Escapes 🌿",
        "Beach Vacations 🏝️",
        "Relaxing Getaways 🏨",
        "Road Trips 🚗",
        "Backpacking 🎒",
      ],
      budget: {
        id: 2,
        title: "Balanced",
        desc: "Moderate spending for a balanced trip.",
        icon: "💼",
      },
    },
    tripPlan: {},
    accommodationOptions: [
      {
        address: "3-7-1-2 Nishi-Shinjuku, Shinjuku-Ku, Tokyo, Japan, 163-1055",
        description:
          "Iconic luxury hotel with stunning views. Featured in 'Lost in Translation'. Price reflects this level of luxury and the area. Good views, but expensive",
        geoCoordinates: {
          latitude: 35.6886,
          longitude: 139.6917,
        },
        hotelName: "Park Hyatt Tokyo (Lost in Translation)",
        imageUrl: "https://example.com/park_hyatt_tokyo.jpg",
        nearbyPlaces: [
          {
            details:
              "A calming park near the bustling Shinjuku area. Offers a peaceful retreat.",
            geoCoordinates: {
              latitude: 35.6911,
              longitude: 139.6867,
            },
            imageUrl: "https://example.com/shinjuku_central_park.jpg",
            placeName: "Shinjuku Central Park",
            ticketPricing: "Free",
            timeToTravel: "5-minute walk",
          },
        ],
        pricePerNight: 400,
        rating: 4.7,
      },
      {
        address: "1-19-1 Kabukicho, Shinjuku-ku, Tokyo 160-0021, Japan",
        description:
          "Modern hotel with a Godzilla head on its terrace. A fun and quirky experience. Centrally located in Shinjuku.",
        geoCoordinates: {
          latitude: 35.6938,
          longitude: 139.7042,
        },
        hotelName: "Hotel Gracery Shinjuku (Godzilla Head Hotel)",
        imageUrl: "https://example.com/hotel_gracery_shinjuku.jpg",
        nearbyPlaces: [
          {
            details:
              "Shinjuku's entertainment district, known for its nightlife, restaurants, and themed bars.",
            geoCoordinates: {
              latitude: 35.6944,
              longitude: 139.7036,
            },
            imageUrl: "https://example.com/kabukicho.jpg",
            placeName: "Kabukicho",
            ticketPricing: "Free (to walk around)",
            timeToTravel: "1-minute walk",
          },
        ],
        pricePerNight: 150,
        rating: 4.3,
      },
      {
        address: "2-2-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-8330, Japan",
        description:
          "Well-established hotel with multiple restaurants, bars, and stunning city views. Offers a range of amenities and services.",
        geoCoordinates: {
          latitude: 35.6895,
          longitude: 139.6903,
        },
        hotelName: "Keio Plaza Hotel Tokyo",
        imageUrl: "https://example.com/keio_plaza_hotel_tokyo.jpg",
        nearbyPlaces: [
          {
            details:
              "Beautiful garden with diverse landscapes (English, French, Japanese). A peaceful escape from the city.",
            geoCoordinates: {
              latitude: 35.6853,
              longitude: 139.7155,
            },
            imageUrl: "https://example.com/shinjuku_gyoen.jpg",
            placeName: "Shinjuku Gyoen National Garden",
            ticketPricing: 500,
            timeToTravel: "20-minute walk or short taxi ride",
          },
        ],
        pricePerNight: 200,
        rating: 4.4,
      },
    ],
    additionalNotes: {
      backpackingTips:
        "Pack light and comfortable clothing and shoes for walking and hiking. Consider using coin lockers for luggage storage.",
      food: "Explore a variety of restaurants and try different Japanese cuisines. A balanced budget allows for more dining options.",
      internet:
        "Rent a pocket wifi or purchase a local SIM card for convenient internet access.",
      language: "Learning some basic Japanese phrases will be helpful.",
      relaxingGetaways:
        "The onsen experience in Hakone is a great way to relax. Consider booking a hotel with onsen facilities or visiting a public bathhouse.",
      transportation:
        "A Suica or Pasmo card is recommended for easy travel. For day trips, consider purchasing a Hakone Free Pass or Enoshima-Kamakura Free Pass for discounted travel.",
    },
    dailyPlan: {
      day1: {
        theme: "Classic Tokyo Experience",
        places: [
          {
            name: "Shibuya Crossing",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/day1-1-shibuya-crossing.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vZGF5MS0xLXNoaWJ1eWEtY3Jvc3NpbmcuanBlZyIsImlhdCI6MTc0Mzg0ODc3NCwiZXhwIjoxNzc1Mzg0Nzc0fQ.BXVF_paQlDuT1uNJmCBuucTuAUdC9IbJHhoF7rdfMyA",
            rating: 4.7,
            reviews: 38256,
            time: "09:00 - 11:00 AM",
            price: "Free",
            coordinates: {
              latitude: 35.6595,
              longitude: 139.7005,
            },
            transportTimes: {
              car: "15 min",
              bike: "25 min",
              tram: "20 min",
              walk: "40 min",
              train: "10 min",
              plane: "N/A",
            },
            description:
              "The world's busiest pedestrian crossing with iconic neon signs.",
          },
          {
            name: "Meiji Shrine",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/day1-2-meiji-shrine.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vZGF5MS0yLW1laWppLXNocmluZS5qcGVnIiwiaWF0IjoxNzQzODQ4NzkzLCJleHAiOjE3NzUzODQ3OTN9.8abGQ6ZfTchsgdz_ApRONPPr7EhgY41A69TQTqW9mYg",
            rating: 4.6,
            reviews: 28743,
            time: "11:30 AM - 1:30 PM",
            price: "Free",
            coordinates: {
              latitude: 35.6764,
              longitude: 139.6993,
            },
            transportTimes: {
              car: "8 min",
              bike: "15 min",
              tram: "12 min",
              walk: "25 min",
              train: "5 min",
              plane: "N/A",
            },
            description:
              "Tranquil Shinto shrine surrounded by forest in the heart of Tokyo.",
          },
          {
            name: "Tokyo Skytree",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/day1-3-tokyo-skytree.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vZGF5MS0zLXRva3lvLXNreXRyZWUuanBlZyIsImlhdCI6MTc0Mzg0ODgwNCwiZXhwIjoxNzc1Mzg0ODA0fQ.gRGEdgDuAMag1BI5_fi6ODPDw77CR82DrEgd5TOsS6M",
            rating: 4.5,
            reviews: 45218,
            time: "2:00 - 4:00 PM",
            price: "$25",
            coordinates: {
              latitude: 35.7101,
              longitude: 139.8107,
            },
            transportTimes: {
              car: "20 min",
              bike: "35 min",
              tram: "25 min",
              walk: "50 min",
              train: "15 min",
              plane: "N/A",
            },
            description:
              "Tallest structure in Japan with panoramic observation decks.",
          },
        ],
      },
      day2: {
        theme: "Cultural Exploration",
        places: [
          {
            name: "Tsukiji Outer Market",
            type: "eat",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/day2-1-tsukiji-market.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vZGF5Mi0xLXRzdWtpamktbWFya2V0LmpwZWciLCJpYXQiOjE3NDM4NDg4MTYsImV4cCI6MTc3NTM4NDgxNn0.Pv40BF4WyYf1CE_0p1r0kAx-NcRBaG9Oc_GRglG1ykg",
            rating: 4.5,
            reviews: 24153,
            time: "8:00 - 10:00 AM",
            price: "$10-30 for food",
            coordinates: {
              latitude: 35.6654,
              longitude: 139.7696,
            },
            transportTimes: {
              car: "12 min",
              bike: "20 min",
              tram: "15 min",
              walk: "30 min",
              train: "8 min",
              plane: "N/A",
            },
            description:
              "Famous fish market with fresh sushi breakfast options.",
          },
          {
            name: "Imperial Palace East Gardens",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/day2-2-imperial-palace.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vZGF5Mi0yLWltcGVyaWFsLXBhbGFjZS5qcGVnIiwiaWF0IjoxNzQzODQ4ODI2LCJleHAiOjE3NzUzODQ4MjZ9.VIX2P1_8uISlGhITmVivebGoxvVReKdPlS-0i8COIik",
            rating: 4.4,
            reviews: 18764,
            time: "10:30 AM - 12:30 PM",
            price: "Free",
            coordinates: {
              latitude: 35.6852,
              longitude: 139.7528,
            },
            transportTimes: {
              car: "8 min",
              bike: "15 min",
              tram: "10 min",
              walk: "20 min",
              train: "5 min",
              plane: "N/A",
            },
            description: "Beautiful gardens with remnants of Edo Castle.",
          },
          {
            name: "Ginza Shopping District",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/day2-3-ginza.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vZGF5Mi0zLWdpbnphLmpwZWciLCJpYXQiOjE3NDM4NDg4MzQsImV4cCI6MTc3NTM4NDgzNH0.s_gt5494_nIQ8ewqNCof11_tP1gYjAYykukU64CI7AI",
            rating: 4.3,
            reviews: 15632,
            time: "1:00 - 3:00 PM",
            price: "Free (shopping varies)",
            coordinates: {
              latitude: 35.672,
              longitude: 139.7679,
            },
            transportTimes: {
              car: "10 min",
              bike: "18 min",
              tram: "12 min",
              walk: "25 min",
              train: "7 min",
              plane: "N/A",
            },
            description: "Luxury shopping and department stores.",
          },
        ],
      },
      day3: {
        theme: "Day Trip to Hakone",
        places: [
          {
            name: "Hakone Open-Air Museum",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/day3-1-museum.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vZGF5My0xLW11c2V1bS5qcGVnIiwiaWF0IjoxNzQzODQ4ODQyLCJleHAiOjE3NzUzODQ4NDJ9.mNTXce2-7Ry9jkFvJGFZYvxKUYsZnu5rQoKaDPTRRl8",
            rating: 4.6,
            reviews: 18753,
            time: "10:00 AM - 12:00 PM",
            price: "$15",
            coordinates: {
              latitude: 35.2446,
              longitude: 139.056,
            },
            transportTimes: {
              car: "90 min from Tokyo",
              bike: "N/A",
              tram: "110 min",
              walk: "N/A",
              train: "85 min",
              plane: "N/A",
            },
            description:
              "Sculpture park with works by Picasso and other artists.",
          },
          {
            name: "Lake Ashi Cruise",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/day3-2-cruise.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vZGF5My0yLWNydWlzZS5qcGVnIiwiaWF0IjoxNzQzODQ4ODUxLCJleHAiOjE3NzUzODQ4NTF9.5FSCxK2pUmXE3BGahUDGq-9K3e8QsvoK_OgRRi7tHLc",
            rating: 4.5,
            reviews: 15642,
            time: "12:30 - 2:00 PM",
            price: "$12",
            coordinates: {
              latitude: 35.2088,
              longitude: 139.0289,
            },
            transportTimes: {
              car: "15 min",
              bike: "N/A",
              tram: "20 min",
              walk: "N/A",
              train: "15 min",
              plane: "N/A",
            },
            description:
              "Pirate ship cruise with views of Mt. Fuji on clear days.",
          },
          {
            name: "Hakone Ropeway",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/tokyo/day3-3-ropeway.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvdG9reW8vZGF5My0zLXJvcGV3YXkuanBlZyIsImlhdCI6MTc0Mzg0ODg1OSwiZXhwIjoxNzc1Mzg0ODU5fQ.8PA1uwsK4PQNaGv6Hgpytx4B7Ls3Mwgb_LZBhFJR0uU",
            rating: 4.7,
            reviews: 21345,
            time: "2:30 - 4:00 PM",
            price: "$25",
            coordinates: {
              latitude: 35.2333,
              longitude: 139.0217,
            },
            transportTimes: {
              car: "10 min",
              bike: "N/A",
              tram: "12 min",
              walk: "N/A",
              train: "10 min",
              plane: "N/A",
            },
            description: "Cable car with volcanic views and sulfur vents.",
          },
        ],
      },
    },
    flightDetails: {
      airline:
        "Japan Airlines (JAL) or All Nippon Airways (ANA) or Budget carrier",
      bookingUrl: "https://www.example-airline.com",
      destination: "Tokyo (NRT or HND)",
      estimatedPrice: 500,
      notes:
        "A 'balanced' budget allows for slightly more comfortable flight options. Consider JAL or ANA for better service. Prices can fluctuate greatly. Check comparison sites.",
      origin: "Your Departure City",
    },
    tripDetails: {
      budget: "Balanced",
      duration: "3 Days, 2 Nights",
      interests: [
        "Nature Escapes 🌿",
        "Beach Vacations 🏝️",
        "Relaxing Getaways 🏨",
        "Backpacking 🎒",
      ],
      location: "Tokyo, Japan (with surrounding areas for Nature and Beach)",
      travelerType: "Solo",
    },
    userEmail: "abc@gmail.com",
  },
  {
    docId: "1742154803391",
    tripData: {
      city: {
        name: "Paris",
        country: "France",
        coverImage:
          "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/paris-cover.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvcGFyaXMtY292ZXIuanBlZyIsImlhdCI6MTc0Mzg0ODk4NiwiZXhwIjoxNzc1Mzg0OTg2fQ.6yaOsAAjzrzJcT9HgWVG7TUupWD_oR1TbaRYEr1mnak",
        description:
          "Paris, the City of Light, is known for its art, fashion, gastronomy, and culture.",
        gettingThere:
          "Paris is served by Charles de Gaulle Airport (CDG) and Orly Airport (ORY).",
        bestTimeToVisit:
          "The best time to visit Paris is during spring (April to June) or fall (September to November).",
        attractions: [
          "Eiffel Tower",
          "Louvre Museum",
          "Notre-Dame Cathedral",
          "Montmartre and Sacré-Cœur",
        ],
        localCulture:
          "Enjoy French cuisine, visit local markets, and explore the city's rich history.",
        activities: [
          "Take a Seine River cruise",
          "Visit the Palace of Versailles",
          "Explore the Marais district",
        ],
        accommodations:
          "Options range from luxury hotels near the Champs-Élysées to charming boutique hotels in Montmartre.",
        transportation:
          "Paris has an extensive metro system, buses, and trams.",
        safety:
          "Paris is generally safe, but be cautious of pickpockets in tourist areas.",
        language: "French is the official language.",
        currency: "Euro (EUR)",
        visaRequirements:
          "Check visa requirements based on your nationality before traveling.",
      },
      traveler: {
        id: 1,
        title: "Only Me",
        desc: "Traveling solo. Just you.",
        icon: "🚶",
        people: 1,
      },
      startDate: "March 20, 2025",
      endDate: "March 22, 2025",
      totalNoOfDays: 3,
      preferences: [
        "Adventure Travel 🏞️",
        "City Breaks 🌇",
        "Cultural Exploration 🏛️",
        "Glamping ⛺",
        "Beach Vacations 🏝️",
      ],
      budget: {
        id: 1,
        title: "Cheap",
        desc: "Budget-friendly. Economical Travel.",
        icon: "💰",
      },
    },
    tripPlan: {},
    accommodationOptions: [
      {
        address: "5 Rue de Dunkerque, 75010 Paris, France",
        description:
          "Popular hostel near Gare du Nord station. Offers dorms and private rooms, plus a bar and restaurant. Great for meeting other travelers.",
        geoCoordinates: {
          latitude: 48.8788,
          longitude: 2.3544,
        },
        hotelName: "St Christopher's Inn Paris Gare du Nord",
        imageUrl: "https://example.com/st_christophers_gare_du_nord.jpg",
        nearbyPlaces: [
          {
            details:
              "Major train station with connections to many destinations.",
            geoCoordinates: {
              latitude: 48.8792,
              longitude: 2.3547,
            },
            imageUrl: "https://example.com/gare_du_nord.jpg",
            placeName: "Gare du Nord",
            ticketPricing: "N/A (transport hub)",
            timeToTravel: "1-minute walk",
          },
        ],
        pricePerNight: 35,
        rating: 4.2,
      },
      {
        address: "9-11 Place du Colonel Fabien, 75010 Paris, France",
        description:
          "Stylish hostel with rooftop terrace, bar, and cafe. Offers dorms and private rooms. Known for its social atmosphere.",
        geoCoordinates: {
          latitude: 48.8748,
          longitude: 2.3692,
        },
        hotelName: "Generator Paris",
        imageUrl: "https://example.com/generator_paris.jpg",
        nearbyPlaces: [
          {
            details:
              "One of the largest and most original green spaces in Paris. Features waterfalls, temples, and bridges.",
            geoCoordinates: {
              latitude: 48.8781,
              longitude: 2.3764,
            },
            imageUrl: "https://example.com/buttes_chaumont.jpg",
            placeName: "Parc des Buttes-Chaumont",
            ticketPricing: "Free",
            timeToTravel: "15-minute walk",
          },
        ],
        pricePerNight: 40,
        rating: 4.3,
      },
      {
        address: "11 Rue de Belleville, 75010 Paris, France",
        description:
          "Modern hostel in the vibrant Belleville district. Offers dorms, a bar, and a common area. Close to street art and diverse cultural experiences.",
        geoCoordinates: {
          latitude: 48.8715,
          longitude: 2.3688,
        },
        hotelName: "The People Paris Belleville",
        imageUrl: "https://example.com/the_people_belleville.jpg",
        nearbyPlaces: [
          {
            details: "A park offering panoramic views over Paris.",
            geoCoordinates: {
              latitude: 48.8737,
              longitude: 2.3744,
            },
            imageUrl: "https://example.com/belleville_park.jpg",
            placeName: "Belleville Park",
            ticketPricing: "Free",
            timeToTravel: "10-minute walk",
          },
        ],
        pricePerNight: 30,
        rating: 4,
      },
    ],
    additionalNotes: {
      backpackingTips:
        "Pack light and comfortable shoes for walking. Use metro for longer distances. Many attractions offer free entry on first Sundays of the month.",
      food: "Try local bakeries for affordable meals. Street crepes make great cheap lunches.",
      internet:
        "Many cafes offer free wifi. Consider a local SIM card for data.",
      language: "Learn basic French phrases - locals appreciate the effort.",
      transportation:
        "Get a carnet of 10 metro tickets for best value. Walking is often faster in central areas.",
    },
    dailyPlan: {
      day1: {
        theme: "Iconic Paris & Montmartre",
        places: [
          {
            name: "Eiffel Tower",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/day1-1-eiffel-tower.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvZGF5MS0xLWVpZmZlbC10b3dlci5qcGVnIiwiaWF0IjoxNzQzODQ5Njc0LCJleHAiOjE3NzUzODU2NzR9.ha7LWb2dRMj_veCnxl6asqVGqug2j6LMo5bPziKgPts",
            rating: 4.8,
            reviews: 125678,
            time: "09:00 - 11:00 AM",
            price: "€18 (stairs to 2nd floor)",
            coordinates: {
              latitude: 48.8584,
              longitude: 2.2945,
            },
            transportTimes: {
              car: "15 min",
              bike: "20 min",
              tram: "25 min",
              walk: "40 min",
              train: "10 min",
              plane: "N/A",
            },
            description:
              "Paris's most iconic landmark with stunning city views.",
          },
          {
            name: "Seine River Cruise",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/day1-2-cruise.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvZGF5MS0yLWNydWlzZS5qcGVnIiwiaWF0IjoxNzQzODQ5Njg5LCJleHAiOjE3NzUzODU2ODl9.U9ljEpjNdUrONYfgWzO_6nKNh6ujQu8v4Szc4X4XDtQ",
            rating: 4.6,
            reviews: 45678,
            time: "12:00 - 1:30 PM",
            price: "€15",
            coordinates: {
              latitude: 48.8566,
              longitude: 2.3522,
            },
            transportTimes: {
              car: "5 min",
              bike: "10 min",
              tram: "15 min",
              walk: "20 min",
              train: "8 min",
              plane: "N/A",
            },
            description: "See Paris's landmarks from the water.",
          },
          {
            name: "Montmartre & Sacré-Cœur",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/day1-3-montmartre.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvZGF5MS0zLW1vbnRtYXJ0cmUuanBlZyIsImlhdCI6MTc0Mzg0OTY5NiwiZXhwIjoxNzc1Mzg1Njk2fQ.fhznXSU82jZ8ogGv4BPRxShwucu10rl9JwB5qIZ7AC4",
            rating: 4.7,
            reviews: 87654,
            time: "2:30 - 6:00 PM",
            price: "Free (donation suggested)",
            coordinates: {
              latitude: 48.8867,
              longitude: 2.3431,
            },
            transportTimes: {
              car: "20 min",
              bike: "25 min",
              tram: "30 min",
              walk: "45 min",
              train: "15 min",
              plane: "N/A",
            },
            description:
              "Artistic neighborhood with stunning basilica and views.",
          },
        ],
      },
      day2: {
        theme: "Art & History",
        places: [
          {
            name: "Louvre Museum",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/day2-1-museum.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvZGF5Mi0xLW11c2V1bS5qcGciLCJpYXQiOjE3NDM4NDk3MDYsImV4cCI6MTc3NTM4NTcwNn0.Ny_Unwg7WIakhs9SBw1GDKvFvC_8fEN3ZajCA7OtHDA",
            rating: 4.8,
            reviews: 98765,
            time: "09:00 AM - 12:00 PM",
            price: "€17",
            coordinates: {
              latitude: 48.8606,
              longitude: 2.3376,
            },
            transportTimes: {
              car: "10 min",
              bike: "15 min",
              tram: "20 min",
              walk: "25 min",
              train: "8 min",
              plane: "N/A",
            },
            description: "World's largest art museum, home to Mona Lisa.",
          },
          {
            name: "Notre-Dame Cathedral",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/day2-2-cathedral.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvZGF5Mi0yLWNhdGhlZHJhbC5qcGVnIiwiaWF0IjoxNzQzODQ5NzE0LCJleHAiOjE3NzUzODU3MTR9.Iee1pBem9_PG0f_bcfUTUn90BU1-foTEl8DvoACq80g",
            rating: 4.7,
            reviews: 76543,
            time: "1:00 - 2:30 PM",
            price: "Free",
            coordinates: {
              latitude: 48.853,
              longitude: 2.3499,
            },
            transportTimes: {
              car: "8 min",
              bike: "12 min",
              tram: "15 min",
              walk: "20 min",
              train: "5 min",
              plane: "N/A",
            },
            description: "Gothic masterpiece on Île de la Cité.",
          },
          {
            name: "Latin Quarter",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/day2-3-latin-quarter.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvZGF5Mi0zLWxhdGluLXF1YXJ0ZXIuanBlZyIsImlhdCI6MTc0Mzg0OTcyMiwiZXhwIjoxNzc1Mzg1NzIyfQ.9fCF6ozO83U2MwFeHEtoHvBKmWNQEdOHPT6n9GqZAnw",
            rating: 4.5,
            reviews: 34567,
            time: "3:00 - 6:00 PM",
            price: "Free",
            coordinates: {
              latitude: 48.8498,
              longitude: 2.347,
            },
            transportTimes: {
              car: "5 min",
              bike: "8 min",
              tram: "10 min",
              walk: "15 min",
              train: "3 min",
              plane: "N/A",
            },
            description: "Historic student quarter with charming streets.",
          },
        ],
      },
      day3: {
        theme: "Parisian Charm",
        places: [
          {
            name: "Parc des Buttes-Chaumont",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/day3-1-charm.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvZGF5My0xLWNoYXJtLmpwZWciLCJpYXQiOjE3NDM4NDk3MzAsImV4cCI6MTc3NTM4NTczMH0.ziJkP-4fnf8C5PFZlDs6QjTK2N3qCikoiwjBWsDDqN4",
            rating: 4.6,
            reviews: 23456,
            time: "09:00 - 11:00 AM",
            price: "Free",
            coordinates: {
              latitude: 48.8804,
              longitude: 2.3829,
            },
            transportTimes: {
              car: "15 min",
              bike: "20 min",
              tram: "25 min",
              walk: "30 min",
              train: "12 min",
              plane: "N/A",
            },
            description: "Beautiful park with cliffs, bridges and waterfalls.",
          },
          {
            name: "Canal Saint-Martin",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/day3-2-canal.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvZGF5My0yLWNhbmFsLndlYnAiLCJpYXQiOjE3NDM4NDk3NDUsImV4cCI6MTc3NTM4NTc0NX0.XLG0n_yaalWEQhSxsOhocVmh3sbYbA8qfWC8ApEPGYE",
            rating: 4.4,
            reviews: 12345,
            time: "11:30 AM - 1:30 PM",
            price: "Free",
            coordinates: {
              latitude: 48.8688,
              longitude: 2.3686,
            },
            transportTimes: {
              car: "10 min",
              bike: "15 min",
              tram: "18 min",
              walk: "25 min",
              train: "8 min",
              plane: "N/A",
            },
            description: "Trendy area with picturesque canals and cafes.",
          },
          {
            name: "Le Marais",
            type: "explore",
            image:
              "https://qrszukeatofpziaxfmpy.supabase.co/storage/v1/object/sign/images/paris/day3-3-marais.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcGFyaXMvZGF5My0zLW1hcmFpcy5qcGVnIiwiaWF0IjoxNzQzODQ5NzU0LCJleHAiOjE3NzUzODU3NTR9.8ICy08uJ0OhzxrBnF1qkm0cUmDIOrrS7xY9wh1Eccms",
            rating: 4.6,
            reviews: 34567,
            time: "2:00 - 5:00 PM",
            price: "Free",
            coordinates: {
              latitude: 48.8554,
              longitude: 2.3626,
            },
            transportTimes: {
              car: "12 min",
              bike: "18 min",
              tram: "20 min",
              walk: "30 min",
              train: "10 min",
              plane: "N/A",
            },
            description: "Historic district with trendy shops and cafes.",
          },
        ],
      },
    },
    flightDetails: {
      airline: "Air France or budget carriers like EasyJet",
      bookingUrl: "https://www.example-airline.com",
      destination: "Paris (CDG or ORY)",
      estimatedPrice: 300,
      notes:
        "Book in advance for best prices. Consider flying into Orly for cheaper options.",
      origin: "Your Departure City",
    },
    tripDetails: {
      budget: "Cheap",
      duration: "3 Days, 2 Nights",
      interests: ["City Breaks 🌇", "Cultural Exploration 🏛️"],
      location: "Paris, France",
      travelerType: "Solo",
    },
    userEmail: "abc@gmail.com",
  },
];
