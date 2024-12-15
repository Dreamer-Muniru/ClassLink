import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function TrendingSubject() {
  return (
    <View>
      <View className="flex-row justify-between mt-5 ">
        <Text className="text-[20px] text-[#000] font-bold">Trending</Text>
        <Text className="text-[20px] text-[#ec6f84] font-bold">
        Subjects
        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        </Text>
      </View>
      <View className="mt-1">
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity className="w-[110px] flex-row h-[58px] mr-4 bg-[#2a9d8f] rounded-md">
                <Text className="text-[#fff] text-[18px] justify-center pt-4 pl-3 text-center font-bold">Chemistry</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[110px] flex-row h-[58px] mr-4 bg-[#2a9d8f] rounded-md">
                <Text className="text-[#fff] text-[18px] p-2 pl-4 justify-center text-center font-bold">Social Studies</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[110px] flex-row h-[58px] mr-4 bg-[#2a9d8f] rounded-md">
                <Text className="text-[#fff] text-[18px] justify-center pt-4 pl-6 text-center font-bold">Science</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[125px] flex-row h-[58px] mr-4 bg-[#2a9d8f] rounded-md">
                <Text className="text-[#fff] text-[18px] p-2 pt-4 text-center font-bold">Mathematics</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[110px] flex-row h-[58px] mr-4 bg-[#2a9d8f] rounded-md">
                <Text className="text-[#fff] text-[18px] justify-center pt-4 pl-6 text-center font-bold">English</Text>
            </TouchableOpacity>
          
       
        </ScrollView>
      </View>
    </View>
  )
}