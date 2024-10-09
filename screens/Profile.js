import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // First, try fetching from the teachers collection (assuming user is a teacher)
          const teacherDocRef = doc(db, 'teachers', user.uid);
          const teacherSnapshot = await getDoc(teacherDocRef);

          if (teacherSnapshot.exists()) {
            setUserInfo({ ...teacherSnapshot.data(), role: 'teacher' });
          } else {
            // If no teacher data, try fetching from a students/users collection
            const userDocRef = doc(db, 'students', user.uid);
            const userSnapshot = await getDoc(userDocRef);
            if (userSnapshot.exists()) {
              setUserInfo({ ...userSnapshot.data(), role: 'student' });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No authenticated user found!");
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('UserLogin');
      Alert.alert('Success', 'You have been logged out successfully.');
    } catch (error) {
      Alert.alert('Logout failed', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to your profile</Text>

      {/* Displaying the current user's email */}
      <Text style={styles.email}>{auth.currentUser?.email}</Text>
      

      {userInfo ? (
        <>
          {userInfo.role === 'teacher' ? (
            <>
              <Image source={{ uri: userInfo.image }} style={styles.profileImage} />
              <Text style={styles.info}>Full Name: {userInfo.fullName}</Text>
              <Text style={styles.info}>Specialization: {userInfo.specialization}</Text>
              <Text style={styles.info}>Qualification: {userInfo.qualification}</Text>
              <Text style={styles.info}>Experience: {userInfo.experience} years</Text>
              <Text style={styles.info}>Address: {userInfo.address}</Text>
            </>
          ) : (
            <>
              <Text style={styles.info}>You are logged in as a student.</Text>
            </>
          )}
        </>
      ) : (
        <Text style={styles.info}>No user information available.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default Profile;
