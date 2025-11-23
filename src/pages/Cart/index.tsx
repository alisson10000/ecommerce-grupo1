import React from "react";
import { View, Text, FlatList } from "react-native";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { cart } = useCart();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Carrinho</Text>

      <FlatList
        data={cart}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 10 }}>{item.title} — R$ {item.price}</Text>
        )}
      />
    </View>
  );
}
