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
  stock: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10
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
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  addButton: {
    backgroundColor: "#2a9d8f",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  addButtonFlex: {
    flex: 1
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center"
  },
  addButtonDisabled: {
    backgroundColor: "#ccc"
  },
  deleteButton: {
    backgroundColor: "#e63946",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60
  },
  deleteButtonText: {
    fontSize: 24
  },
  editButton: {
    backgroundColor: "#2a9d8f",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    marginRight: 10
  },
  editButtonText: {
    fontSize: 24
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
    width: "100%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e63946",
    marginBottom: 15,
    textAlign: "center"
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    textAlign: "center"
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2a9d8f",
    marginBottom: 20,
    textAlign: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9f9f9"
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48
  },
  modalButtonCancel: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 5
  },
  modalButtonCancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
  modalButtonConfirm: {
    backgroundColor: "#e63946",
    marginLeft: 5
  },
  modalButtonConfirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  }
});
