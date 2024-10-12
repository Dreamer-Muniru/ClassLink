import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';


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
                    <Ionicons name="home" size={18} color="#2a9d8f" />
                )
            }} />
            <Tab.Screen name="Resources" component={Resources}
                options={{
                    tabBarLabel:({color})=>(
                        <Text className="text-[18px] pb-5">Resources</Text>
                    ),
                    tabBarIcon:()=>(
                        <FontAwesome5 name="chalkboard-teacher" size={18} color="#2a9d8f" />
                    )
                }}
            />
            <Tab.Screen name="Notification" component={Notification}
               options={{
                    tabBarLabel:({color})=>(
                        <Text className="text-[18px] pb-5">Notification</Text>
                    ),
                    tabBarIcon:()=>(
                        <Ionicons name="notifications" size={24} color="#2a9d8f" />
                    
                    )
                }}
            />
            <Tab.Screen name="Profile" component={Profile}
                options={{
                    tabBarLabel:({color})=>(
                        <Text className="text-[18px] pb-5">Profile</Text>
                    ),
                    tabBarIcon:()=>(
                        <FontAwesome name="user" size={24} color="#2a9d8f" />
                    
                    )
                }}
            />
        </Tab.Navigator>
    
  )
}