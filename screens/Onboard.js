import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { app } from '../firebase/firebaseConfig';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function Onboard() {
    const navigation = useNavigation();
    
    const [image, setImage] = useState(null);
    const db = getFirestore(app);
    const storage = getStorage();
    const [loading, setLoading] = useState(false);

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

    const onSubmitMethod = async (value) => {
        setLoading(true);

        // Upload image to Firebase storage
        const resp = await fetch(image);
        const blob = await resp.blob();
        const storageRef = ref(storage, 'garuDasie/' + Date.now() + ".jpg");
        
        uploadBytes(storageRef, blob).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
                value.image = downloadURL;

                // Adding teacher info to Firebase Firestore
                const docRef = await addDoc(collection(db, "userPost"), value);
                if (docRef.id) {
                    setLoading(false);
                    Alert.alert('Success!', 'Teacher onboarded successfully');
                    navigation.navigate('Home');
                }
            });
        });
    };

    return (
        <KeyboardAvoidingView>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>Onboard Teacher</Text>
                <Text className="text-center text-[16px] pt-2 text-grey-500 mb-2">Onboard yourself to start teaching!</Text>
                
                <Formik 
                    initialValues={{ fullName: '', phoneNumber: '', email: '', specialization: '', qualification: '', experience: '', address: '', image: '' }}
                    onSubmit={value => onSubmitMethod(value)}
                    validate={(values) => {
                        const errors = {};
                        if (!values.fullName) {
                            ToastAndroid.show('Please provide full name', ToastAndroid.SHORT);
                            errors.name = "Full name is required";
                        }
                        if (!values.email) {
                            ToastAndroid.show('Please provide an email address', ToastAndroid.SHORT);
                            errors.email = "Email is required";
                        }
                        return errors;
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <View>
                            <TouchableOpacity onPress={pickImage}>
                                {image ? 
                                    <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                                    : <Image source={require('../assets/icon.png')} style={{ width: 100, height: 100, borderRadius: 10 }} />
                                }  
                                <Text>Upload Profile Image</Text>
                            </TouchableOpacity>

                            <TextInput style={styles.input} placeholder='Full Name' value={values.fullName} onChangeText={handleChange('fullName')} />
                            <TextInput style={styles.input} placeholder='Phone Number' value={values.phoneNumber} onChangeText={handleChange('phoneNumber')} keyboardType='phone-pad' />
                            <TextInput style={styles.input} placeholder='Email Address' value={values.email} onChangeText={handleChange('email')} keyboardType='email-address' />
                            <TextInput style={styles.input} placeholder='Specialization' value={values.specialization} onChangeText={handleChange('specialization')} />
                            <TextInput style={styles.input} placeholder='Qualification' value={values.qualification} onChangeText={handleChange('qualification')} />
                            <TextInput style={styles.input} placeholder='Years of Experience' value={values.experience} onChangeText={handleChange('experience')} keyboardType='numeric' />
                            <TextInput style={styles.input} placeholder='Address' value={values.address} onChangeText={handleChange('address')} />

                            <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: loading ? '#ccc' : 'blue' }} disabled={loading} className="p-2 mt-3 mb-10 bg-blue-500 rounded-full">
                                {loading ? <ActivityIndicator color='green' /> : <Text className="text-center text-white text-[18px]">Submit</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 17,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
