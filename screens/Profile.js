import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getFirestore, query, where, getDocs, collection } from 'firebase/firestore';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

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
                  <Image source={{ uri: userInfo.image }} style={styles.profileImage} className="mt-[-50px] mb-2" />
                  <Text style={styles.header}>{userInfo.fullName}</Text>
                  <View className="flex-1 flex-row">
                    <TouchableOpacity className="w-[110px] h-[50px] bg-[#2a9d8f] ml-8 rounded-lg">
                      
                      <Text className="text-[15px] pt-2" > <Feather name="phone-call" size={16} color="#fff" />{userInfo.phoneNumber}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-[150px] h-[50px] bg-[#2a9d8f] ml-10 rounded-lg">
                      <Text ><Ionicons name="location" size={18} color="#fff" />{userInfo.address}</Text>
                    </TouchableOpacity>
                    
                  </View>
                </View>  
             </View>
            </View>
            <View className="mt-[50px] bg-[#fff]">
                <Text className="ml-5 mb-5 pt-2 text-[22px] font-bold text-[#2a9d8f]">Other Information</Text>
                <Text className="text-center mb-3 bg-[#c7ece8] pb-3 text-[22px]" >Specilization: {userInfo.specialization}</Text>
                <Text  className="text-center mb-3 bg-[#c7ece8] pb-3 text-[22px]">Qualification: {userInfo.qualification}</Text>
                <Text className="text-center mb-5 bg-[#c7ece8] text-[22px]" >Experience: {userInfo.experience} years</Text>

            </View>
              
              
              
            </>
          ) : (
            <>
            <View className="h-[430]">
              <Text className="text-center text-[30px] mb-[40px]" >Welcome {userInfo.fullName}</Text>
              <Text className="text-[24px] text-left pl-5 font-bold mb-5 text-[#2a9d8f] " >User Details</Text>
              <Text className="text-center text-[18px] pb-5" >Contact: {userInfo.phoneNumber} </Text>
              <Text className="text-center text-[18px]">Email: {auth.currentUser.email}</Text>

            </View>
            </>
          )}
        </>
      ) : (
        <Text style={styles.info}>No user information available.</Text>
      )}

      <TouchableOpacity className="w-[140px] mb-[140px] bg-[#2a9d8f] h-[50px] rounded-md ml-[120px] mt-[50px]"  onPress={handleLogout}>
        <Text className="text-center pt-2 text-[#fff] font-bold text-[22px]" >Logout</Text>
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
  
    fontweight: 'bold'
  },
  // button: {
  //   backgroundColor: '#007bff',
  //   padding: 15,
  //   borderRadius: 5,
  //   alignItems: 'center',
  //   marginTop: 20,
  // },
  // buttonText: {
  //   color: '#fff',
  //   fontSize: 18,
  // },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
   
  },
});

export default Profile;
