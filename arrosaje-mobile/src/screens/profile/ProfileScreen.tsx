
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, Text, Card, Switch, Button as PaperButton, Divider, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { AppStackParamList } from '../../navigation/types';
import Button from '../../components/Button';

type ProfileScreenProps = NativeStackScreenProps<AppStackParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Utilisateur non connecté</Text>
      </View>
    );
  }

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      setError("Erreur lors de la déconnexion. Veuillez réessayer.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // Fonction de suppression du compte à implémenter
            setError("La suppression du compte n'est pas encore implémentée.");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Title>{user.username}</Title>
              <Text>{user.is_botanist ? 'Botaniste' : 'Utilisateur'}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Informations personnelles</Title>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={24} color="#666" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={24} color="#666" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
          
          <PaperButton
            mode="outlined"
            onPress={handleEditProfile}
            style={styles.editButton}
          >
            Modifier le profil
          </PaperButton>
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Paramètres</Title>
          
          <View style={styles.settingRow}>
            <Text>Mode Botaniste</Text>
            <Switch
              value={user.is_botanist}
              onValueChange={() => {}}
              disabled={true}
            />
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.accountActions}>
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              Déconnexion
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleDeleteAccount}
              color="#f44336"
              style={styles.deleteButton}
            >
              Supprimer mon compte
            </Button>
          </View>
        </Card.Content>
      </Card>

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
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
  },
  editButton: {
    marginTop: 16,
  },
  settingsCard: {
    marginBottom: 16,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  accountActions: {
    marginTop: 8,
  },
  logoutButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: '#f44336',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ProfileScreen;

