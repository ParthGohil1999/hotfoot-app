import { StatusBar } from "expo-status-bar";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChatMessage, Message } from "../ConvAI/ChatMessage";
import { useEffect, useState, useRef } from "react";
import { Send, MessageSquare, Phone, PhoneOff, ArrowLeft } from "lucide-react-native";
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";
import { AudioModule } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    interpolate,
    withTiming
} from 'react-native-reanimated';
import { BlurView } from "expo-blur";
import ConvAiDOMComponent from "../ConvAI/ConvAI";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AiModal({ visible, onClose, micPermission }) {
    const [modalVisible, setModalVisible] = useState(visible);

    useEffect(() => {
        setModalVisible(visible);
    }, [visible]);

    const [micPermissionGranted, setMicPermissionGranted] = useState(micPermission);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const scrollViewRef = useRef<ScrollView>(null);
    const textInputRef = useRef<TextInput>(null);
    const convAiRef = useRef<any>(null);

    // Animation values
    const headerOpacity = useSharedValue(0);
    const chatOpacity = useSharedValue(0);
    const inputOpacity = useSharedValue(0);
    const statusPulse = useSharedValue(0);

    const requestMicrophonePermissionAgain = async () => {
        try {
            console.log("Requesting microphone permission");
            const status = await AudioModule.getRecordingPermissionsAsync();
            console.log("Microphone permission status:", status);
            if (!status.granted) {
                const newStatus = await AudioModule.requestRecordingPermissionsAsync();
                console.log("Microphone permission request status:", newStatus);
                setMicPermissionGranted(newStatus.granted);
                return newStatus.granted;
            }
            setMicPermissionGranted(true);
            return true;
        } catch (error) {
            console.error("Microphone permission error:", error);
            setMicPermissionGranted(false);
            return false;
        }
    };

    const [fontsLoaded] = useFonts({
        "Inter-Regular": Inter_400Regular,
        "Inter-Medium": Inter_500Medium,
        "Inter-SemiBold": Inter_600SemiBold,
        "Inter-Bold": Inter_700Bold,
    });

    useEffect(() => {
        requestMicrophonePermissionAgain();

        // Entrance animations
        headerOpacity.value = withDelay(200, withSpring(1, { damping: 15 }));
        chatOpacity.value = withDelay(400, withSpring(1, { damping: 15 }));
        inputOpacity.value = withDelay(600, withSpring(1, { damping: 15 }));
    }, []);

    // Add this for debugging
    useEffect(() => {
        console.log('Connection state:', { isConnected, connectionStatus, micPermissionGranted });
    }, [isConnected, connectionStatus, micPermissionGranted]);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    useEffect(() => {
        if (isConnected) {
            statusPulse.value = withTiming(1, { duration: 300 });
        } else {
            statusPulse.value = withTiming(0, { duration: 300 });
        }
    }, [isConnected]);

    const handleConnectionChange = (connected: boolean) => {
        console.log("Connection changed:", connected);
        setIsConnected(connected);
        setConnectionStatus(connected ? 'connected' : 'disconnected');

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(connected ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handleConnectionStatusChange = (status: 'disconnected' | 'connecting' | 'connected') => {
        console.log("Connection status changed:", status);
        setConnectionStatus(status);
    };

    const handleListeningChange = (listening: boolean) => {
        console.log("Listening changed:", listening);
        setIsListening(listening);
    };

    const handleMessage = (message: Message) => {
        console.log("Received message:", message);
        setMessages(prev => {
            // Prevent duplicate messages
            const isDuplicate = prev.some(msg =>
                msg.content === message.content &&
                msg.role === message.role &&
                Math.abs((msg.timestamp || 0) - (message.timestamp || 0)) < 1000
            );

            if (isDuplicate) {
                return prev;
            }

            return [...prev, message];
        });
    };

    const handleSendMessage = async () => {
        if (!textInput.trim()) {
            console.log("No text to send");
            return;
        }
        
        if (!convAiRef.current) {
            console.error("ConvAI ref is not available");
            Alert.alert("Error", "Voice system not ready");
            return;
        }

        if (!isConnected) {
            console.error("Not connected to voice service");
            Alert.alert("Error", "Please connect to voice service first");
            return;
        }

        const messageText = textInput.trim();
        setTextInput('');

        try {
            await convAiRef.current.sendTextMessage(messageText);
            console.log("Text message sent successfully");
        } catch (error) {
            console.error("Failed to send message:", error);
            Alert.alert("Error", "Failed to send message. Please try again.");
            
            // Restore the text input if sending failed
            setTextInput(messageText);
        }

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const getStatusText = () => {
        if (isListening) return 'Listening...';
        if (connectionStatus === 'connecting') return 'Connecting...';
        if (connectionStatus === 'connected') return 'Connected';
        return 'Disconnected';
    };

    const getStatusColor = () => {
        if (isListening) return '#FFD700';
        if (connectionStatus === 'connected') return 'green';
        if (connectionStatus === 'connecting') return '#FF8C00';
        return '#666666';
    };

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: headerOpacity.value,
            transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }],
        };
    });

    const chatAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: chatOpacity.value,
            transform: [{ translateY: interpolate(chatOpacity.value, [0, 1], [30, 0]) }],
        };
    });

    const inputAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: inputOpacity.value,
            transform: [{ translateY: interpolate(inputOpacity.value, [0, 1], [50, 0]) }],
        };
    });

    const statusAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: 1 + statusPulse.value * 0.1 }],
        };
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                
            </View>
            {/* Categories section with enhanced UI */}
            {/* <Text style={styles.sectionTitle}>Explore by Category</Text> */}

            <LinearGradient
                colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
                <View style={styles.headerContent}>
                    <View style={styles.titleContainer}>
                        <View style={styles.iconWrapper}>
                            <View >
                                <TouchableOpacity
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        onClose();
                                    }}
                                >
                                    <ArrowLeft size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.title}>AI Assistant</Text>
                    </View>
                    <Animated.View style={[styles.statusContainer, statusAnimatedStyle]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                        <Text style={[styles.statusText, { color: getStatusColor() }]}>
                            {getStatusText()}
                        </Text>
                    </Animated.View>
                </View>
            </Animated.View>

            {/* Chat Messages */}
            <Animated.View style={[styles.chatContainer, chatAnimatedStyle]}>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyStateIcon}>
                                <Phone size={64} color="#333333" strokeWidth={1} />
                            </View>
                            <Text style={styles.emptyStateTitle}>Ready to chat</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Start a voice conversation or type a message below
                            </Text>
                        </View>
                    ) : (
                        messages.map((message, index) => (
                            <ChatMessage key={`${message.timestamp}-${index}`} message={message} index={index} />
                        ))
                    )}
                </ScrollView>
            </Animated.View>

            {/* Input Container */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <Animated.View style={[styles.inputContainer, inputAnimatedStyle]}>
                    <View style={styles.inputRow}>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                ref={textInputRef}
                                style={styles.textInput}
                                placeholder={isConnected ? "Type your message..." : "Connect to start typing..."}
                                placeholderTextColor="#666666"
                                value={textInput}
                                onChangeText={setTextInput}
                                multiline
                                maxLength={1000}
                                onFocus={() => setIsTyping(true)}
                                onBlur={() => setIsTyping(false)}
                                onSubmitEditing={handleSendMessage}
                                returnKeyType="send"
                                // editable={isConnected}
                            />
                            <TouchableOpacity
                                style={[styles.sendButton, textInput.trim() && isConnected && styles.sendButtonActive]}
                                onPress={handleSendMessage}
                                disabled={!textInput.trim() || !isConnected}
                            >
                                <Send
                                    size={18}
                                    color={textInput.trim() && isConnected ? "#FFFFFF" : "#666666"}
                                    strokeWidth={2}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Voice Button */}
                        {micPermissionGranted && (
                            <View style={styles.voiceButtonContainer}>
                                <ConvAiDOMComponent
                                    ref={convAiRef}
                                    dom={{ style: styles.domComponent }}
                                    platform={Platform.OS}
                                    onMessage={handleMessage}
                                    onConnectionChange={handleConnectionChange}
                                    onConnectionStatusChange={handleConnectionStatusChange}
                                    onListeningChange={handleListeningChange}
                                    requestMicrophonePermission={requestMicrophonePermissionAgain}
                                />
                            </View>
                        )}
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>

            <StatusBar style="light" />


        </Modal>
    );
}

const styles = StyleSheet.create({

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        // backgroundColor: '#f5f5f5',
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 40,
        left: -10,
        zIndex: 10,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingHorizontal: 20,
        marginTop: 50,
        // paddingBottom: 40,
    },
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: "#FFFFFF",
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 8,
    },
    statusText: {
        fontFamily: "Inter-Medium",
        fontSize: 12,
    },
    chatContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        margin: 16,
        borderRadius: 24,
        overflow: 'hidden',
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        paddingVertical: 24,
        flexGrow: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyStateIcon: {
        marginBottom: 24,
        opacity: 0.3,
    },
    emptyStateTitle: {
        fontFamily: "Inter-SemiBold",
        fontSize: 24,
        color: "#FFFFFF",
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: "#666666",
        textAlign: 'center',
        lineHeight: 24,
    },
    keyboardAvoid: {
        backgroundColor: 'transparent',
    },
    inputContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.06)',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    textInputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 16,
        alignItems: 'flex-end',
    },
    textInput: {
        flex: 1,
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: "#FFFFFF",
        maxHeight: 120,
        minHeight: 24,
        textAlignVertical: 'top',
        paddingTop: 0,
    },
    sendButton: {
        marginLeft: 12,
        padding: 8,
        borderRadius: 16,
        backgroundColor: 'transparent',
    },
    sendButtonActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    voiceButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    domComponent: {
        width: 56,
        height: 56,
    },
});
