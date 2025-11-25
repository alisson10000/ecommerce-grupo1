import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import { useChat, SENDER } from '../../context/ChatContext';
import {ChatMessage} from '../../components/ChatMessage';
import {styles} from './styles';

export const ChatBot = () => {
  const { messages, sendMessage, isBotTyping, isLoading } = useChat();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  
  const conversation = isBotTyping 
    ? [...messages, { id: 'typing', text: '', sender: SENDER.TYPING, timestamp: new Date() }] 
    : messages;

  useEffect(() => {
    if (flatListRef.current && conversation.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100); 
    }
  }, [conversation.length]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const renderMessage = ({ item }) => <ChatMessage message={item} />;
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.fullScreen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={conversation}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            multiline={true} 
            textAlignVertical="center" 
          />
          <TouchableOpacity 
            style={[styles.sendButton, (isBotTyping || !inputText.trim()) && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={isBotTyping || !inputText.trim()} 
          >
            <Text style={styles.sendButtonText}>Go</Text> 
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};