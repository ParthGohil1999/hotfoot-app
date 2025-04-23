import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTravelPreferencesStore from './travelPreferencesZustandStore';
import useTripSearchStore from './trpiSearchZustandStore';

interface TripReviewState {
    allSelections: {
        travelPreferences: {
            selectedButtons: string[];
            budgetPreference: string | null;
        };
        tripSearch: {
            fromLocation: { name: string; code: string } | null;
            toLocation: { name: string; code: string } | null;
            dates: {
                startDate: string | null;
                endDate: string | null;
                totalDays: number;
            };
            travelers: { adults: number; children: number; infants: number };
            cabinClass: string;
            tripType: string;
        };
    };

    // Actions
    updateAllSelections: () => Promise<void>;
    clearAllSelections: () => void;
}

const useTripReviewStore = create<TripReviewState>()(
    persist(
        (set, get) => ({
            allSelections: {
                travelPreferences: {
                    selectedButtons: [],
                    budgetPreference: null,
                },
                tripSearch: {
                    fromLocation: null,
                    toLocation: null,
                    dates: { startDate: null, endDate: null, totalDays: 0 },
                    travelers: { adults: 1, children: 0, infants: 0 },
                    cabinClass: 'Economy',
                    tripType: 'Round Trip',
                },
            },

            updateAllSelections: async () => {
                const travelPreferences = useTravelPreferencesStore.getState();
                const tripSearch = useTripSearchStore.getState();

                set({
                    allSelections: {
                        travelPreferences: {
                            selectedButtons: travelPreferences.selectedButtons,
                            budgetPreference: travelPreferences.budgetPreference,
                        },
                        tripSearch: {
                            fromLocation: tripSearch.fromLocation,
                            toLocation: tripSearch.toLocation,
                            dates: tripSearch.dates,
                            travelers: tripSearch.travelers,
                            cabinClass: tripSearch.cabinClass,
                            tripType: tripSearch.tripType,
                        },
                    },
                });
            },

            clearAllSelections: () => set({
                allSelections: {
                    travelPreferences: {
                        selectedButtons: [],
                        budgetPreference: null,
                    },
                    tripSearch: {
                        fromLocation: null,
                        toLocation: null,
                        dates: { startDate: null, endDate: null, totalDays: 0 },
                        travelers: { adults: 1, children: 0, infants: 0 },
                        cabinClass: 'Economy',
                        tripType: 'Round Trip',
                    },
                },
            }),
        }),
        {
            name: 'trip-review-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useTripReviewStore;