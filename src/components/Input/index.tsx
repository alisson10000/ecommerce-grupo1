import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import styles from './styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...rest }: InputProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: theme.card, 
            color: theme.text,
            borderColor: error ? theme.error : theme.border 
          }
        ]}
        placeholderTextColor={theme.textSecondary}
        {...rest}
      />
      
      {error && <Text style={[styles.error, { color: theme.error }]}>{error}</Text>}
    </View>
  );
}