import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home'
import Profile from '../screens/Profile';
import Notification from '../screens/Notification';
import Resources from '../screens/Resources';

const Tab = createBottomTabNavigator()
export default function TabNavigation() {
  return (
    
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Notification" component={Notification}/>
            <Tab.Screen name="Resources" component={Resources}/>
            <Tab.Screen name="Profile" component={Profile}/>
        </Tab.Navigator>
    
  )
}