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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createProduct, getCategories, CategoriaDTO, uploadProductImage } from "../../api/products";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, RootTabParamList } from "../../navigation/types";
import estilos from "./styles";

type NovoProdutoScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: NovoProdutoScreenNavigationProp;
  visivel: boolean;
  aoFechar: () => void;
  aoProdutoCriado: () => void;
};

export default function NovoProduto({
  navigation,
  visivel,
  aoFechar,
  aoProdutoCriado,
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

  useEffect(() => {
    if (visivel) {
      carregarCategorias();
      solicitarPermissaoImagem();
    }
  }, [visivel]);

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
        setImagemUri(resultado.assets[0].uri);
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

  const limparFormulario = () => {
    setNome("");
    setDescricao("");
    setPreco("");
    setQuantidadeEstoque("");
    setCategoriaId(null);
    setImagemUri(null);
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      setCarregando(true);

      const produtoCriado = await createProduct({
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: parseFloat(preco),
        quantidadeEstoque: parseInt(quantidadeEstoque),
        categoriaId: categoriaId!,
      });

      if (imagemUri && produtoCriado.id) {
        try {
          await uploadProductImage(produtoCriado.id, imagemUri);
        } catch (erroUpload: any) {
          console.error("Erro no upload da imagem:", erroUpload);
          Alert.alert(
            "Aviso",
            "Produto criado, mas houve erro ao fazer upload da imagem. Você pode adicionar a imagem depois."
          );
        }
      }

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            limparFormulario();
            aoProdutoCriado();
            aoFechar();
          },
        },
      ]);
    } catch (erro: any) {
      Alert.alert("Erro", erro.message || "Não foi possível cadastrar o produto");
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
          <Text style={estilos.titulo}>Novo Produto</Text>
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
                <Image source={{ uri: imagemUri }} style={estilos.imagemPreview} />
                <TouchableOpacity
                  style={estilos.botaoRemoverImagem}
                  onPress={() => setImagemUri(null)}
                >
                  <Text style={estilos.botaoRemoverImagemTexto}>Remover</Text>
                </TouchableOpacity>
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
              <Text style={estilos.botaoEnviarTexto}>Cadastrar Produto</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
