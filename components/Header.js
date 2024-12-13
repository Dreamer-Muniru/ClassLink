import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import { getFirestore, query, where, getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';


export default function Header({navigation}) {
   
     const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const db = getFirestore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Fetch teacher or student data based on UID
          const teachersQuery = query(collection(db, 'teachers'), where('uid', '==', user.uid));
          const teacherSnapshot = await getDocs(teachersQuery);

          if (!teacherSnapshot.empty) {
            teacherSnapshot.forEach((doc) => {
              setUserInfo({ ...doc.data(), role: 'teacher', docId: doc.id });
            });
          } else {
            const studentsQuery = query(collection(db, 'students'), where('uid', '==', user.uid));
            const studentSnapshot = await getDocs(studentsQuery);

            if (!studentSnapshot.empty) {
              studentSnapshot.forEach((doc) => {
                setUserInfo({ ...doc.data(), role: 'student', docId: doc.id });
              });
            } else {
              setUserInfo(null);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [db]);

    return (
        <View>
        <>
            {userInfo ?(
                <View className="flex-row mt-8"
                onPress={() =>navigation.navigate("Profile")}>
                    <Text> {userInfo.userName} </Text>
                    <Image
                    source={{uri: userInfo.image|| 'https://via.placeholder.com/40' }}
                    style={styles.profileImage}
                />

                {/* Display welcome message and user's name */}
                <View className="ml-1">
                    <Text style={styles.welcome}>Welcome,</Text>
                    <Text style={styles.userName}>{userInfo.fullName}</Text>
                </View>

                </View>
                
            
            ) : (
                    <Text style={styles.info}>No user information available.</Text>
            )}

            <View style={styles.container}>
                
           
            </View>
        </>
        </View>
    );
}

const styles = StyleSheet.create({
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 100,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    welcome: {
        fontSize: 16,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
  
});