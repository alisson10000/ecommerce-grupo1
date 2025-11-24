import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useCart } from "../../context/CartContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import styles from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetails">;

export default function ProductDetails({ route, navigation }: Props) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(product);
      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        <View style={styles.contentContainer}>
          {product.category && (
            <Text style={styles.category}>{product.category}</Text>
          )}

          <Text style={styles.title}>{product.title}</Text>

          <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>

          <Text style={styles.descriptionTitle}>Descrição</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.addButton, isAdding && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Adicionar ao Carrinho</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
