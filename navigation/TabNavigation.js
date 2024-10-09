import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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
            <Tab.Screen name="Resources" component={Resources}
                options={{
                    tabBarLabel:({color})=>(
                        <Text className="text-[18px] mb-[20px]">Resources</Text>
                    ),
                    tabBarIcon:()=>(
                        <FontAwesome5 name="chalkboard-teacher" size={14} color="black" />
                    )
                }}
            />
            <Tab.Screen name="Notification" component={Notification}
                options={{
                    headerStyle:{
                        backgroundColor: '#3b82f6'
                    },
                    headerTitle: 'Notification'
                }}
            />
            <Tab.Screen name="Profile" component={Profile}/>
        </Tab.Navigator>
    
  )
}