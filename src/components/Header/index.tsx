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

  console.log('🎨 Header renderizado:', title, '| isDark:', isDark);

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.leftContainer}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.primary }]}>← Voltar</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text>
      
      <TouchableOpacity 
        onPress={() => {
          console.log('🌙 Botão de tema clicado! isDark atual:', isDark);
          toggleTheme();
        }} 
        style={styles.themeButton}
        activeOpacity={0.7}
      >
        <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
    </View>
  );
}