import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import styles from "./styles";

type PaymentMethod = "debit" | "credit" | "cash" | "pix" | null;

export default function Payment() {
    const navigation = useNavigation();
    const { clearCart, cart } = useCart();
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [receivedAmount, setReceivedAmount] = useState("");
    const change = receivedAmount ? parseFloat(receivedAmount) - total : 0;

    const [installments, setInstallments] = useState(1);

    const [pixStatus, setPixStatus] = useState<"waiting" | "paid">("waiting");
    const pixCode = `00020126580014br.gov.bcb.pix0136${Math.random()
        .toString(36)
        .substring(2, 15)}520400005303986540${total.toFixed(2)}5802BR5913Loja6009SAO PAULO62070503***6304`;

    const handlePaymentMethodSelect = (method: PaymentMethod) => {
        setSelectedMethod(method);
    };

    const handleBackToMethods = () => {
        setSelectedMethod(null);
        setReceivedAmount("");
        setInstallments(1);
        setPixStatus("waiting");
    };

    const handleConfirmPayment = async () => {
        if (selectedMethod === "cash") {
            const received = parseFloat(receivedAmount);
            if (!receivedAmount || isNaN(received)) {
                Alert.alert("Erro", "Por favor, informe o valor recebido.");
                return;
            }
            if (received < total) {
                Alert.alert("Erro", "Valor recebido é insuficiente.");
                return;
            }
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            Alert.alert("Sucesso", "Pagamento realizado com sucesso!", [
                {
                    text: "OK",
                    onPress: () => {
                        clearCart();
                        navigation.navigate("HomeTabs" as never);
                    },
                },
            ]);
        }, 2000);
    };

    const handleCopyPixCode = () => {
        Alert.alert("Código Copiado", "Código Pix copiado para a área de transferência!");
    };

    const simulatePixPayment = () => {
        setPixStatus("paid");
        setTimeout(() => {
            Alert.alert("Pagamento Confirmado", "Pagamento via Pix recebido!", [
                {
                    text: "OK",
                    onPress: () => {
                        clearCart();
                        navigation.navigate("HomeTabs" as never);
                    },
                },
            ]);
        }, 1000);
    };

    if (!selectedMethod) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Forma de Pagamento</Text>
                <Text style={styles.totalDisplay}>Total: R$ {total.toFixed(2).replace(".", ",")}</Text>

                <View style={styles.methodsContainer}>
                    <TouchableOpacity
                        style={styles.methodButton}
                        onPress={() => handlePaymentMethodSelect("debit")}
                    >
                        <Text style={styles.methodIcon}>💳</Text>
                        <Text style={styles.methodText}>Cartão Débito</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.methodButton}
                        onPress={() => handlePaymentMethodSelect("credit")}
                    >
                        <Text style={styles.methodIcon}>💳</Text>
                        <Text style={styles.methodText}>Cartão Crédito</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.methodButton}
                        onPress={() => handlePaymentMethodSelect("cash")}
                    >
                        <Text style={styles.methodIcon}>💵</Text>
                        <Text style={styles.methodText}>Dinheiro</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.methodButton}
                        onPress={() => handlePaymentMethodSelect("pix")}
                    >
                        <Text style={styles.methodIcon}>📱</Text>
                        <Text style={styles.methodText}>Pix</Text>
                    </TouchableOpacity>


                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity onPress={handleBackToMethods} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>
                {selectedMethod === "debit" && "Cartão Débito"}
                {selectedMethod === "credit" && "Cartão Crédito"}
                {selectedMethod === "cash" && "Dinheiro"}
                {selectedMethod === "pix" && "Pix"}
            </Text>

            <View style={styles.paymentDetailsContainer}>
                <Text style={styles.totalLabel}>Valor Total:</Text>
                <Text style={styles.totalValue}>R$ {total.toFixed(2).replace(".", ",")}</Text>

                {selectedMethod === "debit" && (
                    <View style={styles.methodDetails}>
                        <Text style={styles.instructionText}>Aguardando maquininha...</Text>
                        <Text style={styles.subText}>Insira ou aproxime o cartão</Text>
                    </View>
                )}

                {selectedMethod === "credit" && (
                    <View style={styles.methodDetails}>
                        <Text style={styles.label}>Parcelas:</Text>
                        <View style={styles.installmentsContainer}>
                            {[1, 2, 3, 6, 12].map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    style={[
                                        styles.installmentButton,
                                        installments === num && styles.installmentButtonActive,
                                    ]}
                                    onPress={() => setInstallments(num)}
                                >
                                    <Text
                                        style={[
                                            styles.installmentText,
                                            installments === num && styles.installmentTextActive,
                                        ]}
                                    >
                                        {num}x
                                    </Text>
                                    <Text
                                        style={[
                                            styles.installmentValue,
                                            installments === num && styles.installmentValueActive,
                                        ]}
                                    >
                                        R$ {(total / num).toFixed(2).replace(".", ",")}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.instructionText}>Aguardando maquininha...</Text>
                        <Text style={styles.subText}>Insira ou aproxime o cartão</Text>
                    </View>
                )}

                {selectedMethod === "cash" && (
                    <View style={styles.methodDetails}>
                        <Text style={styles.label}>Valor Recebido:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0,00"
                            keyboardType="numeric"
                            value={receivedAmount}
                            onChangeText={setReceivedAmount}
                        />

                        {receivedAmount && !isNaN(parseFloat(receivedAmount)) && (
                            <View style={styles.changeContainer}>
                                <Text style={styles.changeLabel}>Troco:</Text>
                                <Text
                                    style={[
                                        styles.changeValue,
                                        change < 0 && styles.changeValueNegative,
                                    ]}
                                >
                                    R$ {Math.max(0, change).toFixed(2).replace(".", ",")}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {selectedMethod === "pix" && (
                    <View style={styles.methodDetails}>
                        <View style={styles.qrCodeContainer}>
                            <Text style={styles.qrCodePlaceholder}>📱</Text>
                            <Text style={styles.qrCodeText}>QR Code</Text>
                        </View>

                        <TouchableOpacity style={styles.copyButton} onPress={handleCopyPixCode}>
                            <Text style={styles.copyButtonText}>📋 Copiar Código Pix</Text>
                        </TouchableOpacity>

                        <View style={styles.pixStatusContainer}>
                            <Text style={styles.pixStatusLabel}>Status:</Text>
                            <Text
                                style={[
                                    styles.pixStatusText,
                                    pixStatus === "paid" && styles.pixStatusPaid,
                                ]}
                            >
                                {pixStatus === "waiting" ? "⏳ Aguardando pagamento" : "✅ Pago"}
                            </Text>
                        </View>

                        {pixStatus === "waiting" && (
                            <TouchableOpacity
                                style={styles.simulateButton}
                                onPress={simulatePixPayment}
                            >
                                <Text style={styles.simulateButtonText}>
                                    🧪 Simular Pagamento (Dev)
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}



                {selectedMethod !== "pix" && (
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleConfirmPayment}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.confirmButtonText}>Confirmar Pagamento</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}
