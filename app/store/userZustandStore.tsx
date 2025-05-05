import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface UserState {
    userData: any | null;
    userLocation: { city: string; country: string; coordinates: { latitude: number; longitude: number } } | null;
    locationPermission: string | null;
    onboardingStep: string | null;
    loading: boolean;
    error: string | null;

    // Actions
    fetchUserData: (userId: string) => Promise<void>;
    updatePreferences: (userId: string, preferences: any) => Promise<any>;
    updatePersonalInfo: (userId: string, getToken: any, personalInfo: any) => Promise<any>;
    updateUserLocation: (userId: string, getToken: any, location: any) => Promise<void>;
    setOnboardingStep: (userId: string, step: string) => Promise<void>;
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
            onboardingStep: null,
            loading: false,
            error: null,

            fetchUserData: async (userId) => {
                try {
                    set({ loading: true, error: null });
                    console.log("Fetching user data for:", userId);
                    const userRef = doc(db, "users", userId);
                    const docSnap = await getDoc(userRef);

                    if (!docSnap.exists()) {
                        await setDoc(userRef, {
                            createdAt: new Date().toISOString(),
                            preferences: { activities: [] },
                            personalInfo: {},
                            onboardingStep: null,
                            location: null,
                        });
                        const newDocSnap = await getDoc(userRef);
                        set({ userData: newDocSnap.data(), onboardingStep: 'travelPreferences' });
                    } else {
                        const data = docSnap.data();
                        set({ userData: data, onboardingStep: data.onboardingStep || null });
                    }
                    console.log("Received user data:", get().userData);
                } catch (error: any) {
                    console.error("Failed to fetch user data:", error);
                    set({ error: error.message });
                } finally {
                    set({ loading: false });
                }
            },

            updatePreferences: async (userId, preferences) => {
                try {
                    const userRef = doc(db, "users", userId);
                    await updateDoc(userRef, {
                        preferences: {
                            ...get().userData?.preferences,
                            ...preferences,
                        },
                        onboardingStep: 'personalTouch',
                        updatedAt: new Date().toISOString(),
                    });
                    set({ onboardingStep: 'personalTouch' });
                    await get().fetchUserData(userId);
                    return { success: true };
                } catch (error) {
                    console.error("Error saving preferences:", error);
                    throw error;
                }
            },

            updatePersonalInfo: async (userId, getToken, personalInfo) => {
                try {
                    console.log("Updating personalInfo for user:", userId);
                    console.log("personalInfo received:", personalInfo);
                    const userRef = doc(db, "users", userId);
                    const docSnap = await getDoc(userRef);

                    if (!docSnap.exists()) {
                        console.log("User document does not exist, creating new document");
                        await setDoc(userRef, {
                            createdAt: new Date().toISOString(),
                            preferences: { activities: [] },
                            personalInfo: personalInfo,
                            onboardingStep: 'completed',
                            updatedAt: new Date().toISOString(),
                        });
                    } else {
                        const updateData = {
                            personalInfo: {
                                ...docSnap.data().personalInfo,
                                ...personalInfo,
                            },
                            onboardingStep: 'completed',
                            updatedAt: new Date().toISOString(),
                        };
                        console.log("Data to update in Firestore:", updateData);
                        set({ onboardingStep: 'completed' });
                        await updateDoc(userRef, updateData);
                    }
                    console.log("Personal info updated successfully");
                    await get().fetchUserData(userId);
                    return { success: true };
                } catch (error) {
                    console.error("Failed to update personal info:", error);
                    throw error;
                }
            },

            updateUserLocation: async (userId, getToken, location) => {
                try {
                    console.log("Updating user location for user:", userId);
                    console.log("Location data:", location);
                    const userRef = doc(db, "users", userId);
                    const docSnap = await getDoc(userRef);

                    if (!docSnap.exists()) {
                        console.log("User document does not exist, creating new document");
                        await setDoc(userRef, {
                            createdAt: new Date().toISOString(),
                            preferences: { activities: [] },
                            personalInfo: {},
                            location,
                            onboardingStep: 'completed',
                            updatedAt: new Date().toISOString(),
                        });
                    } else {
                        await updateDoc(userRef, {
                            location,
                            updatedAt: new Date().toISOString(),
                        });
                    }
                    console.log("User location updated successfully");
                    set({ userLocation: location });
                    await get().fetchUserData(userId);
                } catch (error) {
                    console.error("Failed to update user location:", error);
                    throw error;
                }
            },

            setOnboardingStep: async (userId, step) => {
                try {
                    const userRef = doc(db, "users", userId);
                    await updateDoc(userRef, {
                        onboardingStep: step,
                        updatedAt: new Date().toISOString(),
                    });
                    set({ onboardingStep: step });
                } catch (error) {
                    console.error("Failed to update onboarding step:", error);
                    throw error;
                }
            },

            setUserLocation: (location) => set({ userLocation: location }),

            setLocationPermission: (permission) => set({ locationPermission: permission }),

            clearUserData: () => set({
                userData: null,
                userLocation: null,
                locationPermission: null,
                onboardingStep: null,
                error: null,
            }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                userData: state.userData,
                userLocation: state.userLocation,
                locationPermission: state.locationPermission,
                onboardingStep: state.onboardingStep,
            }),
        }
    )
);

export default useUserStore;