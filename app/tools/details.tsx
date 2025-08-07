import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Download, CreditCard as Edit3, Trash2, Wrench, Calendar, User, Code, Globe, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { Tool, ToolOrPublished } from '../../types/agents';
import { LocalStorageService } from '../../services/localStorage';
import { FirebaseService } from '../../services/firebaseService';

export default function ToolDetailsScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { toolId, isInstalled, isMyPublished } = useLocalSearchParams();

    const [tool, setTool] = useState<ToolOrPublished | null>(null);
    const [loading, setLoading] = useState(true);
    const [installing, setInstalling] = useState(false);
    const [uninstalling, setUninstalling] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isToolCurrentlyInstalled, setIsToolCurrentlyInstalled] = useState(false);
    const isInstalledTool = isInstalled === 'true';
    const isMyPublishedTool = isMyPublished === 'true';

    useEffect(() => {
        loadToolDetails();
    }, []);

    const loadToolDetails = async () => {
        try {
            let toolData: ToolOrPublished | null = null;

            if (isInstalledTool) {
                // Load from installed tools
                const installedTools = await LocalStorageService.getInstalledTools();
                toolData = installedTools.find(t => t.id === toolId) || null;
            } else {
                // For published tools, we need to search in the appropriate collection
                if (isMyPublishedTool) {
                    // Load from user's published tools (including archived)
                    if (user?.primaryEmailAddress?.emailAddress) {
                        const [myPublishedTools, archivedTools] = await Promise.all([
                            FirebaseService.getMyPublishedTools(user.primaryEmailAddress.emailAddress),
                            FirebaseService.getArchivedTools(user.primaryEmailAddress.emailAddress)
                        ]);
                        toolData = [...myPublishedTools, ...archivedTools].find(t => t.id === toolId) || null;
                    }
                } else {
                    // Load from all published tools
                    const publishedTools = await FirebaseService.getPublishedTools();
                    toolData = publishedTools.find(t => t.id === toolId) || null;
                }

                // If still not found, try the getToolDetails method as fallback
                if (!toolData) {
                    toolData = await FirebaseService.getToolDetails(toolId as string);
                }

                // Check if this published tool is installed locally
                if (toolData) {
                    const installedTools = await LocalStorageService.getInstalledTools();
                    setIsToolCurrentlyInstalled(installedTools.some(t => t.id === toolId));
                }
            }

            if (toolData) {
                setTool(toolData);
            } else {
                console.log('Tool not found with ID:', toolId);
            }
        } catch (error) {
            console.error('Error loading tool details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInstall = async () => {
        if (!tool) return;

        setInstalling(true);
        try {
            await LocalStorageService.saveTool(tool);

            // Increment download count if it's a published tool
            if (!isInstalledTool) {
                await FirebaseService.incrementDownloadCount('publishedTools', tool.id);
            }

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            setIsToolCurrentlyInstalled(true);
            Alert.alert('Success', 'Tool installed successfully!');
        } catch (error) {
            console.error('Error installing tool:', error);
            Alert.alert('Error', 'Failed to install tool');
        } finally {
            setInstalling(false);
        }
    };

    const handleUninstall = async () => {
        if (!tool) return;

        Alert.alert(
            'Uninstall Tool',
            'Are you sure you want to uninstall this tool? You can reinstall it anytime.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Uninstall',
                    style: 'destructive',
                    onPress: async () => {
                        setUninstalling(true);
                        try {
                            await LocalStorageService.deleteTool(tool.id);

                            if (Platform.OS !== 'web') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }

                            setIsToolCurrentlyInstalled(false);
                            Alert.alert('Success', 'Tool uninstalled successfully!');
                        } catch (error) {
                            console.error('Error uninstalling tool:', error);
                            Alert.alert('Error', 'Failed to uninstall tool');
                        } finally {
                            setUninstalling(false);
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = () => {
        if (!tool) return;

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        router.push({
            pathname: '/tools/create',
            params: { editToolId: tool.id }
        });
    };

    const handleDelete = () => {
        if (!tool) return;

        const deleteTitle = isInstalledTool ? 'Delete Tool' : 'Delete Published Tool';
        const deleteMessage = isInstalledTool
            ? 'Are you sure you want to delete this tool? This action cannot be undone.'
            : 'Are you sure you want to delete this published tool? This will remove it for all users and cannot be undone.';

        Alert.alert(
            deleteTitle,
            deleteMessage,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            if (isInstalledTool) {
                                await LocalStorageService.deleteTool(tool.id);
                            } else if (isMyPublishedTool && user?.primaryEmailAddress?.emailAddress) {
                                await FirebaseService.deletePublishedTool(tool.id, user.primaryEmailAddress.emailAddress);
                                // Also remove from local storage if installed
                                try {
                                    await LocalStorageService.deleteTool(tool.id);
                                } catch (error) {
                                    // Tool might not be installed locally, that's ok
                                }
                            }

                            if (Platform.OS !== 'web') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }

                            router.back();
                        } catch (error) {
                            console.error('Error deleting tool:', error);
                            Alert.alert('Error', 'Failed to delete tool');
                        } finally {
                            setDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getParameterTypeColor = (type: string) => {
        const colors = {
            string: '#3B82F6',
            number: '#F59E0B',
            boolean: '#10B981',
            object: '#8B5CF6',
            array: '#EF4444'
        };
        return colors[type as keyof typeof colors] || '#6B7280';
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Loading tool details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!tool) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Tool not found</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Determine what button to show in top right
    const showInstallButton = !isInstalledTool && !isToolCurrentlyInstalled;
    const showUninstallButton = !isInstalledTool && isToolCurrentlyInstalled;

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerBackButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Tool Details</Text>

                <View style={styles.headerActions}>
                    {isInstalledTool ? (
                        <>
                            <TouchableOpacity
                                style={styles.headerAction}
                                onPress={handleEdit}
                                activeOpacity={0.7}
                            >
                                <Edit3 size={18} color="#FFFFFF" strokeWidth={2} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.headerAction, styles.deleteAction, deleting && styles.disabledAction]}
                                onPress={handleDelete}
                                disabled={deleting}
                                activeOpacity={0.7}
                            >
                                {deleting ? (
                                    <ActivityIndicator size="small" color="#FF6B6B" />
                                ) : (
                                    <Trash2 size={18} color="#FF6B6B" strokeWidth={2} />
                                )}
                            </TouchableOpacity>
                        </>
                    ) : isMyPublishedTool ? (
                        <TouchableOpacity
                            style={[styles.headerAction, styles.deleteAction, deleting && styles.disabledAction]}
                            onPress={handleDelete}
                            disabled={deleting}
                            activeOpacity={0.7}
                        >
                            {deleting ? (
                                <ActivityIndicator size="small" color="#FF6B6B" />
                            ) : (
                                <Trash2 size={18} color="#FF6B6B" strokeWidth={2} />
                            )}
                        </TouchableOpacity>
                    ) : showInstallButton ? (
                        <TouchableOpacity
                            style={[styles.installButton, installing && styles.installingButton]}
                            onPress={handleInstall}
                            disabled={installing}
                            activeOpacity={0.7}
                        >
                            {installing ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Download size={16} color="#FFFFFF" strokeWidth={2} />
                                    <Text style={styles.installButtonText}>Install</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : showUninstallButton ? (
                        <TouchableOpacity
                            style={[styles.uninstallButton, uninstalling && styles.uninstallingButton]}
                            onPress={handleUninstall}
                            disabled={uninstalling}
                            activeOpacity={0.7}
                        >
                            {uninstalling ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <X size={16} color="#FFFFFF" strokeWidth={2} />
                                    <Text style={styles.uninstallButtonText}>Uninstall</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Tool Info */}
                <View style={styles.toolHeader}>
                    <View style={styles.toolIcon}>
                        <Wrench size={32} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <Text style={styles.toolName}>{tool.name}</Text>

                    {/* Status Badges */}
                    <View style={styles.badgeContainer}>
                        {isMyPublishedTool && (
                            <View style={styles.statusBadge}>
                                <Globe size={12} color="#34D399" strokeWidth={2} />
                                <Text style={styles.statusText}>Published</Text>
                            </View>
                        )}
                        {isToolCurrentlyInstalled && (
                            <View style={styles.installedBadge}>
                                <Text style={styles.installedBadgeText}>Installed</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.toolMetaContainer}>
                        {tool.authorName && (
                            <View style={styles.metaItem}>
                                <User size={14} color="#666666" strokeWidth={2} />
                                <Text style={styles.metaText}>{tool.authorName}</Text>
                            </View>
                        )}
                        <View style={styles.metaItem}>
                            <Calendar size={14} color="#666666" strokeWidth={2} />
                            <Text style={styles.metaText}>
                                {isInstalledTool ? `Updated ${formatDate(tool.updatedAt)}` : `Created ${formatDate(tool.createdAt)}`}
                            </Text>
                        </View>
                        {!isInstalledTool && tool.downloads !== undefined && (
                            <View style={styles.metaItem}>
                                <Download size={14} color="#666666" strokeWidth={2} />
                                <Text style={styles.metaText}>{tool.downloads} downloads</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{tool.description}</Text>
                </View>

                {/* Parameters */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Parameters</Text>
                        <View style={styles.paramCountBadge}>
                            <Text style={styles.paramCountText}>{tool.parameters.length}</Text>
                        </View>
                    </View>

                    {tool.parameters.length > 0 ? (
                        tool.parameters.map((param) => (
                            <View key={param.id} style={styles.paramItem}>
                                <View style={styles.paramHeader}>
                                    <Text style={styles.paramName}>{param.name}</Text>
                                    <View style={styles.paramTypeContainer}>
                                        <View style={[styles.paramTypeBadge, { backgroundColor: `${getParameterTypeColor(param.type)}20` }]}>
                                            <Text style={[styles.paramTypeText, { color: getParameterTypeColor(param.type) }]}>
                                                {param.type}
                                            </Text>
                                        </View>
                                        {param.required && (
                                            <View style={styles.requiredBadge}>
                                                <Text style={styles.requiredText}>Required</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <Text style={styles.paramDescription}>{param.description}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.noParamsContainer}>
                            <Text style={styles.noParamsText}>No parameters required</Text>
                        </View>
                    )}
                </View>

                {/* Function Code */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Function Code</Text>
                        <Code size={16} color="#666666" strokeWidth={2} />
                    </View>
                    <View style={styles.codeContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text style={styles.codeText}>{tool.function}</Text>
                        </ScrollView>
                    </View>
                </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 24,
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    backButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerAction: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteAction: {
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
    },
    disabledAction: {
        opacity: 0.6,
    },
    installButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    installingButton: {
        opacity: 0.6,
    },
    installButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#FFFFFF',
    },
    uninstallButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    uninstallingButton: {
        opacity: 0.6,
    },
    uninstallButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    toolHeader: {
        alignItems: 'center',
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
        marginBottom: 24,
    },
    toolIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    toolName: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#34D399',
    },
    installedBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    installedBadgeText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#22C55E',
    },
    toolMetaContainer: {
        alignItems: 'center',
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#666666',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#FFFFFF',
    },
    paramCountBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    paramCountText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#3B82F6',
    },
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#CCCCCC',
        lineHeight: 24,
    },
    paramItem: {
        padding: 12,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    paramHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    paramName: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFFFFF',
        flex: 1,
    },
    paramTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    paramTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    paramTypeText: {
        fontFamily: 'Inter-Medium',
        fontSize: 11,
        textTransform: 'uppercase',
    },
    requiredBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    requiredText: {
        fontFamily: 'Inter-Medium',
        fontSize: 10,
        color: '#EF4444',
        textTransform: 'uppercase',
    },
    paramDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        color: '#999999',
        lineHeight: 18,
    },
    noParamsContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    noParamsText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
    codeContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    codeText: {
        fontFamily: 'SF Mono',
        fontSize: 12,
        color: '#E5E5E5',
        lineHeight: 18,
    },
});