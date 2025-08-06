'use dom'

import { useCallback, useEffect, useState, useImperativeHandle, forwardRef, use } from "react";
import { useConversation } from "@elevenlabs/react";
import { View, Pressable, StyleSheet, Animated, Platform } from "react-native";
import { useRef } from "react";
import type { Message } from "./ChatMessage";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react-native";
import * as Haptics from 'expo-haptics';

interface ConvAiComponentProps {
  dom?: import("expo/dom").DOMProps;
  platform: "web" | "ios" | "android" | "windows" | "macos" | "linux";
  onMessage: (message: Message) => void;
  messages: Message[];
  onConnectionChange?: (connected: boolean) => void;
  onConnectionStatusChange?: (status: 'disconnected' | 'connecting' | 'connected') => void;
  onListeningChange?: (listening: boolean) => void;
  requestMicrophonePermission: () => Promise<boolean>;
}

export interface ConvAiComponentRef {
  sendTextMessage: (text: string) => Promise<void>;
}

const ConvAiComponent = forwardRef<ConvAiComponentRef, ConvAiComponentProps>(({
  platform,
  onMessage,
  messages,
  onConnectionChange,
  onConnectionStatusChange,
  onListeningChange,
  requestMicrophonePermission,
}, ref) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [isListening, setIsListening] = useState(false);
  

  useEffect(() => {
    // Reset animations on mount
    if (messages && messages[messages.length - 1]?.type === "text") {
      sendTextMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      onConnectionChange?.(true);
      onConnectionStatusChange?.('connected');

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Start glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();

    },

    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      onConnectionChange?.(false);
      onConnectionStatusChange?.('disconnected');
      onListeningChange?.(false);
      setIsListening(false);

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      // Stop animations
      glowAnim.stopAnimation();
      pulseAnim.stopAnimation();
      glowAnim.setValue(0);
      pulseAnim.setValue(1);
    },

    onMessage: (message) => {
      console.log("ElevenLabs message:", message);

      // Handle different message types from ElevenLabs
      let processedMessage: Message;

      if (message.source === 'user') {
        // User's spoken message
        processedMessage = {
          role: 'user',
          content: message.user_transcript || message.message || '',
          timestamp: Date.now(),
        };
      } else if (message.source === 'ai') {
        // Agent's response
        processedMessage = {
          role: 'assistant',
          content: message.message || '',
          timestamp: Date.now(),
        };
      } else {
        // Fallback for other message types
        processedMessage = {
          role: message.source || 'assistant',
          content: message.content || message.message || message.text || '',
          timestamp: Date.now(),
        };
      }

      if (processedMessage.content.trim()) {
        onMessage(processedMessage);
      }

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },

    onModeChange: (mode) => {
      console.log("Mode changed:", mode);
      const listening = mode?.mode === 'listening';
      setIsListening(listening);
      onListeningChange?.(listening);

      if (listening) {
        // Start pulse animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();

        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } else {
        // Stop pulse animation
        pulseAnim.stopAnimation();
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },

    onError: (error) => {
      console.error("ElevenLabs error:", error);
      onConnectionStatusChange?.('disconnected');

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
  });

  // Workaround for text messages using Web Speech API
  const sendTextMessage = useCallback(async (text: string) => {
    if (!text.trim()) {
      console.log("Cannot send empty message");
      return;
    }

    if (conversation.status !== "connected") {
      // try {
      //   await startConversation(true);
      // } catch (error) {

      //   console.log("Cannot send message - not connected. Status:", conversation.status);
      //   throw new Error("Not connected to voice service");
      // }

      console.log("Cannot send message - not connected. Status:", conversation.status);
        throw new Error("Not connected to voice service");
    }

    try {
      console.log("Sending text message:", text);

      // Add the user message to the chat immediately
      await onMessage({
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      });

      await conversation.sendUserMessage(text.trim());

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error("Failed to send text message:", error);

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      throw error;
    }
  }, [conversation, onMessage]);

  // Expose sendTextMessage method to parent (with limitations)
  // useImperativeHandle(ref, () => ({
  //   sendTextMessage,
  // }), [sendTextMessage, conversation.status !== "connected"]);

  const startConversation = useCallback(async (textOnly = false) => {
    
    try {
      console.log("Starting ElevenLabs conversation");
      onConnectionStatusChange?.('connecting');

      // Request microphone permission first
      // const hasPermission = await requestMicrophonePermission();
      // if (!hasPermission) {
      //   console.error("Microphone permission denied");
      //   onConnectionStatusChange?.('disconnected');
      //   return;
      // }

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }


      await conversation.startSession({
        agentId: "agent_01k00djfnseh6bd03gyt8d5kgs", //test acc
        // agentId: "agent_01jycqn1p5ek9tjw0erc5r329g", //main acc
        dynamicVariables: {
          platform: platform,
          user_name: "Parth"
        },
        clientTools: {
          logMessage: async ({ message }) => {
            console.log("Tool message:", message);
          },
        },
        // textOnly: true, // Allow text-only mode
      });



    } catch (error) {
      console.error("Failed to start conversation:", error);
      onConnectionStatusChange?.('disconnected');

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [conversation, requestMicrophonePermission, onConnectionStatusChange]);

  const stopConversation = useCallback(async () => {
    try {
      console.log("Stopping ElevenLabs conversation");
      onConnectionStatusChange?.('disconnected');

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      await conversation.endSession();
    } catch (error) {
      console.error("Failed to stop conversation:", error);
    }
  }, [conversation, onConnectionStatusChange]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isConnected = conversation.status === "connected";
  const isDisconnected = conversation.status === "disconnected";

  // Debug logging
  useEffect(() => {
    console.log("ConvAI conversation status:", conversation.status);
  }, [conversation.status]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glowContainer,
          {
            opacity: glowAnim,
            transform: [{ scale: pulseAnim }],
          }
        ]}
      >
        <View style={[styles.glowRing, isListening && styles.glowRingListening]} />
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Pressable
          style={[
            styles.callButton,
            isConnected && styles.callButtonConnected,
            isListening && styles.callButtonListening,
          ]}
          onPress={isDisconnected ? startConversation : stopConversation}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View
            style={[
              styles.buttonInner,
              isConnected && styles.buttonInnerConnected,
              isListening && styles.buttonInnerListening,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]}
          >
            {isConnected ? (
              isListening ? (
                <Mic size={24} color="#FFFFFF" strokeWidth={2.5} />
              ) : (
                <PhoneOff size={24} color="#FFFFFF" strokeWidth={2.5} />
              )
            ) : (
              <Phone size={24} color="#FFFFFF" strokeWidth={2.5} />
            )}
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 55,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  glowRingListening: {
    borderColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  buttonContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  callButtonConnected: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)', // Red background when connected
    borderColor: '#DC3545', // Red border when connected
  },
  callButtonListening: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)', // Slightly more opaque red when listening
    borderColor: '#DC3545',
  },
  buttonInner: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonInnerConnected: {
    backgroundColor: '#DC3545', // Red button when connected
  },
  buttonInnerListening: {
    backgroundColor: '#DC3545', // Red button when listening
    shadowColor: '#DC3545',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});

export default ConvAiComponent;