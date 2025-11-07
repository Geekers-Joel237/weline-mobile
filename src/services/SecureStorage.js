import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'com.weline.authtoken';

/**
 * Sauvegarde le token JWT de manière sécurisée.
 * @param {string} token Le token à sauvegarder.
 */
export const saveToken = async (token) => {
  try {
    await Keychain.setGenericPassword('userToken', token, { service: SERVICE_NAME });
    console.log('Token saved successfully.');
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

/**
 * Récupère le token JWT depuis le stockage sécurisé.
 * @returns {Promise<string|null>} Le token ou null s'il n'est pas trouvé.
 */
export const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
    if (credentials) {
      console.log('Token retrieved successfully.');
      return credentials.password;
    }
    console.log('No token found.');
    return null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Supprime le token JWT du stockage sécurisé.
 */
export const deleteToken = async () => {
  try {
    await Keychain.resetGenericPassword({ service: SERVICE_NAME });
    console.log('Token deleted successfully.');
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};