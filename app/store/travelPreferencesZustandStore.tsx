import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the types for the store
interface TravelPreferencesState {
  selectedButtons: string[];
  
  // Actions
  setSelectedButtons: (buttons: string[]) => void;
  toggleButton: (button: string) => void;
  resetPreferences: () => void;
}

const useTravelPreferencesStore = create<TravelPreferencesState>()(
  persist(
    (set) => ({
      selectedButtons: [],
      
      setSelectedButtons: (buttons) => set({ selectedButtons: buttons }),
      
      toggleButton: (button) => set((state) => {
        const isSelected = state.selectedButtons.includes(button);
        if (isSelected) {
          // Remove the button if already selected
          return { 
            selectedButtons: state.selectedButtons.filter(b => b !== button) 
          };
        } else {
          // Add the button if not selected
          return { 
            selectedButtons: [...state.selectedButtons, button] 
          };
        }
      }),
      
      resetPreferences: () => set({ selectedButtons: [] })
    }),
    {
      name: 'travel-preferences-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedButtons: state.selectedButtons
      })
    }
  )
);

export default useTravelPreferencesStore;