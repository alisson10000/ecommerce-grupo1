import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import { ChatBot } from "../pages/ChatBot";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Products" component={Products} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="ChatBot" component={ChatBot} />
    </Tab.Navigator>
  );
}
