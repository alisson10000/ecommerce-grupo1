import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../pages/Login";
import TabRoutes from "./tab.routes";
import ProductDetails from "../pages/ProductsDetails";
import Payment from "../pages/Payment";
import Clientes from "../pages/Clientes";
import BackupClientes from "../pages/BackupClientes";
import { RootStackParamList } from "./types";

const Stack: any = createNativeStackNavigator<RootStackParamList>();

export default function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="HomeTabs" component={TabRoutes} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Clientes" component={Clientes} />
      <Stack.Screen name="BackupClientes" component={BackupClientes} />
    </Stack.Navigator>
  );
}