import React, { useEffect, useState, useMemo } from "react";
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
  RefreshControl
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ProductCard from "../../components/ProductCard";
import { getProducts, Product } from "../../api/products";
import { api } from "../../api/api";
import styles from "./styles";

import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList, RootTabParamList } from "../../navigation/types";
import NovoProduto from "../NovoProduto";

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
  const [itemsPerPage] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadProducts = async (shouldSpin = true) => {
    try {
      if (shouldSpin) setLoading(true);
      setError(null);
      const data = await getProducts();

      const normalizedData = data.map(product => ({
        ...product,
        foto: product.foto
          ? product.foto.replace(/http:\/\/localhost:8080/g, api.defaults.baseURL || 'http://192.168.100.5:8080')
          : `${api.defaults.baseURL || 'http://192.168.100.5:8080'}/uploads/produtos/${product.id}.jpg`
      }));

      setProducts(normalizedData);
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao carregar produtos. Verifique se a API está rodando em http://localhost:8080";
      setError(errorMessage);
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadProducts(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Tela de produtos recebeu foco - recarregando produtos...");
      const timer = setTimeout(() => {
        loadProducts(products.length === 0);
      }, 300);

      return () => clearTimeout(timer);
    }, [products.length])
  );
  const categories = useMemo(() => {
    const categoryMap = new Map<number, { id: number; nome: string }>();

    products.forEach((product) => {
      if (product.categoria) {
        const cat = product.categoria;
        if (!categoryMap.has(cat.id)) {
          categoryMap.set(cat.id, cat);
        }
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesName = product.nome
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === null || product.categoria?.id === selectedCategory;

      return matchesName && matchesCategory;
    });
  }, [products, searchText, selectedCategory]);

  const paginatedProducts = useMemo(() => {
    const startIndex = 0;
    const endIndex = (currentPage + 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
      }, 300);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText, selectedCategory]);

  const handleCategoryPress = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setMostrarModalCategorias(false);
  };

  const handleProdutoCriado = () => {
    loadProducts();
  };

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
          placeholderTextColor="#999"
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
                : categories.find(cat => cat.id === selectedCategory)?.nome || "Selecionar categoria"}
            </Text>
            <Text style={styles.categorySelectorIcon}>▼</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={mostrarModalCategorias}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMostrarModalCategorias(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Categoria</Text>
              <TouchableOpacity
                onPress={() => setMostrarModalCategorias(false)}
                style={styles.modalCloseButton}
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
                onPress={() => handleCategoryPress(null)}
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

              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalCategoryItem,
                    selectedCategory === category.id && styles.modalCategoryItemActive
                  ]}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <Text
                    style={[
                      styles.modalCategoryItemText,
                      selectedCategory === category.id && styles.modalCategoryItemTextActive
                    ]}
                  >
                    {category.nome}
                  </Text>
                  {selectedCategory === category.id && (
                    <Text style={styles.modalCategoryItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {filteredProducts.length > 0 ? (
        <FlatList
          data={paginatedProducts}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2a9d8f"]}
              tintColor="#2a9d8f"
            />
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
                navigation.navigate("ProductDetails", { product: item })
              }
            />
          )}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => {
            if (!loadingMore) return null;
            return (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#2a9d8f" />
                <Text style={styles.footerLoaderText}>Carregando mais produtos...</Text>
              </View>
            );
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {error
              ? error
              : "Nenhum produto encontrado com os filtros selecionados."}
          </Text>
        </View>
      )}

      <NovoProduto
        navigation={navigation}
        visivel={mostrarModalNovoProduto}
        aoFechar={() => setMostrarModalNovoProduto(false)}
        aoProdutoCriado={handleProdutoCriado}
      />
    </View>
  );
}
