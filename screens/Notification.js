import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Import for navigation

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const db = getFirestore();
  const navigation = useNavigation(); 

  useEffect(() => {
    const q = query(collection(db, 'teachers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => {
        const teacher = doc.data();
        const createdAt = teacher.createdAt?.toDate();
        const formattedDate = createdAt ? createdAt.toLocaleString() : 'Unknown date';
        return {
          id: doc.id, 
          specialization: teacher.specialization,
          fullName: teacher.fullName,
          date: formattedDate,
          image: teacher.image || null, 
          phoneNumber: teacher.phoneNumber,
          qualification: teacher.qualification,
          experience: teacher.experience,
          address: teacher.address,
          date: formattedDate,

        };
      });
      setNotifications(newNotifications);
    });

    return () => unsubscribe(); 
  }, []);

  // Render function for FlatList
  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationContainer}
      onPress={() => navigation.navigate('TeacherDetails', {teacher: item })}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text className="text-[16px]">
          A new teacher{' '}
          <Text className="text-[#000] font-bold">{item.name}</Text>{' '}
          has been onboarded as{' '}
          <Text className="text-[#000] font-bold" >{item.specialization} Teacher</Text>{' '}
          on <Text className="text-[#cecaca] font-bold" >{item.date}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ padding: 10 }}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
        />
      ) : (
        <Text>There's no Notification yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },

 
});
