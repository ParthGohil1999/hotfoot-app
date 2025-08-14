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
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Save, Plus, X, Trash2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Tool, ToolParameter } from '../../types/agents';
import { LocalStorageService } from '../../services/localStorage';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-expo';

const PARAMETER_TYPES = ['string', 'number', 'boolean', 'object', 'array'] as const;

export default function CreateEditToolScreen() {
    const router = useRouter();
    const user = useUser();
    const { editToolId } = useLocalSearchParams();
    const isEditing = !!editToolId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [functionCode, setFunctionCode] = useState(`async function exampleTool(param1, param2) {
    // Your tool logic here
    console.log('Tool executed with:', param1, param2);
    
    return {
        success: true,
        message: 'Tool executed successfully',
        data: { param1, param2 }
    };
}`);
    const [parameters, setParameters] = useState<ToolParameter[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEditing) {
            loadTool();
        }
    }, []);

    const loadTool = async () => {
        try {
            const tools = await LocalStorageService.getInstalledTools(user?.primaryEmailAddress?.emailAddress);
            const tool = tools.find(t => t.id === editToolId);
            if (tool) {
                setName(tool.name);
                setDescription(tool.description);
                setFunctionCode(tool.function);
                setParameters(tool.parameters);
            }
        } catch (error) {
            console.error('Error loading tool:', error);
        }
    };

    const addParameter = () => {
        const newParam: ToolParameter = {
            id: uuidv4(),
            name: '',
            type: 'string',
            description: '',
            required: false
        };
        setParameters(prev => [...prev, newParam]);

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const updateParameter = (id: string, field: keyof ToolParameter, value: any) => {
        setParameters(prev =>
            prev.map(param =>
                param.id === id ? { ...param, [field]: value } : param
            )
        );
    };

    const removeParameter = (id: string) => {
        setParameters(prev => prev.filter(param => param.id !== id));
        
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const validateTool = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a tool name');
            return false;
        }

        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a tool description');
            return false;
        }

        if (!functionCode.trim()) {
            Alert.alert('Error', 'Please enter the function code');
            return false;
        }

        // Check if all parameters have names
        const invalidParams = parameters.filter(p => !p.name.trim());
        if (invalidParams.length > 0) {
            Alert.alert('Error', 'All parameters must have a name');
            return false;
        }

        // Check for duplicate parameter names
        const paramNames = parameters.map(p => p.name.toLowerCase());
        const uniqueNames = new Set(paramNames);
        if (paramNames.length !== uniqueNames.size) {
            Alert.alert('Error', 'Parameter names must be unique');
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateTool()) return;

        setSaving(true);
        try {
            const tool: Tool = {
                id: isEditing ? editToolId as string : uuidv4(),
                name: name.trim(),
                description: description.trim(),
                function: functionCode.trim(),
                parameters: parameters.filter(p => p.name.trim()),
                createdAt: isEditing ? new Date() : new Date(),
                updatedAt: new Date(),
                isPublished: false
            };

            await LocalStorageService.saveTool(tool, user?.primaryEmailAddress?.emailAddress);

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            Alert.alert(
                'Success',
                `Tool ${isEditing ? 'updated' : 'created'} successfully!`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error saving tool:', error);
            Alert.alert('Error', 'Failed to save tool');
        } finally {
            setSaving(false);
        }
    };

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
                    {isEditing ? 'Edit Tool' : 'Create Tool'}
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
                    <Text style={styles.label}>Tool Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter tool name..."
                        placeholderTextColor="#666666"
                        value={name}
                        onChangeText={setName}
                        maxLength={100}
                    />
                </View>

                {/* Description Field */}
                <View style={styles.section}>
                    <Text style={styles.label}>Tool Description</Text>
                    <TextInput
                        style={[styles.textInput, styles.textArea]}
                        placeholder="Describe what this tool does and when to use it..."
                        placeholderTextColor="#666666"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        maxLength={1000}
                    />
                    <Text style={styles.characterCount}>
                        {description.length}/1000 characters
                    </Text>
                </View>

                {/* Function Code */}
                <View style={styles.section}>
                    <Text style={styles.label}>Function Code (JavaScript)</Text>
                    <TextInput
                        style={[styles.textInput, styles.codeInput]}
                        placeholder="Enter your JavaScript function..."
                        placeholderTextColor="#666666"
                        value={functionCode}
                        onChangeText={setFunctionCode}
                        multiline
                        numberOfLines={10}
                        textAlignVertical="top"
                        maxLength={5000}
                    />
                    <Text style={styles.characterCount}>
                        {functionCode.length}/5000 characters
                    </Text>
                </View>

                {/* Parameters */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.label}>Parameters</Text>
                        <TouchableOpacity
                            style={styles.addParamButton}
                            onPress={addParameter}
                            activeOpacity={0.7}
                        >
                            <Plus size={16} color="#FFFFFF" strokeWidth={2} />
                            <Text style={styles.addParamText}>Add Parameter</Text>
                        </TouchableOpacity>
                    </View>

                    {parameters.length === 0 ? (
                        <Text style={styles.noParamsText}>No parameters defined</Text>
                    ) : (
                        parameters.map((param, index) => (
                            <View key={param.id} style={styles.parameterItem}>
                                <View style={styles.parameterHeader}>
                                    <Text style={styles.parameterIndex}>Parameter {index + 1}</Text>
                                    <TouchableOpacity
                                        style={styles.removeParamButton}
                                        onPress={() => removeParameter(param.id)}
                                        activeOpacity={0.7}
                                    >
                                        <Trash2 size={16} color="#FF6B6B" strokeWidth={2} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.parameterFields}>
                                    {/* Parameter Name */}
                                    <View style={styles.fieldRow}>
                                        <Text style={styles.fieldLabel}>Name</Text>
                                        <TextInput
                                            style={styles.fieldInput}
                                            placeholder="Parameter name"
                                            placeholderTextColor="#666666"
                                            value={param.name}
                                            onChangeText={(value) => updateParameter(param.id, 'name', value)}
                                            maxLength={50}
                                        />
                                    </View>

                                    {/* Parameter Type */}
                                    <View style={styles.fieldRow}>
                                        <Text style={styles.fieldLabel}>Type</Text>
                                        <View style={styles.typeSelector}>
                                            {PARAMETER_TYPES.map((type) => (
                                                <TouchableOpacity
                                                    key={type}
                                                    style={[
                                                        styles.typeOption,
                                                        param.type === type && styles.selectedTypeOption
                                                    ]}
                                                    onPress={() => updateParameter(param.id, 'type', type)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={[
                                                        styles.typeOptionText,
                                                        param.type === type && styles.selectedTypeOptionText
                                                    ]}>
                                                        {type}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Parameter Description */}
                                    <View style={styles.fieldRow}>
                                        <Text style={styles.fieldLabel}>Description</Text>
                                        <TextInput
                                            style={[styles.fieldInput, styles.descriptionInput]}
                                            placeholder="Parameter description"
                                            placeholderTextColor="#666666"
                                            value={param.description}
                                            onChangeText={(value) => updateParameter(param.id, 'description', value)}
                                            multiline
                                            numberOfLines={2}
                                            textAlignVertical="top"
                                            maxLength={200}
                                        />
                                    </View>

                                    {/* Required Switch */}
                                    <View style={styles.fieldRow}>
                                        <Text style={styles.fieldLabel}>Required</Text>
                                        <Switch
                                            value={param.required}
                                            onValueChange={(value) => updateParameter(param.id, 'required', value)}
                                            trackColor={{ false: '#333333', true: '#3B82F6' }}
                                            thumbColor={param.required ? '#FFFFFF' : '#CCCCCC'}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))
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
        height: 80,
        paddingTop: 14,
    },
    codeInput: {
        height: 200,
        paddingTop: 14,
        fontFamily: 'SF Mono',
        fontSize: 13,
        lineHeight: 18,
    },
    characterCount: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#666666',
        textAlign: 'right',
        marginTop: 4,
    },
    addParamButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    addParamText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#FFFFFF',
    },
    noParamsText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        paddingVertical: 20,
        fontStyle: 'italic',
    },
    parameterItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    parameterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    parameterIndex: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
    removeParamButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    parameterFields: {
        gap: 12,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fieldLabel: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#CCCCCC',
        width: 80,
    },
    fieldInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 12,
    },
    descriptionInput: {
        height: 60,
        paddingTop: 8,
    },
    typeSelector: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginLeft: 12,
    },
    typeOption: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    selectedTypeOption: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    typeOptionText: {
        fontFamily: 'Inter-Regular',
        fontSize: 11,
        color: '#CCCCCC',
    },
    selectedTypeOptionText: {
        color: '#3B82F6',
        fontWeight: '500',
    },
});