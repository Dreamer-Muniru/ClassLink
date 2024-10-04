import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './navigation/TabNavigation';
import StackNavigation from './navigation/StackNavigation';
import { useEffect, useState } from 'react';
import { auth } from './firebase/firebaseConfig'; // Adjust the path as necessary
import { onAuthStateChanged } from 'firebase/auth';
import UserLogin from './screens/UserLogin';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <TabNavigation /> : <UserLogin />}
    </NavigationContainer>
  );
}


