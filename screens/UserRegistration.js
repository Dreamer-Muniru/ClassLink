import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StyleSheet, Image } from 'react-native';
import { app } from '../firebase/firebaseConfig';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function UserRegistration({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('student'); 
    const [image, setImage] = useState(null); 
    const db = getFirestore(app);
    const storage = getStorage();

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

        const auth = getAuth(app);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            if (role === 'teacher') {
                if (image) {
                    const resp = await fetch(image);
                    const blob = await resp.blob();
                    const storageRef = ref(storage, 'teacherProfiles/' + Date.now() + ".jpg");

                    await uploadBytes(storageRef, blob);
                    values.image = await getDownloadURL(storageRef);
                }

                await addDoc(collection(db, "teachers"), { 
                    ...values, 
                    role, 
                    uid: user.uid 
                });
            }

            if (role === 'student') {
                await addDoc(collection(db, "students"), { 
                    email: values.email, 
                    fullName: values.fullName,  // Include full name
                    phoneNumber: values.phoneNumber,  // Include phone number
                    role, 
                    uid: user.uid 
                });
            }

            setLoading(false);
            Alert.alert('Success!', `${role === 'teacher' ? 'Teacher' : 'Student'} registered successfully`);
            navigation.navigate('Home');
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', error.message || 'Something went wrong!');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text className="text-center text-[30px] text-[#2a9d8f] mb-2 font-bold mt-[60px]">
                Register as a {role === 'teacher' ? 'Teacher' : 'Student'}
            </Text>

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
                    if (!values.fullName) {
                        errors.fullName = 'Full name is required';
                    }
                    if (!values.phoneNumber) {
                        errors.phoneNumber = 'Phone number is required';
                    }
                    return errors;
                }}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <View>
                        <Picker
                            selectedValue={role}
                            style={styles.picker_input}
                            onValueChange={(itemValue) => setRole(itemValue)}
                        >
                            <Picker.Item label="Student" value="student" />
                            <Picker.Item label="Teacher" value="teacher" />
                        </Picker>

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

                        {/* Full Name and Phone Number for both students and teachers */}
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
                        {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}

                        {/* Additional fields for teachers */}
                        {role === 'teacher' && (
                            <>
                                <TouchableOpacity onPress={pickImage}>
                                    {image ? (
                                        <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                                    ) : (
                                        <Image source={require('../assets/icon.png')} style={{ width: 100, height: 100, borderRadius: 10 }} />
                                    )}
                                    <Text>Upload Profile Image</Text>
                                </TouchableOpacity>

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

                        <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: loading ? '#ccc' : '#e63946' }} disabled={loading} className="p-2 mt-3 mb-10 rounded-full">
                            {loading ? <ActivityIndicator color="green" /> : <Text className="text-center font-bold text-white text-[22px]">Submit</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
            <View>
                <Text className="text-[22px] text-[#0f4c5c] text-center">Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('UserLogin')} className="mt-5 mb-7">
                    <Text className="text-[22px] text-center bg-[#2a9d8f] text-white w-[150px] p-3 ml-[100px] rounded-md ">Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#2a9d8f',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 17,
    },
    picker_input:{
        color: '#2a9d8f',
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 20,
    },
    error: {
        color: 'red',
        fontSize: 16,
        marginBottom: 5,
    },
});
