const flightDetailsStep1 = [
  {
    search_metadata: {
      id: "67f515901b3d273608c28f7f",
      status: "Success",
      json_endpoint:
        "https://serpapi.com/searches/78e30d21128635e1/67f515901b3d273608c28f7f.json",
      created_at: "2025-04-08 12:24:48 UTC",
      processed_at: "2025-04-08 12:24:48 UTC",
      google_flights_url:
        "https://www.google.com/travel/flights?hl=en&gl=us&curr=USD&tfs=CBwQAhoeEgoyMDI1LTA0LTA4agcIARIDTEhScgcIARIDREVMGh4SCjIwMjUtMDQtMTRqBwgBEgNERUxyBwgBEgNMSFJCAQFIAXABmAEB&tfu=EgIIAQ",
      raw_html_file:
        "https://serpapi.com/searches/78e30d21128635e1/67f515901b3d273608c28f7f.html",
      prettify_html_file:
        "https://serpapi.com/searches/78e30d21128635e1/67f515901b3d273608c28f7f.prettify",
      total_time_taken: 1.26,
    },
    search_parameters: {
      engine: "google_flights",
      hl: "en",
      gl: "us",
      departure_id: "LHR",
      arrival_id: "DEL",
      outbound_date: "2025-04-08",
      return_date: "2025-04-14",
      currency: "USD",
    },
    best_flights: [
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 19:45",
            },
            arrival_airport: {
              name: "Paris Charles de Gaulle Airport",
              id: "CDG",
              time: "2025-04-08 22:00",
            },
            duration: 75,
            airplane: "Airbus A220-300 Passenger",
            airline: "Air France",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
            travel_class: "Economy",
            flight_number: "AF 1181",
            legroom: "30 in",
            extensions: [
              "Average legroom (30 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "Carbon emissions estimate: 56 kg",
            ],
          },
          {
            departure_airport: {
              name: "Paris Charles de Gaulle Airport",
              id: "CDG",
              time: "2025-04-09 10:50",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-09 22:50",
            },
            duration: 510,
            airplane: "Boeing 777",
            airline: "Air France",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
            travel_class: "Economy",
            flight_number: "AF 226",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat power & USB outlets",
              "On-demand video",
              "Carbon emissions estimate: 436 kg",
            ],
          },
        ],
        layovers: [
          {
            duration: 770,
            name: "Paris Charles de Gaulle Airport",
            id: "CDG",
            overnight: true,
          },
        ],
        total_duration: 1355,
        carbon_emissions: {
          this_flight: 494000,
          typical_for_this_route: 476000,
          difference_percent: 4,
        },
        price: 1204,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ3hCUmpFeE9ERjhRVVl5TWpZYUN3anZxd2NRQWhvRFZWTkVPQnh3NzZzSCIsW1siTEhSIiwiMjAyNS0wNC0wOCIsIkNERyIsbnVsbCwiQUYiLCIxMTgxIl0sWyJDREciLCIyMDI1LTA0LTA5IiwiREVMIixudWxsLCJBRiIsIjIyNiJdXV0=",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 19:50",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-09 09:20",
            },
            duration: 540,
            airplane: "Boeing 787",
            airline: "Virgin Atlantic",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/VS.png",
            travel_class: "Premium Economy",
            flight_number: "VS 300",
            extensions: [
              "Extra reclining seat",
              "Wi-Fi for a fee",
              "In-seat power & USB outlets",
              "On-demand video",
              "Carbon emissions estimate: 714 kg",
            ],
            overnight: true,
          },
        ],
        total_duration: 540,
        carbon_emissions: {
          this_flight: 715000,
          typical_for_this_route: 476000,
          difference_percent: 50,
        },
        price: 1576,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/VS.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ1ZXVXpNd01Cb0xDSUhQQ1JBQ0dnTlZVMFE0SEhDQnp3az0iLFtbIkxIUiIsIjIwMjUtMDQtMDgiLCJERUwiLG51bGwsIlZTIiwiMzAwIl1dXQ==",
      },
    ],
    other_flights: [
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 18:10",
            },
            arrival_airport: {
              name: "Helsinki Airport",
              id: "HEL",
              time: "2025-04-08 23:00",
            },
            duration: 170,
            airplane: "Airbus A350",
            airline: "Finnair",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AY.png",
            travel_class: "Economy",
            flight_number: "AY 1338",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "On-demand video",
              "Carbon emissions estimate: 166 kg",
            ],
          },
          {
            departure_airport: {
              name: "Helsinki Airport",
              id: "HEL",
              time: "2025-04-09 18:30",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-10 05:20",
            },
            duration: 500,
            airplane: "Airbus A330",
            airline: "Finnair",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AY.png",
            travel_class: "Economy",
            flight_number: "AY 121",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "On-demand video",
              "Carbon emissions estimate: 412 kg",
            ],
            overnight: true,
          },
        ],
        layovers: [
          {
            duration: 1170,
            name: "Helsinki Airport",
            id: "HEL",
            overnight: true,
          },
        ],
        total_duration: 1840,
        carbon_emissions: {
          this_flight: 579000,
          typical_for_this_route: 476000,
          difference_percent: 22,
        },
        price: 963,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/AY.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ3hCV1RFek16aDhRVmt4TWpFYUN3amY3d1VRQWhvRFZWTkVPQnh3Mys4RiIsW1siTEhSIiwiMjAyNS0wNC0wOCIsIkhFTCIsbnVsbCwiQVkiLCIxMzM4Il0sWyJIRUwiLCIyMDI1LTA0LTA5IiwiREVMIixudWxsLCJBWSIsIjEyMSJdXV0=",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 18:10",
            },
            arrival_airport: {
              name: "Warsaw Frederic Chopin",
              id: "WAW",
              time: "2025-04-08 21:45",
            },
            duration: 155,
            airplane: "Boeing 737MAX 8 Passenger",
            airline: "LOT",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/LO.png",
            travel_class: "Economy",
            flight_number: "LO 280",
            legroom: "30 in",
            extensions: [
              "Average legroom (30 in)",
              "In-seat power & USB outlets",
              "Stream media to your device",
              "Carbon emissions estimate: 114 kg",
            ],
          },
          {
            departure_airport: {
              name: "Warsaw Frederic Chopin",
              id: "WAW",
              time: "2025-04-09 15:50",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-10 02:55",
            },
            duration: 455,
            airplane: "Boeing 787",
            airline: "LOT",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/LO.png",
            travel_class: "Economy",
            flight_number: "LO 71",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "In-seat power & USB outlets",
              "On-demand video",
              "Carbon emissions estimate: 285 kg",
            ],
            overnight: true,
          },
        ],
        layovers: [
          {
            duration: 1085,
            name: "Warsaw Frederic Chopin",
            id: "WAW",
            overnight: true,
          },
        ],
        total_duration: 1695,
        carbon_emissions: {
          this_flight: 400000,
          typical_for_this_route: 476000,
          difference_percent: -16,
        },
        price: 1027,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/LO.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ3BNVHpJNE1IeE1UemN4R2dzSW1hSUdFQUlhQTFWVFJEZ2NjSm1pQmc9PSIsW1siTEhSIiwiMjAyNS0wNC0wOCIsIldBVyIsbnVsbCwiTE8iLCIyODAiXSxbIldBVyIsIjIwMjUtMDQtMDkiLCJERUwiLG51bGwsIkxPIiwiNzEiXV1d",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 20:05",
            },
            arrival_airport: {
              name: "Zurich Airport",
              id: "ZRH",
              time: "2025-04-08 22:45",
            },
            duration: 100,
            airplane: "Airbus A220-300 Passenger",
            airline: "SWISS",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/LX.png",
            travel_class: "Economy",
            flight_number: "LX 339",
            legroom: "30 in",
            extensions: [
              "Average legroom (30 in)",
              "Carbon emissions estimate: 96 kg",
            ],
            plane_and_crew_by: "Air Baltic",
          },
          {
            departure_airport: {
              name: "Zurich Airport",
              id: "ZRH",
              time: "2025-04-09 12:10",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-09 23:35",
            },
            duration: 475,
            airplane: "Airbus A330",
            airline: "SWISS",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/LX.png",
            travel_class: "Economy",
            flight_number: "LX 146",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "On-demand video",
              "Carbon emissions estimate: 383 kg",
            ],
          },
        ],
        layovers: [
          {
            duration: 805,
            name: "Zurich Airport",
            id: "ZRH",
            overnight: true,
          },
        ],
        total_duration: 1380,
        carbon_emissions: {
          this_flight: 479000,
          typical_for_this_route: 476000,
          difference_percent: 1,
        },
        price: 1287,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/LX.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ3RNV0RNek9YeE1XREUwTmhvTENJN3RCeEFDR2dOVlUwUTRISENPN1FjPSIsW1siTEhSIiwiMjAyNS0wNC0wOCIsIlpSSCIsbnVsbCwiTFgiLCIzMzkiXSxbIlpSSCIsIjIwMjUtMDQtMDkiLCJERUwiLG51bGwsIkxYIiwiMTQ2Il1dXQ==",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 20:25",
            },
            arrival_airport: {
              name: "Munich International Airport",
              id: "MUC",
              time: "2025-04-08 23:20",
            },
            duration: 115,
            airplane: "Airbus A320neo",
            airline: "Lufthansa",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/LH.png",
            travel_class: "Economy",
            flight_number: "LH 2481",
            legroom: "29 in",
            extensions: [
              "Below average legroom (29 in)",
              "In-seat USB outlet",
              "Carbon emissions estimate: 85 kg",
            ],
          },
          {
            departure_airport: {
              name: "Munich International Airport",
              id: "MUC",
              time: "2025-04-09 13:00",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-09 23:55",
            },
            duration: 445,
            airplane: "Airbus A380",
            airline: "Lufthansa",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/LH.png",
            travel_class: "Economy",
            flight_number: "LH 762",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "On-demand video",
              "Carbon emissions estimate: 426 kg",
            ],
          },
        ],
        layovers: [
          {
            duration: 820,
            name: "Munich International Airport",
            id: "MUC",
            overnight: true,
          },
        ],
        total_duration: 1380,
        carbon_emissions: {
          this_flight: 512000,
          typical_for_this_route: 476000,
          difference_percent: 8,
        },
        price: 1291,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/LH.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ3hNU0RJME9ERjhURWczTmpJYUN3aUI4QWNRQWhvRFZWTkVPQnh3Z2ZBSCIsW1siTEhSIiwiMjAyNS0wNC0wOCIsIk1VQyIsbnVsbCwiTEgiLCIyNDgxIl0sWyJNVUMiLCIyMDI1LTA0LTA5IiwiREVMIixudWxsLCJMSCIsIjc2MiJdXV0=",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 18:45",
            },
            arrival_airport: {
              name: "Chhatrapati Shivaji Maharaj International Airport Mumbai",
              id: "BOM",
              time: "2025-04-09 08:45",
            },
            duration: 570,
            airplane: "Boeing 787",
            airline: "Virgin Atlantic",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/VS.png",
            travel_class: "Premium Economy",
            flight_number: "VS 354",
            extensions: [
              "Extra reclining seat",
              "Wi-Fi for a fee",
              "In-seat power & USB outlets",
              "On-demand video",
              "Carbon emissions estimate: 712 kg",
            ],
            overnight: true,
          },
          {
            departure_airport: {
              name: "Chhatrapati Shivaji Maharaj International Airport Mumbai",
              id: "BOM",
              time: "2025-04-09 12:30",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-09 14:40",
            },
            duration: 130,
            airplane: "Airbus A321",
            airline: "IndiGo",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
            travel_class: "Economy",
            flight_number: "6E 6028",
            ticket_also_sold_by: ["Virgin Atlantic"],
            legroom: "28 in",
            extensions: [
              "Below average legroom (28 in)",
              "Carbon emissions estimate: 87 kg",
            ],
          },
        ],
        layovers: [
          {
            duration: 225,
            name: "Chhatrapati Shivaji Maharaj International Airport Mumbai",
            id: "BOM",
          },
        ],
        total_duration: 925,
        carbon_emissions: {
          this_flight: 800000,
          typical_for_this_route: 476000,
          difference_percent: 68,
        },
        price: 1342,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/multi.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ3hXVXpNMU5IdzJSVFl3TWpnYUN3aVdtQWdRQWhvRFZWTkVPQnh3bHBnSSIsW1siTEhSIiwiMjAyNS0wNC0wOCIsIkJPTSIsbnVsbCwiVlMiLCIzNTQiXSxbIkJPTSIsIjIwMjUtMDQtMDkiLCJERUwiLG51bGwsIjZFIiwiNjAyOCJdXV0=",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 21:45",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-09 10:55",
            },
            duration: 520,
            airplane: "Boeing 787",
            airline: "Air India",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AI.png",
            travel_class: "Business Class",
            flight_number: "AI 2016",
            extensions: [
              "Lie flat seat",
              "Free Wi-Fi",
              "In-seat power & USB outlets",
              "On-demand video",
              "Carbon emissions estimate: 1595 kg",
            ],
            overnight: true,
          },
        ],
        total_duration: 520,
        carbon_emissions: {
          this_flight: 1595000,
          typical_for_this_route: 476000,
          difference_percent: 235,
        },
        price: 1790,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/AI.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ1pCU1RJd01UWWFDd2lIOWdvUUFob0RWVk5FT0J4d2gvWUsiLFtbIkxIUiIsIjIwMjUtMDQtMDgiLCJERUwiLG51bGwsIkFJIiwiMjAxNiJdXV0=",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 20:35",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-09 09:45",
            },
            duration: 520,
            airplane: "Boeing 787",
            airline: "Air India",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AI.png",
            travel_class: "Business Class",
            flight_number: "AI 2018",
            extensions: [
              "Lie flat seat",
              "Free Wi-Fi",
              "In-seat power & USB outlets",
              "On-demand video",
              "Carbon emissions estimate: 1595 kg",
            ],
            overnight: true,
          },
        ],
        total_duration: 520,
        carbon_emissions: {
          this_flight: 1595000,
          typical_for_this_route: 476000,
          difference_percent: 235,
        },
        price: 1892,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/AI.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ1pCU1RJd01UZ2FDd2oreFFzUUFob0RWVk5FT0J4dy9zVUwiLFtbIkxIUiIsIjIwMjUtMDQtMDgiLCJERUwiLG51bGwsIkFJIiwiMjAxOCJdXV0=",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 18:50",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-09 08:00",
            },
            duration: 520,
            airplane: "Airbus A350",
            airline: "British Airways",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/BA.png",
            travel_class: "Premium Economy",
            flight_number: "BA 257",
            extensions: [
              "Extra reclining seat",
              "Wi-Fi for a fee",
              "In-seat power & USB outlets",
              "On-demand video",
              "Carbon emissions estimate: 604 kg",
            ],
            overnight: true,
          },
        ],
        total_duration: 520,
        carbon_emissions: {
          this_flight: 604000,
          typical_for_this_route: 476000,
          difference_percent: 27,
        },
        price: 3396,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/BA.png",
        departure_token:
          "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ1ZDUVRJMU54b0xDTnZjRkJBQ0dnTlZVMFE0SEhEYjNCUT0iLFtbIkxIUiIsIjIwMjUtMDQtMDgiLCJERUwiLG51bGwsIkJBIiwiMjU3Il1dXQ==",
      },
    ],
    price_insights: {
      lowest_price: 963,
      price_level: "high",
      typical_price_range: [620, 790],
      price_history: [
        [1738886400, 632],
        [1738972800, 631],
        [1739059200, 629],
        [1739145600, 634],
        [1739232000, 632],
        [1739318400, 627],
        [1739404800, 627],
        [1739491200, 631],
        [1739577600, 640],
        [1739664000, 643],
        [1739750400, 624],
        [1739836800, 626],
        [1739923200, 634],
        [1740009600, 643],
        [1740096000, 648],
        [1740182400, 646],
        [1740268800, 646],
        [1740355200, 647],
        [1740441600, 627],
        [1740528000, 648],
        [1740614400, 628],
        [1740700800, 625],
        [1740787200, 622],
        [1740873600, 633],
        [1740960000, 635],
        [1741046400, 637],
        [1741132800, 673],
        [1741219200, 675],
        [1741305600, 687],
        [1741392000, 689],
        [1741478400, 689],
        [1741564800, 683],
        [1741651200, 671],
        [1741737600, 662],
        [1741824000, 692],
        [1741910400, 688],
        [1741996800, 692],
        [1742083200, 733],
        [1742169600, 721],
        [1742256000, 717],
        [1742342400, 709],
        [1742428800, 715],
        [1742515200, 687],
        [1742601600, 730],
        [1742688000, 717],
        [1742774400, 714],
        [1742860800, 758],
        [1742947200, 727],
        [1743033600, 693],
        [1743120000, 775],
        [1743206400, 760],
        [1743292800, 784],
        [1743375600, 796],
        [1743462000, 804],
        [1743548400, 787],
        [1743634800, 804],
        [1743721200, 856],
        [1743807600, 852],
        [1743894000, 854],
        [1743980400, 852],
        [1744066800, 963],
      ],
    },
    airports: [
      {
        departure: [
          {
            airport: {
              id: "LHR",
              name: "Heathrow Airport",
            },
            city: "London",
            country: "United Kingdom",
            country_code: "GB",
            image:
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRpN9RbtOSTDqKIPxWc_D6rdSysaWVh6d-NW7yz7yFXKRwh5RN5BpNIoXEwH1XVcFdLWqn6Sm8_Y_zmeg",
            thumbnail:
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQYH83YXny8hR4M7k5BMFq4vUT6LNtVABQzgs2pg-hcpSZq3oMBOQK3xh591AAJv2Qx4uvFZUGqOVt4kuoCUOklISunmndJleOoSef_7QE",
          },
        ],
        arrival: [
          {
            airport: {
              id: "DEL",
              name: "Indira Gandhi International Airport",
            },
            city: "New Delhi",
            country: "India",
            country_code: "IN",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkRqzwP-0z4pH29-KifVzfrxM5wwXx56g3Hoo_ebldH9Fy8a8EjGqPzd3fZqJSKoE5tSIRC2iGJxgqzQ",
            thumbnail:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY7HqndXM-ihFCu1qUKosYR--X_yXSd-0mkQHeSUaG5rkpq5Y6uxD8CMmYUCdngZE7mV0onuN2zv_aVxGGO8xv4FMcpMlWvbXdvJFcemY",
          },
        ],
      },
      {
        departure: [
          {
            airport: {
              id: "DEL",
              name: "Indira Gandhi International Airport",
            },
            city: "New Delhi",
            country: "India",
            country_code: "IN",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkRqzwP-0z4pH29-KifVzfrxM5wwXx56g3Hoo_ebldH9Fy8a8EjGqPzd3fZqJSKoE5tSIRC2iGJxgqzQ",
            thumbnail:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY7HqndXM-ihFCu1qUKosYR--X_yXSd-0mkQHeSUaG5rkpq5Y6uxD8CMmYUCdngZE7mV0onuN2zv_aVxGGO8xv4FMcpMlWvbXdvJFcemY",
          },
        ],
        arrival: [
          {
            airport: {
              id: "LHR",
              name: "Heathrow Airport",
            },
            city: "London",
            country: "United Kingdom",
            country_code: "GB",
            image:
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRpN9RbtOSTDqKIPxWc_D6rdSysaWVh6d-NW7yz7yFXKRwh5RN5BpNIoXEwH1XVcFdLWqn6Sm8_Y_zmeg",
            thumbnail:
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQYH83YXny8hR4M7k5BMFq4vUT6LNtVABQzgs2pg-hcpSZq3oMBOQK3xh591AAJv2Qx4uvFZUGqOVt4kuoCUOklISunmndJleOoSef_7QE",
          },
        ],
      },
    ],
  },
];

const flightDetailsStep2 = [
  {
    search_metadata: {
      id: "67f5186da9d4b9ae7621128f",
      status: "Success",
      json_endpoint:
        "https://serpapi.com/searches/78e30d21128635e1/67f5186da9d4b9ae7621128f.json",
      created_at: "2025-04-08 12:37:01 UTC",
      processed_at: "2025-04-08 12:37:01 UTC",
      google_flights_url:
        "https://www.google.com/travel/flights?hl=en&gl=us&curr=USD&tfs=CBwQAhphEgoyMDI1LTA0LTA4IiAKA0xIUhIKMjAyNS0wNC0wOBoDQ0RHKgJBRjIEMTE4MSIfCgNDREcSCjIwMjUtMDQtMDkaA0RFTCoCQUYyAzIyNmoHCAESA0xIUnIHCAESA0RFTBoeEgoyMDI1LTA0LTE0agcIARIDREVMcgcIARIDTEhSQgEBSAFwAZgBAQ&tfu=EgIIAQ",
      raw_html_file:
        "https://serpapi.com/searches/78e30d21128635e1/67f5186da9d4b9ae7621128f.html",
      prettify_html_file:
        "https://serpapi.com/searches/78e30d21128635e1/67f5186da9d4b9ae7621128f.prettify",
      total_time_taken: 3.64,
    },
    search_parameters: {
      engine: "google_flights",
      hl: "en",
      gl: "us",
      departure_id: "LHR",
      arrival_id: "DEL",
      outbound_date: "2025-04-08",
      return_date: "2025-04-14",
      departure_token:
        "WyJDalJJYTB3MloyNDBRbWRqVkdkQlFtNHhlbEZDUnkwdExTMHRMUzB0TFhCcWRuWXhNMEZCUVVGQlIyWXhSbHBGUW5wUVNEQkJFZ3hCUmpFeE9ERjhRVVl5TWpZYUN3anZxd2NRQWhvRFZWTkVPQnh3NzZzSCIsW1siTEhSIiwiMjAyNS0wNC0wOCIsIkNERyIsbnVsbCwiQUYiLCIxMTgxIl0sWyJDREciLCIyMDI1LTA0LTA5IiwiREVMIixudWxsLCJBRiIsIjIyNiJdXV0=",
      currency: "USD",
    },
    other_flights: [
      {
        flights: [
          {
            departure_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-14 03:55",
            },
            arrival_airport: {
              name: "Amsterdam Airport Schiphol",
              id: "AMS",
              time: "2025-04-14 09:35",
            },
            duration: 550,
            airplane: "Boeing 787-10",
            airline: "KLM",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/KL.png",
            travel_class: "Economy",
            flight_number: "KL 872",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "On-demand video",
              "Carbon emissions estimate: 327 kg",
            ],
            overnight: true,
          },
          {
            departure_airport: {
              name: "Amsterdam Airport Schiphol",
              id: "AMS",
              time: "2025-04-14 20:35",
            },
            arrival_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-14 20:55",
            },
            duration: 80,
            airplane: "Airbus A321neo",
            airline: "KLM",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/KL.png",
            travel_class: "Economy",
            flight_number: "KL 1017",
            legroom: "29 in",
            extensions: [
              "Below average legroom (29 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "Carbon emissions estimate: 36 kg",
            ],
          },
        ],
        layovers: [
          {
            duration: 660,
            name: "Amsterdam Airport Schiphol",
            id: "AMS",
          },
        ],
        total_duration: 1290,
        carbon_emissions: {
          this_flight: 364000,
          typical_for_this_route: 457000,
          difference_percent: -20,
        },
        price: 1204,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/KL.png",
        booking_token:
          "WyJDalJJT1hsTVQwcFNZbWt6Ym10QlFtNUZOWGRDUnkwdExTMHRMUzB0TFMxMmRITnFNMEZCUVVGQlIyWXhSMGN3U0doQ1EwMUJFZ3hMVERnM01ueExUREV3TVRjYUN3anZxd2NRQWhvRFZWTkVPQnh3NzZzSCIsW1siTEhSIiwiMjAyNS0wNC0wOCIsIkNERyIsbnVsbCwiQUYiLCIxMTgxIl0sWyJDREciLCIyMDI1LTA0LTA5IiwiREVMIixudWxsLCJBRiIsIjIyNiJdXSxbWyJERUwiLCIyMDI1LTA0LTE0IiwiQU1TIixudWxsLCJLTCIsIjg3MiJdLFsiQU1TIiwiMjAyNS0wNC0xNCIsIkxIUiIsbnVsbCwiS0wiLCIxMDE3Il1dXQ==",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-14 00:50",
            },
            arrival_airport: {
              name: "Paris Charles de Gaulle Airport",
              id: "CDG",
              time: "2025-04-14 06:55",
            },
            duration: 575,
            airplane: "Boeing 777",
            airline: "Air France",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
            travel_class: "Economy",
            flight_number: "AF 225",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat power & USB outlets",
              "On-demand video",
              "Carbon emissions estimate: 420 kg",
            ],
            overnight: true,
          },
          {
            departure_airport: {
              name: "Paris Charles de Gaulle Airport",
              id: "CDG",
              time: "2025-04-14 10:00",
            },
            arrival_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-14 10:30",
            },
            duration: 90,
            airplane: "Airbus A220-300 Passenger",
            airline: "Air France",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
            travel_class: "Economy",
            flight_number: "AF 1580",
            legroom: "30 in",
            extensions: [
              "Average legroom (30 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "Carbon emissions estimate: 53 kg",
            ],
          },
        ],
        layovers: [
          {
            duration: 185,
            name: "Paris Charles de Gaulle Airport",
            id: "CDG",
          },
        ],
        total_duration: 850,
        carbon_emissions: {
          this_flight: 474000,
          typical_for_this_route: 457000,
          difference_percent: 4,
        },
        price: 1204,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
        booking_token:
          "WyJDalJJT1hsTVQwcFNZbWt6Ym10QlFtNUZOWGRDUnkwdExTMHRMUzB0TFMxMmRITnFNMEZCUVVGQlIyWXhSMGN3U0doQ1EwMUJFZzVCUmpJeU5YeEJSakUxT0RBak1Sb0xDSWlzQnhBQ0dnTlZVMFE0SEhDSXJBYz0iLFtbIkxIUiIsIjIwMjUtMDQtMDgiLCJDREciLG51bGwsIkFGIiwiMTE4MSJdLFsiQ0RHIiwiMjAyNS0wNC0wOSIsIkRFTCIsbnVsbCwiQUYiLCIyMjYiXV0sW1siREVMIiwiMjAyNS0wNC0xNCIsIkNERyIsbnVsbCwiQUYiLCIyMjUiXSxbIkNERyIsIjIwMjUtMDQtMTQiLCJMSFIiLG51bGwsIkFGIiwiMTU4MCJdXV0=",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-14 03:55",
            },
            arrival_airport: {
              name: "Amsterdam Airport Schiphol",
              id: "AMS",
              time: "2025-04-14 09:35",
            },
            duration: 550,
            airplane: "Boeing 787-10",
            airline: "KLM",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/KL.png",
            travel_class: "Economy",
            flight_number: "KL 872",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "On-demand video",
              "Carbon emissions estimate: 327 kg",
            ],
            overnight: true,
          },
          {
            departure_airport: {
              name: "Amsterdam Airport Schiphol",
              id: "AMS",
              time: "2025-04-14 13:25",
            },
            arrival_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-14 13:50",
            },
            duration: 85,
            airplane: "Embraer 195 E2",
            airline: "KLM",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/KL.png",
            travel_class: "Economy",
            flight_number: "KL 1009",
            legroom: "29 in",
            extensions: [
              "Below average legroom (29 in)",
              "In-seat USB outlet",
              "Carbon emissions estimate: 49 kg",
            ],
            plane_and_crew_by: "KLM Cityhopper",
          },
        ],
        layovers: [
          {
            duration: 230,
            name: "Amsterdam Airport Schiphol",
            id: "AMS",
          },
        ],
        total_duration: 865,
        carbon_emissions: {
          this_flight: 377000,
          typical_for_this_route: 457000,
          difference_percent: -18,
        },
        price: 1489,
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/KL.png",
        booking_token:
          "WyJDalJJT1hsTVQwcFNZbWt6Ym10QlFtNUZOWGRDUnkwdExTMHRMUzB0TFMxMmRITnFNMEZCUVVGQlIyWXhSMGN3U0doQ1EwMUJFZzVMVERnM01ueExUREV3TURrak1Sb0xDTldLQ1JBQ0dnTlZVMFE0SEhEVmlnaz0iLFtbIkxIUiIsIjIwMjUtMDQtMDgiLCJDREciLG51bGwsIkFGIiwiMTE4MSJdLFsiQ0RHIiwiMjAyNS0wNC0wOSIsIkRFTCIsbnVsbCwiQUYiLCIyMjYiXV0sW1siREVMIiwiMjAyNS0wNC0xNCIsIkFNUyIsbnVsbCwiS0wiLCI4NzIiXSxbIkFNUyIsIjIwMjUtMDQtMTQiLCJMSFIiLG51bGwsIktMIiwiMTAwOSJdXV0=",
      },
    ],
    airports: [
      {
        departure: [
          {
            airport: {
              id: "LHR",
              name: "Heathrow Airport",
            },
            city: "London",
            country: "United Kingdom",
            country_code: "GB",
            image:
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRpN9RbtOSTDqKIPxWc_D6rdSysaWVh6d-NW7yz7yFXKRwh5RN5BpNIoXEwH1XVcFdLWqn6Sm8_Y_zmeg",
            thumbnail:
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQYH83YXny8hR4M7k5BMFq4vUT6LNtVABQzgs2pg-hcpSZq3oMBOQK3xh591AAJv2Qx4uvFZUGqOVt4kuoCUOklISunmndJleOoSef_7QE",
          },
        ],
        arrival: [
          {
            airport: {
              id: "DEL",
              name: "Indira Gandhi International Airport",
            },
            city: "New Delhi",
            country: "India",
            country_code: "IN",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkRqzwP-0z4pH29-KifVzfrxM5wwXx56g3Hoo_ebldH9Fy8a8EjGqPzd3fZqJSKoE5tSIRC2iGJxgqzQ",
            thumbnail:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY7HqndXM-ihFCu1qUKosYR--X_yXSd-0mkQHeSUaG5rkpq5Y6uxD8CMmYUCdngZE7mV0onuN2zv_aVxGGO8xv4FMcpMlWvbXdvJFcemY",
          },
        ],
      },
      {
        departure: [
          {
            airport: {
              id: "DEL",
              name: "Indira Gandhi International Airport",
            },
            city: "New Delhi",
            country: "India",
            country_code: "IN",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkRqzwP-0z4pH29-KifVzfrxM5wwXx56g3Hoo_ebldH9Fy8a8EjGqPzd3fZqJSKoE5tSIRC2iGJxgqzQ",
            thumbnail:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY7HqndXM-ihFCu1qUKosYR--X_yXSd-0mkQHeSUaG5rkpq5Y6uxD8CMmYUCdngZE7mV0onuN2zv_aVxGGO8xv4FMcpMlWvbXdvJFcemY",
          },
        ],
        arrival: [
          {
            airport: {
              id: "LHR",
              name: "Heathrow Airport",
            },
            city: "London",
            country: "United Kingdom",
            country_code: "GB",
            image:
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRpN9RbtOSTDqKIPxWc_D6rdSysaWVh6d-NW7yz7yFXKRwh5RN5BpNIoXEwH1XVcFdLWqn6Sm8_Y_zmeg",
            thumbnail:
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQYH83YXny8hR4M7k5BMFq4vUT6LNtVABQzgs2pg-hcpSZq3oMBOQK3xh591AAJv2Qx4uvFZUGqOVt4kuoCUOklISunmndJleOoSef_7QE",
          },
        ],
      },
    ],
  },
];

const flightDetailsStep3 = [
  {
    search_metadata: {
      id: "67f518d3006562d2036d5e98",
      status: "Success",
      json_endpoint:
        "https://serpapi.com/searches/cd78e31e5c8f777e/67f518d3006562d2036d5e98.json",
      created_at: "2025-04-08 12:38:43 UTC",
      processed_at: "2025-04-08 12:38:43 UTC",
      google_flights_url:
        "https://www.google.com/travel/flights?hl=en&gl=us&curr=USD&tfs=CBwQAhphEgoyMDI1LTA0LTA4IiAKA0xIUhIKMjAyNS0wNC0wOBoDQ0RHKgJBRjIEMTE4MSIfCgNDREcSCjIwMjUtMDQtMDkaA0RFTCoCQUYyAzIyNmoHCAESA0xIUnIHCAESA0RFTBphEgoyMDI1LTA0LTE0Ih8KA0RFTBIKMjAyNS0wNC0xNBoDQU1TKgJLTDIDODcyIiAKA0FNUxIKMjAyNS0wNC0xNBoDTEhSKgJLTDIEMTAxN2oHCAESA0RFTHIHCAESA0xIUkIBAUgBcAGYAQE&tfu=EgIIAQ",
      raw_html_file:
        "https://serpapi.com/searches/cd78e31e5c8f777e/67f518d3006562d2036d5e98.html",
      prettify_html_file:
        "https://serpapi.com/searches/cd78e31e5c8f777e/67f518d3006562d2036d5e98.prettify",
      total_time_taken: 9.09,
    },
    search_parameters: {
      engine: "google_flights",
      hl: "en",
      gl: "us",
      departure_id: "LHR",
      arrival_id: "DEL",
      outbound_date: "2025-04-08",
      return_date: "2025-04-14",
      booking_token:
        "WyJDalJJT1hsTVQwcFNZbWt6Ym10QlFtNUZOWGRDUnkwdExTMHRMUzB0TFMxMmRITnFNMEZCUVVGQlIyWXhSMGN3U0doQ1EwMUJFZ3hMVERnM01ueExUREV3TVRjYUN3anZxd2NRQWhvRFZWTkVPQnh3NzZzSCIsW1siTEhSIiwiMjAyNS0wNC0wOCIsIkNERyIsbnVsbCwiQUYiLCIxMTgxIl0sWyJDREciLCIyMDI1LTA0LTA5IiwiREVMIixudWxsLCJBRiIsIjIyNiJdXSxbWyJERUwiLCIyMDI1LTA0LTE0IiwiQU1TIixudWxsLCJLTCIsIjg3MiJdLFsiQU1TIiwiMjAyNS0wNC0xNCIsIkxIUiIsbnVsbCwiS0wiLCIxMDE3Il1dXQ==",
      currency: "USD",
    },
    selected_flights: [
      {
        flights: [
          {
            departure_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-08 19:45",
            },
            arrival_airport: {
              name: "Paris Charles de Gaulle Airport",
              id: "CDG",
              time: "2025-04-08 22:00",
            },
            duration: 75,
            airplane: "Airbus A220-300 Passenger",
            airline: "Air France",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
            travel_class: "Economy",
            flight_number: "AF 1181",
            legroom: "30 in",
            extensions: [
              "Average legroom (30 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "Carbon emissions estimate: 56 kg",
            ],
          },
          {
            departure_airport: {
              name: "Paris Charles de Gaulle Airport",
              id: "CDG",
              time: "2025-04-09 10:50",
            },
            arrival_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-09 22:50",
            },
            duration: 510,
            airplane: "Boeing 777",
            airline: "Air France",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
            travel_class: "Economy",
            flight_number: "AF 226",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat power & USB outlets",
              "On-demand video",
              "Carbon emissions estimate: 436 kg",
            ],
          },
        ],
        layovers: [
          {
            duration: 770,
            name: "Paris Charles de Gaulle Airport",
            id: "CDG",
            overnight: true,
          },
        ],
        total_duration: 1355,
        carbon_emissions: {
          this_flight: 494000,
          typical_for_this_route: 476000,
          difference_percent: 4,
        },
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
      },
      {
        flights: [
          {
            departure_airport: {
              name: "Indira Gandhi International Airport",
              id: "DEL",
              time: "2025-04-14 03:55",
            },
            arrival_airport: {
              name: "Amsterdam Airport Schiphol",
              id: "AMS",
              time: "2025-04-14 09:35",
            },
            duration: 550,
            airplane: "Boeing 787-10",
            airline: "KLM",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/KL.png",
            travel_class: "Economy",
            flight_number: "KL 872",
            legroom: "31 in",
            extensions: [
              "Average legroom (31 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "On-demand video",
              "Carbon emissions estimate: 327 kg",
            ],
            overnight: true,
          },
          {
            departure_airport: {
              name: "Amsterdam Airport Schiphol",
              id: "AMS",
              time: "2025-04-14 20:35",
            },
            arrival_airport: {
              name: "Heathrow Airport",
              id: "LHR",
              time: "2025-04-14 20:55",
            },
            duration: 80,
            airplane: "Airbus A321neo",
            airline: "KLM",
            airline_logo:
              "https://www.gstatic.com/flights/airline_logos/70px/KL.png",
            travel_class: "Economy",
            flight_number: "KL 1017",
            legroom: "29 in",
            extensions: [
              "Below average legroom (29 in)",
              "Wi-Fi for a fee",
              "In-seat USB outlet",
              "Carbon emissions estimate: 36 kg",
            ],
          },
        ],
        layovers: [
          {
            duration: 660,
            name: "Amsterdam Airport Schiphol",
            id: "AMS",
          },
        ],
        total_duration: 1290,
        carbon_emissions: {
          this_flight: 364000,
          typical_for_this_route: 457000,
          difference_percent: -20,
        },
        type: "Round trip",
        airline_logo:
          "https://www.gstatic.com/flights/airline_logos/70px/KL.png",
      },
    ],
    baggage_prices: {
      together: ["1 free carry-on"],
    },
    booking_options: [
      {
        together: {
          book_with: "Air France",
          airline_logos: [
            "https://www.gstatic.com/flights/airline_logos/70px/AF.png",
          ],
          marketed_as: ["AF 1181", "AF 226", "KL 872", "KL 1017"],
          price: 1200,
          local_prices: [
            {
              currency: "GBP",
              price: 941,
            },
          ],
          baggage_prices: ["1 free carry-on"],
          booking_request: {
            url: "https://www.google.com/travel/clk/f",
            post_data:
              "u=EtkgCgJBSRoECAMQAULqBQoCVVMSAmVuGhQtNzkxOTgxNTkzMDU5ODMzMDEzNiIDVVNEKAA6BQjs38YiOgUI_6jaLjoFCMLL4S46BQjMsuIiQKMBQN8BQB1AHkCMAkDRAkC-AkDgAkDYAkDhAkD7AkDtAkCEA0DsAkCUA0DvAkCNA0CYA0CbA0CpA0CaA0CvA0CrA0C1A0DDA0DEA0CuA0CwA0CTA0DCA0CsA0C8A0DKA0DLA0DMA0C2A0DHA0DPA0DNA0DUA0DAA0DVA0DZA0gAUAFYAGJ9TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwNC4wLjUxMTIuMzQgU2FmYXJpLzUzNy4zNixnemlwKGdmZSmIAQCiARhNSVNTSU5HX0VYRUNVVElPTl9SRVNVTFSiAQ1iMzgzMDkxMTc0X3YywgFwQ2pSSWExcDNUM2MzWWpVek5rMUJRalJKWjBGQ1J5MHRMUzB0TFMwdGIydGlaM0V4TlVGQlFVRkJSMll5YVdoRlEzQk5URFpCRWdoQlNUSXdNVGNqTVJvTENLV2tDQkFDR2dOVlUwUTRISENscEFnPdIBgAJodHRwczovL3d3dy5nb29nbGUuY29tL3RyYXZlbC9mbGlnaHRzP3Rmcz1DQjhRQWhvX0Vnb3lNREkxTFRBMExURXlJaDhLQTB4SVVoSUtNakF5TlMwd05DMHhNaG9EUkVWTUtnSkJTVElETVRZeWFnY0lBUklEVEVoU2NnY0lBUklEUkVWTUdrQVNDakl3TWpVdE1EUXRNaklpSUFvRFJFVk1FZ295TURJMUxUQTBMVEl5R2dOTVNGSXFBa0ZKTWdReU1ERTNhZ2NJQVJJRFJFVk1jZ2NJQVJJRFRFaFNRQUZJQVhBQmdnRU5DUF9fX19fX19fX19fd0VRQUpnQkFRWHBgA3KJEAoeChwKCENIRUFQRVNUGQBRPTMzRZVAIgdFQ09OT01ZKg4KBzEwNjMuMTISA0dCUDoOCgcxMDYzLjEyEgNHQlBSDQoGNzQ5LjAwEgNHQlBiDQoGMzE0LjEyEgNHQlCiAQsKBDAuMDASA0dCUOoBhwUKuwIK7gEKmgEKBwoCQUkQogESA0xIUhoDREVMMhYyMDI1LTA0LTEyVDA5OjQ1KzAxOjAwOhYyMDI1LTA0LTEyVDIyOjU1KzA1OjMwQgUSAzM1OYIBATKKAQEzkAGIBJoBBQgBENUgqAEAugEPCAEaC05vbi1zbW9raW5nugEPCAIaC05vbi1zbW9raW5nugEPCAMaC05vbi1zbW9raW5noAIAgAEAkgECQUmYAaIBogEDTEhSqgEDREVMsgEWMjAyNS0wNC0xMlQwOTo0NSswMTowMLoBFjIwMjUtMDQtMTJUMjI6NTUrMDU6MzDAAQDIAYgEWAByAkFJegNMSFKCAQNERUyKARYyMDI1LTA0LTEyVDA5OjQ1KzAxOjAwkgEWMjAyNS0wNC0xMlQyMjo1NSswNTozMJgBAKABiAQKuwIK7gEKmgEKBwoCQUkQ4Q8SA0RFTBoDTEhSMhYyMDI1LTA0LTIyVDE0OjEwKzA1OjMwOhYyMDI1LTA0LTIyVDE5OjAwKzAxOjAwQgUSAzc4OYIBATOKAQEykAGwBJoBBQgBENUgqAEAugEPCAEaC05vbi1zbW9raW5nugEPCAIaC05vbi1zbW9raW5nugEPCAMaC05vbi1zbW9raW5noAIAgAEAkgECQUmYAeEPogEDREVMqgEDTEhSsgEWMjAyNS0wNC0yMlQxNDoxMCswNTozMLoBFjIwMjUtMDQtMjJUMTk6MDArMDE6MDDAAQDIAbAEWAFyAkFJegNERUyCAQNMSFKKARYyMDI1LTA0LTIyVDE0OjEwKzA1OjMwkgEWMjAyNS0wNC0yMlQxOTowMCswMTowMJgBAKABsAQqAwoBMFAAgAHrdIIC-AkaDgoHMTA2My4xMhIDR0JQIg4KBzEwNjMuMTISA0dCUMIBDQoGNzQ5LjAwEgNHQlDSAQ0KBjMxNC4xMhIDR0JQsgILCgQwLjAwEgNHQlDKAqIBEghVSzJZWFNMSNICiwFCiAEgACoeCgwKBTk0LjAwEgNHQlASDAoFOTQuMDASA0dCUBgAKh4KDAoFOTQuMDASA0dCUBIMCgU5NC4wMBIDR0JQGAEyIAoNCgYxNzAuMDASA0dCUBINCgYxNzAuMDASA0dCUBgAMiAKDQoGMTcwLjAwEgNHQlASDQoGMTcwLjAwEgNHQlAYATgA8AIAuAMC6AMAygKmARIIWlUyQ1dGTEjSAo8BQowBIAAqIAoNCgYxNDEuMDASA0dCUBINCgYxNDEuMDASA0dCUBgAKiAKDQoGMTQxLjAwEgNHQlASDQoGMTQxLjAwEgNHQlAYATIgCg0KBjIwNy4wMBIDR0JQEg0KBjIwNy4wMBIDR0JQGAAyIAoNCgYyMDcuMDASA0dCUBINCgYyMDcuMDASA0dCUBgBOADwAgG4AwLoAwDiAnoKAVUSATIYAyIECAAQACoGCAAQABgAOkoQABgAIgEwKkFDNHxENHxKNHxaM3xSNXxBNXxOM3xZOXxCOXxNOXxIOXxLOXxROXxWOXxXOXxHM3xMMnxVMnxUMHxTMHxFMHxQMFIIVUsyWVhTTEiRAQAAAAAAAPA_qAGABOICegoBWhIBNhgBIgQIABABKgYIABABGAA6ShAAGAAiATAqQUM5fEQ5fEo4fFo2fFI5fEE5fE4wfFk5fEI5fE05fEgwfEswfFEwfFYwfFcwfEcwfEwwfFUwfFQwfFMwfEUwfFAwUghaVTJDV0ZMSJEBAAAAAAAA8D-oAYAEqgMzSgJHQlIDMDAxWgJHQnIMCgU5MC4wMBIDR0JQegwKBTkwLjAwEgNHQlDaAQdBUFBMSUVEqgMzSgJVQlIDMDAxWgJHQnIMCgU1MS43MhIDR0JQegwKBTUxLjcyEgNHQlDaAQdBUFBMSUVEqgM0SgJZUVIBRnINCgYyMDAuMDASA1VTRHoNCgYxNTYuMDASA0dCUNoBB0FQUExJRUTiAQJBSaoDL0oCWVJSAUZyCgoDMzIwEgNJTlJ6CwoEMy4wMBIDR0JQ2gEHQVBQTElFROIBAkFJqgMvSgJJTlIDMDAxWgJJTnIJCgI2MhIDSU5SegsKBDAuNjASA0dCUNoBB0FQUExJRUSqAzNKAlAyUgMwMDFaAklOcgwKBTE0LjE2EgNVU0R6DAoFMTEuMDASA0dCUNoBB0FQUExJRUSqAzFKAldPUgMwMDFaAklOcgsKBDIuMjgSA1VTRHoLCgQxLjgwEgNHQlDaAQdBUFBMSUVEggQDCgEwigQ5EAIgDCicATIwQ2hhbmdlcyB0byB0aGlzIHRpY2tldCB3aWxsIGluY3VyIGEgcGVuYWx0eSBmZWUuigQ9EAIgNSgXMjVDYW5jZWxsYXRpb24gb2YgdGhpcyB0aWNrZXQgd2lsbCBpbmN1ciBhIHBlbmFsdHkgZmVlLooEMhAAIAAoLjIqTm90IGluIGN1c3RvbS1mYXJlLWNsYXNzIE5PTi1CQVNJQy1FQ09OT01Z2AQAmgUMCgYIABABGAASAhACmgUMCgYIABAAGAASAhABogUUCgYIABAAGAAKBggAEAEYABICEAGKAgQKAkFJwAIA8gIBMPICATHyAgEyegsKBElUQUEQHjoBMIIBCwjApggQAhoDVVNEkgEEEAEoCpgBMqIBNEhaa3BTejVRdWdub0FBOThfUUJELS0tLS0tLS0tdnRiZ2c5QUFBQUFHZjJpdHNOMHBNQUG6AQQIAhABwAF_wAGWAsABlQLAAaMBwAGRAsABcMAB9QHAAYsBwAG2AcABnALAAZMCwAHZAcAB_gHAAZQBwAGgAsAB4wHAAeIBwAGDAsABhQHAAfMBwAHcAcAB7QHAAbQBwAGaAcAB4QHAAasBwAGdAsABmwLAAUnAAXbAAawBwAG3AcABgQLAAesBwAHwAcAB-AHAAfcBwAGEAsAB9gHAAd0BwAGnAcABkALAAfoBwAGxAcABbMAB0gHAAekBwAHvAcABhQLKAQsIyL4GEAIaA0dCUNoBAPABAYgCAZoCQAoCMUEKAjFVGgNMT04iAkdCKgNMT04yAkdCQABSBEY3WkhyBUVYQktLcgQxMjAw0gECQUmKAglMT05BSTA4TUGiAgCqAk4KCwjjpQgQAhoDVVNEGgsIwKYIEAIaA1VTRCoLCMi-BhACGgNHQlAyCwigvwYQAhoDR0JQQgsI46UIEAIaA1VTREoLCMi-BhACGgNHQlDgAgDoAgH4AgGSA7QGCq4DCtQBCo8BCkoIABoDMzU5IgNMSFIqA0RFTDIHCgJBSRCiAUIWMjAyNS0wNC0xMlQwOTo0NSswMTowMEoWMjAyNS0wNC0xMlQyMjo1NSswNTozMBAAGgJBSSCiASoDTEhSMgNERUw6FjIwMjUtMDQtMTJUMDk6NDUrMDE6MDBCFjIwMjUtMDQtMTJUMjI6NTUrMDU6MzASA0xIUhoDREVMIhYyMDI1LTA0LTEyVDA5OjQ1KzAxOjAwKhYyMDI1LTA0LTEyVDIyOjU1KzA1OjMwMgJBSTgAQAAK1AEKjwEKSggAGgM3ODkiA0RFTCoDTEhSMgcKAkFJEOEPQhYyMDI1LTA0LTIyVDE0OjEwKzA1OjMwShYyMDI1LTA0LTIyVDE5OjAwKzAxOjAwEAAaAkFJIOEPKgNERUwyA0xIUjoWMjAyNS0wNC0yMlQxNDoxMCswNTozMEIWMjAyNS0wNC0yMlQxOTowMCswMTowMBIDREVMGgNMSFIiFjIwMjUtMDQtMjJUMTQ6MTArMDU6MzAqFjIwMjUtMDQtMjJUMTk6MDArMDE6MDAyAkFJOAFAABILCJTJBBACGgNHQlAaCwjIvgYQAhoDR0JQIgkIABACGgNHQlAqCwi09QEQAhoDR0JQMgQKAkFJOsgCCgsIyL4GEAIaA0dCUBILCJTJBBACGgNHQlAaCwi09QEQAhoDR0JQIiAKAVUSCFVLMllYU0xIGAEiBAgAEAAqBggAEAAYADIBMiIgCgFaEghaVTJDV0ZMSBgDIgQIABABKgYIABABGAAyATYyDBIIVUsyWVhTTEg4ADIMEghaVTJDV0ZMSDgAOhkKCgioRhACGgNHQlAaAkdCKgdBUFBMSUVEOhkKCgi0KBACGgNHQlAaAlVCKgdBUFBMSUVEOhkKCgjweRACGgNHQlAaAllRKgdBUFBMSUVEOhkKCgisAhACGgNHQlAaAllSKgdBUFBMSUVEOhgKCQg8EAIaA0dCUBoCSU4qB0FQUExJRUQ6GQoKCMwIEAIaA0dCUBoCUDIqB0FQUExJRUQ6GQoKCLQBEAIaA0dCUBoCV08qB0FQUExJRURCAwoBMJoDCQoESVRBQRIBMKoDBBgBKAG6AysKJxgBKgIIASoCCAMyDAoCCAMSAggBGgIIA0INGAEoATAAygEECAEQARAA",
          },
        },
      },
    ],
    price_insights: {
      lowest_price: 1200,
      price_level: "typical",
      typical_price_range: [950, 1550],
    },
  },
];

export { flightDetailsStep1, flightDetailsStep2, flightDetailsStep3 };

/* 
Step-1:
When first searching the flights with to and from location with all the filters applied. When we hit the search button, we get all the flights from the "from" location to the "to" location":
For ex: LHR -> DEL flights
https://serpapi.com/search.json?engine=google_flights&departure_id=LHR&arrival_id=DEL&gl=us&hl=en&currency=USD&outbound_date=2025-04-12&return_date=2025-04-22&gRecaptchaResponse=03AFcWeA4H8yQQEffH-KwB6LVbfp0qsptPy0lytJx26kBZK9Agqyz-rMb_D7ew8_RHhxiPonTtaWiFdv2UBNs9o1wm0ACg2In1wvfrCsnQ9t0NJokxfmovyA-tliv1PqO7iQ_6_M9sCBvxTCZr4hPFJf3LnaGcbfbhrLms8aLfixkvKy4wE-raIpQ6CNgSX-SeQPA2PWtndlxAJfN_RS1EmbUx18Sr4HIM4MhmD5gGY71x2BpgvjIRs2IyZivjJ3FC3ZXBjYXYuevrgySBHI492PStnU1Cv4BWvKaf22AyiWwZimHAzMUx2fxymhVcMSoVjb4Y6xW2vDBKXfUnZ82xCJzW7ISLdm91UVqxTZxSNa8IwOObv2nbEOMOABLHxXNU73pzJ5MVROo7E30dxd7-SwyiqiE7_NfGDN_pQcRQv1CdEHVhtyKoePo1697GHIDhQ_Ikms9G2kGjOGHDPs7yo5Dqf06zRjcZAT2N4MQMh2VKzfrmOE1TBJXiZ3fupsZ5sv6MGBnYuvC-5AXK0PG4K6nrTEaq6sFsq1J96wIvhGr_Cgnq4Y_zeICzjVsPjbUrwyBhEULSVqE2VU0KPpjYOnqKnqKG5Q8e72E37QfWD2wZoTcDoizFXI6fkl__sfkiRyz30xSd2pxIYNYf1VYHaumedJkyN8-AjSd2DIbOtUULfE57hZ5c8CsmZdha9sQuUrI-HhV3D4ttfYohNQhkpGIzhmb4_rdrsO91T_rJFqhMy7ws4T_ubVTrHbNH8FJI7SVaFo9jmY1-MgRnk0Z73Jwez33XUOb0swT9cZ7PWLdmSczj1l0lRyCZYEBH-cJ61MIF4WZNgJDP6cmX7-Ru8RczkbjRWhH9cPuvn4ikghGC6BIJRxdHRTLPq9lc-crV80x0NT9rIB6z1LvOmRO3fN4v-VTkAIpGChkb6Mvlw8ShbTACFl4OTUEiyGoKk1JKAthOhLq22cKqsPMyn_HeQEMZ7X7AIDyh9qbZwt-s_AuN5WxXA9p7S7kN1TZg62t9Q2qPxFqAirK6

We get flightDetailsStep1 data in json format.

Step-2:
From the first data that we get, each flight has a departure token and in exchange for a departure token, we get the returning flights. 
For ex: DEL -> LHR flights now
https://serpapi.com/search.json?engine=google_flights&departure_id=LHR&arrival_id=DEL&gl=us&hl=en&currency=USD&outbound_date=2025-04-12&return_date=2025-04-22&departure_token=WyJDalJJZEhaYVZ5MVRTMFpUYjNkQlFsa3dTWGRDUnkwdExTMHRMUzB0YjJ0aVluQXlOVUZCUVVGQlIyWXlhVWxSUVZCdWIydEJFZ1ZCU1RFMk1ob0xDTm1wQlJBQ0dnTlZVMFE0SEhEWnFRVT0iLFtbIkxIUiIsIjIwMjUtMDQtMTIiLCJERUwiLG51bGwsIkFJIiwiMTYyIl1dXQ%3D%3D&gRecaptchaResponse=03AFcWeA5JEBNA4zXKEcw_tusSFs-9n5r4LNoag1vhbqTgv1oESo8AEpidHJHymCnNzXgYoI1rgMlmdSCwchLlg6T8O6k7mKBM9mTWSKtQrdKNqpgsupT0RdtAD8JNfQ53CJngoaJABhscML9bpU5cui85oCh1Oi3bRG8D500nCpKMW1hMJL3PJfdj2KTDUaCrSWk0jNml9nIIo672uYJ32wPwbYNC90cWIkYgw_GYiz9t0E9ABbBiwuLlp7Qr2F6otLbgHjcVYboOT4dAevDhTQ2RrU2fPH32ft47QpyQEVq_al498rZzRyFovUlAy0Xlias7AAbdJQ2aD3rkz-QMPfNJYpf6g5g05597byGnaZWNYd60F_sz3u5DCjS2TsP8x9ukf6ANIOhMfHVzsDne2OCrcNoP5ZFmlcAWfeNgmc4ZEhg2iH6ClMZz9kThxI40r7ooCEKWVn1Zv_pJOFbVlA4uKFSl7b_nd2iWWpmOD3XgpccrcVCwKzrjfxecOm5_hHiBRPKDVBulUgJXx4x0RZvgoH6rMrLUXQqy_ntZraFm8V9p6qW3Yse4gxHSBuzUn0Xszkg2Crkm5iA4Tx8SQIb2ev3CkPO6Rz_neExaihPUgYtyXs0moA3al8icfYYzEVmVkACLsw2vDZqFM4YTzYxlzV8-AtCSLvmpSXodJJB9kUoqzaIa-4daeIAFKV9WxKKnj9Kt4Mgzp8o69O_S4HjI4v9rwsH1tsGpkdBlHBZUxZkA8wO6mpGQ2EqJ2TNVJ6RHdF0WEDmc3yk7m52mXYEpUoGwktMBjXuTLxSmtI3uco55MrSx7jejo6sXr4i5dX8mGrIO4ru632fB0xYE29EKn4WClJOgINHcAMNItBNIbUXjp8du4xj_GKwZZYlX4Q5-FlTOOsdOTLwIgVuRis0zqGEPYmtWPF4XHhaLCIoVSpCNHoGGaTkG78ILUf8DwzbACH54m5hyIFvETmj_B436Jspo2v6iel2JK6M_Wc7--llEZPPxRcef44REb1BpAk_l_qxGqahk

Step-3:
From the second data that we get, each flight has a booking token and in exchange for a booking token, we get the journey details that we have selected. 
For ex: LHR -> DEL -> LHR flights now
https://serpapi.com/search.json?engine=google_flights&departure_id=LHR&arrival_id=DEL&gl=us&hl=en&currency=USD&outbound_date=2025-04-12&return_date=2025-04-22&departure_token=WyJDalJJZEhaYVZ5MVRTMFpUYjNkQlFsa3dTWGRDUnkwdExTMHRMUzB0YjJ0aVluQXlOVUZCUVVGQlIyWXlhVWxSUVZCdWIydEJFZ1ZCU1RFMk1ob0xDTm1wQlJBQ0dnTlZVMFE0SEhEWnFRVT0iLFtbIkxIUiIsIjIwMjUtMDQtMTIiLCJERUwiLG51bGwsIkFJIiwiMTYyIl1dXQ%3D%3D&gRecaptchaResponse=03AFcWeA5JEBNA4zXKEcw_tusSFs-9n5r4LNoag1vhbqTgv1oESo8AEpidHJHymCnNzXgYoI1rgMlmdSCwchLlg6T8O6k7mKBM9mTWSKtQrdKNqpgsupT0RdtAD8JNfQ53CJngoaJABhscML9bpU5cui85oCh1Oi3bRG8D500nCpKMW1hMJL3PJfdj2KTDUaCrSWk0jNml9nIIo672uYJ32wPwbYNC90cWIkYgw_GYiz9t0E9ABbBiwuLlp7Qr2F6otLbgHjcVYboOT4dAevDhTQ2RrU2fPH32ft47QpyQEVq_al498rZzRyFovUlAy0Xlias7AAbdJQ2aD3rkz-QMPfNJYpf6g5g05597byGnaZWNYd60F_sz3u5DCjS2TsP8x9ukf6ANIOhMfHVzsDne2OCrcNoP5ZFmlcAWfeNgmc4ZEhg2iH6ClMZz9kThxI40r7ooCEKWVn1Zv_pJOFbVlA4uKFSl7b_nd2iWWpmOD3XgpccrcVCwKzrjfxecOm5_hHiBRPKDVBulUgJXx4x0RZvgoH6rMrLUXQqy_ntZraFm8V9p6qW3Yse4gxHSBuzUn0Xszkg2Crkm5iA4Tx8SQIb2ev3CkPO6Rz_neExaihPUgYtyXs0moA3al8icfYYzEVmVkACLsw2vDZqFM4YTzYxlzV8-AtCSLvmpSXodJJB9kUoqzaIa-4daeIAFKV9WxKKnj9Kt4Mgzp8o69O_S4HjI4v9rwsH1tsGpkdBlHBZUxZkA8wO6mpGQ2EqJ2TNVJ6RHdF0WEDmc3yk7m52mXYEpUoGwktMBjXuTLxSmtI3uco55MrSx7jejo6sXr4i5dX8mGrIO4ru632fB0xYE29EKn4WClJOgINHcAMNItBNIbUXjp8du4xj_GKwZZYlX4Q5-FlTOOsdOTLwIgVuRis0zqGEPYmtWPF4XHhaLCIoVSpCNHoGGaTkG78ILUf8DwzbACH54m5hyIFvETmj_B436Jspo2v6iel2JK6M_Wc7--llEZPPxRcef44REb1BpAk_l_qxGqahk

Step-4:
From the third data that we get, we have our flight details and the booking options that are available.
After passing the booking token, inside the json response, we have the booking options available with url and post data. Using `${url}?${post_data}` we can book the flightby going on their page.
*/