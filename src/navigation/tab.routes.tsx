import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../hooks/useTheme";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Cart from "../pages/Cart";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Products" component={Products} options={{ tabBarLabel: 'Produtos' }} />
      <Tab.Screen name="Cart" component={Cart} options={{ tabBarLabel: 'Carrinho' }} />
    </Tab.Navigator>
  );
}
