import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import styles from './styles';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({ title, showBackButton, onBackPress }: HeaderProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>← Voltar</Text>
        </TouchableOpacity>
      )}
      
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      
      <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
        <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
    </View>
  );
}