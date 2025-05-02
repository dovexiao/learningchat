import React from 'react';
import {useTheme, Text, Spinner} from '@ui-kitten/components';
import {View, StyleSheet, Pressable} from 'react-native';
import {FlashList} from '@shopify/flash-list';

type BasicListProps = {
    data: any[],
    renderEmptyLabel: string;
    onListItemClick: (item: any) => void;
    accessoryLeft: () => React.ReactElement;
    accessoryRight: (item: any) => React.ReactElement;
    onEndReached: () => Promise<any>;
    onRefresh: () => Promise<any>;
}

const BasicList = ({ data, renderEmptyLabel, onListItemClick, accessoryLeft, accessoryRight, onEndReached, onRefresh }: BasicListProps): React.ReactElement => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const [isMoreEmpty, setIsMoreEmpty] = React.useState(false);
    const [refreshingLoading, setRefreshingLoading] = React.useState(false);
    const themes = useTheme();

    const renderEmpty = (): React.ReactElement => (
        <>
            {!isLoading && <Text style={styles.empty}>{renderEmptyLabel}</Text>}
        </>
    );

    const renderFooter = (): React.ReactElement => (
        <>
            {isLoading && !isEmpty &&
                <View style={styles.footer}>
                    <Spinner />
                </View>
            }
        </>
    );

    const renderListItem = ({ item, index }: { item: any, index: number }) => (
        <Pressable
            style={[styles.container, { backgroundColor: themes['background-basic-color-1']}]}
            onPress={() => onListItemClick(item)}
        >
            <View style={styles.avatarContainer}>
                {accessoryLeft()}
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
                    {item.title}
                </Text>
                <Text style={styles.subTitle} numberOfLines={1} ellipsizeMode={'tail'}>
                    {item.subTitle}
                </Text>
            </View>
            <View style={styles.otherContainer}>
                {accessoryRight(item)}
            </View>
        </Pressable>
    );

    const loadMore = async () => {
        if (isLoading || isMoreEmpty) {
            return;
        }
        setIsLoading(true);

        await new Promise<void>(resolve => {
            requestAnimationFrame(() => {
                resolve();
            });
        });

        await onEndReached();

        setIsEmpty(data.length === 0);
        setIsMoreEmpty(data.length === 0);
        setIsLoading(false);
    };

    const refreshInitial = async () => {
        setRefreshingLoading(true);

        await onRefresh();

        setIsMoreEmpty(data.length === 0);
        setIsEmpty(data.length === 0);
        setRefreshingLoading(false);
    };

    return (
        <FlashList
            keyExtractor={(item: any, index: number) => index.toString()}
            data={data}
            estimatedItemSize={100}
            renderItem={renderListItem}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            onRefresh={refreshInitial}
            refreshing={refreshingLoading}
            onLoad={({ elapsedTimeInMs }) => {
                if (elapsedTimeInMs > 100) {
                    // console.warn('列表渲染耗时较高，建议优化动画复杂度');
                }
            }}
        />
    );
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
    empty: {
        textAlign: 'center',
        width: '100%',
        paddingVertical: 40,
    },
    footer: {
        alignItems: 'center',
        width: '100%',
        paddingVertical: 30,
    },
});

export default BasicList;
