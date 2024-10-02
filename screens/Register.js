import { View, Text, TextInput, ScrollView } from 'react-native'
import React from 'react'

export default function Register() {
  return (
    <KeyboardAvoidingView>
        <ScrollView>
            <Text>Register</Text>
            <TextInput style={styles.input} placeholder='Full Name' value={values.fullName} onChangeText={handleChange('fullName')} />

        </ScrollView>

    </KeyboardAvoidingView>
  )
}