import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ProductCard from "../../components/ProductCard";
import { getProducts, Product } from "../../api/products";
import { api } from "../../api/api";
import styles from "./styles";
import NovoProduto from "../NovoProduto";
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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalNovoProduto, setMostrarModalNovoProduto] = useState(false);
  const [mostrarModalCategorias, setMostrarModalCategorias] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [loadingMore, setLoadingMore] = useState(false);

  const loadProducts = async (shouldSpin = true) => {
    try {
      if (shouldSpin) setLoading(true);
      setError(null);

      const data = await getProducts();

      const normalizedData = data.map((product) => ({
        ...product,
        foto: product.foto
          ? product.foto.replace(
            /http:\/\/localhost:8080/g,
            api.defaults.baseURL || "http://192.168.100.5:8080"
          )
          : `${api.defaults.baseURL || "http://192.168.100.5:8080"}/uploads/produtos/${product.id}.jpg`,
      }));

      setProducts(normalizedData);
    } catch (err: any) {
      const msg =
        err.message ||
        "Erro ao carregar produtos. Verifique se a API está rodando.";
      setError(msg);
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        loadProducts(products.length === 0);
      }, 300);
      return () => clearTimeout(timer);
    }, [products.length])
  );

  const categories = useMemo(() => {
    const map = new Map<number, { id: number; nome: string }>();
    products.forEach((p) => {
      if (p.categoria && !map.has(p.categoria.id)) {
        map.set(p.categoria.id, p.categoria);
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesName = product.nome
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === null ||
        product.categoria?.id === selectedCategory;

      return matchesName && matchesCategory;
    });
  }, [products, searchText, selectedCategory]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, (currentPage + 1) * itemsPerPage);
  }, [filteredProducts, currentPage]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setLoadingMore(false);
      }, 300);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText, selectedCategory]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#2a9d8f" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadProducts(true)}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botaoNovoProduto}
        onPress={() => setMostrarModalNovoProduto(true)}
      >
        <Text style={styles.botaoNovoProdutoTexto}>+ Novo Produto</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          value={searchText}
          onChangeText={setSearchText}
        />

        {categories.length > 0 && (
          <TouchableOpacity
            style={styles.categorySelectorButton}
            onPress={() => setMostrarModalCategorias(true)}
          >
            <Text style={styles.categorySelectorButtonText}>
              {selectedCategory === null
                ? "Todas as categorias"
                : categories.find((c) => c.id === selectedCategory)?.nome}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={paginatedProducts}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard
            product={{
              id: item.id,
              title: item.nome,
              price: item.preco,
              image: item.foto || "https://via.placeholder.com/150",
              description: item.descricao,
              category: item.categoria?.nome,
            }}
            onPress={() =>
              navigation.navigate("ProductDetails", {
                productId: String(item.id),
              })
            }
          />
        )}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#2a9d8f" />
          ) : null
        }
      />

      <NovoProduto
        navigation={navigation}
        visivel={mostrarModalNovoProduto}
        aoFechar={() => setMostrarModalNovoProduto(false)}
        aoProdutoCriado={loadProducts}
      />

      <Modal visible={mostrarModalCategorias} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Categoria</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setMostrarModalCategorias(false)}
              >
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <TouchableOpacity
                style={[
                  styles.modalCategoryItem,
                  selectedCategory === null && styles.modalCategoryItemActive
                ]}
                onPress={() => {
                  setSelectedCategory(null);
                  setMostrarModalCategorias(false);
                }}
              >
                <Text
                  style={[
                    styles.modalCategoryItemText,
                    selectedCategory === null && styles.modalCategoryItemTextActive
                  ]}
                >
                  Todas as categorias
                </Text>
                {selectedCategory === null && (
                  <Text style={styles.modalCategoryItemCheck}>✓</Text>
                )}
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.modalCategoryItem,
                    selectedCategory === cat.id && styles.modalCategoryItemActive
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    setMostrarModalCategorias(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalCategoryItemText,
                      selectedCategory === cat.id && styles.modalCategoryItemTextActive
                    ]}
                  >
                    {cat.nome}
                  </Text>
                  {selectedCategory === cat.id && (
                    <Text style={styles.modalCategoryItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
