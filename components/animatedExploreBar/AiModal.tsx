import { StatusBar } from "expo-status-bar";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Alert,
    ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChatMessage, Message } from "../../components/ConvAI/ChatMessage";
import { useEffect, useState, useRef } from "react";
import { Send, Phone, ArrowLeft, Menu, ChevronDown } from "lucide-react-native";
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
import { Sidebar } from '../../components/sidebar/Sidebar';
import { useChatHistory } from '../../hooks/useChatHistory';
import { BlurView } from "expo-blur";
import { useNavigation } from 'expo-router';
import ConvAiComponent from "@/components/ConvAI/ConvAI";
import { CactusAgent, CactusLM, initLlama, LlamaContext, Tools } from 'cactus-react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from "react-native-safe-area-context";
import { AgentSelectionDrawer } from '../../components/agentSelectionDrawer/agentSelectionDrawer';
import { Agent, Tool } from '../../types/agents';
import { LocalStorageService } from '../../services/localStorage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AiModal({ visible, micPermission }) {
    const [modalVisible, setModalVisible] = useState(visible);
    const [lm, setLM] = useState<CactusAgent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [agentDrawerVisible, setAgentDrawerVisible] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const navigation = useNavigation()

    // Chat history management
    const {
        chats,
        currentChatId,
        currentMessages,
        createNewChat,
        selectChat,
        addMessage,
        deleteChat,
    } = useChatHistory();

    const tools = new Tools();

    useEffect(() => {
        loadSelectedAgent();
    }, []);
    useEffect(() => {
        loadSelectedAgent();
    }, [LocalStorageService]);

    const loadSelectedAgent = async () => {
        try {
            const agent = await LocalStorageService.getSelectedAgent();
            if (agent) {
                setSelectedAgent(agent);
                await setupAgentTools(agent);
            }
        } catch (error) {
            console.error('Error loading selected agent:', error);
        }
    };

    const setupAgentTools = async (agent: Agent) => {
        if (!lm) return;

        try {
            // Load tools associated with the agent
            const installedTools = await LocalStorageService.getInstalledTools();
            const agentTools = installedTools.filter(tool => agent.toolIds.includes(tool.id));

            // Clear existing tools and add agent's tools
            for (const tool of agentTools) {
                // Convert tool parameters to the expected format
                const toolParams: any = {};
                tool.parameters.forEach(param => {
                    toolParams[param.name] = {
                        type: param.type,
                        description: param.description,
                        required: param.required
                    }
                });

                // Create the tool function from the stored code
                const toolFunction = new Function('return ' + tool.function)();

                lm.addTool(
                    toolFunction,
                    tool.description,
                    toolParams
                );
            }
        } catch (error) {
            console.error('Error setting up agent tools:', error);
        }
    };

    useEffect(() => {
        setModalVisible(visible);
    }, [visible]);

    useEffect(() => {
        initializeModel();
        return () => {
            lm?.release();
        };
    }, []);

    const [micPermissionGranted, setMicPermissionGranted] = useState(micPermission);
    const [messages, setMessages] = useState<Message[]>([...currentMessages]);
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

    const initializeModel = async () => {
        try {
            const modelUrl = 'https://huggingface.co/Qwen/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q8_0.gguf';
            const filename = 'Qwen3-1.7B-Q8_0.gguf';
            const modelPath = await downloadModel(modelUrl, filename);

            if (!modelPath) {
                console.log('Model download required, stopping initialization');
                setIsLoading(false);
                return;
            }

            console.log('Initializing Model: =======>', modelPath, filename);
            const { agent, error } = await CactusAgent.init({
                model: modelPath,
                use_mlock: true,
                n_ctx: 2048,
                n_threads: 4,
                n_gpu_layers: 99,
            });
            if (error) throw error;
            setLM(agent);

        } catch (error) {
            console.error('Failed to initialize model:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadModel = async (url: string, filename: string): Promise<string | null> => {
        const path = `${RNFS.DocumentDirectoryPath}/${filename}`;

        const fileExists = await RNFS.exists(path);
        if (fileExists) {
            console.log('Model file found at:', path);
            return path;
        }

        console.log('Model file not found, navigating to download screen');
        navigation.navigate('preferences/downloadModelsScreen', { screen: 'home' });

        return null;
    };

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

        headerOpacity.value = withDelay(200, withSpring(1, { damping: 15 }));
        chatOpacity.value = withDelay(400, withSpring(1, { damping: 15 }));
        inputOpacity.value = withDelay(600, withSpring(1, { damping: 15 }));
    }, []);

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
        console.log('Current messages :', currentMessages);
        setTimeout(() => {
            setMessages([...currentMessages]);
        }, 100);
    }, [currentMessages, currentChatId]);

    useEffect(() => {
        if (isConnected) {
            statusPulse.value = withTiming(1, { duration: 300 });
        } else {
            statusPulse.value = withTiming(0, { duration: 300 });
        }
    }, [isConnected]);

    useEffect(() => {
        if (selectedAgent && lm) {
            setupAgentTools(selectedAgent);
        }
    }, [selectedAgent, lm]);

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

    const handleNewChat = () => {
        const newChatId = createNewChat();
        console.log('Created new chat:', newChatId);
    };

    const handleChatSelect = async (chatId: string) => {
        await selectChat(chatId);
        console.log('Selected chat:', chatId);
    };

    const handleDeleteChat = (chatId: string) => {
        deleteChat(chatId);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log('Deleted chat:', chatId);
    };

    const handleSettingsPress = () => {
        navigation.navigate('(tabs)/settings');
    };

    const handleAgentSelect = async (agent: Agent) => {
        setSelectedAgent(agent);
        await LocalStorageService.setSelectedAgent(agent);

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        console.log('Selected agent:', agent.name);
    };

    const handleMessage = (message: Message) => {
        console.log("Received message:", message);
        setMessages(prev => {
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
        // addMessage(message);
    };

    const handleSendMessage = async () => {
        if (textInput.trim() && convAiRef.current && isConnected) {
            const messageText = textInput.trim();
            setTextInput('');

            const userMessage: Message = {
                role: 'user',
                content: messageText,
                timestamp: Date.now(),
                type: 'text'
            };
            handleMessage(userMessage);

            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        } else {
            if (!lm || !textInput.trim() || isGenerating) return;

            const formattedTextInput = textInput.trim();
            const userMessage: Message = { role: 'user', content: formattedTextInput, timestamp: Date.now() };
            const newMessages = [...messages, userMessage];

            const loadingMessage: Message = {
                role: 'assistant',
                content: "Preparing response...",
                timestamp: Date.now()
            };
            setMessages([...newMessages, loadingMessage]);
            setTextInput('');
            setIsGenerating(true);

            const stopWords = ['</s>', '<|end|>', '<|eot_id|>', '<|end_of_text|>',
                '<|im_end|>', '<|EOT|>', '<|END_OF_TURN_TOKEN|>',
                '<|end_of_turn|>', '<|endoftext|>', '<end_of_turn>', '<|end_of_sentence|>'];

            const systemPrompt = selectedAgent
                ? selectedAgent.description
                : `You are Dora, a capable AI assistant helping people to ease their life with answering their questions and performing tasks and running locally on a smartphone. You help users with legitimate tasks while maintaining high ethical standards.

CORE CAPABILITIES:
- Answer questions using your knowledge base
- Help with writing, analysis, and problem-solving
- Provide information on general topics
- Assist with productivity tasks like scheduling, reminders, and organization
- Offer technical guidance within your expertise

SAFETY GUARDRAILS:
- Do not generate harmful, illegal, or unethical content
- Refuse requests for dangerous instructions (weapons, drugs, hacking)
- Do not provide medical, legal, or financial advice requiring professional expertise
- Do not impersonate real people or organizations
- Avoid generating misleading or false information

RESPONSE GUIDELINES:
- Be helpful, accurate, and concise given mobile context
- Acknowledge when you're uncertain or lack information
- Suggest appropriate alternatives when you cannot fulfill a request
- Maintain a friendly but professional tone
- Consider mobile device limitations (shorter responses when appropriate)

LOCAL OPERATION:
- All processing occurs on-device for privacy
- No external data transmission without explicit user consent
- Respect device resources and battery life`;

            const formattedMessages = [
                {
                    role: 'system',
                    content: systemPrompt
                },
                ...newMessages.slice(-10).map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                { role: 'user', content: `/no_think ${formattedTextInput}\n` }
            ];

            console.log("Formatted messages for generation:", formattedMessages);

            try {
                let response = '';
                let insideThinkTags = false;
                let insideToolCallTags = false;
                let currentLoadingMessage = "Preparing response...";

                const result = await lm?.completionWithTools(formattedMessages, {
                    temperature: 0.9,
                    n_predict: 256,
                    jinja: true,
                    stop: stopWords,
                }, (content) => {
                    console.log("Token received:", content);
                    response += content.token;

                    if (content.token.includes('<think>')) {
                        insideThinkTags = true;
                        const newLoadingMessage = `${selectedAgent?.name || 'Dora'} is thinking...`;
                        if (currentLoadingMessage !== newLoadingMessage) {
                            currentLoadingMessage = newLoadingMessage;
                            setMessages(prev => [
                                ...prev.slice(0, -1),
                                { role: 'assistant', content: currentLoadingMessage, timestamp: Date.now() }
                            ]);
                        }
                    } else if (content.token.includes('</think>')) {
                        insideThinkTags = false;
                    }

                    if (content.token.includes('<tool_call>')) {
                        insideToolCallTags = true;
                        const newLoadingMessage = "Calling tools...";
                        if (currentLoadingMessage !== newLoadingMessage) {
                            currentLoadingMessage = newLoadingMessage;
                            setMessages(prev => [
                                ...prev.slice(0, -1),
                                { role: 'assistant', content: currentLoadingMessage, timestamp: Date.now() }
                            ]);
                        }
                    } else if (content.token.includes('</tool_call>')) {
                        insideToolCallTags = false;
                        const newLoadingMessage = "Processing response...";
                        if (currentLoadingMessage !== newLoadingMessage) {
                            currentLoadingMessage = newLoadingMessage;
                            setMessages(prev => [
                                ...prev.slice(0, -1),
                                { role: 'assistant', content: currentLoadingMessage, timestamp: Date.now() }
                            ]);
                        }
                    }

                    if (insideThinkTags && currentLoadingMessage !== `${selectedAgent?.name || 'Dora'} is thinking...`) {
                        currentLoadingMessage = `${selectedAgent?.name || 'Dora'} is thinking...`;
                        setMessages(prev => [
                            ...prev.slice(0, -1),
                            { role: 'assistant', content: currentLoadingMessage, timestamp: Date.now() }
                        ]);
                    } else if (insideToolCallTags && currentLoadingMessage !== "Calling tools...") {
                        currentLoadingMessage = "Calling tools...";
                        setMessages(prev => [
                            ...prev.slice(0, -1),
                            { role: 'assistant', content: currentLoadingMessage, timestamp: Date.now() }
                        ]);
                    } else if (!insideThinkTags && !insideToolCallTags && response.includes('Your') && currentLoadingMessage !== "Generating response...") {
                        currentLoadingMessage = "Generating response...";
                        setMessages(prev => [
                            ...prev.slice(0, -1),
                            { role: 'assistant', content: currentLoadingMessage, timestamp: Date.now() }
                        ]);
                    }
                });

                let cleanedResponse = response
                    .replace(/<think>.*?<\/think>/gs, '')
                    .replace(/<tool_call>.*?<\/tool_call>/gs, '')
                    .trim();

                const finalMessage: Message = {
                    role: 'assistant',
                    content: cleanedResponse,
                    timestamp: Date.now()
                };

                setMessages(prev => [
                    ...prev.slice(0, -1),
                    finalMessage
                ]);

                addMessage(userMessage);
                addMessage(finalMessage);

                console.log("Response from model:", result);
            } catch (error) {
                console.error('Generation failed:', error);
                setMessages(prev => [
                    ...prev.slice(0, -1),
                    { role: 'assistant', content: 'Error generating response', timestamp: Date.now() }
                ]);
            } finally {
                setIsGenerating(false);
            }
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

    if (isLoading) {
        return (
            <LinearGradient colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Loading model...</Text>
            </LinearGradient>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
                <View style={styles.headerContent}>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity
                            style={styles.iconWrapper}
                            onPress={() => {
                                if (Platform.OS !== 'web') {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }
                                setSidebarVisible(true);
                            }}
                            activeOpacity={0.7}
                        >
                            <Menu size={18} color="white" strokeWidth={2} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.agentSelector}
                            onPress={() => setAgentDrawerVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.title}>
                                {selectedAgent ? selectedAgent.name : 'AI Assistant'}
                            </Text>
                            <ChevronDown size={14} color="white" strokeWidth={2} />
                        </TouchableOpacity>
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
                            {selectedAgent && (
                                <View style={styles.agentInfo}>
                                    <Text style={styles.agentInfoTitle}>Active Agent: {selectedAgent.name}</Text>
                                    <Text style={styles.agentInfoDescription} numberOfLines={3}>
                                        {selectedAgent.description}
                                    </Text>
                                </View>
                            )}
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
                            />
                            <TouchableOpacity
                                style={[styles.sendButton, textInput.trim() && styles.sendButtonActive]}
                                onPress={handleSendMessage}
                            >
                                <Send
                                    size={20}
                                    color={textInput.trim() ? "#FFFFFF" : "#666666"}
                                    strokeWidth={2}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Voice Button */}
                        {micPermissionGranted && (
                            <View style={styles.voiceButtonContainer}>
                                <ConvAiComponent
                                    ref={convAiRef}
                                    dom={{ style: styles.domComponent }}
                                    platform={Platform.OS}
                                    onMessage={handleMessage}
                                    messages={messages}
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

            {/* Sidebar */}
            <Sidebar
                isVisible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
                onNewChat={handleNewChat}
                onChatSelect={handleChatSelect}
                onSettingsPress={handleSettingsPress}
                onDeleteChat={handleDeleteChat}
                chats={chats}
                currentChatId={currentChatId}
            />

            {/* Agent Selection Drawer */}
            <AgentSelectionDrawer
                isVisible={agentDrawerVisible}
                onClose={() => setAgentDrawerVisible(false)}
                onSelectAgent={handleAgentSelect}
                selectedAgentId={selectedAgent?.id}
            />

            <StatusBar style="light" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    loadingText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 16,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconWrapper: {
        width: 26,
        height: 26,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    agentSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
        maxWidth: 200,
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 15,
        color: "#FFFFFF",
        flex: 1,
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
        fontSize: 8,
    },
    chatContainer: {
        flex: 1,
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
        marginBottom: 24,
    },
    agentInfo: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        maxWidth: '90%',
    },
    agentInfoTitle: {
        fontFamily: "Inter-SemiBold",
        fontSize: 14,
        color: "#3B82F6",
        marginBottom: 8,
    },
    agentInfoDescription: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: "#CCCCCC",
        lineHeight: 16,
    },
    keyboardAvoid: {
        backgroundColor: 'transparent',
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 5,
        paddingBottom: Platform.OS === 'ios' ? 8 : 10,
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
        paddingVertical: 10,
        marginRight: 16,
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: "#FFFFFF",
        maxHeight: 120,
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