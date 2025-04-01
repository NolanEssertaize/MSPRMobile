import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Title, Text, Divider, Button as PaperButton, IconButton, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { deletePlant, startPlantCare, endPlantCare } from '../../api/plants';
import { getPlantComments, createComment, deleteComment } from '../../api/comments';
import { Comment } from '../../types/comment';
import CommentItem from '../../components/CommentItem';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { AppStackParamList } from '../../navigation/types';
import { useForm } from 'react-hook-form';
import FormInput from '../../components/FormInput';

type PlantDetailScreenProps = NativeStackScreenProps<AppStackParamList, 'PlantDetail'>;

const PlantDetailScreen: React.FC<PlantDetailScreenProps> = ({ route, navigation }) => {
  const { plant } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommentSending, setIsCommentSending] = useState(false);
  const { user } = useAuth();
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      comment: '',
    },
  });

  const isOwner = user?.id === plant.owner.id;
  const isCaring = plant.in_care && plant.plant_sitting === user?.id;

  useEffect(() => {
    fetchComments();
  }, [plant.id]);

  const fetchComments = async () => {
    setIsCommentsLoading(true);
    try {
      const data = await getPlantComments(plant.id);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setError('Impossible de récupérer les commentaires');
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la plante',
      'Êtes-vous sûr de vouloir supprimer cette plante? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deletePlant(plant.id);
              navigation.goBack();
            } catch (error) {
              console.error('Failed to delete plant:', error);
              setError('Impossible de supprimer la plante');
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditPlant', { plant });
  };

  const handleStartCare = async () => {
    setIsLoading(true);
    try {
      await startPlantCare(plant.id);
      // Recharger la page
      navigation.replace('PlantDetail', { plant: { ...plant, in_care: true, plant_sitting: user?.id } });
    } catch (error) {
      console.error('Failed to start care:', error);
      setError('Impossible de commencer à prendre soin de la plante');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCare = async () => {
    setIsLoading(true);
    try {
      await endPlantCare(plant.id);
      // Recharger la page
      navigation.replace('PlantDetail', { plant: { ...plant, in_care: false, plant_sitting: null } });
    } catch (error) {
      console.error('Failed to end care:', error);
      setError('Impossible de terminer le soin de la plante');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (data: { comment: string }) => {
    setIsCommentSending(true);
    try {
      await createComment({
        plant_id: plant.id,
        comment: data.comment,
      });
      reset({ comment: '' });
      fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
      setError('Impossible d\'ajouter le commentaire');
    } finally {
      setIsCommentSending(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    Alert.alert(
      'Supprimer le commentaire',
      'Êtes-vous sûr de vouloir supprimer ce commentaire?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComment(commentId);
              fetchComments();
            } catch (error) {
              console.error('Failed to delete comment:', error);
              setError('Impossible de supprimer le commentaire');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {plant.photo_url ? (
          <Image source={{ uri: plant.photo_url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>Aucune photo disponible</Text>
          </View>
        )}

        <View style={styles.header}>
          <Title style={styles.title}>{plant.name}</Title>
          
          {isOwner && (
            <View style={styles.ownerActions}>
              <IconButton icon="pencil" size={20} onPress={handleEdit} />
              <IconButton icon="delete" size={20} onPress={handleDelete} color="#f44336" />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Emplacement:</Text>
          <Text style={styles.infoValue}>{plant.location}</Text>
        </View>

        {plant.care_instructions && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Instructions d'entretien:</Text>
            <Text style={styles.infoValue}>{plant.care_instructions}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Propriétaire:</Text>
          <Text style={styles.infoValue}>{plant.owner.username}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Date d'ajout:</Text>
          <Text style={styles.infoValue}>
            {new Date(plant.created_at).toLocaleDateString()}
          </Text>
        </View>

        {plant.in_care ? (
          <View style={styles.careInfo}>
            <Text style={styles.careText}>Cette plante est en cours d'entretien</Text>
            {isCaring && (
              <Button mode="outlined" onPress={handleEndCare} color="#f44336">
                Terminer l'entretien
              </Button>
            )}
          </View>
        ) : (
          !isOwner && user?.is_botanist && (
            <Button mode="contained" onPress={handleStartCare}>
              Proposer de prendre soin de cette plante
            </Button>
          )
        )}

        <Divider style={styles.divider} />

        <Title style={styles.commentsTitle}>Commentaires</Title>
        
        <View style={styles.newCommentContainer}>
          <FormInput
            control={control}
            name="comment"
            label="Ajouter un commentaire"
            multiline
            error={errors.comment?.message}
          />
          <Button
            mode="contained"
            onPress={handleSubmit(handleAddComment)}
            loading={isCommentSending}
            disabled={isCommentSending}
          >
            Envoyer
          </Button>
        </View>

        {isCommentsLoading ? (
          <Text style={styles.loadingComments}>Chargement des commentaires...</Text>
        ) : comments.length === 0 ? (
          <Text style={styles.noComments}>Aucun commentaire pour le moment</Text>
        ) : (
          <View style={styles.commentsList}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id || 0}
                onDelete={handleDeleteComment}
              />
            ))}
          </View>
        )}
      </ScrollView>

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
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: 250,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  ownerActions: {
    flexDirection: 'row',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  careInfo: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  careText: {
    fontSize: 16,
    color: '#2e7d32',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 20,
  },
  commentsTitle: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  newCommentContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  loadingComments: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
  noComments: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  commentsList: {
    paddingHorizontal: 16,
  },
});

export default PlantDetailScreen;