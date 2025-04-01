import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Plant } from '../types/plant';

interface PlantItemProps {
  plant: Plant;
  onPress: (plant: Plant) => void;
}

const PlantItem: React.FC<PlantItemProps> = ({ plant, onPress }) => {
  const truncateText = (text: string, length: number) => {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  };

  return (
    <TouchableOpacity onPress={() => onPress(plant)}>
      <Card style={styles.card}>
        {plant.photo_url ? (
          <Card.Cover source={{ uri: plant.photo_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Paragraph>No Image</Paragraph>
          </View>
        )}
        <Card.Content>
          <Title style={styles.title}>{plant.name}</Title>
          <Paragraph style={styles.location}>{plant.location}</Paragraph>
          {plant.care_instructions && (
            <Paragraph style={styles.instructions}>
              {truncateText(plant.care_instructions, 50)}
            </Paragraph>
          )}
          {plant.in_care && (
            <View style={styles.careTag}>
              <Paragraph style={styles.careTagText}>In Care</Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    elevation: 4,
  },
  image: {
    height: 150,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  location: {
    marginTop: 5,
    color: '#555',
  },
  instructions: {
    marginTop: 5,
    color: '#666',
    fontSize: 14,
  },
  careTag: {
    marginTop: 8,
    backgroundColor: '#4caf50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  careTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default PlantItem;
