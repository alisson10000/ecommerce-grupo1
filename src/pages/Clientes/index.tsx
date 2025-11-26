import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
    RefreshControl,
    ScrollView
} from 'react-native';
import { useClientes } from '../../context/ClienteContext';
import { Cliente } from '../../api/mockApi';
import styles from './styles';

export default function Clientes() {
    const { clientes, loadClientes, addCliente, updateCliente, syncStatus, fetchAddressByCep } = useClientes();
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

    // Form states
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cep, setCep] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');

    // Address display states
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [loadingCep, setLoadingCep] = useState(false);

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
            setTelefone(cliente.telefone);
            setNumero(cliente.numero);
            setComplemento(cliente.complemento || '');
            // TODO: Se tivermos o CEP salvo, poderíamos carregar. 
            // Como o banco só tem endereco_id, precisaríamos buscar o endereço completo.
            // Por simplificação, deixamos em branco na edição se não tivermos os dados locais.
            setCep('');
            setLogradouro('');
            setBairro('');
            setCidade('');
            setUf('');
        } else {
            setEditingCliente(null);
            setNome('');
            setCpf('');
            setEmail('');
            setTelefone('');
            setCep('');
            setNumero('');
            setComplemento('');
            setLogradouro('');
            setBairro('');
            setCidade('');
            setUf('');
        }
        setModalVisible(true);
    };

    const handleBlurCep = async () => {
        if (cep.length !== 8) return;
        setLoadingCep(true);
        try {
            const address = await fetchAddressByCep(cep);
            setLogradouro(address.logradouro);
            setBairro(address.bairro);
            setCidade(address.localidade);
            setUf(address.uf);
        } catch (error) {
            Alert.alert('Erro', 'CEP não encontrado');
            setLogradouro('');
            setBairro('');
            setCidade('');
            setUf('');
        } finally {
            setLoadingCep(false);
        }
    };

    const validateForm = () => {
        if (!nome.trim()) { Alert.alert('Erro', 'Nome é obrigatório'); return false; }
        if (cpf.length !== 11) { Alert.alert('Erro', 'CPF deve ter 11 dígitos'); return false; }
        if (!email.includes('@')) { Alert.alert('Erro', 'Email inválido'); return false; }
        if (telefone.length !== 11) { Alert.alert('Erro', 'Telefone deve ter 11 dígitos'); return false; }
        if (!numero.trim()) { Alert.alert('Erro', 'Número é obrigatório'); return false; }
        // Endereço é obrigatório, garantido pelo CEP
        if (!logradouro) { Alert.alert('Erro', 'Busque um CEP válido'); return false; }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        const clienteData: any = {
            nome,
            cpf,
            email,
            telefone,
            numero,
            complemento,
            endereco_id: 1 // Placeholder, o backend deve gerenciar isso com base no CEP/Endereço enviado
        };

        try {
            if (editingCliente) {
                await updateCliente(editingCliente.id!, clienteData);
                Alert.alert('Sucesso', 'Cliente atualizado!');
            } else {
                await addCliente(clienteData);
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
                    keyExtractor={(item) => String(item.id || Math.random())}
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
                        <ScrollView>
                            <Text style={styles.modalTitle}>{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</Text>

                            <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
                            <TextInput style={styles.input} placeholder="CPF (11 dígitos)" value={cpf} onChangeText={setCpf} keyboardType="numeric" maxLength={11} />
                            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                            <TextInput style={styles.input} placeholder="Telefone (11 dígitos)" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" maxLength={11} />

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="CEP (8 dígitos)"
                                    value={cep}
                                    onChangeText={setCep}
                                    keyboardType="numeric"
                                    maxLength={8}
                                    onBlur={handleBlurCep}
                                />
                                {loadingCep && <ActivityIndicator color="#0000ff" />}
                            </View>

                            {logradouro ? (
                                <View style={{ marginBottom: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Endereço:</Text>
                                    <Text>{logradouro}, {bairro}</Text>
                                    <Text>{cidade} - {uf}</Text>
                                </View>
                            ) : null}

                            <TextInput style={styles.input} placeholder="Número" value={numero} onChangeText={setNumero} />
                            <TextInput style={styles.input} placeholder="Complemento (Opcional)" value={complemento} onChangeText={setComplemento} />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
