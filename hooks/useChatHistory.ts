import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { ChatItem } from '../components/sidebar/Sidebar';
import { Message } from '../components/ConvAI/ChatMessage';

const CHAT_HISTORY_FILE = `${FileSystem.documentDirectory}chatHistory.json`;
const CHAT_MESSAGES_DIR = `${FileSystem.documentDirectory}chatMessages/`;

// Define message type
// export interface Message {
//   id: string;
//   text: string;
//   isUser: boolean;
//   timestamp: Date;
// }

export function useChatHistory() {
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | undefined>();
    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

    // Ensure messages directory exists
    const ensureMessagesDirExists = async () => {
        try {
            const dirInfo = await FileSystem.getInfoAsync(CHAT_MESSAGES_DIR);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(CHAT_MESSAGES_DIR, { intermediates: true });
            }
        } catch (error) {
            console.error('Error creating messages directory:', error);
        }
    };

    // Load chat history from file
    const loadChatHistory = async () => {
        try {
            const fileExists = await FileSystem.getInfoAsync(CHAT_HISTORY_FILE);
            if (fileExists.exists) {
                const fileContent = await FileSystem.readAsStringAsync(CHAT_HISTORY_FILE);
                const savedChats = JSON.parse(fileContent);

                // Convert timestamp strings back to Date objects
                const chatsWithDates = savedChats.map((chat: any) => ({
                    ...chat,
                    timestamp: new Date(chat.timestamp),
                }));

                setChats(chatsWithDates);

                // Set the most recent chat as current if no current chat is set
                if (chatsWithDates.length > 0 && !currentChatId) {
                    const mostRecentChat = chatsWithDates.reduce((prev: ChatItem, current: ChatItem) =>
                        prev.timestamp > current.timestamp ? prev : current
                    );
                    setCurrentChatId(mostRecentChat.id);
                    await loadChatMessages(mostRecentChat.id);
                }
            } else {
                // Initialize with empty array if no file exists
                setChats([]);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setChats([]);
        }
    };

    // Save chat history to file
    const saveChatHistory = async (updatedChats: ChatItem[]) => {
        try {
            const jsonData = JSON.stringify(updatedChats, null, 2);
            await FileSystem.writeAsStringAsync(CHAT_HISTORY_FILE, jsonData);
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    };

    // Load messages for a specific chat
    const loadChatMessages = async (chatId: string) => {
        try {
            await ensureMessagesDirExists();
            const messagesFile = `${CHAT_MESSAGES_DIR}${chatId}.json`;
            const fileExists = await FileSystem.getInfoAsync(messagesFile);

            if (fileExists.exists) {
                const fileContent = await FileSystem.readAsStringAsync(messagesFile);
                const savedMessages = JSON.parse(fileContent);

                console.log('savedMessages:', savedMessages);

                // Convert timestamp strings back to Date objects
                const messagesWithDates = savedMessages.map((message: any) => ({
                    ...message,
                    timestamp: new Date(message.timestamp),
                }));

                console.log(`Loaded ${messagesWithDates.length} messages for chat ${chatId}`);
                setCurrentMessages(messagesWithDates);
            } else {
                console.log(`No messages file found for chat ${chatId}`);
                setCurrentMessages([]);
            }
        } catch (error) {
            console.error('Error loading chat messages:', error);
            setCurrentMessages([]);
        }
    };

    // Save messages for a specific chat
    const saveChatMessages = async (chatId: string, messages: Message[]) => {
        try {
            await ensureMessagesDirExists();
            const messagesFile = `${CHAT_MESSAGES_DIR}${chatId}.json`;
            const jsonData = JSON.stringify(messages, null, 2);
            await FileSystem.writeAsStringAsync(messagesFile, jsonData);
        } catch (error) {
            console.error('Error saving chat messages:', error);
        }
    };

    useEffect(() => {
        loadChatHistory();
    }, []);

    // Save to file whenever chats change
    useEffect(() => {
        if (chats.length > 0) {
            saveChatHistory(chats);
        }
    }, [chats]);

    // Save messages whenever currentMessages change
    useEffect(() => {
        if (currentChatId && currentMessages.length > 0) {
            saveChatMessages(currentChatId, currentMessages);
        }
    }, [currentMessages]);

    const createNewChat = (title?: string) => {
        const newChat: ChatItem = {
            id: Date.now().toString(),
            title: title || 'New Chat',
            lastMessage: '',
            timestamp: new Date(),
            isActive: true,
        };

        setChats(prev => {
            const updated = prev.map(chat => ({ ...chat, isActive: false }));
            return [newChat, ...updated];
        });
        setCurrentChatId(newChat.id);
        setCurrentMessages([]); // Clear messages for new chat
        return newChat.id;
    };

    const selectChat = async (chatId: string) => {
        console.log(`Selecting chat: ${chatId}`);

        setChats(prev =>
            prev.map(chat => ({
                ...chat,
                isActive: chat.id === chatId,
            }))
        );
        setCurrentChatId(chatId);

        // Load messages for the selected chat
        await loadChatMessages(chatId);
    };

    const addMessage = (message: Message) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content: message.content,
            role: message.role,
            timestamp: message.timestamp,
        };

        console.log(`Adding message to chat ${currentChatId}:`, { text: newMessage.content.substring(0, 50), role: newMessage.role });
        setCurrentMessages(prev => [...prev, newMessage]);

        // Update chat's last message and title if it's still "New Chat"
        if (currentChatId) {
            updateChatLastMessage(currentChatId, newMessage.content);
        }

        return newMessage;
    };

    const updateChatLastMessage = (chatId: string, message: string) => {
        setChats(prev =>
            prev.map(chat =>
                chat.id === chatId
                    ? {
                        ...chat,
                        lastMessage: message,
                        timestamp: new Date(),
                        title: chat.title === 'New Chat' ?
                            (message.length > 30 ? message.substring(0, 30) + '...' : message) :
                            chat.title
                    }
                    : chat
            )
        );
    };

    const deleteChat = async (chatId: string) => {
        try {
            // Delete the messages file for this chat
            const messagesFile = `${CHAT_MESSAGES_DIR}${chatId}.json`;
            const fileExists = await FileSystem.getInfoAsync(messagesFile);
            if (fileExists.exists) {
                await FileSystem.deleteAsync(messagesFile);
            }
        } catch (error) {
            console.error('Error deleting chat messages file:', error);
        }

        setChats(prev => {
            const updatedChats = prev.filter(chat => chat.id !== chatId);

            // If we're deleting the current chat, select another one
            if (currentChatId === chatId) {
                if (updatedChats.length > 0) {
                    // Select the most recent remaining chat
                    const mostRecentChat = updatedChats.reduce((prev, current) =>
                        prev.timestamp > current.timestamp ? prev : current
                    );
                    setCurrentChatId(mostRecentChat.id);
                    loadChatMessages(mostRecentChat.id);
                } else {
                    setCurrentChatId(undefined);
                    setCurrentMessages([]);
                }
            }

            return updatedChats;
        });
    };

    const clearAllChats = async () => {
        try {
            // Delete chat history file
            await FileSystem.deleteAsync(CHAT_HISTORY_FILE);

            // Delete all message files
            const dirInfo = await FileSystem.getInfoAsync(CHAT_MESSAGES_DIR);
            if (dirInfo.exists) {
                await FileSystem.deleteAsync(CHAT_MESSAGES_DIR);
            }

            setChats([]);
            setCurrentChatId(undefined);
            setCurrentMessages([]);
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    };

    return {
        chats,
        currentChatId,
        currentMessages,
        createNewChat,
        selectChat,
        addMessage,
        updateChatLastMessage,
        deleteChat,
        clearAllChats,
    };
}