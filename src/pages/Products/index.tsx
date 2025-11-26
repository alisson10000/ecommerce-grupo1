import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import ProductCard from "../../components/ProductCard";
import { getProducts, Product } from "../../api/products";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "HomeTabs">;

export default function Products({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
           onPress={() => navigation.navigate("ProductDetails", { productId: String(item.id) })}
          />
        )}
      />
    </View>
  );
}
