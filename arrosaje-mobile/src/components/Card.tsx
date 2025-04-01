import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: object;
}

const Card: React.FC<CardProps> = ({ title, children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Title style={styles.title}>{title}</Title>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Card;