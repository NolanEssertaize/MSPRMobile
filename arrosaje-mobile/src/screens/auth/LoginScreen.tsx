import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Title, Snackbar } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { LoginCredentials } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import { AuthStackParamList } from '../../navigation/types';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const schema = yup.object().shape({
  username: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().required('Mot de passe requis'),
});

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { login, error, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
    } catch (err) {
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Arrosaje</Title>
      <Text style={styles.subtitle}>Connectez-vous pour accéder à votre compte</Text>

      <FormInput
        control={control}
        name="username"
        label="Email"
        error={errors.username?.message}
        keyboardType="email-address"
      />

      <FormInput
        control={control}
        name="password"
        label="Mot de passe"
        error={errors.password?.message}
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
      >
        Se connecter
      </Button>

      <View style={styles.row}>
        <Text>Vous n'avez pas de compte? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>S'inscrire</Text>
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
  );
};

const styles = StyleSheet.create({
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

export default LoginScreen;