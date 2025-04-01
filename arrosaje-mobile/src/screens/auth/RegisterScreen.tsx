import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Title, Snackbar, Checkbox } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RegisterData } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import { AuthStackParamList } from '../../navigation/types';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const schema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  username: yup.string().required('Nom d\'utilisateur requis').min(3, 'Au moins 3 caractères'),
  phone: yup.string().required('Numéro de téléphone requis'),
  password: yup
    .string()
    .required('Mot de passe requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [isBotanist, setIsBotanist] = useState(false);
  const { register, error, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      username: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await register({ ...data, is_botanist: isBotanist });
    } catch (err) {
      setSnackbarVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Title style={styles.title}>Créer un compte</Title>
        <Text style={styles.subtitle}>Inscrivez-vous pour utiliser Arrosaje</Text>

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

        <FormInput
          control={control}
          name="password"
          label="Mot de passe"
          error={errors.password?.message}
          secureTextEntry
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isBotanist ? 'checked' : 'unchecked'}
            onPress={() => setIsBotanist(!isBotanist)}
          />
          <Text style={styles.checkboxLabel}>
            Je suis un botaniste et je veux prendre soin des plantes
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
        >
          S'inscrire
        </Button>

        <View style={styles.row}>
          <Text>Vous avez déjà un compte? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        <Snackbar
          visible={snackbarVisible || !!error}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'Fermer',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {error || 'Une erreur s\'est produite. Veuillez réessayer.'}
        </Snackbar>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'center',
  },
  link: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
});

export default RegisterScreen;