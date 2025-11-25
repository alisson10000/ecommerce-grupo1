import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import styles from './styles';

interface LoaderProps {
  text?: string;
}

export default function Loader({ text }: LoaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
      {text && <Text style={[styles.text, { color: theme.text }]}>{text}</Text>}
    </View>
  );
}