import { create } from 'zustand';

const useItineraryStore = create((set) => ({
    // Generated places from Google Places API
    generatedPlaces: [],
    setGeneratedPlaces: (places: any) => set({ generatedPlaces: places }),

    // Generated itinerary from Gemini AI
    generatedItinerary: null,
    setGeneratedItinerary: (itinerary: any) => set({ generatedItinerary: itinerary }),
    updateDailyPlan: (dayKey: any, newPlaces: any) =>
        set((state: any) => {
            if (state.generatedItinerary && state.generatedItinerary.dailyPlan) {
                return {
                    generatedItinerary: {
                        ...state.generatedItinerary,
                        dailyPlan: {
                            ...state.generatedItinerary.dailyPlan,
                            [dayKey]: {
                                ...state.generatedItinerary.dailyPlan[dayKey],
                                places: newPlaces,
                            },
                        },
                    },
                };
            }
            return state;
        }),

    // Trip search parameters
    tripParameters: null,
    setTripParameters: (params: any) => set({ tripParameters: params }),

    // Reset all data
    resetItinerary: () => set({
        generatedPlaces: [],
        generatedItinerary: null,
        tripParameters: null,
    }),
}));

export default useItineraryStore;