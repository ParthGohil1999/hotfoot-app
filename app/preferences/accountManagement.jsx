import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
    ScrollView
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth, useClerk } from "@clerk/clerk-expo";
import {
    getFirestore,
    doc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    getDoc,
    enableNetwork,
} from "firebase/firestore";
import TopBar from "../../components/topBar";
import useUserStore from "../store/userZustandStore";
import { Trash2, Plane } from "lucide-react-native";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const VERIFICATION_DELAY_MS = 500;

const AccountManagement = () => {
    const router = useRouter();
    const { signOut, userId } = useAuth();
    const { user } = useClerk();
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const db = getFirestore();

    const withRetry = async (operation, maxRetries = MAX_RETRIES) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await enableNetwork(db);
                return await operation();
            } catch (error) {
                if (attempt === maxRetries) throw error;
                console.warn(
                    `Attempt ${attempt} failed, retrying in ${RETRY_DELAY_MS}ms...`
                );
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            }
        }
    };

    const handleDeleteAccount = async () => {
        setLoadingModalVisible(true);
        try {
            console.log("Starting account deletion for user:", userId);
            if (!userId) throw new Error("No user ID provided");

            console.log("Fetching itineraries...");
            const itinerariesQuery = query(
                collection(db, "itineraries"),
                where("userId", "==", userId)
            );
            const itinerarySnapshot = await withRetry(() =>
                getDocs(itinerariesQuery)
            );
            console.log(
                `Found ${itinerarySnapshot.docs.length} itineraries to delete.`
            );

            const deleteItineraryPromises = itinerarySnapshot.docs.map(
                (docSnapshot) =>
                    withRetry(() => deleteDoc(doc(db, "itineraries", docSnapshot.id)))
            );
            await Promise.all(deleteItineraryPromises);
            console.log("Itineraries deleted successfully.");

            console.log("Deleting user document...");
            const userRef = doc(db, "users", userId);
            await withRetry(() => deleteDoc(userRef));
            console.log("User document deletion attempted.");

            console.log("Verifying user document deletion...");
            await new Promise((resolve) =>
                setTimeout(resolve, VERIFICATION_DELAY_MS)
            );
            let verificationAttempts = 0;
            let userDoc;
            do {
                userDoc = await withRetry(() => getDoc(userRef));
                if (!userDoc.exists()) break;
                verificationAttempts++;
                console.warn(
                    `Verification attempt ${verificationAttempts}: Document still exists.`
                );
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            } while (verificationAttempts < MAX_RETRIES);

            if (userDoc.exists()) {
                console.error(
                    "User document data after failed deletion:",
                    userDoc.data()
                );
                throw new Error("User document still exists after deletion attempts");
            }
            console.log("User document confirmed deleted.");

            // Delete the Clerk user account properly
            if (user) {
                console.log("Deleting Clerk user...");
                try {
                    // Use the deleteAccount method from Clerk
                    await withRetry(() => user.delete());
                    console.log("Clerk user deleted successfully.");
                } catch (clerkError) {
                    console.error("Error deleting Clerk user:", clerkError);
                    // Continue with the flow even if Clerk deletion fails
                    // This ensures the user can still sign out and clear local data
                }
            } else {
                console.warn("No Clerk user object found to delete");
            }

            console.log("Clearing local user data...");
            useUserStore.getState().clearUserData();
            console.log("Local user data cleared.");

            console.log("Signing out...");
            await signOut();
            console.log("Sign-out complete.");

            setLoadingModalVisible(false);
            Alert.alert(
                "Success",
                "Your account and all associated data have been permanently deleted."
            );

            setTimeout(() => {
                console.log("Navigating to /auth...");
                router.replace("/auth");
            }, 0);
        } catch (error) {
            console.error("Error deleting account:", error);
            setLoadingModalVisible(false);
            if (error.message.includes("navigate before mounting")) {
                console.log("Ignoring navigation error, deletion succeeded.");
                return;
            }
            let errorMessage = "Failed to delete account. Please try again.";
            if (error.code === "permission-denied") {
                errorMessage = "Permission denied. Please contact support.";
            } else if (error.code === "unavailable") {
                errorMessage =
                    "Network error. Please check your connection and try again.";
            } else if (error.message.includes("still exists")) {
                errorMessage =
                    "Failed to fully delete account data. Please try again or contact support.";
            }
            Alert.alert("Error", errorMessage);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Delete Account</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.sectionTitle}>What happens when you delete your account?</Text>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                • Your account will be permanently deleted from our systems
                            </Text>
                            <Text style={styles.infoText}>
                                • All your personal information will be removed
                            </Text>
                            <Text style={styles.infoText}>
                                • Your saved itineraries and travel plans will be permanently deleted
                            </Text>
                            <Text style={styles.infoText}>
                                • Your data cannot be recovered once deleted
                            </Text>
                            <Text style={styles.infoText}>
                                • Any active subscriptions will be cancelled
                            </Text>
                        </View>

                        <Text style={styles.privacyNote}>
                            In accordance with our Privacy Policy, we may retain certain information for legal
                            and regulatory compliance for a limited time. All other data will be immediately
                            deleted from our systems.
                        </Text>

                        <Text style={styles.warningText}>
                            Warning: Deleting your account is permanent and cannot be undone!
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <View style={styles.buttonContent}>
                            <Trash2 size={22} color="#FFF" />
                            <Text style={styles.deleteButtonText}>
                                Delete My Account Permanently
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Confirmation Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>⚠ Caution</Text>
                            <Text style={styles.modalMessage}>
                                Are you sure you want to delete your account permanently? This
                                will delete all your data, including all itineraries and
                                personal details. This action cannot be undone.
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.confirmButton]}
                                    onPress={() => {
                                        setModalVisible(false);
                                        handleDeleteAccount();
                                    }}
                                >
                                    <Text style={styles.confirmButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Loading Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={loadingModalVisible}
                    onRequestClose={() => { }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <LottieView
                                source={require("../../constants/deleting-animation.json")}
                                autoPlay
                                loop
                                style={styles.animation}
                            />
                            <Text style={styles.loadingMessage}>
                                Deleting your account...
                            </Text>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        flex: 1,
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    backButtonText: {
        fontSize: 16,
        color: "black",
        fontWeight: "500",
    },
    headerSpacer: {
        width: 60, // Same width as back button for center alignment
    },
    scrollContainer: {
        flex: 1,
    },
    infoContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        color: "#333",
    },
    infoBox: {
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    infoText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 10,
        lineHeight: 22,
    },
    privacyNote: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
        marginBottom: 20,
        lineHeight: 20,
    },
    warningText: {
        fontSize: 16,
        color: "#FF4444",
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "600",
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    deleteButton: {
        backgroundColor: "#FF4444",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    deleteButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        padding: 24,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: "#F3F4F6",
    },
    cancelButtonText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    confirmButton: {
        backgroundColor: "#FF4444",
    },
    confirmButtonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "600",
    },
    animation: {
        width: 150,
        height: 150,
        marginBottom: 16,
    },
    loadingMessage: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000000",
        textAlign: "center",
        marginBottom: 12,
    },
});

export default AccountManagement;