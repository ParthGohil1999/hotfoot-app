import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User, Bot, Volume2, Mic, MessageCircle, Phone } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  interpolate,
  withTiming,
} from 'react-native-reanimated';

export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  type?: 'text' | 'voice' | 'user_transcript' | 'agent_response' | 'audio';
}

interface ChatMessageProps {
  message: Message;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  
  const isUser = message?.role === 'user';
  const isVoiceMessage = message.type === 'voice' || message.type === 'user_transcript' || message.type === 'agent_response' || message.type === 'audio';
  
  // Animation values
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    // Staggered entrance animation
    const delay = Math.min(index * 80, 300);
    
    translateY.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 120 }));
    opacity.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 120 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 120 }));
  }, [index]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });

  const getMessageIcon = () => {
    if (isUser) {
      return isVoiceMessage ? (
        <Mic size={14} color="#FFFFFF" strokeWidth={2} />
      ) : (
        <MessageCircle size={14} color="#FFFFFF" strokeWidth={2} />
      );
    } else {
      return isVoiceMessage ? (
        <Volume2 size={14} color="#FFFFFF" strokeWidth={2} />
      ) : (
        <Bot size={14} color="#FFFFFF" strokeWidth={2} />
      );
    }
  };

  const getMessageStyle = () => {
    if (isUser) {
      return isVoiceMessage ? styles.userVoiceMessage : styles.userMessage;
    } else {
      return isVoiceMessage ? styles.assistantVoiceMessage : styles.assistantMessage;
    }
  };

  const getContainerStyle = () => {
    return isUser ? styles.userContainer : styles.assistantContainer;
  };

  const getMessageTypeLabel = () => {
    if (!isVoiceMessage) return null;
    
    switch (message.type) {
      case 'user_transcript':
        return 'Voice';
      case 'agent_response':
        return 'Audio';
      case 'voice':
        return 'Voice';
      case 'audio':
        return 'Audio';
      default:
        return 'Voice';
    }
  };

  return (
    <Animated.View style={[styles.messageContainer, getContainerStyle(), containerAnimatedStyle]}>
      <View style={styles.messageContent}>
        <View style={[styles.messageBubble, getMessageStyle()]}>
          <View style={styles.messageHeader}>
            <View style={styles.iconContainer}>
              {getMessageIcon()}
            </View>
            <Text style={styles.roleText}>
              {isUser ? 'You' : 'Assistant'}
            </Text>
            {isVoiceMessage && (
              <View style={styles.typeIndicator}>
                <Text style={styles.typeLabel}>
                  {getMessageTypeLabel()}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.messageText}>{message.content}</Text>
          
          {message.timestamp && (
            <Text style={styles.timestampText}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 6,
    paddingHorizontal: 20,
    position: 'relative',
  },
  userContainer: {
    alignItems: 'flex-end',
    
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  messageContent: {
    maxWidth: '85%',
    position: 'relative',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessage: {
    backgroundColor: '#2D2D2D',
    borderTopRightRadius: 8,
    minWidth: 100,
  },
  assistantMessage: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    minWidth: 200,
  },
  userVoiceMessage: {
    backgroundColor: '#4A4A4A',
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  assistantVoiceMessage: {
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  roleText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  typeIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  messageText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  timestampText: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 6,
    textAlign: 'right',
  },
});