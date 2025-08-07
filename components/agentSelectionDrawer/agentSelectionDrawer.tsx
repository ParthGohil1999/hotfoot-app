import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import { Search, Bot, X } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Agent } from '../../types/agents';
import { LocalStorageService } from '../../services/localStorage';

const { height: screenHeight } = Dimensions.get('window');
const DRAWER_HEIGHT = screenHeight * 0.7;

interface AgentSelectionDrawerProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectAgent: (agent: Agent) => void;
    selectedAgentId?: string;
}

export function AgentSelectionDrawer({
    isVisible,
    onClose,
    onSelectAgent,
    selectedAgentId
}: AgentSelectionDrawerProps) {
    const [searchText, setSearchText] = useState('');
    const [agents, setAgents] = useState<Agent[]>([]);
    const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);

    const translateY = useSharedValue(DRAWER_HEIGHT);
    const overlayOpacity = useSharedValue(0);

    useEffect(() => {
        if (isVisible) {
            translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
            overlayOpacity.value = withTiming(1, { duration: 300 });
            loadAgents();
        } else {
            translateY.value = withTiming(DRAWER_HEIGHT, { duration: 250 });
            overlayOpacity.value = withTiming(0, { duration: 250 });
        }
    }, [isVisible]);

    useEffect(() => {
        const filtered = agents.filter(agent =>
            agent.name.toLowerCase().includes(searchText.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredAgents(filtered);
    }, [searchText, agents]);

    const loadAgents = async () => {
        try {
            const installedAgents = await LocalStorageService.getInstalledAgents();
            setAgents(installedAgents);
        } catch (error) {
            console.error('Error loading agents:', error);
        }
    };

    const handleSelectAgent = (agent: Agent) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onSelectAgent(agent);
        onClose();
    };

    const drawerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const overlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

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

            {/* Drawer */}
            <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
                <LinearGradient
                    colors={['#0F0F0F', '#1A1A1A', '#0F0F0F']}
                    style={StyleSheet.absoluteFill}
                />

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={styles.title}>Select Agent</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <X size={20} color="#FFFFFF" strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Search size={16} color="#666666" strokeWidth={2} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search agents..."
                            placeholderTextColor="#666666"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                </View>

                {/* Agents List */}
                <ScrollView
                    style={styles.agentsList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.agentsContent}
                >
                    {filteredAgents.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Bot size={48} color="#333333" strokeWidth={1} />
                            <Text style={styles.emptyStateText}>No agents found</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Install agents from the agents section to use them here
                            </Text>
                        </View>
                    ) : (
                        filteredAgents.map((agent) => (
                            <TouchableOpacity
                                key={agent.id}
                                style={[
                                    styles.agentItem,
                                    selectedAgentId === agent.id && styles.selectedAgentItem,
                                ]}
                                onPress={() => handleSelectAgent(agent)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.agentIcon}>
                                    <Bot size={20} color="#FFFFFF" strokeWidth={2} />
                                </View>
                                <View style={styles.agentInfo}>
                                    <Text style={[
                                        styles.agentName,
                                        selectedAgentId === agent.id && styles.selectedAgentName,
                                    ]}>
                                        {agent.name}
                                    </Text>
                                    <Text style={styles.agentDescription} numberOfLines={2}>
                                        {agent.description}
                                    </Text>
                                    <Text style={styles.toolCount}>
                                        {agent.toolIds.length} {agent.toolIds.length === 1 ? 'tool' : 'tools'}
                                    </Text>
                                </View>
                                {selectedAgentId === agent.id && (
                                    <View style={styles.selectedIndicator} />
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
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
        zIndex: 2000,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    overlayTouchable: {
        flex: 1,
    },
    drawer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: DRAWER_HEIGHT,
        backgroundColor: '#0F0F0F',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: '#FFFFFF',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 12,
    },
    agentsList: {
        flex: 1,
    },
    agentsContent: {
        padding: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#FFFFFF',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
    },
    agentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    selectedAgentItem: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    agentIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    agentInfo: {
        flex: 1,
    },
    agentName: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    selectedAgentName: {
        color: '#3B82F6',
    },
    agentDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        color: '#999999',
        lineHeight: 18,
        marginBottom: 4,
    },
    toolCount: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#666666',
    },
    selectedIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
        marginLeft: 12,
    },
});