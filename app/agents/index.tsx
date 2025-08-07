import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Platform,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Search, Plus, Bot, Download } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Agent, PublishedItem } from '../../types/agents';
import { LocalStorageService } from '../../services/localStorage';
import { FirebaseService } from '../../services/firebaseService';

export default function AgentsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'installed' | 'published'>('installed');
    const [searchText, setSearchText] = useState('');
    const [installedAgents, setInstalledAgents] = useState<Agent[]>([]);
    const [publishedAgents, setPublishedAgents] = useState<PublishedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [installed, published] = await Promise.all([
                LocalStorageService.getInstalledAgents(),
                FirebaseService.getPublishedAgents()
            ]);
            setInstalledAgents(installed);
            setPublishedAgents(published);
        } catch (error) {
            console.error('Error loading agents:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const filteredInstalledAgents = installedAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchText.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredPublishedAgents = publishedAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchText.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAgentPress = (agentId: string, isInstalled: boolean) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push({
            pathname: '/agents/details',
            params: { agentId, isInstalled: isInstalled.toString() }
        });
    };

    const handleCreateAgent = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.push('/agents/create');
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    const renderAgentItem = (agent: Agent | PublishedItem, isInstalled: boolean) => (
        <TouchableOpacity
            key={agent.id}
            style={styles.agentItem}
            onPress={() => handleAgentPress(agent.id, isInstalled)}
            activeOpacity={0.7}
        >
            <View style={styles.agentIcon}>
                <Bot size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentDescription} numberOfLines={2}>
                    {agent.description}
                </Text>
                <View style={styles.agentMeta}>
                    {'toolIds' in agent ? (
                        <Text style={styles.metaText}>
                            {agent.toolIds.length} tools • {formatDate(agent.updatedAt)}
                        </Text>
                    ) : (
                        <Text style={styles.metaText}>
                            {agent.authorName} • {agent.downloads} downloads • {formatDate(agent.createdAt)}
                        </Text>
                    )}
                </View>
            </View>
            {!isInstalled && (
                <View style={styles.downloadIcon}>
                    <Download size={16} color="#666666" strokeWidth={2} />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>AI Agents</Text>

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateAgent}
                    activeOpacity={0.7}
                >
                    <Plus size={20} color="#FFFFFF" strokeWidth={2} />
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

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'installed' && styles.activeTab]}
                    onPress={() => setActiveTab('installed')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'installed' && styles.activeTabText]}>
                        Installed ({installedAgents.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'published' && styles.activeTab]}
                    onPress={() => setActiveTab('published')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'published' && styles.activeTabText]}>
                        Published ({publishedAgents.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                        <Text style={styles.loadingText}>Loading agents...</Text>
                    </View>
                ) : (
                    <>
                        {activeTab === 'installed' ? (
                            filteredInstalledAgents.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Bot size={64} color="#333333" strokeWidth={1} />
                                    <Text style={styles.emptyStateTitle}>No agents installed</Text>
                                    <Text style={styles.emptyStateText}>
                                        Install agents from the published section or create your own
                                    </Text>
                                </View>
                            ) : (
                                filteredInstalledAgents.map(agent => renderAgentItem(agent, true))
                            )
                        ) : (
                            filteredPublishedAgents.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Bot size={64} color="#333333" strokeWidth={1} />
                                    <Text style={styles.emptyStateTitle}>No published agents</Text>
                                    <Text style={styles.emptyStateText}>
                                        Be the first to publish an agent
                                    </Text>
                                </View>
                            ) : (
                                filteredPublishedAgents.map(agent => renderAgentItem(agent, false))
                            )
                        )}
                    </>
                )}
            </ScrollView>

            <StatusBar style="light" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    createButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
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
        marginHorizontal: 20,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 12,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    tabText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#666666',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 20,
        color: '#FFFFFF',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
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
    agentIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
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
    agentDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#999999',
        lineHeight: 20,
        marginBottom: 8,
    },
    agentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#666666',
    },
    downloadIcon: {
        marginLeft: 12,
        opacity: 0.6,
    },
});