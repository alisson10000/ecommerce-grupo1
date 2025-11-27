import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../components/Header";

import Login from "../pages/Login";
import TabRoutes from "./tab.routes";
import ProductDetails from "../pages/ProductsDetails";
import Payment from "../pages/Payment";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackRoutes() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      
      <Stack.Screen name="HomeTabs" component={TabRoutes} />
      
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetails}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <Header 
              title="Detalhes do Produto" 
              showBackButton 
              onBackPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      
      <Stack.Screen 
        name="Payment" 
        component={Payment}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <Header 
              title="Pagamento" 
              showBackButton 
              onBackPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}