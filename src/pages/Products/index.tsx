import React, { useEffect, useState, useMemo } from "react";
import { View, FlatList, TextInput, Text, TouchableOpacity } from "react-native";
import ProductCard from "../../components/ProductCard";
import { getProducts, Product } from "../../api/products";
import styles from "./styles";

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
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
    return uniqueCategories.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesName = product.title
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === null || product.category === selectedCategory;

      return matchesName && matchesCategory;
    });
  }, [products, searchText, selectedCategory]);

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(
      selectedCategory === category ? null : category
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />

        {categories.length > 0 && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Categorias:</Text>
            <View style={styles.categoryButtons}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === null && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === null &&
                      styles.categoryButtonTextActive
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive
                  ]}
                  onPress={() => handleCategoryPress(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category &&
                        styles.categoryButtonTextActive
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
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
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum produto encontrado com os filtros selecionados.
          </Text>
        </View>
      )}
    </View>
  );
}
