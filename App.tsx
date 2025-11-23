import React from "react";
import { StatusBar } from "expo-status-bar";
import { Routes } from "./src/navigation";
import { CartProvider } from "./src/context/CartContext";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="light" translucent />
        <Routes />
      </CartProvider>
    </AuthProvider>
  );
}
