import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text numberOfLines={1} style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>R$ {product.price}</Text>
    </TouchableOpacity>
  );
}
