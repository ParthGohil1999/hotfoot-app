import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Dimensions,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info, Smartphone, Wifi, Battery, X, Check } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    interpolate,
} from 'react-native-reanimated';
import { useNavigation } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DownloadModelsScreen = ({ onContinue, onBack }) => {
    const [modelExists, setModelExists] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadedBytes, setDownloadedBytes] = useState(0);
    const [totalBytes, setTotalBytes] = useState(0);
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [existingModelName, setExistingModelName] = useState('');
    const [downloadStarted, setDownloadStarted] = useState(false);
    const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const navigation = useNavigation()

    // Refs for download tracking
    const downloadTask = useRef(null);
    const lastProgressTime = useRef(Date.now());
    const lastDownloadedBytes = useRef(0);
    const speedHistory = useRef([]);
    const startTime = useRef(0);
    const isCancelling = useRef(false); // Add flag to track cancellation state

    // Model configuration - Fixed filename extension
    const MODEL_CONFIG = {
        url: 'https://huggingface.co/Qwen/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q8_0.gguf',
        filename: 'Qwen3-1.7B-Q8_0.gguf', // Fixed the typo (was .ggu, now .gguf)
        displayName: 'Qwen 3 - 1.7B',
        size: '1.83 GB',
        sizeBytes: 1964394496, // 1.83 GB in bytes
        description: 'Compact language model optimized for mobile devices'
    };

    // Animation values
    const headerOpacity = useSharedValue(0);
    const contentOpacity = useSharedValue(0);
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        checkExistingModel();

        // Entrance animations
        headerOpacity.value = withDelay(200, withSpring(1, { damping: 15 }));
        contentOpacity.value = withDelay(400, withSpring(1, { damping: 15 }));
        buttonOpacity.value = withDelay(600, withSpring(1, { damping: 15 }));
    }, []);

    useEffect(() => {
        if (downloadStarted) {
            console.log('Download started:', downloadStarted);
            // Add a small delay to ensure content is rendered
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 9999, animated: true });
            }, 100);
        }
    }, [downloadStarted]);



    const checkExistingModel = async () => {
        try {
            setIsChecking(true);
            const modelPath = `${FileSystem.documentDirectory}${MODEL_CONFIG.filename}`;
            const fileInfo = await FileSystem.getInfoAsync(modelPath);

            if (fileInfo.exists && fileInfo.size > 0) {
                setModelExists(true);
                setExistingModelName(MODEL_CONFIG.filename);
                setAgreedToTerms(true);
                setDownloadStarted(true);
                console.log('Existing model found:', fileInfo);
            }

            setIsChecking(false);
        } catch (error) {
            console.error('Error checking existing model:', error);
            setIsChecking(false);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatSpeed = (bytesPerSecond) => {
        if (bytesPerSecond === 0) return '0 B/s';
        return formatBytes(bytesPerSecond) + '/s';
    };

    const formatTime = (seconds) => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    };

    const calculateDownloadSpeed = (currentBytes, totalBytes) => {
        const currentTime = Date.now();
        const timeDiff = (currentTime - lastProgressTime.current) / 1000; // Convert to seconds
        const bytesDiff = currentBytes - lastDownloadedBytes.current;

        if (timeDiff > 0.5) { // Only calculate if at least 500ms passed
            const currentSpeed = bytesDiff / timeDiff;

            // Add to speed history for smoothing
            speedHistory.current.push(currentSpeed);
            if (speedHistory.current.length > 8) {
                speedHistory.current.shift(); // Keep only last 8 measurements
            }

            // Calculate average speed for smoother display
            const avgSpeed = speedHistory.current.reduce((sum, speed) => sum + speed, 0) / speedHistory.current.length;
            const smoothedSpeed = Math.max(0, avgSpeed);

            setDownloadSpeed(smoothedSpeed);

            // Calculate estimated time remaining
            const remainingBytes = totalBytes - currentBytes;
            if (smoothedSpeed > 0 && remainingBytes > 0) {
                const timeRemaining = remainingBytes / smoothedSpeed;
                setEstimatedTimeRemaining(timeRemaining);
            }

            lastProgressTime.current = currentTime;
            lastDownloadedBytes.current = currentBytes;
        }
    };

    const cancelDownload = async () => {
        if (downloadTask.current) {
            try {
                // Set cancellation flag
                isCancelling.current = true;

                // Cancel the download task
                await downloadTask.current.cancelAsync();

                // Clean up partial download
                const modelPath = `${FileSystem.documentDirectory}${MODEL_CONFIG.filename}`;
                const fileInfo = await FileSystem.getInfoAsync(modelPath);
                if (fileInfo.exists) {
                    await FileSystem.deleteAsync(modelPath);
                }

                // Reset states
                setIsDownloading(false);
                setDownloadProgress(0);
                setDownloadedBytes(0);
                setTotalBytes(0);
                setDownloadSpeed(0);
                setEstimatedTimeRemaining(0);
                setDownloadStarted(false);
                setAgreedToTerms(false);

                // Reset refs
                downloadTask.current = null;
                speedHistory.current = [];
                lastProgressTime.current = Date.now();
                lastDownloadedBytes.current = 0;
                isCancelling.current = false;

                Alert.alert('Download Cancelled', 'The model download has been cancelled.');
            } catch (error) {
                console.error('Error cancelling download:', error);
                isCancelling.current = false;
                Alert.alert('Error', 'Failed to cancel download. Please try again.');
            }
        }
    };

    const downloadModel = async () => {
        if (!agreedToTerms && !modelExists) {
            Alert.alert('Agreement Required', 'Please read and agree to the terms before downloading.');
            return;
        }

        try {
            setIsDownloading(true);
            setDownloadStarted(true);
            setDownloadProgress(0);
            setDownloadedBytes(0);
            setTotalBytes(MODEL_CONFIG.sizeBytes);
            setDownloadSpeed(0);
            setEstimatedTimeRemaining(0);

            // Reset tracking variables
            lastProgressTime.current = Date.now();
            lastDownloadedBytes.current = 0;
            speedHistory.current = [];
            startTime.current = Date.now();
            isCancelling.current = false; // Reset cancellation flag

            const modelPath = `${FileSystem.documentDirectory}${MODEL_CONFIG.filename}`;

            // Check if model already exists
            const existingFileInfo = await FileSystem.getInfoAsync(modelPath);
            if (existingFileInfo.exists && existingFileInfo.size > 0) {
                setModelExists(true);
                setExistingModelName(MODEL_CONFIG.filename);
                setIsDownloading(false);
                return;
            }

            console.log('Starting model download...');
            console.log('Download URL:', MODEL_CONFIG.url);
            console.log('Download Path:', modelPath);

            // Create download task with progress callback
            const downloadResumable = FileSystem.createDownloadResumable(
                MODEL_CONFIG.url,
                modelPath,
                {},
                (downloadProgress) => {
                    console.log('Progress callback received:', downloadProgress);

                    const { totalBytesWritten, totalBytesExpectedToWrite } = downloadProgress;

                    // Update total bytes if we get accurate info from server
                    const actualTotalBytes = totalBytesExpectedToWrite > 0 ? totalBytesExpectedToWrite : MODEL_CONFIG.sizeBytes;

                    if (actualTotalBytes !== totalBytes) {
                        setTotalBytes(actualTotalBytes);
                    }

                    // Calculate progress percentage
                    const progressPercentage = actualTotalBytes > 0
                        ? Math.min(Math.max(Math.round((totalBytesWritten / actualTotalBytes) * 100), 0), 100)
                        : 0;

                    console.log(`Download progress: ${totalBytesWritten} / ${actualTotalBytes} bytes (${progressPercentage}%)`);

                    setDownloadProgress(progressPercentage);
                    setDownloadedBytes(totalBytesWritten);

                    // Calculate and update download speed
                    calculateDownloadSpeed(totalBytesWritten, actualTotalBytes);
                }
            );

            // Store download task for potential cancellation
            downloadTask.current = downloadResumable;

            const result = await downloadResumable.downloadAsync();
            console.log('Download result:', result);

            // Check if download was cancelled by user
            if (isCancelling.current) {
                console.log('Download was cancelled by user');
                return; // Exit early, cancellation is already handled
            }

            // Check if download was successful
            if (result && result.status === 200) {
                // Verify file exists and has content
                const fileInfo = await FileSystem.getInfoAsync(result.uri);
                console.log('Downloaded file info:', fileInfo);

                if (fileInfo.exists && fileInfo.size > 0) {
                    setModelExists(true);
                    setExistingModelName(MODEL_CONFIG.filename);
                    setDownloadProgress(100);
                    setDownloadedBytes(fileInfo.size);
                    setTotalBytes(fileInfo.size);

                    const downloadTime = (Date.now() - startTime.current) / 1000;
                    console.log(`Download completed in ${downloadTime} seconds`);

                    Alert.alert(
                        'Download Complete',
                        'The AI model has been successfully downloaded and is ready to use!',
                        [{ text: 'Continue', onPress: onContinue }]
                    );
                } else {
                    throw new Error('Downloaded file is empty or corrupted');
                }
            } else {
                throw new Error(`Download failed with status: ${result?.status || 'unknown'}`);
            }

            setIsDownloading(false);
            downloadTask.current = null;

        } catch (error) {
            console.error('Download failed:', error);

            // Check if the error is due to user cancellation
            if (isCancelling.current ||
                (error.message && (
                    error.message.includes('cancelled') ||
                    error.message.includes('aborted') ||
                    error.message.includes('canceled')
                ))) {
                console.log('Download was cancelled, not treating as error');
                return; // Don't show error for user-initiated cancellation
            }

            setIsDownloading(false);
            setDownloadProgress(0);
            setDownloadedBytes(0);
            setDownloadSpeed(0);
            setEstimatedTimeRemaining(0);
            downloadTask.current = null;

            // Clean up partial download for actual errors
            try {
                const modelPath = `${FileSystem.documentDirectory}${MODEL_CONFIG.filename}`;
                const fileInfo = await FileSystem.getInfoAsync(modelPath);
                if (fileInfo.exists) {
                    await FileSystem.deleteAsync(modelPath);
                    console.log('Cleaned up partial download');
                }
            } catch (cleanupError) {
                console.error('Error cleaning up partial download:', cleanupError);
            }

            Alert.alert(
                'Download Failed',
                `Failed to download the model: ${error.message || 'Unknown error'}. Please check your internet connection and try again.`,
                [
                    {
                        text: 'Retry',
                        onPress: () => {
                            setDownloadStarted(false);
                            downloadModel();
                        }
                    },
                    { text: 'Cancel' }
                ]
            );
        }
    };

    const handleContinue = () => {
        if (modelExists) {
            navigation.navigate('(tabs)/home', { screen: 'home' });
        } else {
            downloadModel();
        }
    };

    const handleTermsToggle = () => {
        if (downloadStarted && agreedToTerms) {
            return;
        }
        setAgreedToTerms(!agreedToTerms);
    };

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: headerOpacity.value,
            transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-30, 0]) }],
        };
    });

    const contentAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: contentOpacity.value,
            transform: [{ translateY: interpolate(contentOpacity.value, [0, 1], [50, 0]) }],
        };
    });

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: buttonOpacity.value,
            transform: [{ translateY: interpolate(buttonOpacity.value, [0, 1], [30, 0]) }],
        };
    });

    if (isChecking) {
        return (
            <LinearGradient colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]} style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Checking for existing models...</Text>
                </View>
            </LinearGradient>
        );
    }



    return (
        <LinearGradient colors={["#0A0A0A", "#1A1A1A", "#0A0A0A"]} style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {/* Header */}
                <Animated.View style={[styles.header, headerAnimatedStyle]}>
                    <View style={styles.iconContainer}>
                        {modelExists ? (<Check size={32} color="#FFFFFF" strokeWidth={2} />) :
                            (<Download size={32} color="#FFFFFF" strokeWidth={2} />)}
                    </View>
                    <Text style={styles.title}>
                        {modelExists ? 'Model Ready' : 'Download AI Model'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {modelExists
                            ? 'Your AI assistant is ready to use'
                            : 'Download the AI model to enable offline conversations'
                        }
                    </Text>
                </Animated.View>

                {/* Content */}
                <Animated.View style={[styles.content, contentAnimatedStyle]}>
                    {/* Model Status */}
                    <View style={[styles.card, modelExists ? styles.successCard : styles.infoCard]}>
                        <View style={styles.cardHeader}>
                            {modelExists ? (
                                <CheckCircle size={24} color="#4ADE80" strokeWidth={2} />
                            ) : (
                                <Info size={24} color="#60A5FA" strokeWidth={2} />
                            )}
                            <Text style={styles.cardTitle}>
                                {modelExists ? 'Model Available' : 'Model Required'}
                            </Text>
                        </View>

                        <View style={styles.modelInfo}>
                            <Text style={styles.modelName}>{MODEL_CONFIG.displayName}</Text>
                            {modelExists && (
                                <Text style={styles.modelStatus}>File: {existingModelName}</Text>
                            )}
                            <Text style={styles.modelSize}>Size: {MODEL_CONFIG.size}</Text>
                            <Text style={styles.modelDescription}>{MODEL_CONFIG.description}</Text>
                        </View>
                    </View>

                    {/* Requirements */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <AlertCircle size={24} color="#F59E0B" strokeWidth={2} />
                            <Text style={styles.cardTitle}>Requirements</Text>
                        </View>

                        <View style={styles.requirementsList}>
                            <View style={styles.requirement}>
                                <Wifi size={20} color="#60A5FA" />
                                <Text style={styles.requirementText}>
                                    Stable internet connection for download
                                </Text>
                            </View>
                            <View style={styles.requirement}>
                                <Smartphone size={20} color="#60A5FA" />
                                <Text style={styles.requirementText}>
                                    {MODEL_CONFIG.size} of free storage space
                                </Text>
                            </View>
                            <View style={styles.requirement}>
                                <Battery size={20} color="#60A5FA" />
                                <Text style={styles.requirementText}>
                                    Sufficient battery (recommend 50%+)
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Terms and Conditions */}
                    {!modelExists && (
                        <View style={styles.card}>
                            <Text style={styles.termsTitle}>Terms of Use</Text>
                            <ScrollView style={styles.termsScroll} nestedScrollEnabled>
                                <Text style={styles.termsText}>
                                    By downloading and using this AI model, you agree to the following terms:
                                    {'\n\n'}
                                    • The model will be stored locally on your device for privacy
                                    {'\n'}
                                    • The model is provided "as-is" without warranties
                                    {'\n'}
                                    • You are responsible for using the AI ethically and legally
                                    {'\n'}
                                    • The model may consume device storage and processing power
                                    {'\n'}
                                    • Regular updates may be required for optimal performance
                                    {'\n\n'}
                                    Privacy: All AI processing happens locally on your device. No data is sent to external servers during conversations.
                                </Text>
                            </ScrollView>

                            <TouchableOpacity
                                style={[
                                    styles.checkboxContainer,
                                    downloadStarted && agreedToTerms && styles.checkboxContainerDisabled
                                ]}
                                onPress={handleTermsToggle}
                                disabled={downloadStarted && agreedToTerms}
                            >
                                <View style={[
                                    styles.checkbox,
                                    agreedToTerms && styles.checkboxChecked,
                                    downloadStarted && agreedToTerms && styles.checkboxLocked
                                ]}>
                                    {agreedToTerms && <CheckCircle size={16} color="#FFFFFF" />}
                                </View>
                                <Text style={[
                                    styles.checkboxText,
                                    downloadStarted && agreedToTerms && styles.checkboxTextDisabled
                                ]}>
                                    I have read and agree to the terms of use
                                    {downloadStarted && agreedToTerms && ' (Locked)'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Download Progress */}
                    {isDownloading && (
                        <View style={styles.card}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.progressTitle}>Downloading Model</Text>
                                <ActivityIndicator size="small" color="#4ADE80" style={styles.progressSpinner} />
                            </View>

                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <Animated.View
                                        style={[
                                            styles.progressFill,
                                            { width: `${downloadProgress}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressText}>{downloadProgress}%</Text>
                            </View>

                            <View style={styles.downloadStats}>
                                <Text style={styles.downloadStatsText}>
                                    {formatBytes(downloadedBytes)} / {formatBytes(totalBytes)}
                                </Text>
                                <Text style={styles.downloadSpeedText}>
                                    {formatSpeed(downloadSpeed)}
                                </Text>
                            </View>

                            {estimatedTimeRemaining > 0 && (
                                <View style={styles.timeRemainingContainer}>
                                    <Text style={styles.timeRemainingText}>
                                        Est. time remaining: {formatTime(estimatedTimeRemaining)}
                                    </Text>
                                </View>
                            )}

                            <Text style={styles.progressSubtext}>
                                Please keep the app open during download
                            </Text>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            {/* Action Buttons */}
            <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
                {isDownloading ? (
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={cancelDownload}
                    >
                        <X size={20} color="#000000" style={styles.cancelIcon} />
                        <Text style={styles.cancelButtonText}>Cancel Download</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                (modelExists || agreedToTerms) && styles.continueButtonEnabled
                            ]}
                            onPress={handleContinue}
                            disabled={!modelExists && !agreedToTerms}
                        >
                            <Text style={[
                                styles.continueButtonText,
                                (modelExists || agreedToTerms) && styles.continueButtonTextEnabled
                            ]}>
                                {modelExists ? 'Continue' : 'Download & Continue'}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 16,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#CCCCCC',
        textAlign: 'center',
        lineHeight: 24,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    successCard: {
        borderColor: 'rgba(74, 222, 128, 0.3)',
        backgroundColor: 'rgba(74, 222, 128, 0.05)',
    },
    infoCard: {
        borderColor: 'rgba(96, 165, 250, 0.3)',
        backgroundColor: 'rgba(96, 165, 250, 0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 12,
    },
    modelInfo: {
        paddingLeft: 36,
    },
    modelName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    modelStatus: {
        fontSize: 14,
        color: '#4ADE80',
        marginBottom: 4,
    },
    modelSize: {
        fontSize: 14,
        color: '#CCCCCC',
        marginBottom: 8,
    },
    modelDescription: {
        fontSize: 14,
        color: '#AAAAAA',
        lineHeight: 20,
    },
    requirementsList: {
        paddingLeft: 36,
    },
    requirement: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    requirementText: {
        fontSize: 14,
        color: '#CCCCCC',
        marginLeft: 12,
        flex: 1,
    },
    termsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    termsScroll: {
        maxHeight: 120,
        marginBottom: 16,
    },
    termsText: {
        fontSize: 13,
        color: '#CCCCCC',
        lineHeight: 18,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    checkboxContainerDisabled: {
        opacity: 0.7,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#AAAAAA',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#4ADE80',
        borderColor: '#4ADE80',
    },
    checkboxLocked: {
        backgroundColor: '#888888',
        borderColor: '#888888',
    },
    checkboxText: {
        fontSize: 14,
        color: '#CCCCCC',
        flex: 1,
    },
    checkboxTextDisabled: {
        color: '#888888',
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    progressSpinner: {
        marginLeft: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        marginRight: 12,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4ADE80',
        borderRadius: 4,
        minWidth: 2,
    },
    progressText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
        minWidth: 40,
        textAlign: 'right',
    },
    downloadStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    downloadStatsText: {
        fontSize: 14,
        color: '#CCCCCC',
    },
    downloadSpeedText: {
        fontSize: 14,
        color: '#CCCCCC',
        fontWeight: '500',
    },
    timeRemainingContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    timeRemainingText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    progressSubtext: {
        fontSize: 12,
        color: '#AAAAAA',
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        backgroundColor: 'black',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.06)',
    },
    backButton: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginRight: 12,
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#CCCCCC',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cancelIcon: {
        marginRight: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
    },
    continueButton: {
        flex: 2,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonEnabled: {
        backgroundColor: '#FFFFFF',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
    },
    continueButtonTextEnabled: {
        color: 'black',
    },
});

export default DownloadModelsScreen;