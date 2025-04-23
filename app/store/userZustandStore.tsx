import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    userData: any | null;
    userLocation: any | null;
    locationPermission: string | null;
    loading: boolean;
    error: string | null;
    API_BASE_URL: string;

    // Actions
    fetchUserData: (userId: string, getToken: () => Promise<string>) => Promise<void>;
    updatePreferences: (userId: string, getToken: () => Promise<string>, preferences: any) => Promise<any>;
    updatePersonalInfo: (userId: string, getToken: () => Promise<string>, personalInfo: any) => Promise<any>;
    setUserLocation: (location: any) => void;
    setLocationPermission: (permission: string) => void;
    clearUserData: () => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            userData: null,
            userLocation: null,
            locationPermission: null,
            loading: false,
            error: null,
            // API_BASE_URL: "http://192.168.29.125:5000",
            API_BASE_URL: "http://192.168.1.6:5000",

            fetchUserData: async (userId, getToken) => {
                try {
                    set({ loading: true, error: null });
                    const token = await getToken();

                    console.log("Fetching user data for:", userId);
                    const response = await fetch(`${get().API_BASE_URL}/api/user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log("Received user data:", data);
                    set({ userData: data });
                } catch (error: any) {
                    console.error("Failed to fetch user data:", error);
                    set({ error: error.message });
                } finally {
                    set({ loading: false });
                }
            },

            updatePreferences: async (userId, getToken, preferences) => {
                try {
                    const token = await getToken();
                    const response = await fetch(
                        `${get().API_BASE_URL}/api/user/${userId}/preferences`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(preferences),
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to save preferences");
                    }

                    const data = await response.json();
                    await get().fetchUserData(userId, getToken);
                    return data;
                } catch (error) {
                    console.error("Error saving preferences:", error);
                    throw error;
                }
            },

            updatePersonalInfo: async (userId, getToken, personalInfo) => {
                try {
                    const token = await getToken();
                    const response = await fetch(
                        `${get().API_BASE_URL}/api/user/${userId}/personal-info`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(personalInfo),
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    await get().fetchUserData(userId, getToken);
                    return data;
                } catch (error) {
                    console.error("Failed to update personal info:", error);
                    throw error;
                }
            },

            setUserLocation: (location) => set({ userLocation: location }),
            setLocationPermission: (permission) => set({ locationPermission: permission }),
            clearUserData: () => set({
                userData: null,
                userLocation: null,
                locationPermission: null,
                error: null
            })
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                userData: state.userData,
                userLocation: state.userLocation,
                locationPermission: state.locationPermission
            })
        }
    )
);

export default useUserStore;