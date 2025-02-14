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
           <Tab.Screen name="Home" component={HomeScreen} 
            options={{
                tabBarLabel:()=>(
                    <Text style={{fontSize: 16, marginBottom: 3, marginTop: -6}}>Home</Text>
                ),

                headerShown: null,
                headerStyle:{
                        backgroundColor: 'lightgray'
                    },
                tabBarIcon:()=>(
                    <Ionicons name="home" size={20} color="#2a9d8f" />
                )
            }} />
            <Tab.Screen name="Resources" component={Resources}
                options={{
                    tabBarLabel:()=>(
                        <Text style={{fontSize: 16, marginBottom: 3, marginTop: -6}}>Resources</Text>
                    ),
                    headerStyle:{
                        backgroundColor: 'lightgray'
                    },
                    tabBarIcon:()=>(
                        <FontAwesome5 name="chalkboard-teacher" size={20} color="#2a9d8f" />
                    )
                }}
            />
            <Tab.Screen name="Notification" component={Notification}
               options={{
                    tabBarLabel:()=>(
                        <Text style={{fontSize: 16, marginBottom: 3, marginTop: -6}}>Notification</Text>
                    ),
                    headerStyle:{
                        backgroundColor: 'lightgray'
                    },
                    tabBarIcon:()=>(
                        <Ionicons name="notifications" size={24} color="#2a9d8f" />
                    
                    )
                }}
            />
            <Tab.Screen name="Profile" component={Profile}
                options={{
                    tabBarLabel:()=>(
                        <Text style={{fontSize: 16, marginBottom: 3, marginTop: -6}}>Profile</Text>
                    ),
                    headerStyle:{
                        backgroundColor: 'lightgray'
                    },
                    tabBarIcon:()=>(
                        <FontAwesome name="user" size={24} color="#2a9d8f" />
                    
                    )
                }}
            />
        </Tab.Navigator>
    
  )
}

