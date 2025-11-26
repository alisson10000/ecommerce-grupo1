import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { styles } from "./styles"; // 👈 Importação dos estilos

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { theme } = useTheme();
  const { login } = useAuth(); // Assume-se que 'login' é assíncrono e se comunica com a API

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha o e-mail e a senha.");
      return;
    }
    
    setLoading(true);

    try {
      // ⚠️ IMPORTANTE: Sua função login deve ser atualizada para aceitar email e senha e fazer a chamada à API.
      await login(email, password); 
      
      // Se o login for bem-sucedido, navega para a Home
      navigation.replace("HomeTabs");
    } catch (error) {
      // Exibe erro de autenticação
      Alert.alert("Erro de Login", "Falha na autenticação. E-mail ou senha inválidos.");
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primary }]}>
        PDV Login
      </Text>
      
      {/* Campo de E-mail */}
      <TextInput
        style={[
          styles.input, 
          { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }
        ]}
        placeholder="E-mail"
        placeholderTextColor={theme.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      
      {/* Campo de Senha */}
      <TextInput
        style={[
          styles.input, 
          { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }
        ]}
        placeholder="Senha"
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      
      {/* Botão de Login */}
      <Button 
        title={loading ? "Conectando..." : "Entrar"}
        onPress={handleLogin} 
        disabled={loading}
        color={theme.primary}
      />
      
      {/* Indicador de Loading */}
      {loading && (
        <ActivityIndicator 
          style={styles.activityIndicator} 
          size="large" 
          color={theme.primary} 
        />
      )}
    </View>
  );
}