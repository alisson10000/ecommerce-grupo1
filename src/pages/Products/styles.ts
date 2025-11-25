import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5"
  },
  searchContainer: {
    marginBottom: 20
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  categorySelectorButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  categorySelectorButtonText: {
    fontSize: 16,
    color: "#333",
    flex: 1
  },
  categorySelectorIcon: {
    fontSize: 12,
    color: "#666",
    marginLeft: 10
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333"
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#f0f0f0"
  },
  modalCloseButtonText: {
    fontSize: 18,
    color: "#666"
  },
  modalScrollView: {
    maxHeight: 400
  },
  modalCategoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  modalCategoryItemActive: {
    backgroundColor: "#f0f9ff"
  },
  modalCategoryItemText: {
    fontSize: 16,
    color: "#333"
  },
  modalCategoryItemTextActive: {
    color: "#2a9d8f",
    fontWeight: "600"
  },
  modalCategoryItemCheck: {
    fontSize: 18,
    color: "#2a9d8f",
    fontWeight: "bold"
  },
  categoryContainer: {
    marginBottom: 15
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333"
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8
  },
  categoryButtonActive: {
    backgroundColor: "#2a9d8f",
    borderColor: "#2a9d8f"
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#333"
  },
  categoryButtonTextActive: {
    color: "#fff",
    fontWeight: "600"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center"
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#2a9d8f",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  botaoNovoProduto: {
    backgroundColor: "#2a9d8f",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  botaoNovoProdutoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoaderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
});
