import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserRegistration from '../screens/UserRegistration';
import HomeScreen from '../screens/HomeScreen';
import UserLogin from '../screens/UserLogin';
import TabNavigation from './TabNavigation'; // Import your tab navigation

const Stack = createStackNavigator();

export default function StackNavigation({ isLoggedIn }) {
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen name="Home" component={TabNavigation} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="UserLogin" component={UserLogin} options={{ headerShown: false }} />
          <Stack.Screen name="UserRegistration" component={UserRegistration} />
        </>
      )}
    </Stack.Navigator>
  );
}
