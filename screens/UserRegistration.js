import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StyleSheet, Image } from 'react-native';
import { app } from '../firebase/firebaseConfig';
import { collection, addDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';

export default function UserRegistration({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('student');
    const [image, setImage] = useState(null);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
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
                    uid: user.uid,
                    createdAt: serverTimestamp()
                });
            }

            if (role === 'student') {
                await addDoc(collection(db, "students"), { 
                    email: values.email, 
                    fullName: values.fullName,  
                    phoneNumber: values.phoneNumber,
                    role, 
                    uid: user.uid,
                    createdAt: serverTimestamp()
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
       
            <Text style={styles.title}>Register as a {role === 'teacher' ? 'Teacher' : 'Student'}</Text>

            <Formik
                initialValues={{
                    email: '', password: '', confirmPassword: '', fullName: '', phoneNumber: '',
                    specialization: '', qualification: '', experience: '', address: '', rate: '',
                    availability: '', location: '', about: ''
                }}
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
                        <View style={[styles.pickerContainer]}>
                            <Picker
                                selectedValue={role}
                                style={styles.picker_input}
                                onValueChange={(itemValue) => setRole(itemValue)}
                            >
                                <Picker.Item label="Student" value="student" />
                                <Picker.Item label="Teacher" value="teacher" />
                            </Picker>
                        </View>

                        <TextInput style={styles.input} placeholder="Email Address" value={values.email} onChangeText={handleChange('email')} keyboardType="email-address" />
                        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                        <TextInput style={styles.input} placeholder="Password" value={values.password} onChangeText={handleChange('password')} secureTextEntry />
                        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

                        <TextInput style={styles.input} placeholder="Confirm Password" value={values.confirmPassword} onChangeText={handleChange('confirmPassword')} secureTextEntry />
                        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

                        <TextInput style={styles.input} placeholder="Full Name" value={values.fullName} onChangeText={handleChange('fullName')} />
                        {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

                        <TextInput style={styles.input} placeholder="Phone Number" value={values.phoneNumber} onChangeText={handleChange('phoneNumber')} keyboardType="phone-pad" />
                        {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}

                        {role === 'teacher' && !showAdditionalFields && (
                            <TouchableOpacity onPress={() => setShowAdditionalFields(true)} style={styles.nextButton}>
                                <Text style={styles.nextButtonText}>Next</Text>
                            </TouchableOpacity>
                        )}

                        {role === 'teacher' && showAdditionalFields && (
                            <>
                                <TouchableOpacity onPress={pickImage}>
                                    {image ? (
                                        <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                                    ) : (
                                        <Image source={require('../assets/adaptive-icon.png')} style={{ width: 100, height: 100, borderRadius: 10 }} />
                                    )}
                                    <Text style={styles.uploadText}>Upload Profile Image</Text>
                                </TouchableOpacity>

                                <TextInput style={styles.input} placeholder="Specialization" value={values.specialization} onChangeText={handleChange('specialization')} />

                                <TextInput style={styles.input} placeholder="Qualification" value={values.qualification} onChangeText={handleChange('qualification')} />

                                <TextInput style={styles.input} placeholder="Years of Experience" value={values.experience} onChangeText={handleChange('experience')} keyboardType="numeric" />

                                <TextInput style={styles.input} placeholder="Address" value={values.address} onChangeText={handleChange('address')} />

                                <View style={styles.currencyContainer}>
                                    <TextInput style={[styles.input, { flex: 1 }]} placeholder="Rate per month" value={values.rate} onChangeText={handleChange('rate')} keyboardType="numeric" />
                                    <Text style={styles.currencyLabel}>GHS</Text>
                                </View>

                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={values.availability} style={styles.picker_input} onValueChange={handleChange('availability')}>
                                        <Picker.Item label="Select Availability" value="" />
                                        <Picker.Item label="Monday to Friday" value="Monday to Friday" />
                                        <Picker.Item label="Saturday & Sunday" value="Saturday & Sunday" />
                                    </Picker>
                                </View>

                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={values.location} style={styles.picker_input} onValueChange={handleChange('location')}>
                                        <Picker.Item label="Select Location" value="" />
                                        <Picker.Item label="In-person" value="In-person" />
                                        <Picker.Item label="Online" value="Online" />
                                    </Picker>
                                </View>

                                <TextInput style={[styles.input, { height: 80 }]} placeholder="About you" value={values.about} onChangeText={handleChange('about')} multiline />
                            </>
                        )}

                        {((role === 'teacher' && showAdditionalFields) || role === 'student') && (
                            <TouchableOpacity onPress={handleSubmit} style={[styles.submitButton, { backgroundColor: loading ? '#ccc' : '#e63946' }]} disabled={loading}>
                                {loading ? <ActivityIndicator color="green" /> : <Text style={styles.submitButtonText}>Submit</Text>}
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </Formik>
            <View className="mt-8 mb-8">
                <Text className="text-[22px] text-[#0f4c5c] text-center">Have an account already?</Text>
                <TouchableOpacity className="mt-8 justify-items-center" onPress={() => navigation.navigate("UserLogin")}>
                <Text className="text-[22px] text-center bg-[#2a9d8f] text-white w-[150px] p-3 ml-[100px] rounded-md ">Login</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" color="gray" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        padding: 10 
    },
    title: { 
        fontSize: 30, 
        color: '#2a9d8f', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginVertical: 22,
        marginTop: 40, 
    
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#2a9d8f', 
        borderRadius: 10,
         padding: 10, 
         fontSize: 17, 
         marginVertical: 10 },
    pickerContainer: { 
        borderWidth: 1, 
        borderColor: '#2a9d8f', 
        borderRadius: 10, 
        marginVertical: 10
     },
    picker_input: { 
        color: '#2a9d8f', 
        fontSize: 18, 
        padding: 10 
    },
    error: { 
        color: 'red', 
        fontSize: 16, 
        marginBottom: 5 
    },
    currencyContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical: 10 
    },
    currencyLabel: { 
        fontSize: 17, 
        color: '#2a9d8f',
        marginLeft: 5 
    },
    uploadText: { 
        color: '#2a9d8f', 
        fontSize: 18, 
        marginTop: 5, 
        marginBottom: 20 
    },
    nextButton: { 
        backgroundColor: '#2a9d8f', 
        padding: 15, borderRadius: 10, 
        alignItems: 'center', 
        marginVertical: 20 
    },
    nextButtonText: { 
        color: '#fff', 
        fontSize: 20 
    },
    submitButton: { 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center',
         marginVertical: 20 
        },
    submitButtonText: { 
        color: '#fff', 
        fontSize: 20 
    },
});
