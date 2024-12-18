import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserRegistration from '../screens/UserRegistration';
import HomeScreen from '../screens/HomeScreen';
import UserLogin from '../screens/UserLogin';
import TabNavigation from './TabNavigation';
import TeacherDetails from '../screens/TeacherDetails';

const Stack = createStackNavigator();

export default function StackNavigation({ isLoggedIn }) {
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
        <Stack.Screen name="Home-Tab" component={TabNavigation} 
        options={{ headerShown: false,
          headerStyle:{
                        backgroundColor: 'lightgray'
                    },
         }} 

        />
        <Stack.Screen name="TeacherDetails" component={TeacherDetails}
           options={{
                    headerStyle:{
                        backgroundColor: 'lightgray'
                    },
                    headerTitle: 'Detail'
                }}
         />
        </>
      ) : (
        <>
          <Stack.Screen name="UserLogin" component={UserLogin} 
          options={{ headerShown: false, 
            headerStyle:{
                        backgroundColor: 'lightgray'
                    },
          }
          
          } 
            
          />
          <Stack.Screen name="UserRegistration" component={UserRegistration} 
          options={{headerShown: false,
            headerStyle:{
                        backgroundColor: 'lightgray'
                    },
          }} />
         
        </>
      )}
    </Stack.Navigator>
  );
}
