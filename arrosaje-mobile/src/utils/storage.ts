import * as SecureStore from 'expo-secure-store';

export const storeData = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
};

export const getData = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    throw error;
  }
};

