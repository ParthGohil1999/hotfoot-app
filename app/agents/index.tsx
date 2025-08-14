import React, { useState, useEffect, use } from 'react';
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
    Alert,
    Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Search, Plus, Bot, Download, Upload, Archive, Trash2, RotateCcw, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { Agent, PublishedItem, AgentOrPublished } from '../../types/agents';
import { LocalStorageService } from '../../services/localStorage';
import { FirebaseService } from '../../services/firebaseService';

export default function AgentsScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<'installed' | 'published' | 'my-published' | 'archived'>('installed');
    const [searchText, setSearchText] = useState('');
    const [installedAgents, setInstalledAgents] = useState<Agent[]>([]);
    const [publishedAgents, setPublishedAgents] = useState<PublishedItem[]>([]);
    const [myPublishedAgents, setMyPublishedAgents] = useState<PublishedItem[]>([]);
    const [archivedAgents, setArchivedAgents] = useState<PublishedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedAgentsForPublish, setSelectedAgentsForPublish] = useState<Set<string>>(new Set());
    const [selectedAgentsForAction, setSelectedAgentsForAction] = useState<Set<string>>(new Set());
    const [isPublishMode, setIsPublishMode] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [installed, published, myPublished, archived] = await Promise.all([
                LocalStorageService.getInstalledAgents(user?.primaryEmailAddress?.emailAddress),
                FirebaseService.getPublishedAgents(),
                user?.primaryEmailAddress?.emailAddress
                    ? FirebaseService.getMyPublishedAgents(user.primaryEmailAddress.emailAddress)
                    : Promise.resolve([]),
                user?.primaryEmailAddress?.emailAddress
                    ? FirebaseService.getArchivedAgents(user.primaryEmailAddress.emailAddress)
                    : Promise.resolve([])
            ]);

            setInstalledAgents(installed);
            setPublishedAgents(published);
            setMyPublishedAgents(myPublished);
            setArchivedAgents(archived);
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

    // Check if an agent is installed by comparing agent IDs
    const isAgentInstalled = (agentId: string) => {
        return installedAgents.some(installedAgent => installedAgent.id === agentId);
    };

    const filteredInstalledAgents = installedAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchText.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredPublishedAgents = publishedAgents.filter(agent =>
        agent?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        agent?.description?.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredMyPublishedAgents = myPublishedAgents.filter(agent =>
        agent.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        agent.description?.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredArchivedAgents = archivedAgents.filter(agent =>
        agent.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        agent.description?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Check if an agent is already published by comparing agent IDs
    const isAgentAlreadyPublished = (agentId: string) => {
        return myPublishedAgents.some(publishedAgent => publishedAgent.id === agentId);
    };

    // Get agents that can be published (not already published)
    const getPublishableAgents = () => {
        return installedAgents.filter(agent => !isAgentAlreadyPublished(agent.id));
    };

    // Get already published agent IDs for display purposes
    const getAlreadyPublishedAgentIds = () => {
        return new Set(myPublishedAgents.map(agent => agent.id));
    };

    const handleAgentPress = (agentId: string, isInstalled: boolean) => {
        if (isPublishMode || isSelectionMode) return;

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        const isMyPublishedAgent = activeTab === 'my-published' || activeTab === 'archived';
        router.push({
            pathname: '/agents/details',
            params: {
                agentId,
                isInstalled: isInstalled.toString(),
                isMyPublished: isMyPublishedAgent.toString()
            }
        });
    };

    const handleAgentLongPress = (agentId: string) => {
        if (activeTab !== 'my-published' && activeTab !== 'archived') return;

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else {
            // For web, provide alternative feedback
            Vibration.vibrate(50);
        }

        setIsSelectionMode(true);
        setSelectedAgentsForAction(new Set([agentId]));
    };

    const handleCreateAgent = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.push('/agents/create');
    };

    const togglePublishMode = () => {
        setIsPublishMode(!isPublishMode);
        setSelectedAgentsForPublish(new Set());
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedAgentsForAction(new Set());
    };

    const toggleAgentSelection = (agentId: string) => {
        // For publish mode
        if (isPublishMode) {
            if (isAgentAlreadyPublished(agentId)) {
                Alert.alert('Already Published', 'This agent has already been published and cannot be published again.');
                return;
            }

            const newSelection = new Set(selectedAgentsForPublish);
            if (newSelection.has(agentId)) {
                newSelection.delete(agentId);
            } else {
                newSelection.add(agentId);
            }
            setSelectedAgentsForPublish(newSelection);
        }

        // For action mode (archive/delete)
        if (isSelectionMode) {
            const newSelection = new Set(selectedAgentsForAction);
            if (newSelection.has(agentId)) {
                newSelection.delete(agentId);
            } else {
                newSelection.add(agentId);
            }
            setSelectedAgentsForAction(newSelection);
        }
    };

    const handlePublishSelected = async () => {
        if (selectedAgentsForPublish.size === 0) {
            Alert.alert('Error', 'Please select at least one agent to publish');
            return;
        }

        if (!user?.primaryEmailAddress?.emailAddress) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        // Double-check that none of the selected agents are already published
        const alreadyPublishedIds = getAlreadyPublishedAgentIds();
        const conflictingAgents = Array.from(selectedAgentsForPublish).filter(agentId =>
            alreadyPublishedIds.has(agentId)
        );

        if (conflictingAgents.length > 0) {
            Alert.alert(
                'Error',
                `Some selected agents have already been published. Please refresh and try again.`
            );
            await loadData(); // Refresh data to show current state
            setSelectedAgentsForPublish(new Set());
            return;
        }

        Alert.alert(
            'Publish Agents',
            `Are you sure you want to publish ${selectedAgentsForPublish.size} agent(s)? They will be visible to all users.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Publish',
                    onPress: async () => {
                        setPublishing(true);
                        try {
                            const agentsToPublish = installedAgents.filter(agent =>
                                selectedAgentsForPublish.has(agent.id)
                            );

                            await Promise.all(
                                agentsToPublish.map(agent =>
                                    FirebaseService.publishAgent(
                                        agent,
                                        user.fullName || 'Unknown User',
                                        user.primaryEmailAddress?.emailAddress || ''
                                    )
                                )
                            );

                            if (Platform.OS !== 'web') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }

                            Alert.alert('Success', 'Agents published successfully!');
                            setIsPublishMode(false);
                            setSelectedAgentsForPublish(new Set());
                            await loadData(); // Reload to show in my published
                        } catch (error) {
                            console.error('Error publishing agents:', error);
                            Alert.alert('Error', 'Failed to publish agents');
                        } finally {
                            setPublishing(false);
                        }
                    }
                }
            ]
        );
    };

    const handleArchiveSelected = async () => {
        if (selectedAgentsForAction.size === 0) {
            Alert.alert('Error', 'Please select at least one agent to archive');
            return;
        }

        if (!user?.primaryEmailAddress?.emailAddress) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        Alert.alert(
            'Archive Agents',
            `Are you sure you want to archive ${selectedAgentsForAction.size} agent(s)? They will be moved to archive and hidden from other users.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Archive',
                    onPress: async () => {
                        setActionLoading(true);
                        try {
                            await FirebaseService.archiveAgents(
                                Array.from(selectedAgentsForAction),
                                user.primaryEmailAddress?.emailAddress || ''
                            );

                            if (Platform.OS !== 'web') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }

                            Alert.alert('Success', 'Agents archived successfully!');
                            setIsSelectionMode(false);
                            setSelectedAgentsForAction(new Set());
                            await loadData();
                        } catch (error) {
                            console.error('Error archiving agents:', error);
                            Alert.alert('Error', 'Failed to archive agents');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedAgentsForAction.size === 0) {
            Alert.alert('Error', 'Please select at least one agent to delete');
            return;
        }

        if (!user?.primaryEmailAddress?.emailAddress) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        Alert.alert(
            'Delete Agents',
            `Are you sure you want to permanently delete ${selectedAgentsForAction.size} agent(s)? This action cannot be undone and will remove them from all users.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setActionLoading(true);
                        try {
                            // Delete from Firebase
                            await FirebaseService.deleteMultiplePublishedAgents(
                                Array.from(selectedAgentsForAction),
                                user.primaryEmailAddress?.emailAddress || ''
                            );

                            // Also remove from local storage if installed
                            const promises = Array.from(selectedAgentsForAction).map(async (agentId) => {
                                try {
                                    await LocalStorageService.deleteAgent(agentId, user?.primaryEmailAddress?.emailAddress);
                                } catch (error) {
                                    // Agent might not be installed locally, that's ok
                                    console.log('Agent not found in local storage:', agentId);
                                }
                            });
                            await Promise.all(promises);

                            if (Platform.OS !== 'web') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }

                            Alert.alert('Success', 'Agents deleted successfully!');
                            setIsSelectionMode(false);
                            setSelectedAgentsForAction(new Set());
                            await loadData();
                        } catch (error) {
                            console.error('Error deleting agents:', error);
                            Alert.alert('Error', 'Failed to delete agents');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleUnarchive = async (agentId: string) => {
        if (!user?.primaryEmailAddress?.emailAddress) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        try {
            await FirebaseService.unarchiveAgent(agentId, user.primaryEmailAddress.emailAddress);

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            Alert.alert('Success', 'Agent unarchived successfully!');
            await loadData();
        } catch (error) {
            console.error('Error unarchiving agent:', error);
            Alert.alert('Error', 'Failed to unarchive agent');
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    const renderAgentItem = (agent: Agent | PublishedItem, isInstalled: boolean) => {
        const isAlreadyPublished = isInstalled && isAgentAlreadyPublished(agent.id);
        const isAgentCurrentlyInstalled = !isInstalled && isAgentInstalled(agent.id);
        const isSelectable = isPublishMode && isInstalled && !isAlreadyPublished;
        const isActionSelectable = isSelectionMode && (activeTab === 'my-published' || activeTab === 'archived');
        const isSelected = selectedAgentsForPublish.has(agent.id);
        const isActionSelected = selectedAgentsForAction.has(agent.id);

        return (
            <TouchableOpacity
                key={agent.id}
                style={[
                    styles.agentItem,
                    isSelectable && styles.selectableAgentItem,
                    isSelected && styles.selectedAgentItem,
                    isActionSelectable && styles.selectableAgentItem,
                    isActionSelected && styles.selectedAgentItem,
                    isAlreadyPublished && styles.publishedAgentItem
                ]}
                onPress={() => {
                    if (isPublishMode && isInstalled) {
                        toggleAgentSelection(agent.id);
                    } else if (isSelectionMode && (activeTab === 'my-published' || activeTab === 'archived')) {
                        toggleAgentSelection(agent.id);
                    } else {
                        handleAgentPress(agent.id, isInstalled);
                    }
                }}
                onLongPress={() => handleAgentLongPress(agent.id)}
                activeOpacity={0.7}
            >
                <View style={styles.agentIcon}>
                    <Bot size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={styles.agentInfo}>
                    <View style={styles.agentNameContainer}>
                        <Text style={styles.agentName}>{agent.name}</Text>
                        <View style={styles.badgeContainer}>
                            {isAlreadyPublished && (
                                <View style={styles.publishedBadge}>
                                    <Text style={styles.publishedBadgeText}>Published</Text>
                                </View>
                            )}
                            {isAgentCurrentlyInstalled && (
                                <View style={styles.installedBadge}>
                                    <Text style={styles.installedBadgeText}>Installed</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <Text style={styles.agentDescription} numberOfLines={2}>
                        {agent.description}
                    </Text>
                    <View style={styles.agentMeta}>
                        {'toolIds' in agent ? (
                            <Text style={styles.metaText}>
                                {agent?.toolIds?.length} tools • {formatDate(agent.updatedAt)}
                            </Text>
                        ) : (
                            <Text style={styles.metaText}>
                                {agent.authorName} • {agent.downloads} downloads • {formatDate(agent.createdAt)}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Action Icons */}
                {activeTab === 'archived' && !isSelectionMode && (
                    <TouchableOpacity
                        style={styles.unarchiveIcon}
                        onPress={() => handleUnarchive(agent.id)}
                        activeOpacity={0.7}
                    >
                        <RotateCcw size={16} color="#F59E0B" strokeWidth={2} />
                    </TouchableOpacity>
                )}

                {!isInstalled && !isAgentCurrentlyInstalled && !isSelectionMode && (
                    <View style={styles.downloadIcon}>
                        <Download size={16} color="#666666" strokeWidth={2} />
                    </View>
                )}

                {isPublishMode && isInstalled && (
                    <>
                        {!isAlreadyPublished ? (
                            <View style={[
                                styles.selectionCircle,
                                isSelected && styles.selectedCircle
                            ]}>
                                {isSelected && (
                                    <View style={styles.selectionDot} />
                                )}
                            </View>
                        ) : (
                            <View style={styles.disabledIcon}>
                                <Text style={styles.disabledText}>✓</Text>
                            </View>
                        )}
                    </>
                )}

                {isSelectionMode && (activeTab === 'my-published' || activeTab === 'archived') && (
                    <View style={[
                        styles.selectionCircle,
                        isActionSelected && styles.selectedCircle
                    ]}>
                        {isActionSelected && (
                            <View style={styles.selectionDot} />
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const publishableAgentsCount = getPublishableAgents().length;
    const showPublishButton = activeTab === 'installed' && filteredInstalledAgents.length > 0 && publishableAgentsCount > 0;
    const showActionButtons = isSelectionMode && (activeTab === 'my-published' || activeTab === 'archived');

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
                    onPress={() => {
                        if (isSelectionMode) {
                            toggleSelectionMode();
                        } else {
                            router.back();
                        }
                    }}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    {isSelectionMode ? `${selectedAgentsForAction.size} Selected` : 'AI Agents'}
                </Text>

                {showActionButtons ? <TouchableOpacity
                    style={styles.createButton}
                    onPress={toggleSelectionMode}
                    activeOpacity={0.7}
                >
                    <X size={20} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity> :

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={handleCreateAgent}
                        activeOpacity={0.7}
                    >
                        <Plus size={20} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>}
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
                {/* Installed Tab */}
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'installed' && styles.activeTab]}
                    onPress={() => setActiveTab('installed')}
                    activeOpacity={0.7}
                >
                    <View style={styles.tabWithBadge}>
                        <Text style={[styles.tabText, activeTab === 'installed' && styles.activeTabText]}>
                            Installed
                        </Text>
                        {installedAgents.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{installedAgents.length}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Published Tab */}
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'published' && styles.activeTab]}
                    onPress={() => setActiveTab('published')}
                    activeOpacity={0.7}
                >
                    <View style={styles.tabWithBadge}>
                        <Text style={[styles.tabText, activeTab === 'published' && styles.activeTabText]}>
                            Published
                        </Text>
                        {publishedAgents.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{publishedAgents.length}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {/* My Published Tab */}
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'my-published' && styles.activeTab]}
                    onPress={() => setActiveTab('my-published')}
                    activeOpacity={0.7}
                >
                    <View style={styles.tabWithBadge}>
                        <Text style={[styles.tabText, activeTab === 'my-published' && styles.activeTabText]}>
                            My Published
                        </Text>
                        {myPublishedAgents.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{myPublishedAgents.length}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Archived Tab */}
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'archived' && styles.activeTab]}
                    onPress={() => setActiveTab('archived')}
                    activeOpacity={0.7}
                >
                    <View style={styles.tabWithBadge}>
                        <Text style={[styles.tabText, activeTab === 'archived' && styles.activeTabText]}>
                            Archive
                        </Text>
                        {archivedAgents.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{archivedAgents.length}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Mode Info Banners */}
            {isPublishMode && (
                <View style={styles.publishModeInfo}>
                    <Text style={styles.publishModeText}>
                        Select agents to publish ({publishableAgentsCount} available)
                    </Text>
                    <Text style={styles.publishModeSubText}>
                        Agents with "Published" badge are already published
                    </Text>
                </View>
            )}

            {isSelectionMode && (
                <View style={styles.selectionModeInfo}>
                    <Text style={styles.selectionModeText}>
                        Selection Mode - Choose agents to archive or delete
                    </Text>
                    <Text style={styles.selectionModeSubText}>
                        Long press on any agent to start selecting
                    </Text>
                </View>
            )}

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
                        ) : activeTab === 'published' ? (
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
                        ) : activeTab === 'my-published' ? (
                            filteredMyPublishedAgents.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Bot size={64} color="#333333" strokeWidth={1} />
                                    <Text style={styles.emptyStateTitle}>No published agents</Text>
                                    <Text style={styles.emptyStateText}>
                                        Publish your installed agents to share with others
                                    </Text>
                                </View>
                            ) : (
                                filteredMyPublishedAgents.map(agent => renderAgentItem(agent, false))
                            )
                        ) : (
                            filteredArchivedAgents.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Archive size={64} color="#333333" strokeWidth={1} />
                                    <Text style={styles.emptyStateTitle}>No archived agents</Text>
                                    <Text style={styles.emptyStateText}>
                                        Archived agents will appear here
                                    </Text>
                                </View>
                            ) : (
                                filteredArchivedAgents.map(agent => renderAgentItem(agent, false))
                            )
                        )}
                    </>
                )}
            </ScrollView>

            {/* Bottom Bars */}
            {showPublishButton && !isSelectionMode && (
                <View style={styles.bottomBar}>
                    {!isPublishMode ? (
                        <TouchableOpacity
                            style={styles.publishButton}
                            onPress={togglePublishMode}
                            activeOpacity={0.7}
                        >
                            <Upload size={20} color="#FFFFFF" strokeWidth={2} />
                            <Text style={styles.publishButtonText}>
                                Publish Agents ({publishableAgentsCount} available)
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.publishActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={togglePublishMode}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <View style={styles.selectionInfo}>
                                <Text style={styles.selectionText}>
                                    {selectedAgentsForPublish.size} selected
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.publishSelectedButton,
                                    (selectedAgentsForPublish.size === 0 || publishing) && styles.disabledButton
                                ]}
                                onPress={handlePublishSelected}
                                disabled={selectedAgentsForPublish.size === 0 || publishing}
                                activeOpacity={0.7}
                            >
                                {publishing ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Upload size={16} color="#FFFFFF" strokeWidth={2} />
                                        <Text style={styles.publishSelectedText}>Publish</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {showActionButtons && (
                <View style={styles.bottomBar}>
                    <View style={styles.actionButtons}>
                        {activeTab === 'my-published' && (
                            <TouchableOpacity
                                style={[
                                    styles.archiveButton,
                                    (selectedAgentsForAction.size === 0 || actionLoading) && styles.disabledButton
                                ]}
                                onPress={handleArchiveSelected}
                                disabled={selectedAgentsForAction.size === 0 || actionLoading}
                                activeOpacity={0.7}
                            >
                                {actionLoading ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Archive size={16} color="#FFFFFF" strokeWidth={2} />
                                        <Text style={styles.archiveButtonText}>Archive</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.deleteButton,
                                (selectedAgentsForAction.size === 0 || actionLoading) && styles.disabledButton
                            ]}
                            onPress={handleDeleteSelected}
                            disabled={selectedAgentsForAction.size === 0 || actionLoading}
                            activeOpacity={0.7}
                        >
                            {actionLoading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Trash2 size={16} color="#FFFFFF" strokeWidth={2} />
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}

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
        fontSize: 10,
        color: '#666666',
        textAlign: 'center',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    publishModeInfo: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 12,
        borderRadius: 12,
    },
    publishModeText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#3B82F6',
        marginBottom: 4,
    },
    publishModeSubText: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#7C3AED',
    },
    selectionModeInfo: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 12,
        borderRadius: 12,
    },
    selectionModeText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#F59E0B',
        marginBottom: 4,
    },
    selectionModeSubText: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#D97706',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Add padding for bottom bar
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
    selectableAgentItem: {
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    selectedAgentItem: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.5)',
    },
    publishedAgentItem: {
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderColor: 'rgba(34, 197, 94, 0.2)',
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
    agentNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    agentName: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        flex: 1,
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    publishedBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    publishedBadgeText: {
        fontFamily: 'Inter-Medium',
        fontSize: 10,
        color: '#22C55E',
        textTransform: 'uppercase',
    },
    installedBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    installedBadgeText: {
        fontFamily: 'Inter-Medium',
        fontSize: 10,
        color: '#22C55E',
        textTransform: 'uppercase',
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
    unarchiveIcon: {
        marginLeft: 12,
        padding: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
    },
    selectionCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedCircle: {
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
    },
    selectionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    disabledIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(34, 197, 94, 0.3)',
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledText: {
        fontFamily: 'Inter-Bold',
        fontSize: 12,
        color: '#22C55E',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Account for home indicator
    },
    publishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    publishButtonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
    },
    publishActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 8,
    },
    cancelButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFFFFF',
    },
    selectionInfo: {
        flex: 1,
        alignItems: 'center',
    },
    selectionText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#CCCCCC',
    },
    publishSelectedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },
    publishSelectedText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
    archiveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },
    archiveButtonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },
    deleteButtonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabWithBadge: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: -20,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        minWidth: 12,
        height: 12,
        paddingHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 7,
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
    },
});