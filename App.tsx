import React from "react";
import { StatusBar } from "expo-status-bar";
import { Routes } from "./src/navigation";
import { CartProvider } from "./src/context/CartContext";
import { AuthProvider } from "./src/context/AuthContext";
import { ChatProvider } from "./src/context/ChatContext";
import { ThemeProvider } from "./src/context/ThemeContext"; // ADICIONE ISSO

export default function App() {
  return (
    <ThemeProvider> {/* AGORA ENVOLVE TUDO */}
      <AuthProvider>
        <ChatProvider>
          <CartProvider>
            <StatusBar style="light" translucent />
            <Routes />
          </CartProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
