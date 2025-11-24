import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useClientes } from '../../context/ClienteContext';
import { Cliente } from '../../api/mockApi';
import styles from './styles';

export default function Clientes() {
    const { clientes, loadClientes, addCliente, updateCliente, syncStatus } = useClientes();
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

    // Form states
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');

    useEffect(() => {
        loadClientes();
    }, []);

    const filteredClientes = clientes.filter(c =>
        c.nome.toLowerCase().includes(searchText.toLowerCase()) ||
        c.cpf.includes(searchText)
    );

    const handleOpenModal = (cliente?: Cliente) => {
        if (cliente) {
            setEditingCliente(cliente);
            setNome(cliente.nome);
            setCpf(cliente.cpf);
            setEmail(cliente.email);
            setEndereco(cliente.endereco);
        } else {
            setEditingCliente(null);
            setNome('');
            setCpf('');
            setEmail('');
            setEndereco('');
        }
        setModalVisible(true);
    };

    const validateForm = () => {
        if (!nome.trim()) { Alert.alert('Erro', 'Nome é obrigatório'); return false; }
        if (cpf.length !== 11) { Alert.alert('Erro', 'CPF deve ter 11 dígitos'); return false; }
        if (!email.includes('@')) { Alert.alert('Erro', 'Email inválido'); return false; }
        if (!endereco.trim()) { Alert.alert('Erro', 'Endereço é obrigatório'); return false; }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            if (editingCliente) {
                await updateCliente(editingCliente.clienteId, { nome, cpf, email, endereco });
                Alert.alert('Sucesso', 'Cliente atualizado!');
            } else {
                await addCliente({
                    nome,
                    cpf,
                    email,
                    endereco,
                    dataCadastro: new Date().toISOString()
                });
                Alert.alert('Sucesso', 'Cliente cadastrado!');
            }
            setModalVisible(false);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao salvar cliente');
        }
    };

    const renderItem = ({ item }: { item: Cliente }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleOpenModal(item)}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardText}>CPF: {item.cpf}</Text>
            <Text style={styles.cardText}>Email: {item.email}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Clientes</Text>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome ou CPF"
                value={searchText}
                onChangeText={setSearchText}
            />

            {syncStatus === 'loading' && !clientes.length ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredClientes}
                    keyExtractor={(item) => String(item.clienteId)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={syncStatus === 'loading'} onRefresh={loadClientes} />
                    }
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cliente encontrado</Text>}
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={() => handleOpenModal()}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</Text>

                        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
                        <TextInput style={styles.input} placeholder="CPF (apenas números)" value={cpf} onChangeText={setCpf} keyboardType="numeric" maxLength={11} />
                        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                        <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
