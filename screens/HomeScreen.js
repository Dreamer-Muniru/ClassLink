import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, Image, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';
import Header from '../components/Header'
import { Ionicons } from '@expo/vector-icons';
import TrendingSubject from '../components/TrendingSubject';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const db = getFirestore(app);

    // Function to fetch teachers from Firestore
    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'teachers'));
            const teacherList = [];
            querySnapshot.forEach((doc) => {
                teacherList.push({ id: doc.id, ...doc.data() });
            });
            setTeachers(teacherList);
            setLoading(false);
        } catch (error) {
            console.log("Error fetching teacher data:", error);
            setLoading(false);
        }
    };

    // Fetch data when the component is mounted
    useEffect(() => {
        fetchTeachers();
    }, []); // Empty dependency array ensures it runs only once

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TeacherDetails', { teacher: item })}>
            <Image source={{ uri: item.image }} style={styles.profileImage} />
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.specialization}>{item.specialization}</Text>
            <Text style={styles.qualification}>{item.qualification}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
        {/* Display i */}
        <Header/>
         {/* Search Bar Section */}
         <View style={styles.searchBar}>
            <Ionicons name="search" size={24} color="black" />
            <TextInput placeholder='Search for Teacher' style={styles.searchInput} />
        </View>
        <View>
            <TrendingSubject/>
        </View>
            <Text className="text-[24px] text-center mt-[20px] text-[#e94560] font-bold mb-3">Our Teachers</Text>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <FlatList
                    data={teachers}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            <StatusBar style="auto" color="gray" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        width: '48%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    specialization: {
        fontSize: 14,
        color: '#888',
        marginTop: 3,
    },
    qualification: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    input: {
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        marginTop: 30,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 22,
    },

    searchBar:{
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        paddingBottom: 10,
        backgroundColor: '#dbd7d7',
        borderRadius: 20,
        marginTop: 10
    },
    searchInput:{
        fontSize: 18,
        padding: 1,
        paddingLeft: 5,
    }
});
