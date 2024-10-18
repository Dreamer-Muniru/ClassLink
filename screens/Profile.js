import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getFirestore, query, where, getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker'; // Import image picker
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

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
    <View >
      {userInfo ? (
        <>
          {/* Profile Information */}
          <View className="bg-[#2a9d8f] h-[200px] w-full rounded-bl-[20px] rounded-br-[20px] mb-10">
              <View className="w-[100px] h-[100px] rounded-full mt-[70px]">
                <View className="bg-[#fff] w-[350px] ml-[20px] h-[200px] rounded-2xl">
                  <Image source={{ uri: userInfo.image }} style={styles.profileImage} className="mt-[-50px] mb-2" />
                  <Text style={styles.header}>{userInfo.fullName}</Text>
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
                <Text className="text-center mb-3 bg-[#c7ece8] pb-3 text-[22px]">Specialization: {userInfo.specialization}</Text>
                <Text className="text-center mb-3 bg-[#c7ece8] pb-3 text-[22px]">Qualification: {userInfo.qualification}</Text>
                <Text className="text-center mb-5 bg-[#c7ece8] text-[22px]">Experience: {userInfo.experience} years</Text>
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

      <TouchableOpacity className="w-[140px] mb-[50px] bg-[#2a9d8f] h-[50px] rounded-md ml-[120px] mt-[50px]" onPress={handleLogout}>
        <Text className="text-center pt-2 text-[#fff] font-bold text-[22px]">Logout</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 20,
  },
  editButton: {
    width: 120,
    marginLeft: 240,
    marginTop: 30,
    marginBottom: -30,
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
