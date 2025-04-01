// src/navigation/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plant } from '../types/plant';

// Types pour la navigation d'authentification
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Types pour la navigation principale
export type AppStackParamList = {
  // Onglet Plantes
  PlantList: undefined;
  PlantDetail: { plant: Plant };
  AddPlant: undefined;
  EditPlant: { plant: Plant };
  
  // Onglet Soins
  CareRequests: undefined;
  PlantCare: { plant: Plant };
  
  // Onglet Profil
  Profile: undefined;
  EditProfile: undefined;
};

// Type de la barre d'onglets principale
export type MainTabParamList = {
  PlantsTab: undefined;
  CareTab: undefined;
  ProfileTab: undefined;
};

// Types pour les props d'écran communs
export type AuthScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppScreenProps<T extends keyof AppStackParamList> = 
  NativeStackScreenProps<AppStackParamList, T>;