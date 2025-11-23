import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 4
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain"
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500"
  },
  price: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#2a9d8f"
  }
});
