import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SENDER } from '../../context/ChatContext';
import { styles } from './styles';

 export const ChatMessage = ({ message }) => {
  const isUser = message.sender === SENDER.USER;
  const isTyping = message.sender === SENDER.TYPING;
  
  if (isTyping) {
    return (
      <View style={styles.typingContainer}>
        <ActivityIndicator size="small" color="#606060" />
        <Text style={styles.typingText}>A IA está digitando...</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userContainer : styles.botContainer,
      { alignSelf: isUser ? 'flex-end' : 'flex-start' }
    ]}>
      <Text style={isUser ? styles.userText : styles.botText}>
        {message.text}
      </Text>
    </View>
  );
};
