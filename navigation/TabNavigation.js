import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Profile from '../screens/Profile';
import Notification from '../screens/Notification';
import Resources from '../screens/Resources';
import StackNavigation from './StackNavigation';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator()
export default function TabNavigation() {
  return (
    
        <Tab.Navigator>
           <Tab.Screen name="HomeScreen" component={HomeScreen} 
            options={{
                tabBarLabel:({color})=>(
                    <Text style={{fontSize: 16, marginBottom: 3}}>Home</Text>
                ),
                tabBarIcon:(color, size)=>(
                    <Ionicons name="home" size={18} color="red" />
                )
            }} />
            <Tab.Screen name="Notification" component={Notification}/>
            <Tab.Screen name="Resources" component={Resources}/>
            <Tab.Screen name="Profile" component={Profile}/>
        </Tab.Navigator>
    
  )
}