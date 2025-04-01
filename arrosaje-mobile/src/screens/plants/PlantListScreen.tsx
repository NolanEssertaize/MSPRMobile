import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Searchbar, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPlants } from '../../api/plants';
import { Plant } from '../../types/plant';
import PlantItem from '../../components/PlantItem';
import Loading from '../../components/Loading';
import { AppStackParamList } from '../../navigation/types';

type PlantListScreenProps = NativeStackScreenProps<AppStackParamList, 'PlantList'>;

const PlantListScreen: React.FC<PlantListScreenProps> = ({ navigation }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPlants = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    
    try {
      const data = await getUserPlants();
      setPlants(data);
      setFilteredPlants(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch plants:', err);
      setError('Impossible de récupérer vos plantes. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlants();
    
    // Actualiser la liste lors du focus sur l'écran
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPlants();
    });
    
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = () => {
    fetchPlants(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(
        (plant) =>
          plant.name.toLowerCase().includes(query.toLowerCase()) ||
          plant.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlants(filtered);
    }
  };

  const handlePlantPress = (plant: Plant) => {
    navigation.navigate('PlantDetail', { plant });
  };

  if (isLoading) {
    return <Loading message="Chargement des plantes..." />;
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher une plante..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {filteredPlants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? "Aucune plante ne correspond à votre recherche."
              : "Vous n'avez pas encore de plantes. Ajoutez-en une!"}
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

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddPlant')}
        label="Ajouter"
      />

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
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 80,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default PlantListScreen;
