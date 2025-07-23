import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    Text,
    Image,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchModal } from './SearchModal';
import * as Haptics from 'expo-haptics';
import {

    Search,

    Sparkles,

    MapPin,

    Heart,
    ArrowLeft
} from 'lucide-react-native';
import ExploreCategory from './exploreCategory';
import TripSearchPage from '../tripSearch/tripSearch';
import { AudioModule } from 'expo-audio';
import AiModal from './AiModal';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnimatedExploreBar() {
    const inputRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [micPermission, setMicPermission] = useState(false);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setModalVisible(true);
    };

    const requestMicrophonePermission = async () => {
        try {
            console.log("Requesting microphone permission from index");
            const status = await AudioModule.getRecordingPermissionsAsync();
            console.log("Microphone permission status from index:", status);
            if (!status.granted) {
                const newStatus = await AudioModule.requestRecordingPermissionsAsync();
                console.log("Microphone permission request status from index:", newStatus);
                setMicPermission(newStatus.granted);
                return newStatus.granted;
            }
            setMicPermission(true);
            return true;
        } catch (error) {
            console.error("Microphone permission error from index:", error);
            setMicPermission(false);
            return false;
        }
    };

    useEffect(() => {
        requestMicrophonePermission();
    }, []);


    useEffect(() => {
        console.log('Connection state from index:', { micPermission });
    }, [micPermission]);



    return (
        <>
            <TouchableOpacity
                style={styles.searchContainer}
                onPress={handlePress}
                activeOpacity={0.9}
            >
                <View style={styles.inputRow}>
                    {/* <LinearGradient
                        colors={['black', 'black']}
                        style={styles.searchIconContainer}
                    >
                        <Search size={22} color="#FFFFFF" />
                    </LinearGradient> */}
                    <View style={styles.input}>
                        <TextInput
                            ref={inputRef}
                            style={styles.inputText}
                            placeholder="✨ Plan your trip with AI"
                            placeholderTextColor="#8f8f8f"
                            editable={false}
                            pointerEvents="none"
                        />
                    </View>
                </View>
            </TouchableOpacity>

            <AiModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                requestMicrophonePermission={requestMicrophonePermission}
                micPermission={micPermission}
            />
        </>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        width: SCREEN_WIDTH * 0.9,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
        borderColor: "black",
        borderWidth: 1,
        // marginTop: Platform.OS === 'ios' ? 60 : 40,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 60,
    },
    searchIconContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 60,
        justifyContent: 'center',
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10,
    },

});