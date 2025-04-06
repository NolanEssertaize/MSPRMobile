// src/screens/care/CareRequestsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Searchbar, Snackbar, ToggleButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { getCareRequests, getUserPlants } from '../../api/plants';
import { Plant } from '../../types/plant';
import PlantItem from '../../components/PlantItem';
import Loading from '../../components/Loading';
import { AppStackParamList } from '../../navigation/types';

type CareRequestsScreenProps = NativeStackScreenProps<AppStackParamList, 'CareRequests'>;

const CareRequestsScreen: React.FC<CareRequestsScreenProps> = ({ navigation }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [myCarePlants, setMyCarePlants] = useState<Plant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'myCare'
  const { user } = useAuth();

  const fetchPlants = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    
    try {
      if (user?.is_botanist) {
        // Botaniste : récupérer toutes les plantes nécessitant des soins
        const careRequests = await getCareRequests();
        setPlants(careRequests);
        setFilteredPlants(careRequests);
      }
      
      // Récupérer les plantes dont l'utilisateur prend soin
      const userPlants = await getCareRequests();
      const carePlants = userPlants.filter(plant => plant.in_care_id === user?.id);
      setMyCarePlants(carePlants);
      
      if (viewMode === 'myCare') {
        setFilteredPlants(carePlants);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch care requests:', err);
      setError('Impossible de récupérer les demandes de soins. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlants();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPlants();
    });
    
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (viewMode === 'all') {
      handleSearch(searchQuery); 
    } else {
      if (searchQuery.trim() === '') {
        setFilteredPlants(myCarePlants);
      } else {
        const filtered = myCarePlants.filter(
          (plant) =>
            plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plant.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPlants(filtered);
      }
    }
  }, [viewMode, searchQuery, myCarePlants]);

  const handleRefresh = () => {
    fetchPlants(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    const plantsToFilter = viewMode === 'all' ? plants : myCarePlants;
    
    if (query.trim() === '') {
      setFilteredPlants(plantsToFilter);
    } else {
      const filtered = plantsToFilter.filter(
        (plant) =>
          plant.name.toLowerCase().includes(query.toLowerCase()) ||
          plant.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlants(filtered);
    }
  };

  const handlePlantPress = (plant: Plant) => {
    navigation.navigate('PlantCare', { plant });
  };

  if (isLoading) {
    return <Loading message="Chargement des demandes de soins..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <ToggleButton.Row
          onValueChange={value => value && setViewMode(value)}
          value={viewMode}
          style={styles.toggleRow}
        >
          <ToggleButton icon="flower" value="all" style={styles.toggleButton}>
            <Text>Toutes les demandes</Text>
          </ToggleButton>
          <ToggleButton icon="heart" value="myCare" style={styles.toggleButton}>
            <Text>Mes soins</Text>
          </ToggleButton>
        </ToggleButton.Row>
      </View>

      <Searchbar
        placeholder="Rechercher une plante..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {filteredPlants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {viewMode === 'all'
              ? "Aucune demande de soin n'est disponible pour le moment."
              : "Vous ne prenez soin d'aucune plante actuellement."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PlantItem plant={item} onPress={handlePlantPress} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{
          label: 'OK',
          onPress: () => setError(null),
        }}
      >
        {error}
      </Snackbar>
    </View> 
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  toggleContainer: {
    marginBottom: 16,
  },
  toggleRow: {
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  toggleButton: {
    flex: 1,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default CareRequestsScreen;