import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { useTheme } from "../hooks/useTheme";
import Header from "../components/Header";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import { ChatBot } from "../pages/ChatBot"; // ← CORRIGIDO: Import do ChatBot

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ size }) => <HomeIcon size={size} />,
          header: () => <Header title="Início" showBackButton={false} />,
        }}
      />
      
      <Tab.Screen 
        name="Products" 
        component={Products}
        options={{
          tabBarLabel: 'Produtos',
          tabBarIcon: ({ size }) => <ProductsIcon size={size} />,
          header: () => <Header title="Produtos" showBackButton={false} />,
        }}
      />
      
      <Tab.Screen 
        name="Cart" 
        component={Cart}
        options={{
          tabBarLabel: 'Carrinho',
          tabBarIcon: ({ size }) => <CartIcon size={size} />,
          header: () => <Header title="Carrinho" showBackButton={false} />,
        }}
      />
      
      {/* CORRIGIDO: Adicionado tabBarIcon e header */}
      <Tab.Screen
        name="ChatBot"
        component={ChatBot}
        options={{
          tabBarLabel: "Assistente",
          tabBarIcon: ({ size }) => <ChatIcon size={size} />, // ← ADICIONADO
          header: () => <Header title="Assistente IA" showBackButton={false} />, // ← ADICIONADO
        }}
      />
    </Tab.Navigator>
  );
}

// Ícones
const HomeIcon = ({ size }: { size: number }) => (
  <Text style={{ fontSize: size }}>🏠</Text>
);

const ProductsIcon = ({ size }: { size: number }) => (
  <Text style={{ fontSize: size }}>📦</Text>
);

const CartIcon = ({ size }: { size: number }) => (
  <Text style={{ fontSize: size }}>🛒</Text>
);

// CORRIGIDO: Ícone do chatbot agora tem emoji
const ChatIcon = ({ size }: { size: number }) => (
  <Text style={{ fontSize: size }}>🤖</Text>
);