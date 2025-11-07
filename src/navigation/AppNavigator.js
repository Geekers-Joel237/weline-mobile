import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../contexts/AuthContext';
import OTPScreen from '../screens/OTPScreen';
import TicketStatusScreen from '../screens/TicketStatusScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen 
            name="TicketStatus" 
            component={TicketStatusScreen} 
            options={{ title: 'Statut du Ticket' }} 
          /> 
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Otp" component={OTPScreen} options={{ title: 'Vérification' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
