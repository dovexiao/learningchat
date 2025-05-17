import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {NavigationProps} from "../types/navigationType.ts";
import {Icon} from "@ui-kitten/components";
import {useGlobal} from "../hooks/GlobalContext.tsx";
import VersionHistory from "../component/Modal/VersionHistory.tsx";

interface Project {
    id: string;
    name: string;
    type: string;
    status: string;
    owner: string;
    created: string;
}

const projectsData: Project[] = [
    { id: '1', name: 'Project Alpha', type: 'Development', status: 'Active', owner: 'Team A', created: '2025-01-10' },
    { id: '2', name: 'Marketing Campaign', type: 'Marketing', status: 'Planning', owner: 'Team B', created: '2025-01-12' },
    { id: '3', name: 'Server Upgrade', type: 'Infrastructure', status: 'Completed', owner: 'Team C', created: '2025-01-14' },
];

export const ResourcesScreen: React.FC<NavigationProps> = ({ navigation, route }) => {
    const { slideOutViewRef } = useGlobal();
    const [visible, setVisible] = React.useState(true);

    const renderHeader = () => (
        <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.headerCell, styles.cell, { width: 125 }]}>Name</Text>
            <Text style={[styles.headerCell, styles.cell, { width: 125 }]}>Type</Text>
            <Text style={[styles.headerCell, styles.cell, { width: 125 }]}>Status</Text>
            <Text style={[styles.headerCell, styles.cell, { width: 125 }]}>Owner</Text>
            <Text style={[styles.headerCell, styles.cell, { width: 125 }]}>Created</Text>
        </View>
    );

    const renderItem = (item: Project) => (
        <View key={item.id} style={styles.row}>
            <Text style={[styles.cell, { width: 125 }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.cell, { width: 125 }]} numberOfLines={1}>{item.type}</Text>
            <Text style={[styles.cell, { width: 125 }]} numberOfLines={1}>{item.status}</Text>
            <Text style={[styles.cell, { width: 125 }]} numberOfLines={1}>{item.owner}</Text>
            <Text style={[styles.cell, { width: 125 }]} numberOfLines={1}>{item.created}</Text>
        </View>
    );

    // @ts-ignore
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => slideOutViewRef.current?.show('Resources', navigation)} style={styles.menuButton}>
                    <Icon name={'menu-outline'} style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>资源管理</Text>
                <View style={{width: 28}} />
            </View>

            <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.versionButton} onPress={() => setVisible(!visible)}>
                    <Icon name={'options-outline'} fill={'#FFFFFF'} style={{ width: 20, height: 20 }}></Icon>
                    <Text style={styles.versionText}>版本树</Text>
                </TouchableOpacity>
            </View>

            {visible && <VersionHistory/>}

            <ScrollView>
                <ScrollView
                    horizontal={true}        // 启用横向滚动
                    showsHorizontalScrollIndicator={false}  // 可选：隐藏水平滚动条
                    style={styles.scrollView}
                >
                    <View style={styles.tableContainer}>
                        {renderHeader()}
                        {projectsData.map(renderItem)}
                    </View>
                </ScrollView>
                <View style={{height: 40}}></View>
            </ScrollView>

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
        justifyContent: 'flex-end',
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
    versionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CED4DA',
        backgroundColor: '#212529', // 登出按钮背景色
    },
    versionText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    scrollView: {
        width: '100%',
        backgroundColor: '#f9f9f9'
    },
    tableContainer: {
        flexDirection: 'column'
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        paddingVertical: 25,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    headerRow: {
        backgroundColor: '#e9ecef',
        borderBottomWidth: 2,
        borderBottomColor: '#ced4da',
        paddingVertical: 30,
        paddingHorizontal: 15
    },
    cell: {
        fontSize: 14,
        color: '#495057',
        paddingHorizontal: 6,
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#212529',
    },
    actionText: {
        color: '#007bff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
