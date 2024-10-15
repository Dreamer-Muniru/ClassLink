import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';


const Resources = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const fetchWorkshops = async () => {
  
    setTimeout(() => {
      const data = [
        {
          id: '1',
          title: 'Effective Online Teaching Strategies',
          date: '2024-10-20',
          mode: 'Online',
        },
        {
          id: '2',
          title: 'Classroom Management for New Teachers',
          date: '2024-11-05',
          mode: 'Offline',
        },
        {
          id: '3',
          title: 'Using Tech Tools for Better Learning',
          date: '2024-11-15',
          mode: 'Online',
        },
      ];
      setWorkshops(data);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const renderWorkshopItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>Date: {item.date}</Text>
        <Text style={styles.mode}>Mode: {item.mode}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={workshops}
          renderItem={renderWorkshopItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No upcoming workshops or webinars</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    marginTop: 5,
  },
  mode: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default Resources;
