import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation }: Props) {
  const { login } = useAuth();

  function handleLogin() {
    login("alisson@email.com");
    navigation.replace("HomeTabs");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22 }}>E-commerce Login</Text>
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
