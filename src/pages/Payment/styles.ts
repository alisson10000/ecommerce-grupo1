import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  totalDisplay: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ecc71",
    textAlign: "center",
    marginBottom: 30,
  },
  methodsContainer: {
    gap: 15,
  },
  methodButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  methodIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  methodText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  paymentDetailsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2ecc71",
    textAlign: "center",
    marginBottom: 20,
  },
  methodDetails: {
    marginTop: 10,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
  },
  installmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  installmentButton: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
  },
  installmentButtonActive: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  installmentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  installmentTextActive: {
    color: "#fff",
  },
  installmentValue: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  installmentValueActive: {
    color: "#fff",
  },
  changeContainer: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  changeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  changeValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  changeValueNegative: {
    color: "#e74c3c",
  },
  qrCodeContainer: {
    backgroundColor: "#f5f5f5",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  qrCodePlaceholder: {
    fontSize: 80,
  },
  qrCodeText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  copyButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pixStatusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 10,
  },
  pixStatusLabel: {
    fontSize: 16,
    color: "#666",
    marginRight: 10,
  },
  pixStatusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f39c12",
  },
  pixStatusPaid: {
    color: "#2ecc71",
  },
  simulateButton: {
    backgroundColor: "#9b59b6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  simulateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default styles;
