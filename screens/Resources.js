import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';

export default function Resources() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [textInput, setTextInput] = useState('');
    const apiKey = ''
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const handleSend = async () => {
        if (!textInput.trim()) return; 
        setLoading(true);

        try {
            const response = await axios.post(apiUrl, {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: textInput }],
                max_tokens: 1024,
                temperature: 0.5
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const text = response.data.choices[0].message.content;
            setData([...data, { type: 'user', text: textInput }, { type: 'bot', text }]);
            setTextInput('');
        } catch (error) {
            console.error("Request failed:", error);
            alert("An error occurred while processing your request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                style={styles.body}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', color: item.type === 'user' ? 'green' : 'red' }}>
                            {item.type === 'user' ? 'Dreamer' : 'Bot'}
                        </Text>
                        <Text style={styles.bot}>{item.text}</Text>
                    </View>
                )}
            />

            {loading && <ActivityIndicator size="large" color="#2a9d8f" />}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask me anything..."
                    value={textInput}
                    onChangeText={setTextInput}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: { backgroundColor: '#fffcc9', width: '100%', margin: 10 },
    bot: { fontSize: 16, marginLeft: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        width: '90%',
        height: 40,
        marginBottom: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' },
    sendButton: { backgroundColor: '#2a9d8f', padding: 10, borderRadius: 20, marginLeft: 10 },
    sendButtonText: { color: '#fff', fontSize: 16 },
});
