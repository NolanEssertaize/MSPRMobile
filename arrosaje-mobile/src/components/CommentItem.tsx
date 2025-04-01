import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Paragraph, IconButton } from 'react-native-paper';
import { Comment } from '../types/comment';

interface CommentItemProps {
  comment: Comment;
  currentUserId: number;
  onDelete?: (commentId: number) => void;
  onEdit?: (comment: Comment) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onDelete,
  onEdit,
}) => {
  const isOwner = comment.user_id === currentUserId;
  
  // Formatter la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Paragraph style={styles.time}>{formatDate(comment.time_stamp)}</Paragraph>
          </View>
          {isOwner && (
            <View style={styles.actions}>
              {onEdit && (
                <IconButton
                  icon="pencil"
                  size={18}
                  onPress={() => onEdit(comment)}
                  style={styles.actionButton}
                />
              )}
              {onDelete && (
                <IconButton
                  icon="delete"
                  size={18}
                  onPress={() => onDelete(comment.id)}
                  style={styles.actionButton}
                />
              )}
            </View>
          )}
        </View>
        <Paragraph style={styles.comment}>{comment.comment}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  comment: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
  },
});

export default CommentItem;
