import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    SafeAreaView, 
    ActivityIndicator, 
    TouchableOpacity,
    Alert // <-- Import Alert pour afficher les erreurs
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // <-- Import useNavigation pour pouvoir naviguer
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTakingTicket, setIsTakingTicket] = useState(null); // Pour savoir quel item est en chargement
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigation = useNavigation(); // <-- Initialise le hook de navigation

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get('/services');
        console.log("response", response);
        setServices(response.data.data);
      } catch (e) {
        setError('Impossible de charger les services. Veuillez réessayer plus tard.');
        console.error("Erreur API /services:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // --- NOUVELLE FONCTION POUR PRENDRE UN TICKET ---
  const handleTakeTicket = async (queueId) => {
   
    setIsTakingTicket(queueId); // On stocke l'ID de la queue pour afficher le loader sur le bon item
    try {
      const response = await apiClient.post(`/queues/${queueId}/tickets`);

      console.log("response", response);
      if (response.status === 201) { // 201 Created
        const ticketData = response.data.data;
        // On navigue vers l'écran de statut en passant les données du ticket
        navigation.navigate('TicketStatus', {
          ticketId: ticketData.ticketId,
          ticketNumber: ticketData.ticketNumber,
        });
      }
    } catch (e) {
      // On affiche une alerte claire à l'utilisateur avec le message du backend
      const errorMessage = e.response?.data?.message || 'Une erreur est survenue en prenant le ticket.';
      Alert.alert('Opération impossible', errorMessage);
    } finally {
      setIsTakingTicket(null); // On réinitialise l'état de chargement dans tous les cas
    }
  };


  const renderServiceItem = ({ item }) => (
    // On rend chaque item cliquable et on gère l'état de chargement
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => handleTakeTicket(item.queueId)}
      disabled={isTakingTicket !== null} // On désactive tous les boutons pendant qu'un appel est en cours
    >
      {/* On garde la vue pour la mise en page du texte */}
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemPartner}>{item.partnerName}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      {/* On n'affiche l'indicateur que sur l'item en cours de traitement */}
      {isTakingTicket === item.queueId && (
        <ActivityIndicator size="small" color="#007bff" />
      )}
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (isLoading) {
      return <View style={styles.center}><ActivityIndicator size="large" color="#007bff" /></View>;
    }

    if (error) {
      return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
    }

    if (services.length === 0) {
        return <View style={styles.center}><Text>Aucun service disponible pour le moment.</Text></View>;
    }

    return (
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Services Disponibles</Text>
        <TouchableOpacity onPress={logout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {renderContent()}

    </SafeAreaView>
  );
};

// --- STYLES (avec l'ajustement pour itemContainer) ---
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  safeArea: { flex: 1, backgroundColor: '#f0f4f7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold' },
  logoutText: { color: 'red', fontSize: 16 },
  list: { padding: 16 },
  itemContainer: { 
    backgroundColor: 'white', 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 1.41, 
    elevation: 2,
    // Styles ajoutés pour la mise en page
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  itemPartner: { fontSize: 14, color: '#007bff', marginBottom: 8, fontWeight: '600' },
  itemDescription: { fontSize: 14, color: '#666' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});

export default HomeScreen;