import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen({navigation}) {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    // const navigation = useNavigation(); // Use navigation

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

    // Reload data when the HomeScreen is focused
    useFocusEffect(
        useCallback(() => {
            fetchTeachers();
        }, [])
    );
 
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TeacherDetails', { teacher: item })}>
            <Image source={{ uri: item.image }} style={styles.profileImage} />
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.specialization}>{item.specialization}</Text>
            <Text style={styles.qualification}>{item.qualification}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Our Teachers</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 45,
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
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
        shadowRadius: 4,
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
        marginTop: 5,
    },
    qualification: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
});
