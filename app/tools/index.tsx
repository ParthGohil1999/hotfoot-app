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
    Alert,
    Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Search, Plus, Wrench, Download, Upload, Archive, Trash2, RotateCcw, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { Tool, PublishedItem, ToolOrPublished } from '../../types/agents';
import { LocalStorageService } from '../../services/localStorage';
import { FirebaseService } from '../../services/firebaseService';

export default function ToolsScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<'installed' | 'published' | 'my-published' | 'archived'>('installed');
    const [searchText, setSearchText] = useState('');
    const [installedTools, setInstalledTools] = useState<Tool[]>([]);
    const [publishedTools, setPublishedTools] = useState<PublishedItem[]>([]);
    const [myPublishedTools, setMyPublishedTools] = useState<PublishedItem[]>([]);
    const [archivedTools, setArchivedTools] = useState<PublishedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedToolsForPublish, setSelectedToolsForPublish] = useState<Set<string>>(new Set());
    const [selectedToolsForAction, setSelectedToolsForAction] = useState<Set<string>>(new Set());
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
                LocalStorageService.getInstalledTools(),
                FirebaseService.getPublishedTools(),
                user?.primaryEmailAddress?.emailAddress
                    ? FirebaseService.getMyPublishedTools(user.primaryEmailAddress.emailAddress)
                    : Promise.resolve([]),
                user?.primaryEmailAddress?.emailAddress
                    ? FirebaseService.getArchivedTools(user.primaryEmailAddress.emailAddress)
                    : Promise.resolve([])
            ]);

            setInstalledTools(installed);
            setPublishedTools(published);
            setMyPublishedTools(myPublished);
            setArchivedTools(archived);
        } catch (error) {
            console.error('Error loading tools:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Check if a tool is installed by comparing tool IDs
    const isToolInstalled = (toolId: string) => {
        return installedTools.some(installedTool => installedTool.id === toolId);
    };

    const filteredInstalledTools = installedTools.filter(tool =>
        tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredPublishedTools = publishedTools.filter(tool =>
        tool?.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tool?.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredMyPublishedTools = myPublishedTools.filter(tool =>
        tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredArchivedTools = archivedTools.filter(tool =>
        tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchText.toLowerCase())
    );

    // Check if a tool is already published by comparing tool IDs
    const isToolAlreadyPublished = (toolId: string) => {
        return myPublishedTools.some(publishedTool => publishedTool.id === toolId);
    };

    // Get tools that can be published (not already published)
    const getPublishableTools = () => {
        return installedTools.filter(tool => !isToolAlreadyPublished(tool.id));
    };

    // Get already published tool IDs for display purposes
    const getAlreadyPublishedToolIds = () => {
        return new Set(myPublishedTools.map(tool => tool.id));
    };

    const handleToolPress = (toolId: string, isInstalled: boolean) => {
        if (isPublishMode || isSelectionMode) return;

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        const isMyPublishedTool = activeTab === 'my-published' || activeTab === 'archived';
        router.push({
            pathname: '/tools/details',
            params: {
                toolId,
                isInstalled: isInstalled.toString(),
                isMyPublished: isMyPublishedTool.toString()
            }
        });
    };

    const handleToolLongPress = (toolId: string) => {
        if (activeTab !== 'my-published' && activeTab !== 'archived') return;

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else {
            // For web, provide alternative feedback
            Vibration.vibrate(50);
        }

        setIsSelectionMode(true);
        setSelectedToolsForAction(new Set([toolId]));
    };

    const handleCreateTool = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.push('/tools/create');
    };

    const togglePublishMode = () => {
        setIsPublishMode(!isPublishMode);
        setSelectedToolsForPublish(new Set());
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedToolsForAction(new Set());
    };

    const toggleToolSelection = (toolId: string) => {
        // For publish mode
        if (isPublishMode) {
            if (isToolAlreadyPublished(toolId)) {
                Alert.alert('Already Published', 'This tool has already been published and cannot be published again.');
                return;
            }

            const newSelection = new Set(selectedToolsForPublish);
            if (newSelection.has(toolId)) {
                newSelection.delete(toolId);
            } else {
                newSelection.add(toolId);
            }
            setSelectedToolsForPublish(newSelection);
        }

        // For action mode (archive/delete)
        if (isSelectionMode) {
            const newSelection = new Set(selectedToolsForAction);
            if (newSelection.has(toolId)) {
                newSelection.delete(toolId);
            } else {
                newSelection.add(toolId);
            }
            setSelectedToolsForAction(newSelection);
        }
    };

    const handlePublishSelected = async () => {
        if (selectedToolsForPublish.size === 0) {
            Alert.alert('Error', 'Please select at least one tool to publish');
            return;
        }

        if (!user?.primaryEmailAddress?.emailAddress) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        // Double-check that none of the selected tools are already published
        const alreadyPublishedIds = getAlreadyPublishedToolIds();
        const conflictingTools = Array.from(selectedToolsForPublish).filter(toolId =>
            alreadyPublishedIds.has(toolId)
        );

        if (conflictingTools.length > 0) {
            Alert.alert(
                'Error',
                `Some selected tools have already been published. Please refresh and try again.`
            );
            await loadData(); // Refresh data to show current state
            setSelectedToolsForPublish(new Set());
            return;
        }

        Alert.alert(
            'Publish Tools',
            `Are you sure you want to publish ${selectedToolsForPublish.size} tool(s)? They will be visible to all users.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Publish',
                    onPress: async () => {
                        setPublishing(true);
                        try {
                            const toolsToPublish = installedTools.filter(tool =>
                                selectedToolsForPublish.has(tool.id)
                            );

                            await Promise.all(
                                toolsToPublish.map(tool =>
                                    FirebaseService.publishTool(
                                        tool,
                                        user.fullName || 'Unknown User',
                                        user.primaryEmailAddress?.emailAddress || ''
                                    )
                                )
                            );

                            if (Platform.OS !== 'web') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }

                            Alert.alert('Success', 'Tools published successfully!');
                            setIsPublishMode(false);
                            setSelectedToolsForPublish(new Set());
                            await loadData(); // Reload to show in my published
                        } catch (error) {
                            console.error('Error publishing tools:', error);
                            Alert.alert('Error', 'Failed to publish tools');
                        } finally {
                            setPublishing(false);
                        }
                    }
                }
            ]
        );
    };

    const handleArchiveSelected = async () => {
        if (selectedToolsForAction.size === 0) {
            Alert.alert('Error', 'Please select at least one tool to archive');
            return;
        }

        if (!user?.primaryEmailAddress?.emailAddress) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        Alert.alert(
            'Archive Tools',
            `Are you sure you want to archive ${selectedToolsForAction.size} tool(s)? They will be moved to archive and hidden from other users.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Archive',
                    onPress: async () => {
                        setActionLoading(true);
                        try {
                            await FirebaseService.archiveTools(
                                Array.from(selectedToolsForAction),
                                user.primaryEmailAddress?.emailAddress || ''
                            );

                            if (Platform.OS !== 'web') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }

                            Alert.alert('Success', 'Tools archived successfully!');
                            setIsSelectionMode(false);
                            setSelectedToolsForAction(new Set());
                            await loadData();
                        } catch (error) {
                            console.error('Error archiving tools:', error);
                            Alert.alert('Error', 'Failed to archive tools');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedToolsForAction.size === 0) {
            Alert.alert('Error', 'Please select at least one tool to delete');
            return;
        }

        if (!user?.primaryEmailAddress?.emailAddress) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        Alert.alert(
            'Delete Tools',
            `Are you sure you want to permanently delete ${selectedToolsForAction.size} tool(s)? This action cannot be undone and will remove them from all users.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setActionLoading(true);
                        try {
                            // Delete from Firebase
                            await FirebaseService.deleteMultiplePublishedTools(
                                Array.from(selectedToolsForAction),
                                user.primaryEmailAddress?.emailAddress || ''
                            );

                            // Also remove from local storage if installed
                            const promises = Array.from(selectedToolsForAction).map(async (toolId) => {
                                try {
                                    await LocalStorageService.deleteTool(toolId);
                                } catch (error) {
                                    // Tool might not be installed locally, that's ok
                                    console.log('Tool not found in local storage:', toolId);
                                }
                            });
                            await Promise.all(promises);

                            if (Platform.OS !== 'web') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }

                            Alert.alert('Success', 'Tools deleted successfully!');
                            setIsSelectionMode(false);
                            setSelectedToolsForAction(new Set());
                            await loadData();
                        } catch (error) {
                            console.error('Error deleting tools:', error);
                            Alert.alert('Error', 'Failed to delete tools');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleUnarchive = async (toolId: string) => {
        if (!user?.primaryEmailAddress?.emailAddress) {
            Alert.alert('Error', 'User email not found');
            return;
        }

        try {
            await FirebaseService.unarchiveTool(toolId, user.primaryEmailAddress.emailAddress);

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            Alert.alert('Success', 'Tool unarchived successfully!');
            await loadData();
        } catch (error) {
            console.error('Error unarchiving tool:', error);
            Alert.alert('Error', 'Failed to unarchive tool');
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    const renderToolItem = (tool: Tool | PublishedItem, isInstalled: boolean) => {
        const isAlreadyPublished = isInstalled && isToolAlreadyPublished(tool.id);
        const isToolCurrentlyInstalled = !isInstalled && isToolInstalled(tool.id);
        const isSelectable = isPublishMode && isInstalled && !isAlreadyPublished;
        const isActionSelectable = isSelectionMode && (activeTab === 'my-published' || activeTab === 'archived');
        const isSelected = selectedToolsForPublish.has(tool.id);
        const isActionSelected = selectedToolsForAction.has(tool.id);

        return (
            <TouchableOpacity
                key={tool.id}
                style={[
                    styles.toolItem,
                    isSelectable && styles.selectableToolItem,
                    isSelected && styles.selectedToolItem,
                    isActionSelectable && styles.selectableToolItem,
                    isActionSelected && styles.selectedToolItem,
                    isAlreadyPublished && styles.publishedToolItem
                ]}
                onPress={() => {
                    if (isPublishMode && isInstalled) {
                        toggleToolSelection(tool.id);
                    } else if (isSelectionMode && (activeTab === 'my-published' || activeTab === 'archived')) {
                        toggleToolSelection(tool.id);
                    } else {
                        handleToolPress(tool.id, isInstalled);
                    }
                }}
                onLongPress={() => handleToolLongPress(tool.id)}
                activeOpacity={0.7}
            >
                <View style={styles.toolIcon}>
                    <Wrench size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={styles.toolInfo}>
                    <View style={styles.toolNameContainer}>
                        <Text style={styles.toolName}>{tool.name}</Text>
                        <View style={styles.badgeContainer}>
                            {isAlreadyPublished && (
                                <View style={styles.publishedBadge}>
                                    <Text style={styles.publishedBadgeText}>Published</Text>
                                </View>
                            )}
                            {isToolCurrentlyInstalled && (
                                <View style={styles.installedBadge}>
                                    <Text style={styles.installedBadgeText}>Installed</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <Text style={styles.toolDescription} numberOfLines={2}>
                        {tool.description}
                    </Text>
                    <View style={styles.toolMeta}>
                        {'parameters' in tool ? (
                            <Text style={styles.metaText}>
                                {tool.parameters.length} params • {formatDate(tool.updatedAt)}
                            </Text>
                        ) : (
                            <Text style={styles.metaText}>
                                {tool.authorName} • {tool.downloads} downloads • {formatDate(tool.createdAt)}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Action Icons */}
                {activeTab === 'archived' && !isSelectionMode && (
                    <TouchableOpacity
                        style={styles.unarchiveIcon}
                        onPress={() => handleUnarchive(tool.id)}
                        activeOpacity={0.7}
                    >
                        <RotateCcw size={16} color="#F59E0B" strokeWidth={2} />
                    </TouchableOpacity>
                )}

                {!isInstalled && !isToolCurrentlyInstalled && !isSelectionMode && (
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

    const publishableToolsCount = getPublishableTools().length;
    const showPublishButton = activeTab === 'installed' && filteredInstalledTools.length > 0 && publishableToolsCount > 0;
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
                    {isSelectionMode ? `${selectedToolsForAction.size} Selected` : 'AI Tools'}
                </Text>

                {showActionButtons ? <TouchableOpacity
                    // style={styles.cancelButton}
                    style={styles.createButton}
                    onPress={toggleSelectionMode}
                    activeOpacity={0.7}
                >
                    <X size={20} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity> :

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={handleCreateTool}
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
                    placeholder="Search tools..."
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
                        {installedTools.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{installedTools.length}</Text>
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
                        {publishedTools.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{publishedTools.length}</Text>
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
                        {myPublishedTools.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{myPublishedTools.length}</Text>
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
                        {archivedTools.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{archivedTools.length}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>


            {/* Mode Info Banners */}
            {isPublishMode && (
                <View style={styles.publishModeInfo}>
                    <Text style={styles.publishModeText}>
                        Select tools to publish ({publishableToolsCount} available)
                    </Text>
                    <Text style={styles.publishModeSubText}>
                        Tools with "Published" badge are already published
                    </Text>
                </View>
            )}

            {isSelectionMode && (
                <View style={styles.selectionModeInfo}>
                    <Text style={styles.selectionModeText}>
                        Selection Mode - Choose tools to archive or delete
                    </Text>
                    <Text style={styles.selectionModeSubText}>
                        Long press on any tool to start selecting
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
                        <Text style={styles.loadingText}>Loading tools...</Text>
                    </View>
                ) : (
                    <>
                        {activeTab === 'installed' ? (
                            filteredInstalledTools.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Wrench size={64} color="#333333" strokeWidth={1} />
                                    <Text style={styles.emptyStateTitle}>No tools installed</Text>
                                    <Text style={styles.emptyStateText}>
                                        Install tools from the published section or create your own
                                    </Text>
                                </View>
                            ) : (
                                filteredInstalledTools.map(tool => renderToolItem(tool, true))
                            )
                        ) : activeTab === 'published' ? (
                            filteredPublishedTools.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Wrench size={64} color="#333333" strokeWidth={1} />
                                    <Text style={styles.emptyStateTitle}>No published tools</Text>
                                    <Text style={styles.emptyStateText}>
                                        Be the first to publish a tool
                                    </Text>
                                </View>
                            ) : (
                                filteredPublishedTools.map(tool => renderToolItem(tool, false))
                            )
                        ) : activeTab === 'my-published' ? (
                            filteredMyPublishedTools.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Wrench size={64} color="#333333" strokeWidth={1} />
                                    <Text style={styles.emptyStateTitle}>No published tools</Text>
                                    <Text style={styles.emptyStateText}>
                                        Publish your installed tools to share with others
                                    </Text>
                                </View>
                            ) : (
                                filteredMyPublishedTools.map(tool => renderToolItem(tool, false))
                            )
                        ) : (
                            filteredArchivedTools.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Archive size={64} color="#333333" strokeWidth={1} />
                                    <Text style={styles.emptyStateTitle}>No archived tools</Text>
                                    <Text style={styles.emptyStateText}>
                                        Archived tools will appear here
                                    </Text>
                                </View>
                            ) : (
                                filteredArchivedTools.map(tool => renderToolItem(tool, false))
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
                                Publish Tools ({publishableToolsCount} available)
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
                                    {selectedToolsForPublish.size} selected
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.publishSelectedButton,
                                    (selectedToolsForPublish.size === 0 || publishing) && styles.disabledButton
                                ]}
                                onPress={handlePublishSelected}
                                disabled={selectedToolsForPublish.size === 0 || publishing}
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
                        {/* <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={toggleSelectionMode}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>X</Text>
                        </TouchableOpacity> */}

                        {/* <View style={styles.selectionInfo}>
                            <Text style={styles.selectionText}>
                                {selectedToolsForAction.size} selected
                            </Text>
                        </View> */}

                        {activeTab === 'my-published' && (
                            <TouchableOpacity
                                style={[
                                    styles.archiveButton,
                                    (selectedToolsForAction.size === 0 || actionLoading) && styles.disabledButton
                                ]}
                                onPress={handleArchiveSelected}
                                disabled={selectedToolsForAction.size === 0 || actionLoading}
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
                                (selectedToolsForAction.size === 0 || actionLoading) && styles.disabledButton
                            ]}
                            onPress={handleDeleteSelected}
                            disabled={selectedToolsForAction.size === 0 || actionLoading}
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
    toolItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    selectableToolItem: {
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    selectedToolItem: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.5)',
    },
    publishedToolItem: {
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    toolIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    toolInfo: {
        flex: 1,
    },
    toolNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    toolName: {
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
    toolDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#999999',
        lineHeight: 20,
        marginBottom: 8,
    },
    toolMeta: {
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
        backdropFilter: 'blur(10px)',
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
        // right: 15,
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