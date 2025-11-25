import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendMessageToIA } from '../../api/chatbotApi';

export const MESSAGE_STORAGE_KEY = '@ChatHistory:v1';
export const SENDER = {
  USER: 'user',
  BOT: 'bot',
  TYPING: 'typing',
};

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBotTyping, setIsBotTyping] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await AsyncStorage.getItem(MESSAGE_STORAGE_KEY);
        if (history) {
          const parsedHistory = JSON.parse(history).map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(parsedHistory);
        }
      } catch (error) {
        console.error("AsyncStorage Load Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    const saveHistory = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
          console.error("AsyncStorage Save Error:", error);
        }
      }
    };
    saveHistory();
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || isBotTyping) return;

    const userMessage = {
      id: Date.now().toString() + SENDER.USER,
      text: userText.trim(),
      sender: SENDER.USER,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsBotTyping(true); 

    try {
      const botReplyText = await sendMessageToIA(userText.trim());

      const botMessage = {
        id: Date.now().toString() + SENDER.BOT,
        text: botReplyText,
        sender: SENDER.BOT,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (e) {
      const errorMessage = {
        id: Date.now().toString() + 'error',
        text: "Falha de comunicação com a IA. Por favor, cheque sua conexão.",
        sender: SENDER.BOT,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsBotTyping(false); 
    }
  }, [isBotTyping]);

  return (
    <ChatContext.Provider value={{
      messages,
      sendMessage,
      isBotTyping,
      isLoading,
      SENDER
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
};