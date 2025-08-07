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
import { ArrowLeft, Download, CreditCard as Edit3, Trash2, Bot, Wrench, Calendar, User } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Agent, Tool } from '../../types/agents';
import { LocalStorageService } from '../../services/localStorage';
import { FirebaseService } from '../../services/firebaseService';

export default function AgentDetailsScreen() {
    const router = useRouter();
    const { agentId, isInstalled } = useLocalSearchParams();
    
    const [agent, setAgent] = useState<Agent | null>(null);
    const [agentTools, setAgentTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [installing, setInstalling] = useState(false);
    const isInstalledAgent = isInstalled === 'true';

    useEffect(() => {
        loadAgentDetails();
    }, []);

    const loadAgentDetails = async () => {
        try {
            let agentData: Agent | null = null;
            
            if (isInstalledAgent) {
                const installedAgents = await LocalStorageService.getInstalledAgents();
                agentData = installedAgents.find(a => a.id === agentId) || null;
            } else {
                agentData = await FirebaseService.getAgentDetails(agentId as string);
            }

            if (agentData) {
                setAgent(agentData);
                // Load tools associated with the agent
                const installedTools = await LocalStorageService.getInstalledTools();
                const associatedTools = installedTools.filter(tool => 
                    agentData!.toolIds.includes(tool.id)
                );
                setAgentTools(associatedTools);
            }
        } catch (error) {
            console.error('Error loading agent details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInstall = async () => {
        if (!agent) return;
        
        setInstalling(true);
        try {
            await LocalStorageService.saveAgent(agent);
            
            // Increment download count if it's a published agent
            if (!isInstalledAgent) {
                await FirebaseService.incrementDownloadCount('publishedAgents', agent.id);
            }
            
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            
            Alert.alert('Success', 'Agent installed successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('Error installing agent:', error);
            Alert.alert('Error', 'Failed to install agent');
        } finally {
            setInstalling(false);
        }
    };

    const handleEdit = () => {
        if (!agent) return;
        
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        router.push({
            pathname: '/agents/create',
            params: { editAgentId: agent.id }
        });
    };

    const handleDelete = () => {
        if (!agent) return;
        
        Alert.alert(
            'Delete Agent',
            'Are you sure you want to delete this agent? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await LocalStorageService.deleteAgent(agent.id);
                            
                            if (Platform.OS !== 'web') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }
                            
                            router.back();
                        } catch (error) {
                            console.error('Error deleting agent:', error);
                            Alert.alert('Error', 'Failed to delete agent');
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

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Loading agent details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!agent) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Agent not found</Text>
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
                
                <Text style={styles.headerTitle}>Agent Details</Text>

                <View style={styles.headerActions}>
                    {isInstalledAgent ? (
                        <>
                            <TouchableOpacity
                                style={styles.headerAction}
                                onPress={handleEdit}
                                activeOpacity={0.7}
                            >
                                <Edit3 size={18} color="#FFFFFF" strokeWidth={2} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.headerAction, styles.deleteAction]}
                                onPress={handleDelete}
                                activeOpacity={0.7}
                            >
                                <Trash2 size={18} color="#FF6B6B" strokeWidth={2} />
                            </TouchableOpacity>
                        </>
                    ) : (
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
                    )}
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Agent Info */}
                <View style={styles.agentHeader}>
                    <View style={styles.agentIcon}>
                        <Bot size={32} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <Text style={styles.agentName}>{agent.name}</Text>
                    
                    <View style={styles.agentMetaContainer}>
                        {agent.authorName && (
                            <View style={styles.metaItem}>
                                <User size={14} color="#666666" strokeWidth={2} />
                                <Text style={styles.metaText}>{agent.authorName}</Text>
                            </View>
                        )}
                        <View style={styles.metaItem}>
                            <Calendar size={14} color="#666666" strokeWidth={2} />
                            <Text style={styles.metaText}>
                                {isInstalledAgent ? `Updated ${formatDate(agent.updatedAt)}` : `Created ${formatDate(agent.createdAt)}`}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{agent.description}</Text>
                </View>

                {/* Tools */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Associated Tools</Text>
                        <View style={styles.toolCountBadge}>
                            <Text style={styles.toolCountText}>{agent.toolIds.length}</Text>
                        </View>
                    </View>
                    
                    {agentTools.length > 0 ? (
                        agentTools.map((tool) => (
                            <View key={tool.id} style={styles.toolItem}>
                                <View style={styles.toolIcon}>
                                    <Wrench size={16} color="#FFFFFF" strokeWidth={2} />
                                </View>
                                <View style={styles.toolInfo}>
                                    <Text style={styles.toolName}>{tool.name}</Text>
                                    <Text style={styles.toolDescription} numberOfLines={2}>
                                        {tool.description}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.noToolsContainer}>
                            <Text style={styles.noToolsText}>
                                {agent.toolIds.length > 0 
                                    ? 'Some tools are not installed locally'
                                    : 'No tools associated with this agent'
                                }
                            </Text>
                        </View>
                    )}
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    agentHeader: {
        alignItems: 'center',
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
        marginBottom: 24,
    },
    agentIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    agentName: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
    },
    agentMetaContainer: {
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
    toolCountBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    toolCountText: {
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
    toolItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    toolIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    toolInfo: {
        flex: 1,
    },
    toolName: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    toolDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#999999',
        lineHeight: 16,
    },
    noToolsContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    noToolsText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
});