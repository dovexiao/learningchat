import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from "@ui-kitten/components";
import {useGlobal} from "../../hooks/GlobalContext.tsx";

interface VersionItem {
    id: string;
    title: string;
    date: string;
    author: string;
    isCurrent?: boolean;
    children?: VersionItem[];
}

const versionData: VersionItem[] = [
    {
        id: '1',
        title: 'Initial Version',
        date: '2025-01-15',
        author: 'Alex Johnson',
    }, {
        id: '2',
        title: 'Updated Fields',
        date: '2025-02-01',
        author: 'Sarah Williams',
    }, {
        id: '3',
        title: 'Added New Columns',
        date: '2025-03-10',
        author: 'Michael Brown',
    }, {
        id: '4',
        title: 'Latest Version',
        date: '2025-04-05',
        author: 'Alex Johnson',
    }, {
        id: '5',
        title: 'Test Branch',
        date: '2025-02-15',
        author: 'Emily Davis',
    }
];

const VersionItem: React.FC<{ item: VersionItem, currentVersion?: string, handleVersion?: () => void }> = ({
   item,
   currentVersion,
   handleVersion = () => {}
}) => {
    return (
        <View style={[styles.versionItem, currentVersion === item.id && styles.currentVersion]}>
            <TouchableOpacity
                style={styles.versionHeader}
                onPress={handleVersion}
            >
                {/*<View style={styles.iconContainer}>*/}
                {/*    {item.children && (*/}
                {/*        isExpanded ? (*/}
                {/*            // <ChevronDown size={18} color="#666" />*/}
                {/*            <Icon name={'chevron-down-outline'} fill={'#666'} style={{ width: 18, height: 18 }} />*/}
                {/*        ) : (*/}
                {/*            // <ChevronRight size={18} color="#666" />*/}
                {/*            <Icon name={'chevron-right-outline'} fill={'#666'} style={{ width: 18, height: 18 }} />*/}
                {/*        )*/}
                {/*    )}*/}
                {/*</View>*/}

                <View style={styles.versionInfo}>
                    <View style={styles.titleRow}>
                        <Text style={styles.versionTitle}>{item.title}</Text>
                        {currentVersion === item.id && <View style={styles.currentBadge}><Text style={styles.currentText}>Current</Text></View>}
                    </View>
                    <Text style={styles.versionMeta}>{item.date} by {item.author}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const VersionHistory: React.FC = () => {
    const { version, handleVersion } = useGlobal();

    return (
        <ScrollView style={styles.container}>
            {versionData.map(item => (
                <VersionItem
                    key={item.id}
                    item={item}
                    currentVersion={version}
                    handleVersion={() => handleVersion(item.id)}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 250,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    versionItem: {
        marginBottom: 8,
        borderRadius: 4,
    },
    currentVersion: {
        backgroundColor: '#f0f8ff',
    },
    versionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    iconContainer: {
        marginRight: 12,
        width: 24,
        alignItems: 'center',
    },
    versionInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    versionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    versionMeta: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    currentBadge: {
        backgroundColor: '#4caf50',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    currentText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default VersionHistory;
