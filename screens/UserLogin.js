import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function UserLogin({navigation}) {
  // const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user data into AsyncStorage to persist login state
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      
      Alert.alert('Success', 'Logged in successfully');
      navigation.navigate('Home'); 

    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} className="w-[140px] h-[140px] ml-[100px] rounded-full mb-4" />
      <Text style={styles.header}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <View className="mt-8">
        <Text className="text-[22px] text-[#0f4c5c] text-center">Don't have an account?</Text>
        <TouchableOpacity className="mt-8 justify-items-center" onPress={() => navigation.navigate("UserRegistration")}>
          <Text className="text-[22px] text-center bg-[#2a9d8f] text-white w-[150px] p-3 ml-[100px] rounded-md ">Register</Text>
        </TouchableOpacity>
      </View>
  
    </View>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 40,
    color: '#2a9d8f',
    textAlign: 'center',
    marginBottom: 42,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2a9d8f',
    borderRadius: 5,
    padding: 10,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#e63946',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  
});
