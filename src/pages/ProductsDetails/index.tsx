import React from "react";
import { View, Text, Image, Button } from "react-native";
import { useCart } from "../../context/CartContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetails">;

export default function ProductDetails({ route }: Props) {
  const { product } = route.params;
  const { addToCart } = useCart();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Image
        source={{ uri: product.image }}
        style={{ width: "100%", height: 280, resizeMode: "contain" }}
      />

      <Text style={{ fontSize: 22, marginTop: 10 }}>{product.title}</Text>

      <Text style={{ marginTop: 10, fontSize: 18, color: "green" }}>
        R$ {product.price}
      </Text>

      <Button
        title="Adicionar ao carrinho"
        onPress={() => addToCart(product)}
      />
    </View>
  );
}
