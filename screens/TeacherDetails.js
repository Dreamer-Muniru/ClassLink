import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Linking } from 'react-native';

export default function TeacherDetails({ route }) {
  const { teacher } = route.params || {}
  

  const handleBookPress = () => {
    // Open the phone dialer with the teacher's phone number
    const phoneNumber = `tel:${teacher.phoneNumber}`;
    Linking.openURL(phoneNumber);
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-3xl font-bold text-center text-[#2a9d8f] mb-6">Teacher Details</Text>
      
      <View className="items-center mb-6">
        <Image
          source={{ uri: teacher.image }}
          className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-md mb-4"
        />
        <Text className="text-2xl font-semibold text-gray-900">{teacher.fullName}</Text>
      </View>

      <View className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        {/* <Text className="text-lg text-gray-700">
          <Text className="font-bold">Phone Number: </Text>{teacher.phoneNumber}
        </Text> */}
        <Text className="text-lg text-gray-700">
          <Text className="font-bold">Subject: </Text>{teacher.specialization}
        </Text>
        <Text className="text-lg text-gray-700">
          <Text className="font-bold">Qualification: </Text>{teacher.qualification}
        </Text>
        <Text className="text-lg text-gray-700">
          <Text className="font-bold">Experience: </Text>{teacher.experience} years
        </Text>
        <Text className="text-lg text-gray-700">
          <Text className="font-bold">Address: </Text>{teacher.address}
        </Text>
      </View>

      {/* Book Button */}
      <View className="items-center mt-6">
        <TouchableOpacity
          onPress={handleBookPress}
          className="bg-[#e63946] w-[150px] py-3 px-6 rounded-full shadow-lg"
        >
          <Text className="text-lg text-white text-center font-bold">Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
