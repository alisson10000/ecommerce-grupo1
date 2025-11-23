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
  }
});
