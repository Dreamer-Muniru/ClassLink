import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getFirestore, query, where, getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker'; // Import image picker
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState({});
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('UserLogin');
      Alert.alert('Success', 'You have been logged out successfully.');
    } catch (error) {
      Alert.alert('Logout failed', error.message);
    }
  };

  const openEditModal = () => {
    setEditData(userInfo);
    setModalVisible(true);
  };

  const handleEditChange = (key, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const closeEditModal = () => {
    setModalVisible(false);
  };

  const saveChanges = async () => {
    try {
      const docRef = doc(db, userInfo.role === 'teacher' ? 'teachers' : 'students', userInfo.docId);
      await updateDoc(docRef, editData);
      setUserInfo(editData);
      setModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
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
    <ScrollView >
      {userInfo ? (
        <>
          {/* Profile Information */}
          <View className="bg-[#2a9d8f] h-[200px] w-full rounded-bl-[20px] rounded-br-[20px] mb-10">
              <View className="w-[100px] h-[100px] rounded-full mt-[70px]">
                <View className="bg-[#fff] w-[350px] ml-[20px] h-[250px] rounded-2xl">
                  <Image source={{ uri: userInfo.image }} style={styles.profileImage} className="mt-[-50px] mb-2" />
                  <Text style={styles.header}>{userInfo.fullName}</Text>
                  <Text className="w-[350px] mb-1 pl-4 ">{userInfo.about}</Text>
                  <View className="flex-1 flex-row">
                    <View className="w-[110px] h-[50px] bg-[#2a9d8f] ml-8 rounded-lg">
                      <Text className="text-[15px] pt-2"> <Feather name="phone-call" size={16} color="#fff" />{userInfo.phoneNumber}</Text>
                    </View>
                    {/* Display role in place of address if user is a student */}
                    <View className="w-[150px] h-[50px] bg-[#2a9d8f] ml-10 rounded-lg">
                      <Text className="text-white text-[18px] font-bold pl-5 pt-3" >{userInfo.role === 'student' ?  userInfo.role :  userInfo.address} </Text>
                    </View>
                  </View>
                </View>  
             </View>
            </View>
            <View>
            <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
              <Feather name="edit" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            </View>
            {/* Conditionally render additional teacher info */}
            {userInfo.role === 'teacher' && (
              <View className="mt-[50px] bg-[#fff]">
                <Text className="ml-5 mb-5 pt-2 text-[22px] font-bold text-[#2a9d8f]">Other Information</Text>
                {/* Speicialiation */}
                <View className="flex-row pl-3" style={styles.profile_List}>
                  <View className="mt-1">
                    <AntDesign name="export2" size={50} color="#2a9d8f" />
                    
                  </View>
                  <View className="pl-2">
                    <Text className="text-center text-[22px] mb-1 font-bold ">Specialization</Text>
                    <Text className="text-[18px] text-[#686262] mt-[-5px] pb-2 pl-[5px]">{userInfo.specialization}</Text>
                  </View>
                </View>
                {/* Qualification */}
                 <View className="flex-row" style={styles.profile_List}>
                  <View className="mt-2 ml-5">
                    <FontAwesome5 name="user-graduate" size={40} color="#2a9d8f" />
                  </View>
                  <View className="pl-3">
                    <Text className="text-left text-[22px] font-bold ">Qualification</Text>
                    <Text className="text-[18px] text-[#686262] mt-[-5px] pb-2 pl-[5px]">{userInfo.qualification}</Text>
                  </View>
                </View>
                {/* Years of Experience */}
                <View className="flex-row pl-3" style={styles.profile_List}>
                  <View className="mt-1">
                    <MaterialIcons name="group-work" size={50} color="#2a9d8f" />
                  </View>

                  <View className="ml-2">
                    <Text className="text-center text-[22px] mb-1 font-bold ">Years of Experience</Text>
                    <Text className="text-[18px] text-[#686262] pb-2 mt-[-5px] pl-[5px]">{userInfo.experience} Years</Text>
                  </View>
                </View>
               {/* Rate per Month */}
               <View className="flex-row pl-3" style={styles.profile_List}>
                  <View className="ml-1 mt-1">
                    <FontAwesome name="money" size={45} color="#2a9d8f" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-center text-[22px] mb-1 font-bold ">Rate per month</Text>
                    <Text className="text-[18px] text-[#686262] pb-2 mt-[-5px] pl-[5px]">{userInfo.rate} GHS</Text>
                  </View>
                </View>
                {/* Location */}
                <View className="flex-row pl-3" style={styles.profile_List}>
                  <View className="">
                    <MaterialIcons name="fmd-good" size={50} color="#2a9d8f" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-center text-[22px] mb-1 font-bold ">Location</Text>
                    <Text className="text-[18px] text-[#686262] pb-2 mt-[-5px] pl-[5px]">{userInfo.location}</Text>
                  </View>
                </View>
                {/* Availability */}
                <View className="flex-row pl-3" style={styles.profile_List}>
                  <View className="ml-1 mt-1">
                    <Entypo name="compass" size={45} color="#2a9d8f" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-left text-[22px] mb-1 font-bold ">Availability</Text>
                    <Text className="text-[18px] text-[#686262] pb-2 mt-[-5px] pl-[5px]">{userInfo.availability}</Text>
                  </View>
                </View>
      
              </View>
            )}

           

          {/* Edit Profile Modal */}
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={closeEditModal} style={styles.closeButton}>
                  <Ionicons name="close-circle" size={30} color="red" />
                </TouchableOpacity>
                <Text style={styles.modalHeader}>Edit Profile</Text>
                <ScrollView>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={editData.fullName}
                    onChangeText={(value) => handleEditChange('fullName', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={editData.phoneNumber}
                    onChangeText={(value) => handleEditChange('phoneNumber', value)}
                  />
                  {userInfo.role === 'teacher' && (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Specialization"
                        value={editData.specialization}
                        onChangeText={(value) => handleEditChange('specialization', value)}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Qualification"
                        value={editData.qualification}
                        onChangeText={(value) => handleEditChange('qualification', value)}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Experience"
                        value={editData.experience}
                        onChangeText={(value) => handleEditChange('experience', value)}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Rate per Month"
                        value={editData.rate}
                        onChangeText={(value) => handleEditChange('rate', value)}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Availability"
                        value={editData.availability}
                        onChangeText={(value) => handleEditChange('availability', value)}
                      />
                       <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={editData.location}
                        onChangeText={(value) => handleEditChange('location', value)}
                      />
                       <TextInput
                        style={styles.input}
                        placeholder="About"
                        value={editData.about}
                        onChangeText={(value) => handleEditChange('about', value)}
                      />
                    </>
                  )}
                  <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Text style={styles.info}>No user information available.</Text>
      )}

      <TouchableOpacity className="w-[140px] mb-[50px] bg-[#e63946] h-[50px] rounded-md ml-[120px] mt-[50px]" onPress={handleLogout}>
        <Text className="text-center pt-2 text-[#fff] font-bold text-[22px]">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  editButton: {
    width: 120,
    marginLeft: 240,
    marginTop: 100,
    marginBottom: -20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e63946',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  profile_List:{
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
   
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default Profile;
