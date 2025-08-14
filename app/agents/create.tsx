import React, { useState, useEffect, use } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Save, Trash2, Plus, X, Wrench } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Agent, Tool } from '../../types/agents';
import { LocalStorageService } from '../../services/localStorage';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-expo';

export default function CreateEditAgentScreen() {
    const router = useRouter();
    const user = useUser();
    const { editAgentId } = useLocalSearchParams();
    const isEditing = !!editAgentId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
    const [availableTools, setAvailableTools] = useState<Tool[]>([]);
    const [saving, setSaving] = useState(false);
    const [showToolSelector, setShowToolSelector] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const tools = await LocalStorageService.getInstalledTools(user?.primaryEmailAddress?.emailAddress);
            setAvailableTools(tools);

            if (isEditing) {
                const agents = await LocalStorageService.getInstalledAgents(user?.primaryEmailAddress?.emailAddress);
                const agent = agents.find(a => a.id === editAgentId);
                if (agent) {
                    setName(agent.name);
                    setDescription(agent.description);
                    setSelectedToolIds(agent.toolIds);
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter an agent name');
            return;
        }

        if (!description.trim()) {
            Alert.alert('Error', 'Please enter an agent description');
            return;
        }

        if (selectedToolIds.length > 5) {
            Alert.alert('Error', 'Maximum 5 tools allowed per agent');
            return;
        }

        setSaving(true);
        try {
            const agent: Agent = {
                id: isEditing ? editAgentId as string : uuidv4(),
                name: name.trim(),
                description: description.trim(),
                toolIds: selectedToolIds,
                createdAt: isEditing ? new Date() : new Date(),
                updatedAt: new Date(),
                isPublished: false
            };

            await LocalStorageService.saveAgent(agent, user?.primaryEmailAddress?.emailAddress);

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            Alert.alert(
                'Success',
                `Agent ${isEditing ? 'updated' : 'created'} successfully!`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error saving agent:', error);
            Alert.alert('Error', 'Failed to save agent');
        } finally {
            setSaving(false);
        }
    };

    const toggleTool = (toolId: string) => {
        if (selectedToolIds.includes(toolId)) {
            setSelectedToolIds(prev => prev.filter(id => id !== toolId));
        } else if (selectedToolIds.length < 5) {
            setSelectedToolIds(prev => [...prev, toolId]);
        } else {
            Alert.alert('Limit Reached', 'Maximum 5 tools allowed per agent');
        }

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const removeTool = (toolId: string) => {
        setSelectedToolIds(prev => prev.filter(id => id !== toolId));
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const selectedTools = availableTools.filter(tool => selectedToolIds.includes(tool.id));

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
                
                <Text style={styles.headerTitle}>
                    {isEditing ? 'Edit Agent' : 'Create Agent'}
                </Text>

                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.savingButton]}
                    onPress={handleSave}
                    disabled={saving}
                    activeOpacity={0.7}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Save size={20} color="#FFFFFF" strokeWidth={2} />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Name Field */}
                <View style={styles.section}>
                    <Text style={styles.label}>Agent Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter agent name..."
                        placeholderTextColor="#666666"
                        value={name}
                        onChangeText={setName}
                        maxLength={100}
                    />
                </View>

                {/* Description Field */}
                <View style={styles.section}>
                    <Text style={styles.label}>System Prompt / Description</Text>
                    <TextInput
                        style={[styles.textInput, styles.textArea]}
                        placeholder="Enter the system prompt that defines how this agent should behave..."
                        placeholderTextColor="#666666"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        maxLength={2000}
                    />
                    <Text style={styles.characterCount}>
                        {description.length}/2000 characters
                    </Text>
                </View>

                {/* Selected Tools */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.label}>Associated Tools</Text>
                        <View style={styles.toolLimitBadge}>
                            <Text style={styles.toolLimitText}>
                                {selectedToolIds.length}/5
                            </Text>
                        </View>
                    </View>

                    {selectedTools.length > 0 ? (
                        <View style={styles.selectedToolsContainer}>
                            {selectedTools.map((tool) => (
                                <View key={tool.id} style={styles.selectedToolItem}>
                                    <View style={styles.toolInfo}>
                                        <Text style={styles.selectedToolName}>{tool.name}</Text>
                                        <Text style={styles.selectedToolDescription} numberOfLines={2}>
                                            {tool.description}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.removeToolButton}
                                        onPress={() => removeTool(tool.id)}
                                        activeOpacity={0.7}
                                    >
                                        <X size={16} color="#FF6B6B" strokeWidth={2} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.noToolsText}>No tools selected</Text>
                    )}

                    <TouchableOpacity
                        style={styles.addToolButton}
                        onPress={() => setShowToolSelector(!showToolSelector)}
                        activeOpacity={0.7}
                    >
                        <Plus size={16} color="#FFFFFF" strokeWidth={2} />
                        <Text style={styles.addToolButtonText}>Add Tools</Text>
                    </TouchableOpacity>
                </View>

                {/* Tool Selector */}
                {showToolSelector && (
                    <View style={styles.toolSelector}>
                        <Text style={styles.toolSelectorTitle}>Available Tools</Text>
                        {availableTools.length === 0 ? (
                            <View style={styles.noAvailableTools}>
                                <Wrench size={32} color="#333333" strokeWidth={1} />
                                <Text style={styles.noAvailableToolsText}>No tools available</Text>
                                <Text style={styles.noAvailableToolsSubtext}>
                                    Install tools from the tools section first
                                </Text>
                            </View>
                        ) : (
                            availableTools.map((tool) => (
                                <TouchableOpacity
                                    key={tool.id}
                                    style={[
                                        styles.toolSelectorItem,
                                        selectedToolIds.includes(tool.id) && styles.selectedToolSelectorItem
                                    ]}
                                    onPress={() => toggleTool(tool.id)}
                                    disabled={!selectedToolIds.includes(tool.id) && selectedToolIds.length >= 5}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.toolSelectorInfo}>
                                        <Text style={[
                                            styles.toolSelectorName,
                                            selectedToolIds.includes(tool.id) && styles.selectedToolSelectorName
                                        ]}>
                                            {tool.name}
                                        </Text>
                                        <Text style={styles.toolSelectorDescription} numberOfLines={2}>
                                            {tool.description}
                                        </Text>
                                    </View>
                                    {selectedToolIds.includes(tool.id) && (
                                        <View style={styles.selectedIndicator} />
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
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
        fontSize: 18,
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    saveButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    savingButton: {
        opacity: 0.6,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    toolLimitBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    toolLimitText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#3B82F6',
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#FFFFFF',
    },
    textArea: {
        height: 120,
        paddingTop: 14,
    },
    characterCount: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#666666',
        textAlign: 'right',
        marginTop: 4,
    },
    selectedToolsContainer: {
        marginBottom: 16,
    },
    selectedToolItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    toolInfo: {
        flex: 1,
    },
    selectedToolName: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    selectedToolDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#999999',
        lineHeight: 16,
    },
    removeToolButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    noToolsText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        paddingVertical: 20,
        fontStyle: 'italic',
    },
    addToolButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderStyle: 'dashed',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    addToolButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFFFFF',
    },
    toolSelector: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    toolSelectorTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 16,
    },
    noAvailableTools: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    noAvailableToolsText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 12,
        marginBottom: 4,
    },
    noAvailableToolsSubtext: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
    },
    toolSelectorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    selectedToolSelectorItem: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    toolSelectorInfo: {
        flex: 1,
    },
    toolSelectorName: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    selectedToolSelectorName: {
        color: '#22C55E',
    },
    toolSelectorDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#999999',
        lineHeight: 16,
    },
    selectedIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22C55E',
        marginLeft: 8,
    },
});