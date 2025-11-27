import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function ProductCard({ product, onPress }) {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {!imageError ? (
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={[styles.image, { backgroundColor: "#ddd", justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ color: "#999" }}>Sem imagem</Text>
        </View>
      )}

      <Text numberOfLines={1} style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>R$ {product.price?.toFixed(2).replace(".", ",")}</Text>
    </TouchableOpacity>
  );
}
