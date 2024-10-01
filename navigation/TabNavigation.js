import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Onboard from '../screens/Onboard'
import Home from '../screens/Home'
import Profile from '../screens/Profile'

const Tab = createBottomTabNavigator()
export default function TabNavigation() {
  return (
    <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Onboard" component={Onboard}/>
            <Tab.Screen name="Profile" component={Profile}/>
        </Tab.Navigator>
    </NavigationContainer>
  )
}