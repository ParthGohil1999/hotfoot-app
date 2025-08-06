import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Platform,
} from 'react-native';
import { MessageSquarePlus, CreditCard as Edit3, User, Settings, MessageSquare, Trash2 } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useUser } from '@clerk/clerk-expo';

const { width: screenWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = screenWidth * 0.82;

export interface ChatItem {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
    isActive?: boolean;
}

interface SidebarProps {
    isVisible: boolean;
    onClose: () => void;
    onNewChat: () => void;
    onChatSelect: (chatId: string) => void;
    onDeleteChat: (chatId: string) => void;
    onSettingsPress: () => void;
    chats: ChatItem[];
    currentChatId?: string;
}

export function Sidebar({
    isVisible,
    onClose,
    onNewChat,
    onChatSelect,
    onSettingsPress,
    chats,
    currentChatId,
    onDeleteChat
}: SidebarProps) {
    const translateX = useSharedValue(-SIDEBAR_WIDTH);
    const overlayOpacity = useSharedValue(0);
    const { user } = useUser();

    useEffect(() => {
        if (isVisible) {
            translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
            overlayOpacity.value = withTiming(1, { duration: 300 });
        } else {
            translateX.value = withTiming(-SIDEBAR_WIDTH, { duration: 250 });
            overlayOpacity.value = withTiming(0, { duration: 250 });
        }
    }, [isVisible]);

    const sidebarAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const overlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    const handleChatPress = (chatId: string) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onChatSelect(chatId);
        onClose();
    };

    const handleNewChat = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onNewChat();
        onClose();
    };

    const handleSettingsPress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onSettingsPress();
        onClose();
    };

    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = diff / (1000 * 60 * 60);
        const days = diff / (1000 * 60 * 60 * 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${Math.floor(hours)}h ago`;
        if (days < 7) return `${Math.floor(days)}d ago`;
        return date.toLocaleDateString();
    };

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
            {/* Overlay */}
            <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
                <TouchableOpacity
                    style={styles.overlayTouchable}
                    onPress={onClose}
                    activeOpacity={1}
                />
            </Animated.View>

            {/* Sidebar */}
            <Animated.View style={[styles.sidebar, sidebarAnimatedStyle]}>
                <LinearGradient
                    colors={['#0F0F0F', '#1A1A1A', '#0F0F0F']}
                    style={StyleSheet.absoluteFill}
                />

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image style={[styles.logoIcon]} source={require('../../assets/images/adaptive-icon-white.png')} />
                        <Text style={styles.appName}>Hotfoot</Text>
                    </View>

                    {/* New Chat Button */}
                    <TouchableOpacity
                        style={styles.newChatButton}
                        onPress={handleNewChat}
                        activeOpacity={0.7}
                    >
                        <MessageSquarePlus size={20} color="#FFFFFF" strokeWidth={2} />
                        <Text style={styles.newChatText}>New Chat</Text>
                        <Edit3 size={16} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                </View>

                {/* Chat List */}
                <ScrollView
                    style={styles.chatList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.chatListContent}
                >
                    <Text style={styles.sectionTitle}>Recent Chats</Text>

                    {chats.length === 0 ? (
                        <View style={styles.emptyChatState}>
                            <MessageSquare size={32} color="#666666" strokeWidth={1} />
                            <Text style={styles.emptyChatText}>No chats yet</Text>
                            <Text style={styles.emptyChatSubtext}>
                                Start a new conversation to see your chat history
                            </Text>
                        </View>
                    ) : (
                        chats.map((chat) => (
                            <TouchableOpacity
                                key={chat.id}
                                style={[
                                    styles.chatItem,
                                    currentChatId === chat.id && styles.activeChatItem,
                                ]}
                                onPress={() => handleChatPress(chat.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.chatItemContent}>
                                    <View style={styles.chatItemHeader}>
                                        <Text
                                            style={[
                                                styles.chatTitle,
                                                currentChatId === chat.id && styles.activeChatTitle,
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {chat.title}
                                        </Text>
                                        <Text style={styles.chatTime}>
                                            {formatRelativeTime(chat.timestamp)}
                                        </Text>
                                    </View>
                                    <Text style={styles.chatPreview} numberOfLines={1}>
                                        {chat.lastMessage}
                                    </Text>
                                    <Text style={styles.chatPreview} numberOfLines={1}>
                                        {chat.id}
                                    </Text>
                                </View>

                                <TouchableOpacity style={styles.chatActions} activeOpacity={0.7} onPress={() => onDeleteChat(chat.id)}>
                                    <Trash2 size={14} color="#666666" strokeWidth={2} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={handleSettingsPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.profileInfo}>
                            <View style={styles.profilePicContainer}>
                                {/* <User size={20} color="#FFFFFF" strokeWidth={2} /> */}
                                {user?.imageUrl ? <Image
                                    height={35}
                                    width={35}
                                    borderRadius={20}
                                    source={{uri: user.imageUrl}
                                    }
                                /> : <User size={20} color="#FFFFFF" strokeWidth={2} />}
                            </View>
                            <View style={styles.profileText}>
                                <Text style={styles.userName}>{user?.fullName}</Text>
                                <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
                            </View>
                        </View>
                        <Settings size={18} color="#666666" strokeWidth={2} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    overlayTouchable: {
        flex: 1,
    },
    sidebar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: '#0F0F0F',
        borderRightWidth: 1,
        borderRightColor: 'rgba(255, 255, 255, 0.08)',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    logoIcon: {
        height: 34,
        width: 34,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    appName: {
        fontFamily: 'Inter-Bold',
        fontSize: 21,
        color: '#FFFFFF',
    },
    newChatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    newChatText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
        flex: 1,
        marginLeft: 8,
    },
    chatList: {
        flex: 1,
    },
    chatListContent: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 12,
        color: '#666666',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emptyChatState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    emptyChatText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyChatSubtext: {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 18,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 12,
        marginVertical: 2,
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    activeChatItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    chatItemContent: {
        flex: 1,
    },
    chatItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatTitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#FFFFFF',
        flex: 1,
        marginRight: 8,
    },
    activeChatTitle: {
        color: '#FFFFFF',
    },
    chatTime: {
        fontFamily: 'Inter-Regular',
        fontSize: 11,
        color: '#666666',
    },
    chatPreview: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#999999',
        lineHeight: 16,
    },
    chatActions: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: 'transparent',
    },
    profileSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.06)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22,
        // paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 12,
        // backgroundColor: 'rgba(255, 255, 255, 0.04)',
        // borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profilePicContainer: {
        width: 40,
        height: 40,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    profileText: {
        flex: 1,
    },
    userName: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    userEmail: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#666666',
    },
});