import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

// Define the types for the store
interface TripSearchState {
  fromLocation: { name: string; code: string } | null;
  toLocation: { name: string; code: string } | null;
  dates: {
    startDate: string | null;
    endDate: string | null;
    totalDays: number
  };
  travelers: { adults: number; children: number; infants: number };
  cabinClass: string;
  tripType: string;

  // Actions
  setFromLocationToStore: (location: { name: string; code: string } | null) => void;
  setToLocationToStore: (location: { name: string; code: string } | null) => void;
  setDatesToStore: (dates: { startDate: string | null; endDate: string | null }) => void;
  setTravelersToStore: (travelers: { adults: number; children: number; infants: number }) => void;
  setCabinClassToStore: (cabinClass: string) => void;
  setTripTypeToStore: (tripType: string) => void;

  // Utility methods
  getTotalTravelers: () => number;
  calculateTotalDays: (startDate: string | null, endDate: string | null) => number;
  resetSearch: () => void;
}

const useTripSearchStore = create<TripSearchState>()(
  persist(
    (set, get) => ({
      fromLocation: null,
      toLocation: null,
      dates: { startDate: null, endDate: null, totalDays: 0 },
      travelers: { adults: 1, children: 0, infants: 0 },
      cabinClass: 'Economy',
      tripType: 'Round Trip',

      setFromLocationToStore: (location) => set({ fromLocation: location }),
      setToLocationToStore: (location) => set({ toLocation: location }),

      calculateTotalDays: (startDate, endDate) => {
        // console.log('Calculating total days with:', { startDate, endDate });
        if (!startDate) return 0;

        const start = moment(startDate, ['MMM DD, YYYY', 'YYYY-MM-DD'], true);
        const end = endDate ? moment(endDate, ['MMM DD, YYYY', 'YYYY-MM-DD'], true) : null;
        // console.log('Parsed dates:', { start, end });

        if (!start.isValid() || (endDate && !end?.isValid())) {
          console.error('Invalid date format:', { startDate, endDate });
          return 0;
        }

        if (!end) return 1; // One-way trip

        const diffDays = end.diff(start, 'days') + 1; // include both start and end dates
        console.log('Total days:', diffDays);

        return diffDays;

      },

      setDatesToStore: (dates) => set((state) => {
        // If switching to One Way, clear end date
        const updatedDates = state.tripType === 'One Way'
          ? { ...dates, endDate: null }
          : dates;

        // Calculate total days
        const totalDays = get().calculateTotalDays(updatedDates.startDate, updatedDates.endDate);
        console.log('Total days after update:', totalDays);


        return {
          dates: {
            ...updatedDates,
            totalDays
          }
        };
      }),

      setTravelersToStore: (travelers) => set({ travelers }),

      setCabinClassToStore: (cabinClass) => set({ cabinClass }),

      setTripTypeToStore: (tripType) => set((state) => {
        // Reset end date when switching to one-way trip
        if (tripType === 'One Way') {
          const updatedDates = {
            ...state.dates,
            endDate: null,
            totalDays: state.dates.startDate ? 1 : 0
          };

          return {
            tripType,
            dates: updatedDates
          };
        }
        return { tripType };
      }),

      getTotalTravelers: () => {
        const { adults, children, infants } = get().travelers;
        return adults + children + infants;
      },

      resetSearch: () => set({
        fromLocation: null,
        toLocation: null,
        dates: { startDate: null, endDate: null, totalDays: 0 },
        travelers: { adults: 1, children: 0, infants: 0 },
        cabinClass: 'Economy',
        tripType: 'Round Trip'
      })
    }),
    {
      name: 'trip-search-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        fromLocation: state.fromLocation,
        toLocation: state.toLocation,
        dates: state.dates,
        travelers: state.travelers,
        cabinClass: state.cabinClass,
        tripType: state.tripType
      })
    }
  )
);

export default useTripSearchStore;