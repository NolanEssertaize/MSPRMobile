import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { updateUser } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { AppStackParamList } from '../../navigation/types';

type EditProfileScreenProps = NativeStackScreenProps<AppStackParamList, 'EditProfile'>;

const schema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  username: yup.string().required('Nom d\'utilisateur requis').min(3, 'Au moins 3 caractères'),
  phone: yup.string().required('Numéro de téléphone requis'),
});

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { user, updateUserInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: user?.email || '',
      username: user?.username || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: any) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user.id, data);
      updateUserInfo(updatedUser);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Impossible de mettre à jour le profil. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Title style={styles.errorText}>Utilisateur non connecté</Title>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Modifier le profil</Title>

      <FormInput
        control={control}
        name="email"
        label="Email"
        error={errors.email?.message}
        keyboardType="email-address"
      />

      <FormInput
        control={control}
        name="username"
        label="Nom d'utilisateur"
        error={errors.username?.message}
      />

      <FormInput
        control={control}
        name="phone"
        label="Téléphone"
        error={errors.phone?.message}
        keyboardType="phone-pad"
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
        style={styles.submitButton}
      >
        Enregistrer les modifications
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.cancelButton}
      >
        Annuler
      </Button>

      {isLoading && <Loading />}

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
  submitButton: {
    marginTop: 20,
  },
  cancelButton: {
    marginTop: 10,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default EditProfileScreen;