import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Linking, ActivityIndicator } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getFirestore, query, where, getDocs, collection } from 'firebase/firestore';

const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const phone = () =>{
    const url = data.phoneNumber
    Linking.openURL(`tel:${url}`)
  }
  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          console.log('Fetching user data for UID:', user.uid);

          // Query teachers collection
          const teachersQuery = query(collection(db, 'teachers'), where('uid', '==', user.uid));
          const teacherSnapshot = await getDocs(teachersQuery);

          if (!teacherSnapshot.empty) {
            teacherSnapshot.forEach((doc) => {
              console.log('Teacher data found:', doc.data());
              setUserInfo({ ...doc.data(), role: 'teacher' });
            });
          } else {
            // Query students collection if not found in teachers
            const studentsQuery = query(collection(db, 'students'), where('uid', '==', user.uid));
            const studentSnapshot = await getDocs(studentsQuery);

            if (!studentSnapshot.empty) {
              studentSnapshot.forEach((doc) => {
                console.log('Student data found:', doc.data());
                setUserInfo({ ...doc.data(), role: 'student' });
              });
            } else {
              console.log('No data found for the current user in either collection');
              setUserInfo(null);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('No authenticated user found!');
      }
      setLoading(false); // Set loading to false after trying to fetch data
    };

    fetchUserInfo();
  }, [db]);

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
    <View style={styles.container} className="bg-[#e1dddd]">
      
      {userInfo ? (
        <>
          {userInfo.role === 'teacher' ? (
            <>
            <View className="bg-[#2a9d8f] h-[200px] w-full rounded-bl-[20px] rounded-br-[20px] mb-10">
              <View className="w-[100px] h-[100px] rounded-full mt-[70px]">
                <View className="bg-[#fff] w-[350px] ml-[20px] h-[200px] rounded-2xl">
                  <Image source={{ uri: userInfo.image }} style={styles.profileImage} className="mt-[-50px]" />
                  <Text style={styles.header}>{userInfo.fullName}</Text>
                  <Text style={styles.info}>{userInfo.specialization}</Text>
                  <View className="flex-1 flex-row">
                    <TouchableOpacity>
                      <Text style={styles.info}>Contact{userInfo.phoneNumber}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Text style={styles.info}>Address: {userInfo.address}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      
                    </TouchableOpacity>
                  </View>
                </View>  
             </View>
            </View>
              
              
              <Text style={styles.info} className="mt-10">Qualification: {userInfo.qualification}</Text>
              <Text style={styles.info}>Experience: {userInfo.experience} years</Text>
              
            </>
          ) : (
            <>
              <Text style={styles.info}>You are logged in as a student.</Text>
              <Text style={styles.info}>Email: {auth.currentUser.email}</Text>
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
    // flex: 1,
    // justifyContent: 'center',
    // padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default Profile;
