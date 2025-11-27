import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Platform
} from "react-native";
import { useCart } from "../../context/CartContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { deleteProduct, getProductById, Product } from "../../api/products";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import EditarProduto from "../EditarProduto";
import { api } from "../../api/api";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetails">;

function normalizeImageUrl(url: string | null | undefined, productId: number): string {
  const baseURL = api.defaults.baseURL || 'http://192.168.100.5:8080';

  if (!url || url.trim() === '') {
    return `${baseURL}/imagens/${productId}.jpg?t=${Date.now()}`;
  }

  let normalizedUrl = url;
  if (url.includes('localhost:8080')) {
    normalizedUrl = url.replace(/http:\/\/localhost:8080/g, baseURL);
  }

  if (normalizedUrl.startsWith('/')) {
    normalizedUrl = `${baseURL}${normalizedUrl}`;
  }

  if (!normalizedUrl.includes('?')) {
    normalizedUrl = `${normalizedUrl}?t=${Date.now()}`;
  } else if (!normalizedUrl.includes('t=')) {
    normalizedUrl = `${normalizedUrl}&t=${Date.now()}`;
  }

  return normalizedUrl;
}

export default function ProductDetails({ route }: Props) {
  const { productId } = route.params;
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { addToCart } = useCart();
  const navigation = useNavigation();
  const [isAdding, setIsAdding] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [productNameInput, setProductNameInput] = React.useState("");
  const [imageError, setImageError] = React.useState(false);
  const [imageKey, setImageKey] = React.useState(0);
  const [imageSource, setImageSource] = React.useState<{ uri: string } | null>(null);

  React.useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await getProductById(Number(productId));

        // Normalize image URL
        const normalizedProduct = {
          ...productData,
          foto: normalizeImageUrl(productData.foto, productData.id)
        };

        setProduct(normalizedProduct);
      } catch (err: any) {
        const msg = err.message || "Erro ao carregar produto.";
        setError(msg);
        Alert.alert("Erro", msg);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    try {
      addToCart({
        id: product.id,
        title: product.nome,
        price: product.preco,
        image: product.foto || "https://via.placeholder.com/150",
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeletePress = () => {
    if (!product) return;

    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o produto "${product.nome}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sim, excluir",
          style: "destructive",
          onPress: () => {
            setShowConfirmModal(true);
          }
        }
      ]
    );
  };

  const handleConfirmDelete = async () => {
    if (!product) return;

    if (productNameInput.trim() !== product.nome.trim()) {
      Alert.alert(
        "Nome incorreto",
        "O nome digitado não corresponde ao nome do produto. Por favor, digite o nome exato do produto para confirmar a exclusão."
      );
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      Alert.alert(
        "Sucesso",
        "Produto excluído com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error: any) {
      console.error("Erro ao excluir produto:", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível excluir o produto. Tente novamente."
      );
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
      setProductNameInput("");
    }
  };

  const handleProdutoEditado = async () => {
    if (!product) return;

    try {
      console.log("=== ATUALIZANDO PRODUTO APÓS EDIÇÃO ===");

      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("Buscando produto atualizado, ID:", product.id);
      const response = await api.get(`/produtos/${product.id}`);
      const produtoBruto = response.data;

      console.log("=== DADOS BRUTOS DA API ===");
      console.log("Produto completo:", JSON.stringify(produtoBruto, null, 2));
      console.log("Campo foto do backend:", produtoBruto.foto);

      const produtoAtualizado = await getProductById(product.id);

      console.log("=== DADOS NORMALIZADOS ===");
      console.log("URL da foto normalizada:", produtoAtualizado.foto);

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);

      const fotoBase = produtoAtualizado.foto || normalizeImageUrl(produtoBruto.foto, product.id);

      const fotoSemQuery = fotoBase.split('?')[0];
      const fotoAtualizada = `${fotoSemQuery}?t=${timestamp}&v=${random}`;

      console.log("URL da foto final:", fotoAtualizada);

      setProduct({
        ...produtoAtualizado,
        foto: fotoAtualizada
      });

      setImageError(false);

      setImageKey(prev => prev + 1);

      setTimeout(() => {
        setImageKey(prev => prev + 1);
      }, 500);

      console.log("Produto atualizado no estado local");
    } catch (error: any) {
      console.error("=== ERRO AO ATUALIZAR PRODUTO ===");
      console.error("Erro completo:", error);
      console.error("Response:", error.response?.data);

      Alert.alert(
        "Aviso",
        "Produto atualizado, mas não foi possível recarregar os dados.\n\nTente fechar e abrir novamente a tela de detalhes."
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2a9d8f" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando produto...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: '#e63946', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
          {error || "Produto não encontrado"}
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: '#2a9d8f', padding: 15, borderRadius: 8 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasStock = (product.quantidadeEstoque ?? 0) > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image
              key={`product-image-${product.id}-${imageKey}`}
              source={imageSource}
              style={styles.image}
              onError={(error) => {
                console.log("Erro ao carregar imagem:", imageSource.uri);
                setImageError(true);
              }}
              onLoad={() => {
                console.log("Imagem carregada:", imageSource.uri);
                setImageError(false);
              }}
            />
          ) : (
            <Image
              key={`product-image-${product.id}-${imageKey}`}
              source={{
                uri: imageError
                  ? "https://via.placeholder.com/150"
                  : product.foto || "https://via.placeholder.com/150"
              }}
              style={styles.image}
              onError={(error) => {
                console.log("Erro ao carregar imagem:", product.foto);
                setImageError(true);
              }}
              onLoad={() => {
                console.log("Imagem carregada:", product.foto);
                setImageError(false);
              }}
            />
          )}
        </View>

        <View style={styles.contentContainer}>
          {product.categoria && (
            <Text style={styles.category}>{product.categoria.nome}</Text>
          )}

          <Text style={styles.title}>{product.nome}</Text>

          <Text style={styles.price}>
            R$ {product.preco.toFixed(2).replace(".", ",")}
          </Text>

          {product.quantidadeEstoque !== undefined && (
            <Text style={styles.stock}>
              Estoque: {product.quantidadeEstoque} unidades
            </Text>
          )}

          <Text style={styles.descriptionTitle}>Descrição</Text>
          <Text style={styles.description}>{product.descricao}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.addButton, !hasStock && styles.addButtonDisabled, styles.addButtonFlex]}
            onPress={handleAddToCart}
            disabled={isAdding || !hasStock}
          >
            {isAdding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>
                {hasStock ? "Adicionar ao Carrinho" : "Produto Indisponível"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePress}
            disabled={isDeleting}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <EditarProduto
        visivel={showEditModal}
        aoFechar={() => setShowEditModal(false)}
        aoProdutoEditado={handleProdutoEditado}
        produto={product}
      />

      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowConfirmModal(false);
          setProductNameInput("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalMessage}>
              Para confirmar a exclusão, digite o nome do produto:
            </Text>
            <Text style={styles.modalProductName}>"{product.nome}"</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Digite o nome do produto"
              value={productNameInput}
              onChangeText={setProductNameInput}
              autoCapitalize="words"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowConfirmModal(false);
                  setProductNameInput("");
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonConfirmText}>Confirmar Exclusão</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
