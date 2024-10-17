import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const db = getFirestore();
  // Use effect to listen for new teacher additions in Firestore
  useEffect(() => {
    const q = query(collection(db, 'teachers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => {
        const teacher = doc.data();
        return `A new teacher ${teacher.fullName} has been onboard as ${teacher.specialization} Teacher`;
      });
      setNotifications(newNotifications);
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      
      
      {notifications.length === 0 ? (
        <Text className="text-lg text-gray-600">There's no Notification yet</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="bg-white p-4 mb-2 rounded-lg shadow-sm">
              <Text className="text-gray-800">{item}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
