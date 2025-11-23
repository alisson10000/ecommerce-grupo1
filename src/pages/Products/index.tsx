import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import ProductCard from "../../components/ProductCard";
import { getProducts, Product } from "../../api/products";

import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList, RootTabParamList } from "../../navigation/types";

type ProductsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "Products">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: ProductsScreenNavigationProp;
};

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
            onPress={() =>
              navigation.navigate("ProductDetails", { product: item })
            }
          />
        )}
      />
    </View>
  );
}
