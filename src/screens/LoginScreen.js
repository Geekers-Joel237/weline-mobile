import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../api/client';

// Simple UUID generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : ((r & 0x3) + 0x8);
    return v.toString(16);
  });
};

// Un composant simple pour la case à cocher
const Checkbox = ({ label, value, onValueChange }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
      {value && <Text style={styles.checkboxCheckmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [acceptedRights, setAcceptedRights] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // On détermine si le bouton doit être actif
  const isButtonDisabled = phoneNumber.length < 9 || !acceptedRights || isLoading;

  const handleContinue = async () => {
    setIsLoading(true);
    const fullPhoneNumber = `+237${phoneNumber.slice(-9)}`; // Normalisation simple

    try {
      // Pour cet exemple, on suppose que l'utilisateur s'inscrit.
      // On pourrait ajouter un switch/bouton pour choisir entre /register et /login.
       await apiClient.post('/auth/register', {
        customerId: generateUUID(),
        phoneNumber: fullPhoneNumber,
        acceptedRights: acceptedRights,
      });


      // Si l'appel réussit, on navigue vers l'écran OTP
      navigation.navigate('Otp', { phoneNumber: fullPhoneNumber });

    } catch (error) {
        console.log(error);
        
      // Affiche une alerte si l'API retourne une erreur
      const errorMessage = error.response?.data?.data?.message || 'Une erreur est survenue.';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue sur Weline</Text>
        <Text style={styles.subtitle}>Entrez votre numéro de téléphone pour commencer.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+237</Text>
          <TextInput
            style={styles.input}
            placeholder="6 XX XX XX XX"
            keyboardType="phone-pad"
            maxLength={9}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <Checkbox
          label="J'accepte les termes et conditions d'utilisation."
          value={acceptedRights}
          onValueChange={setAcceptedRights}
        />

        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={isButtonDisabled}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continuer</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4f7' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  countryCode: { fontSize: 18, marginRight: 8, color: '#333' },
  input: { flex: 1, fontSize: 18, paddingVertical: 12 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkboxChecked: { backgroundColor: '#007bff', borderColor: '#007bff' },
  checkboxCheckmark: { color: '#fff', fontSize: 12 },
  checkboxLabel: { fontSize: 14, color: '#333' },
  button: { backgroundColor: '#007bff', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#a0cfff' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default LoginScreen;