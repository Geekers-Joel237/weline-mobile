import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getToken, saveToken, deleteToken } from '../services/SecureStorage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import apiClient from '../api/client'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // La fonction logout est maintenant définie avec useCallback pour stabiliser sa référence
  const logout = useCallback(async () => {
    await deleteToken();
    setAuthState({ token: null, isAuthenticated: false, isLoading: false });
  }, []);

  const login = async (token) => {
    await saveToken(token);
    setAuthState({ token: token, isAuthenticated: true, isLoading: false });
  };

  // Ce useEffect s'exécute une seule fois au démarrage de l'app
  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      if (token) {
        setAuthState({ token: token, isAuthenticated: true, isLoading: false });
      } else {
        setAuthState({ token: null, isAuthenticated: false, isLoading: false });
      }
    };
    loadToken();
  }, []);


  // --- NOUVELLE PARTIE : On met en place l'intercepteur ---
  useEffect(() => {
    // On définit l'intercepteur de réponse
    const responseInterceptor = apiClient.interceptors.response.use(
      // Pour les réponses réussies (2xx), on ne fait rien, on les laisse passer.
      (response) => response,

      // Pour les réponses en erreur...
      (error) => {
        // On vérifie si l'erreur a une réponse de l'API et un statut
        const status = error.response?.status;

        // Si le statut est 401 (Non autorisé) ou 403 (Interdit)...
        if (status === 401 || status === 403) {
          console.log('Authentication error detected (401/403), logging out.');
          // ... on déclenche la déconnexion globale.
          logout();
        }
        
        // On propage l'erreur pour que le code qui a fait l'appel (ex: HomeScreen) puisse la gérer aussi.
        return Promise.reject(error);
      }
    );

    // Fonction de "nettoyage" : quand le composant est démonté, on retire l'intercepteur
    // pour éviter les doublons ou les fuites de mémoire.
    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]); // On ajoute logout aux dépendances du hook

  
  const value = { ...authState, login, logout };

  if (authState.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const useAuth = () => {
  return useContext(AuthContext);
};