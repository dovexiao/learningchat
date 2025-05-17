import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {NavigationProps} from "../types/navigationType.ts";
import {Icon} from "@ui-kitten/components";
import SlideOutView from "../component/Modal/SlideOutView.tsx";
import {useGlobal} from "../hooks/GlobalContext.tsx";

// 定义好友数据类型
type Friend = {
    id: string;
    name: string;
    status: string;
    avatar: string;
    handlePress?: () => void;
};

const friendsData: Friend[] = [
    { id: '1', name: 'Alex Johnson', status: 'Online', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { id: '2', name: 'Sarah Williams', status: 'Last seen 3 hours ago', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: '3', name: 'Michael Brown', status: 'Online', avatar: 'https://i.pravatar.cc/150?u=michael' },
    { id: '4', name: 'Emily Davis', status: 'Last seen 30 minutes ago', avatar: 'https://i.pravatar.cc/150?u=emily' },
    { id: '5', name: 'David Wilson', status: 'Last seen 1 day ago', avatar: 'https://i.pravatar.cc/150?u=david' },
];

const FriendItem = ({ name, status, avatar, handlePress }: Friend) => (
    <TouchableOpacity style={styles.friendItemContainer} onPress={handlePress}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{name}</Text>
            <Text style={styles.friendStatus}>{status}</Text>
        </View>
        {/*<TouchableOpacity style={styles.actionButton}>*/}
        {/*    <Text style={styles.actionButtonText}>Message</Text>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity style={[styles.actionButton, styles.profileButton]}>*/}
        {/*    <Text style={styles.actionButtonText}>Profile</Text>*/}
        {/*</TouchableOpacity>*/}
    </TouchableOpacity>
);

export const FriendsListScreen: React.FC<NavigationProps> = ({ navigation, route }) => {
    const { slideOutViewRef } = useGlobal();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => slideOutViewRef.current?.show('Friends', navigation)} style={styles.menuButton}>
                    {/*<Menu color="#212529" size={28} />*/}
                    <Icon name={'menu-outline'} style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>好友列表</Text>
                <View style={{width: 28}} />
            </View>

            <View style={styles.controlsContainer}>
                <View style={styles.searchContainer}>
                    {/*<Search color="#6C757D" size={20} style={styles.searchIcon} />*/}
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search friends..."
                        placeholderTextColor="#6C757D"
                    />
                </View>
                <TouchableOpacity style={styles.addFriendButton}>
                    {/*<UserPlus color="#FFFFFF" size={20} />*/}
                    <Text style={styles.addFriendButtonText}>加友</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={friendsData}
                renderItem={({ item }) => <FriendItem {...item} handlePress={() => navigation.navigate('Chat', { friend: item })}/>}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContentContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    menuButton: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#212529',
    },
    controlsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        marginBottom: 8,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F3F5',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#212529',
    },
    addFriendButton: {
        flexDirection: 'row',
        backgroundColor: '#212529',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    addFriendButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    listContentContainer: {
        paddingHorizontal: 16,
    },
    friendItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
    },
    friendStatus: {
        fontSize: 13,
        color: '#6C757D',
        marginTop: 2,
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#E9ECEF',
        marginLeft: 8,
    },
    profileButton: {
        backgroundColor: '#DEE2E6',
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#212529',
    },
});
