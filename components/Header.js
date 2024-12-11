// import React, {useEffect, useState} from 'react';
// import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { auth } from '../firebase/firebaseConfig';
// import { signOut } from 'firebase/auth';
// import { getFirestore, query, where, getDocs, collection, updateDoc, doc } from 'firebase/firestore';

// export default function Header({ user }) {
//     // Extract the first name from the full name if available
//     const firstName = user?.fullName?.split(' ')[0] || 'Guest';
//     const profileImage = user?.imageUrl || 'https://via.placeholder.com/40'; // Default image if no URL is provided
//     const db = getFirestore();

//     useEffect(() => {
//         const fetchUserInfo = async () => {
//           const user = auth.currentUser;
//           if (user) {
//             try {
//               // Fetch teacher or student data based on UID
//               const teachersQuery = query(collection(db, 'teachers'), where('uid', '==', user.uid));
//               const teacherSnapshot = await getDocs(teachersQuery);
    
//               if (!teacherSnapshot.empty) {
//                 teacherSnapshot.forEach((doc) => {
//                   setUserInfo({ ...doc.data(), role: 'teacher', docId: doc.id });
//                 });
//               } else {
//                 const studentsQuery = query(collection(db, 'students'), where('uid', '==', user.uid));
//                 const studentSnapshot = await getDocs(studentsQuery);
    
//                 if (!studentSnapshot.empty) {
//                   studentSnapshot.forEach((doc) => {
//                     setUserInfo({ ...doc.data(), role: 'student', docId: doc.id });
//                   });
//                 } else {
//                   setUserInfo(null);
//                 }
//               }
//             } catch (error) {
//               console.error('Error fetching user data:', error);
//             }
//           }
//           setLoading(false);
//         };
    
//         fetchUserInfo();
//       }, [db]);
    
//     return (
//         <View className="mt-9">
//             {/* User Profile Section */}
//             {userInfo ? (
//                 <>
//                 <Image source={{ uri: userInfo.image }} style={styles.profileImage} className="mt-[-50px] mb-2" />
//                 <Text style={styles.header}>{userInfo.fullName}</Text>
//                 </>
//             )}
//             <View style={styles.container}>
//                 <Image 
//                     source={{ uri: profileImage }} 
//                     style={styles.profileImage} 
//                 />

//                 <View>
//                     <Text style={styles.welcome}>Welcome</Text>
//                     <Text style={styles.userName}>{firstName}</Text>
//                 </View>
//             </View>
           

//             {/* Search Bar Section */}
//             <View style={styles.searchBar}>
//                 <Ionicons name="search" size={24} color="black" />
//                 <TextInput 
//                     placeholder="Search" 
//                     style={styles.searchInput} 
//                 />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     profileImage: {
//         width: 40,
//         height: 40,
//         borderRadius: 20, // Circle image
//     },
//     container: {
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10, // Space between image and text
//     },
//     welcome: {
//         fontSize: 16,
//         color: '#555', // Subtle color for "Welcome"
//     },
//     userName: {
//         fontWeight: 'bold',
//         fontSize: 18,
//         color: '#000', // Primary text color
//     },
//     searchBar: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         backgroundColor: '#f0f0f0',
//         borderRadius: 20,
//         marginTop: 10,
//     },
//     searchInput: {
//         fontSize: 16,
//         marginLeft: 10,
//         flex: 1, // Expand to fill remaining space
//     },
// });