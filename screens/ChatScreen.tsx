import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from 'react-native';
import {NavigationProps} from "../types/navigationType.ts";
import {Icon} from "@ui-kitten/components";
// import { ArrowLeft, Phone, Video, Send, Smile, PaperClip, Plus } from 'lucide-react-native';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: string;
}

const initialMessages: Message[] = [
    {
        id: '1',
        text: 'Hi there! Did you get a chance to review the marketing proposal?',
        sender: 'other',
        timestamp: 'Yesterday'
    },
    {
        id: '2',
        text: 'Yes, I did! I think it looks really promising.',
        sender: 'user',
        timestamp: 'Yesterday'
    }
];

const ChatScreen: React.FC<NavigationProps> = ({ navigation, route }) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState('');
    const friend = route.params?.friend;

    const sendMessage = () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: inputText,
                sender: 'user',
                timestamp: 'Just now',
            };
            setMessages([...messages, newMessage]);
            setInputText('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    {/*<ArrowLeft size={24} color="#000" />*/}
                </TouchableOpacity>

                <View style={styles.profileContainer}>
                    <Image source={{ uri: friend.avatar }} style={styles.avatar} />
                    <View>
                        <Text style={styles.userName}>{friend.name}</Text>
                        <Text style={styles.userStatus}>Last seen 3 hours ago</Text>
                    </View>
                </View>

                {/*<View style={styles.actionButtons}>*/}
                {/*    <TouchableOpacity style={styles.actionButton}>*/}
                {/*        <Phone size={20} color="#000" />*/}
                {/*    </TouchableOpacity>*/}
                {/*    <TouchableOpacity style={styles.actionButton}>*/}
                {/*        <Video size={20} color="#000" />*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}
            </View>

            <View style={styles.divider} />

            {/* Messages */}
            <ScrollView style={styles.messagesContainer}>
                {messages.map((message) => (
                    <View
                        key={message.id}
                        style={[
                            styles.messageWrapper,
                            message.sender === 'user' ? styles.userMessageWrapper : styles.otherMessageWrapper
                        ]}
                    >
                        {/*{message.sender === 'other' && (*/}
                        {/*    <View style={styles.smallAvatarContainer}>*/}
                        {/*        <Text style={styles.smallAvatarText}>SW</Text>*/}
                        {/*    </View>*/}
                        {/*)}*/}

                        <View style={[
                            styles.messageBubble,
                            message.sender === 'user' ? styles.userMessage : styles.otherMessage
                        ]}>
                            <Text style={[
                                styles.messageText,
                                message.sender === 'user' ? styles.userMessageText : styles.otherMessageText
                            ]}>
                                {message.text}
                            </Text>
                        </View>

                        <Text style={styles.timestamp}>{message.timestamp}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                {/*<TouchableOpacity style={styles.attachButton}>*/}
                {/*    <Plus size={24} color="#666" />*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity style={styles.attachButton}>*/}
                {/*    <PaperClip size={24} color="#666" />*/}
                {/*</TouchableOpacity>*/}

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    {/*<TouchableOpacity style={styles.emojiButton}>*/}
                    {/*    <Smile size={24} color="#666" />*/}
                    {/*</TouchableOpacity>*/}
                </View>

                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}
                >
                    {/*<Send size={24} color="#fff" />*/}
                    <Icon name={'navigation-2-outline'} fill={'#fff'} style={{ width: 24, height: 24 }} ></Icon>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        marginRight: 12,
    },
    profileContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#aaa',
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userStatus: {
        fontSize: 12,
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messageWrapper: {
        marginBottom: 16,
        maxWidth: '80%',
    },
    userMessageWrapper: {
        alignSelf: 'flex-end',
    },
    otherMessageWrapper: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    smallAvatarContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#e0e0ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    smallAvatarText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#5050ff',
    },
    messageBubble: {
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    userMessage: {
        backgroundColor: '#4080ff',
    },
    otherMessage: {
        backgroundColor: '#f0f0f0',
    },
    messageText: {
        fontSize: 16,
    },
    userMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#000',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    attachButton: {
        marginRight: 8,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
    },
    emojiButton: {
        marginLeft: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
