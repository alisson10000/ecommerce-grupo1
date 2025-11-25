import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  botaoFechar: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoFecharTexto: {
    fontSize: 24,
    color: "#666",
  },
  formulario: {
    flex: 1,
    padding: 20,
  },
  grupoInput: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  containerCategorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  botaoCategoria: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
  },
  botaoCategoriaAtivo: {
    backgroundColor: "#2a9d8f",
    borderColor: "#2a9d8f",
  },
  botaoCategoriaTexto: {
    fontSize: 14,
    color: "#333",
  },
  botaoCategoriaTextoAtivo: {
    color: "#fff",
    fontWeight: "600",
  },
  botaoEnviar: {
    backgroundColor: "#2a9d8f",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  botaoEnviarDesabilitado: {
    opacity: 0.6,
  },
  botaoEnviarTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  botaoSelecionarImagem: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#2a9d8f",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoSelecionarImagemTexto: {
    color: "#2a9d8f",
    fontSize: 16,
    fontWeight: "600",
  },
  containerImagem: {
    alignItems: "center",
  },
  imagemPreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  botoesImagem: {
    flexDirection: "row",
    gap: 10,
  },
  botaoAlterarImagem: {
    backgroundColor: "#2a9d8f",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoAlterarImagemTexto: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  botaoRemoverImagem: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoRemoverImagemTexto: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
