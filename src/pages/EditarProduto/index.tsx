import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateProduct, getCategories, CategoriaDTO, uploadProductImage, Product, getProductById } from "../../api/products";
import estilos from "./styles";
import { api } from "../../api/api";

type Props = {
  visivel: boolean;
  aoFechar: () => void;
  aoProdutoEditado: () => void;
  produto: Product;
};

export default function EditarProduto({
  visivel,
  aoFechar,
  aoProdutoEditado,
  produto,
}: Props) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [imagemAlterada, setImagemAlterada] = useState(false);
  const [imagemOriginalUri, setImagemOriginalUri] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageKey, setImageKey] = React.useState(0);

  useEffect(() => {
    if (visivel && produto) {

      setNome(produto.nome || "");
      setDescricao(produto.descricao || "");
      setPreco(produto.preco?.toString() || "");
      setQuantidadeEstoque(produto.quantidadeEstoque?.toString() || "");
      setCategoriaId(produto.categoria?.id || null);
      setImagemUri(produto.foto || null);
      setImagemOriginalUri(produto.foto || null);
      setImagemAlterada(false);
      carregarCategorias();
      solicitarPermissaoImagem();
    }
  }, [visivel, produto]);

  const solicitarPermissaoImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para acessar suas fotos!'
      );
    }
  };

  const selecionarImagem = async () => {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets[0]) {
        console.log("Imagem selecionada:", resultado.assets[0].uri);
        setImagemUri(resultado.assets[0].uri);
        setImagemAlterada(true);
      }
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível selecionar a imagem");
      console.error(erro);
    }
  };

  const carregarCategorias = async () => {
    try {
      setCarregandoCategorias(true);
      const dados = await getCategories();
      setCategorias(dados);
    } catch (erro: any) {
      Alert.alert("Erro", "Não foi possível carregar as categorias");
      console.error(erro);
    } finally {
      setCarregandoCategorias(false);
    }
  };

  const validarFormulario = (): boolean => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O nome do produto é obrigatório");
      return false;
    }
    if (!descricao.trim()) {
      Alert.alert("Erro", "A descrição do produto é obrigatória");
      return false;
    }
    const precoNum = parseFloat(preco);
    if (isNaN(precoNum) || precoNum <= 0) {
      Alert.alert("Erro", "O preço deve ser um número maior que zero");
      return false;
    }
    const quantidadeNum = parseInt(quantidadeEstoque);
    if (isNaN(quantidadeNum) || quantidadeNum < 0) {
      Alert.alert("Erro", "A quantidade em estoque deve ser um número válido");
      return false;
    }
    if (!categoriaId) {
      Alert.alert("Erro", "Selecione uma categoria");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      setCarregando(true);
      
      let uploadRealizado = false;

      if (imagemAlterada && imagemUri) {

        const isLocalImage = !imagemUri.startsWith('http://') && !imagemUri.startsWith('https://');
        
        if (isLocalImage) {
          try {
            console.log("=== INICIANDO UPLOAD DA IMAGEM ===");
            console.log("Produto ID:", produto.id);
            console.log("URI da imagem:", imagemUri);

            await uploadProductImage(produto.id, imagemUri);
            uploadRealizado = true;
            
            console.log("Upload da imagem realizado com sucesso");

            console.log("Aguardando processamento do servidor...");
            await new Promise(resolve => setTimeout(resolve, 2000));

            try {

              const responseDireta = await api.get(`/produtos/${produto.id}`);
              console.log("=== VERIFICAÇÃO DIRETA DA API ===");
              console.log("Response completa:", JSON.stringify(responseDireta.data, null, 2));
              console.log("Campo foto:", responseDireta.data.foto);

              const produtoVerificacao = await getProductById(produto.id);
              console.log("=== VERIFICAÇÃO NORMALIZADA ===");
              console.log("URL da foto normalizada:", produtoVerificacao.foto);

              if (produtoVerificacao.foto === produto.foto) {
                console.warn("⚠️ ATENÇÃO: A URL da foto não mudou após o upload!");
                console.warn("URL anterior:", produto.foto);
                console.warn("URL atual:", produtoVerificacao.foto);
              } else {
                console.log("✅ URL da foto foi atualizada com sucesso!");
              }
            } catch (err) {
              console.error("Erro ao verificar produto após upload:", err);
            }
          } catch (erroUpload: any) {
            console.error("=== ERRO NO UPLOAD ===");
            console.error("Erro completo:", erroUpload);
            console.error("Response data:", erroUpload.response?.data);
            console.error("Response status:", erroUpload.response?.status);
            
            Alert.alert(
              "Erro no Upload",
              `Erro ao fazer upload da imagem:\n${erroUpload.response?.data?.message || erroUpload.message || "Erro desconhecido"}\n\nTente novamente.`,
              [
                {
                  text: "Continuar mesmo assim",
                  onPress: () => {

                  }
                },
                {
                  text: "Cancelar",
                  style: "cancel",
                  onPress: () => {
                    setCarregando(false);
                    return;
                  }
                }
              ]
            );

            if (!erroUpload.response) {
              setCarregando(false);
              return;
            }
          }
        }
      }

      console.log("Atualizando dados do produto...");
      await updateProduct(produto.id, {
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: parseFloat(preco),
        quantidadeEstoque: parseInt(quantidadeEstoque),
        categoriaId: categoriaId!,
      });

      Alert.alert(
        "Sucesso", 
        uploadRealizado 
          ? "Produto e imagem atualizados com sucesso!" 
          : "Produto atualizado com sucesso!",
        [
          {
            text: "OK",
            onPress: async () => {

              await new Promise(resolve => setTimeout(resolve, 500));
              aoProdutoEditado();
              aoFechar();
            },
          },
        ]
      );
    } catch (erro: any) {
      console.error("Erro ao atualizar produto:", erro);
      Alert.alert("Erro", erro.response?.data?.message || erro.message || "Não foi possível atualizar o produto");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      transparent={false}
      onRequestClose={aoFechar}
    >
      <View style={estilos.container}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Editar Produto</Text>
          <TouchableOpacity onPress={aoFechar} style={estilos.botaoFechar}>
            <Text style={estilos.botaoFecharTexto}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={estilos.formulario}>
          <View style={estilos.grupoInput}>
            <Text style={estilos.label}>Nome do Produto *</Text>
            <TextInput
              style={estilos.input}
              placeholder="Digite o nome do produto"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={estilos.grupoInput}>
            <Text style={estilos.label}>Descrição *</Text>
            <TextInput
              style={[estilos.input, estilos.textArea]}
              placeholder="Digite a descrição do produto"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={estilos.grupoInput}>
            <Text style={estilos.label}>Preço (R$) *</Text>
            <TextInput
              style={estilos.input}
              placeholder="0.00"
              value={preco}
              onChangeText={setPreco}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={estilos.grupoInput}>
            <Text style={estilos.label}>Quantidade em Estoque *</Text>
            <TextInput
              style={estilos.input}
              placeholder="0"
              value={quantidadeEstoque}
              onChangeText={setQuantidadeEstoque}
              keyboardType="numeric"
            />
          </View>

          <View style={estilos.grupoInput}>
            <Text style={estilos.label}>Imagem do Produto</Text>
            {imagemUri ? (
              <View style={estilos.containerImagem}>
                <Image
                  key={`product-image-${produto.id}-${imageKey}`}
                  source={{ 
                    uri: imageError 
                      ? "https://via.placeholder.com/150" 
                      : imagemUri || "https://via.placeholder.com/150" 
                  }}
                  style={estilos.imagemPreview}
                  onError={() => {
                    console.log("Erro ao carregar imagem:", imagemUri);
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log("Imagem carregada com sucesso:", imagemUri);
                    setImageError(false);
                  }}
                />
                <View style={estilos.botoesImagem}>
                  <TouchableOpacity
                    style={estilos.botaoAlterarImagem}
                    onPress={selecionarImagem}
                  >
                    <Text style={estilos.botaoAlterarImagemTexto}>Alterar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={estilos.botaoRemoverImagem}
                    onPress={() => {
                      setImagemUri(null);
                      setImagemAlterada(true);
                    }}
                  >
                    <Text style={estilos.botaoRemoverImagemTexto}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={estilos.botaoSelecionarImagem}
                onPress={selecionarImagem}
              >
                <Text style={estilos.botaoSelecionarImagemTexto}>
                  📷 Selecionar Imagem
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={estilos.grupoInput}>
            <Text style={estilos.label}>Categoria *</Text>
            {carregandoCategorias ? (
              <ActivityIndicator size="small" color="#2a9d8f" />
            ) : (
              <View style={estilos.containerCategorias}>
                {categorias.map((categoria) => (
                  <TouchableOpacity
                    key={categoria.id}
                    style={[
                      estilos.botaoCategoria,
                      categoriaId === categoria.id && estilos.botaoCategoriaAtivo,
                    ]}
                    onPress={() => setCategoriaId(categoria.id)}
                  >
                    <Text
                      style={[
                        estilos.botaoCategoriaTexto,
                        categoriaId === categoria.id &&
                          estilos.botaoCategoriaTextoAtivo,
                      ]}
                    >
                      {categoria.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[estilos.botaoEnviar, carregando && estilos.botaoEnviarDesabilitado]}
            onPress={handleSubmit}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={estilos.botaoEnviarTexto}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
