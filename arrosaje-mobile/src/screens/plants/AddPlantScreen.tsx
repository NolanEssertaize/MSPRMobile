import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Title, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

import { createPlant } from '../../api/plants';
import { PlantCreate } from '../../types/plant';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { AppStackParamList } from '../../navigation/types';

type AddPlantScreenProps = NativeStackScreenProps<AppStackParamList, 'AddPlant'>;

const schema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  location: yup.string().required('L\'emplacement est requis'),
  care_instructions: yup.string(),
});

const AddPlantScreen: React.FC<AddPlantScreenProps> = ({ navigation }) => {
  const [photo, setPhoto] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PlantCreate>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      location: '',
      care_instructions: '',
    },
  });

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permissions requises',
        'Nous avons besoin d\'accéder à votre caméra et à votre galerie pour ajouter une photo de plante.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0]);
      }
    } catch (err) {
      setError('Erreur lors de la sélection de l\'image');
      console.error(err);
    }
  };

  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0]);
      }
    } catch (err) {
      setError('Erreur lors de la capture de l\'image');
      console.error(err);
    }
  };

  const onSubmit = async (data: PlantCreate) => {
    if (!photo) {
      setError('Veuillez ajouter une photo de votre plante');
      return;
    }

    setIsLoading(true);
    try {
      await createPlant({
        ...data,
        photo: photo,
      });
      
      Alert.alert(
        'Succès',
        'Votre plante a été ajoutée avec succès !',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('PlantList')
          }
        ]
      );
    } catch (err) {
      console.error('Failed to create plant:', err);
      setError('Impossible de créer la plante. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Ajouter une plante</Title>

      <View style={styles.imageSection}>
        <Text style={styles.imageLabel}>Photo de la plante</Text>
        {photo ? (
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: photo.uri }} style={styles.image} />
            <View style={styles.imageOverlay}>
              <Text style={styles.changeImageText}>Changer l'image</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={28} color="#6200ee" />
              <Text style={styles.photoButtonText}>Galerie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <MaterialIcons name="camera-alt" size={28} color="#6200ee" />
              <Text style={styles.photoButtonText}>Appareil photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FormInput
        control={control}
        name="name"
        label="Nom de la plante"
        error={errors.name?.message}
      />

      <FormInput
        control={control}
        name="location"
        label="Emplacement"
        error={errors.location?.message}
      />

      <FormInput
        control={control}
        name="care_instructions"
        label="Instructions d'entretien"
        error={errors.care_instructions?.message}
        multiline
        numberOfLines={4}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
      >
        Ajouter la plante
      </Button>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageSection: {
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    alignItems: 'center',
  },
  changeImageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  photoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '45%',
  },
  photoButtonText: {
    marginTop: 5,
    color: '#6200ee',
  },
});

export default AddPlantScreen;