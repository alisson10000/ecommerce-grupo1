import React from "react";
import { StatusBar } from "expo-status-bar";
import { Routes } from "./src/navigation";
import { CartProvider } from "./src/context/CartContext";
import { AuthProvider } from "./src/context/AuthContext";
import { ChatProvider } from "./src/context/ChatContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { ClienteProvider } from "./src/context/ClienteContext";

export default function App() {
  return (

    <ThemeProvider> {/* AGORA ENVOLVE TUDO */}
      <ClienteProvider>
        <AuthProvider>
          <ChatProvider>
            <CartProvider>
              <StatusBar style="light" translucent />
              <Routes />
            </CartProvider>
          </ChatProvider>
        </AuthProvider>
      </ClienteProvider>
    </ThemeProvider>
  );
}
