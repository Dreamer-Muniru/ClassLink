import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function TeacherDetails({route}) {
    const { teacher } = route.params;
  return (
    <View style={styles.container}>
      <Text className="text-[30px] text-center mb-5">Teacher Details</Text>
            <Image source={{ uri: teacher.image }} style={styles.profileImage} />
            <Text style={styles.header}>{teacher.fullName}</Text>
            <Text style={styles.detail}>Phone Number: {teacher.phoneNumber}</Text>
            <Text style={styles.detail}>Specialization: {teacher.specialization}</Text>
            <Text style={styles.detail}>Qualification: {teacher.qualification}</Text>
            <Text style={styles.detail}>Experience: {teacher.experience} years</Text>
            <Text style={styles.detail}>Address: {teacher.address}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detail: {
        fontSize: 22,
        marginVertical: 5,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
});