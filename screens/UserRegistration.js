import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StyleSheet, Image } from 'react-native';
import { app } from '../firebase/firebaseConfig';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Formik } from 'formik';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function UserRegistration() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('student'); // Default to 'student'
    const [image, setImage] = useState(null); // For teacher profile image
    const db = getFirestore(app);
    const storage = getStorage();
    const navigation = useNavigation();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });
    
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmitMethod = async (values) => {
        setLoading(true);

        if (role === 'teacher' && image) {
            // Upload image to Firebase storage if teacher
            const resp = await fetch(image);
            const blob = await resp.blob();
            const storageRef = ref(storage, 'teacherProfiles/' + Date.now() + ".jpg");

            await uploadBytes(storageRef, blob);
            values.image = await getDownloadURL(storageRef);
        }

        try {
            // Add user info to Firebase Firestore
            const docRef = await addDoc(collection(db, "teachers"), { ...values, role });
            if (docRef.id) {
                setLoading(false);
                Alert.alert('Success!', `${role === 'teacher' ? 'Teacher' : 'Student'} registered successfully`);
                navigation.navigate('Home');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Something went wrong!');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text className="text-center text-[30px] text-grey-500 mb-2">Register as a {role === 'teacher' ? 'Teacher' : 'Student'}</Text>
            
            <Formik
                initialValues={{ email: '', password: '', confirmPassword: '', fullName: '', phoneNumber: '', specialization: '', qualification: '', experience: '', address: '' }}
                onSubmit={values => onSubmitMethod(values)}
                validate={(values) => {
                    const errors = {};
                    if (!values.email) {
                        errors.email = 'Email is required';
                    }
                    if (!values.password) {
                        errors.password = 'Password is required';
                    }
                    if (values.password !== values.confirmPassword) {
                        errors.confirmPassword = 'Passwords do not match';
                    }
                    if (role === 'teacher' && !values.fullName) {
                        errors.fullName = 'Full name is required';
                    }
                    return errors;
                }}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <View>
                        {/* Role Selection */}
                        <Picker
                            selectedValue={role}
                            style={styles.input}
                            onValueChange={(itemValue) => setRole(itemValue)}
                        >
                            <Picker.Item label="Student" value="student" />
                            <Picker.Item label="Teacher" value="teacher" />
                        </Picker>

                        {/* Shared Fields (Student/Teacher) */}
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            keyboardType="email-address"
                        />
                        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            secureTextEntry
                        />
                        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            secureTextEntry
                        />
                        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

                        {/* Additional Fields for Teachers */}
                        {role === 'teacher' && (
                            <>
                                <TouchableOpacity onPress={pickImage}>
                                    {image ? 
                                        <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                                        : <Image source={require('../assets/icon.png')} style={{ width: 100, height: 100, borderRadius: 10 }} />
                                    }
                                    <Text>Upload Profile Image</Text>
                                </TouchableOpacity>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    value={values.fullName}
                                    onChangeText={handleChange('fullName')}
                                />
                                {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone Number"
                                    value={values.phoneNumber}
                                    onChangeText={handleChange('phoneNumber')}
                                    keyboardType="phone-pad"
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Specialization"
                                    value={values.specialization}
                                    onChangeText={handleChange('specialization')}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Qualification"
                                    value={values.qualification}
                                    onChangeText={handleChange('qualification')}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Years of Experience"
                                    value={values.experience}
                                    onChangeText={handleChange('experience')}
                                    keyboardType="numeric"
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Address"
                                    value={values.address}
                                    onChangeText={handleChange('address')}
                                />
                            </>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: loading ? '#ccc' : 'blue' }} disabled={loading} className="p-2 mt-3 mb-10 bg-blue-500 rounded-full">
                            {loading ? <ActivityIndicator color="green" /> : <Text className="text-center text-white text-[18px]">Submit</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 17,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
    },
});
