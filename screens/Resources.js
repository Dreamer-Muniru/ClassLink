import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import {openAI} from 'openai';

// Initialize the API key and base URL
const DEEPSEEK_API_KEY = ""
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; 

export default function Resources() {
    const [userInput, setUserInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
        
        const userMessage = { sender: 'user', text: userInput };
        setChatMessages([...chatMessages, userMessage]);
        setUserInput('');
        
        try {
            setLoading(true);

            // Send the user's message to DeepSeek's API using axios
            const response = await axios.post(
                DEEPSEEK_API_URL,
                {
                    model: "deepseek-chat", // DeepSeek's model name
                    messages: [
                        { role: "system", content: "You are a helpful assistant." }, 
                        { role: "user", content: userInput }, 
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Extract the AI's response
            const aiMessage = { sender: 'bot', text: response.data.choices[0].message.content };
            setChatMessages(prevMessages => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error('API Error:', error);
            const errorMessage = { sender: 'bot', text: 'Something went wrong. Please try again later.' };
            setChatMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.chatContainer}>
                {chatMessages.map((msg, index) => (
                    <View key={index} style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
                        <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                ))}
            </ScrollView>
            
            {loading && <ActivityIndicator size="large" color="#2a9d8f" />}
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask me anything..."
                    value={userInput}
                    onChangeText={setUserInput}
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" color="black" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    chatContainer: { 
        flex: 1, 
        padding: 10 
    },
    userMessage: {
         alignSelf: 'flex-end', 
         backgroundColor: '#2a9d8f',
        borderRadius: 10, 
        padding: 10, 
        marginVertical: 5 
    },
    botMessage: { 
        alignSelf: 'flex-start', 
        backgroundColor: '#e0e0e0', 
        borderRadius: 10, 
        padding: 10, 
        marginVertical: 5 },
        messageText: { 
        fontSize: 16, 
        color: '#333' 
    },
    inputContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10, 
        backgroundColor: '#fff' },
    input: { 
        flex: 1, 
        borderWidth: 1, 
        borderColor: '#2a9d8f', 
        borderRadius: 20, 
        paddingHorizontal: 10, 
        height: 40, 
        marginRight: 10 },
    sendButton: { 
        backgroundColor: '#2a9d8f', 
        padding: 10, 
        borderRadius: 15 
    },
    sendButtonText: {
         color: '#fff', 
         fontSize: 16 
        }
});