import React from 'react';
import {Divider, List, useTheme} from "@ui-kitten/components";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";

interface IListItem {
    title: string;
    subTitle: string;
    other: any;
}

interface ListProps {
    data: IListItem[],
    onListItemClick: (index: number) => void;
    accessoryLeft: () => React.ReactElement;
    accessoryRight: (item: IListItem) => React.ReactElement;
}

export const AccessList: React.FC<ListProps> = ({ data, onListItemClick, accessoryLeft, accessoryRight }) => {
    const themes = useTheme();

    const renderItem = ({ item, index }: { item: IListItem, index: number }) => (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: themes['background-basic-color-1']}]}
            onPress={() => onListItemClick(index)}
        >
            <View style={styles.avatarContainer}>
                {accessoryLeft()}
            </View>
            <View style={styles.contentContainer}>
                <Text style={[styles.title, { color: themes['text-basic-color'] }]} numberOfLines={1} ellipsizeMode={'tail'}>
                    {item.title}
                </Text>
                <Text style={[styles.subTitle, { color: themes['text-basic-color'] }]} numberOfLines={1} ellipsizeMode={'tail'}>
                    {item.subTitle}
                </Text>
            </View>
            <View style={styles.otherContainer}>
                {accessoryRight(item)}
            </View>
        </TouchableOpacity>
    )

    return (
        <List
            style={{ width: '100%' }}
            data={data}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem}
        />
    )
};

const styles = StyleSheet.create({
    container: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 13,
    },
    otherContainer: {
        width: 40,
        height: 40,
        marginHorizontal: 15,
        marginLeft: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
