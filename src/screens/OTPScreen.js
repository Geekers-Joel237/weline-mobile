import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';

const OTPScreen = () => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute(); // Pour récupérer les paramètres passés par la navigation
  const { phoneNumber } = route.params;
  const { login } = useAuth(); // On récupère la fonction login de notre contexte

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      Alert.alert('Erreur', 'Le code OTP doit contenir 6 chiffres.');
      return;
    }
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/verify-otp', {
        phoneNumber,
        otpCode,
      });

      console.log("response", response);
      
      // On vérifie si notre logique métier a réussi
      if (response.data?.data?.isValidated) {
        const token = response.data.data.token;
        await login(token); // On appelle login() avec le token reçu !
        // L'application va automatiquement basculer vers l'écran d'accueil.
      } else {
        // Affiche l'erreur métier retournée par le backend
        const errorMessage = response.data?.data?.message || 'Code OTP invalide.';
        Alert.alert('Échec de la vérification', errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur de réseau est survenue.';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Vérifiez votre numéro</Text>
        <Text style={styles.subtitle}>
          Nous avons envoyé un code à 6 chiffres à votre numéro WhatsApp.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="_ _ _ _ _ _"
          keyboardType="number-pad"
          maxLength={6}
          value={otpCode}
          onChangeText={setOtpCode}
          textAlign="center"
          letterSpacing={10}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Vérifier</Text>
          )}
        </TouchableOpacity>

        {/* Logique pour renvoyer le code à implémenter */}
        <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendButtonText}>Renvoyer le code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- STYLES (similaires à LoginScreen) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4f7' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  input: { fontSize: 24, padding: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#007bff', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resendButton: { marginTop: 20 },
  resendButtonText: { color: '#007bff', textAlign: 'center' },
});

export default OTPScreen;