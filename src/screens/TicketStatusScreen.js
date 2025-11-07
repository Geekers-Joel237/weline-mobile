import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';

const StatusCard = ({ label, value }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const HeaderLogoutButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.logoutText}>Déconnexion</Text>
  </TouchableOpacity>
);

const TicketStatusScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { ticketNumber, ticketId } = route.params;

  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook pour la configuration de l'en-tête (ne change pas)
  const headerRight = useCallback(() => <HeaderLogoutButton onPress={logout} />, [logout]);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
      headerLeft: () => null,
    });
  }, [navigation, headerRight]);

  // --- NOUVELLE PARTIE : Le Polling ---
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiClient.get(`/tickets/${ticketId}/status`);
        console.log("status response", response);
        
        setStatus(response.data.data);
      } catch (e) {
        setError('Impossible de récupérer le statut.');
        console.log('Error fetching ticket status:', e.response?.data || e.message);
      } finally {
        setIsLoading(false);
      }
    };

    // 1. On appelle une première fois immédiatement
    fetchStatus();

    // 2. On met en place un intervalle pour rafraîchir toutes les 10 secondes
    const intervalId = setInterval(fetchStatus, 10000);

    // 3. Fonction de nettoyage : quand l'écran est quitté, on arrête le polling
    return () => clearInterval(intervalId);

  }, [ticketId]); // Le hook dépend de ticketId

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#007bff" />;
    }
    if (error || !status) {
      return <Text style={styles.errorText}>{error || 'Données non disponibles.'}</Text>;
    }
    return (
      <>
        <Text style={styles.serviceName}>{status.serviceName}</Text>
        <View style={styles.ticketContainer}>
          <Text style={styles.label}>Votre Numéro</Text>
          <Text style={styles.ticketNumber}>{status.yourTicketNumber}</Text>
        </View>
        <View style={styles.statusGrid}>
          <StatusCard label="Numéro Actuel" value={status.currentTicketNumber} />
          <StatusCard label="Avant Vous" value={status.peopleBeforeYou} />
        </View>
      </>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

// --- NOUVEAUX STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4f7' },
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  serviceName: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  ticketContainer: { alignItems: 'center', marginBottom: 30 },
  label: { fontSize: 18, color: '#666' },
  ticketNumber: { fontSize: 60, fontWeight: 'bold', color: '#007bff', marginVertical: 5 },
  statusGrid: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, alignItems: 'center', width: '45%', elevation: 3 },
  cardLabel: { fontSize: 16, color: '#666', marginBottom: 5 },
  cardValue: { fontSize: 32, fontWeight: 'bold' },
  logoutText: { color: 'red', fontSize: 16, marginRight: 10 },
  errorText: { color: 'red', fontSize: 16 },
});

export default TicketStatusScreen;