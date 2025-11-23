import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  scrollContent: {
    paddingBottom: 20
  },
  imageContainer: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain"
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 15
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10
  },
  category: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 15,
    fontWeight: "500"
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2a9d8f",
    marginBottom: 20
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "justify"
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee"
  },
  addButton: {
    backgroundColor: "#2a9d8f",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  addButtonDisabled: {
    backgroundColor: "#ccc"
  },
  header: {
    backgroundColor: "#fff",
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 2
  },
  backButton: {
    alignSelf: "flex-start"
  },
  backButtonText: {
    fontSize: 16,
    color: "#2a9d8f",
    fontWeight: "600"
  }
});
