import React from 'react';
import TopNavigationAvatar from "../TopNavigation/TopNavigationAvatar.tsx";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../types/navigationType.tsx";
import { Divider, Icon, Layout, useTheme } from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import { AccessList } from "../List";

type NoteNavigationProp = StackNavigationProp<RootStackParamList, 'NoteComponent'>;

const data = new Array(10).fill({
    title: '笔记库12323sfdgdgsfdhgsfdgdgdgdfsfstdfhcggfhdsdw',
    subTitle: '2025-04-15',
    other: '管理',
});

const SharedNote = () => {
    const navigation = useNavigation<NoteNavigationProp>();
    const themes = useTheme();

    const onNoteLibraryClick = (index: number) => {
        // navigation.navigate('NoteLibrary', { index });
    };

    const accessoryLeft = (): IconElement => (
        <Icon
            name="folder-outline"
            fill={themes['color-primary-500']}
        />
    )

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationAvatar
                navigation={navigation}
                // renderItemAccessory={renderItemAccessory}
            />
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <AccessList
                    data={data}
                    accessoryLeft={accessoryLeft}
                    accessoryRight={accessoryRight}
                    onListItemClick={onNoteLibraryClick}
                />
            </Layout>
        </SafeAreaView>
    );
};

const accessoryRight = () => (
    <Text>
        管理
    </Text>
)

const styles = StyleSheet.create({

});

export default SharedNote;
