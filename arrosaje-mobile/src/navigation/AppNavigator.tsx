import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { AppStackParamList, MainTabParamList } from './types';

// Écrans de plantes
import PlantListScreen from '../screens/plants/PlantListScreen';
import PlantDetailScreen from '../screens/plants/PlantDetailScreen';
import AddPlantScreen from '../screens/plants/AddPlantScreen';
import EditPlantScreen from '../screens/plants/EditPlantScreen';

// Écrans de soins
import CareRequestsScreen from '../screens/care/CareRequestsScreen';
import PlantCareScreen from '../screens/care/PlantCareScreen';

// Écrans de profil
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

// Navigateurs
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Navigateur pour l'onglet Plantes
const PlantsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="PlantList" 
      component={PlantListScreen} 
      options={{ title: 'Mes Plantes' }}
    />
    <Stack.Screen 
      name="PlantDetail" 
      component={PlantDetailScreen}
      options={{ title: 'Détail de la plante' }}
    />
    <Stack.Screen 
      name="AddPlant" 
      component={AddPlantScreen}
      options={{ title: 'Ajouter une plante' }}
    />
    <Stack.Screen 
      name="EditPlant" 
      component={EditPlantScreen}
      options={{ title: 'Modifier la plante' }}
    />
  </Stack.Navigator>
);

// Navigateur pour l'onglet Soins
const CareNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="CareRequests" 
      component={CareRequestsScreen}
      options={{ title: 'Demandes de soins' }}
    />
    <Stack.Screen 
      name="PlantCare" 
      component={PlantCareScreen}
      options={{ title: 'Soins de plante' }}
    />
  </Stack.Navigator>
);

// Navigateur pour l'onglet Profil
const ProfileNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Mon Profil' }}
    />
    <Stack.Screen 
      name="EditProfile" 
      component={EditProfileScreen}
      options={{ title: 'Modifier le profil' }}
    />
  </Stack.Navigator>
);

// Navigateur principal avec onglets
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        if (route.name === 'PlantsTab') {
          iconName = focused ? 'local-florist' : 'local-florist';
        } else if (route.name === 'CareTab') {
          iconName = focused ? 'favorite' : 'favorite-border';
        } else {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="PlantsTab" 
      component={PlantsNavigator} 
      options={{ 
        title: 'Mes Plantes',
      }}
    />
    <Tab.Screen 
      name="CareTab" 
      component={CareNavigator} 
      options={{ 
        title: 'Soins',
      }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileNavigator} 
      options={{ 
        title: 'Profil',
    }}
  />
</Tab.Navigator>
);

// Navigateur principal qui choisit entre Auth et App selon l'état de connexion
const AppNavigator: React.FC = () => {
const { user, isLoading } = useAuth();

// Afficher un écran de chargement si l'état d'authentification est en cours de récupération
if (isLoading) {
  return null; // Vous pourriez aussi afficher un indicateur de chargement ici
}

return user ? <MainTabNavigator /> : <AuthNavigator />;
};

export default AppNavigator;