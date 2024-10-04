import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserRegistration from '../screens/UserRegistration'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Home';
import UserLogin from '../screens/UserLogin';
import TabNavigation from './TabNavigation';

// const Stack = createNativeStackNavigator()
const Stack = createStackNavigator();

export default function StackNavigation() {

  return (
      <Stack.Navigator>
          <Stack.Screen name="UserLogin" component={UserLogin} />
          <Stack.Screen name="UserRegister" component={UserRegistration}/>
      </Stack.Navigator>

  )
}