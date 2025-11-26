import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useClientes } from '../../context/ClienteContext';
import { Cliente } from '../../api/mockApi';
import styles from './styles';

export default function BackupClientes() {
  const {
    clientes,
    backupClientes,
    syncStatus,
    lastSync,
    syncClientes,
    restoreBackup,
    checkBackupDifferences
  } = useClientes();

  const [stats, setStats] = useState({ localOnly: 0, backupOnly: 0, conflicts: 0 });

  useEffect(() => {
    updateStats();
  }, [clientes, backupClientes]);

  const updateStats = async () => {
    const differences = await checkBackupDifferences();
    setStats(differences);
  };

  const handleSync = async () => {
    try {
      await syncClientes();
      Alert.alert('Sucesso', 'Sincronização concluída!');
      updateStats();
    } catch (error) {
      Alert.alert('Erro', 'Falha na sincronização. Verifique sua conexão.');
    }
  };

  const handleRestore = () => {
    Alert.alert(
      'Confirmar Restauração',
      'Isso substituirá os dados locais pelos dados do backup. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            try {
              await restoreBackup();
              Alert.alert('Sucesso', 'Dados restaurados do backup!');
              updateStats();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao restaurar backup.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Backup de Clientes</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status da Sincronização</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Total Local:</Text>
          <Text style={styles.value}>{clientes.length}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total Backup:</Text>
          <Text style={styles.value}>{backupClientes.length}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Última Sincronização:</Text>
          <Text style={styles.value}>
            {lastSync ? lastSync.toLocaleString('pt-BR') : 'Nunca'}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subTitle}>Diferenças Encontradas</Text>
        <Text style={styles.infoText}>• {stats.localOnly} apenas localmente</Text>
        <Text style={styles.infoText}>• {stats.backupOnly} apenas no backup</Text>
        <Text style={styles.infoText}>• {stats.conflicts} conflitos de dados</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.syncButton]}
          onPress={handleSync}
          disabled={syncStatus === 'loading'}
        >
          {syncStatus === 'loading' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sincronizar Agora</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.restoreButton]}
          onPress={handleRestore}
          disabled={syncStatus === 'loading'}
        >
          <Text style={styles.buttonText}>Restaurar do Backup</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Dados no Backup (MockAPI)</Text>
        {backupClientes.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum dado no backup ou não carregado.</Text>
        ) : (
          backupClientes.map((item) => (
            <View key={item.id || Math.random()} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{item.nome}</Text>
              <Text style={styles.itemSubtitle}>ID: {item.id} | CPF: {item.cpf}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
