import React from 'react';
import {useTheme, Text, Spinner, Card, Button} from '@ui-kitten/components';
import {View, StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';

type CardListProps = {
    data: any[],
    renderEmptyLabel: string;
    onEndReached: () => Promise<any>;
    onRefresh: () => Promise<any>;
    handleFriendAddResponse: (to: string, status: string) => void;
}

const CardList = ({ data, renderEmptyLabel, onEndReached, onRefresh, handleFriendAddResponse }: CardListProps): React.ReactElement => {
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

    const CardHeader = (item: any): React.ReactElement => (
        <View style={styles.container}>
            <Text category="h6">
                { item.status === 'pending' ? '加友请求' : '好友'}
            </Text>
            <Text category="s1">
                来自 { item.fromName ? item.fromName : '未知用户' }
            </Text>
        </View>
    );

    const CardFooter = (item: any): React.ReactElement => (
        <View
            style={styles.footerContainer}
        >
            <Button
                style={[styles.footerControl, { backgroundColor: themes['background-basic-color-1'] }]}
                size="small"
                appearance="outline"
                onPress={() => {
                    handleFriendAddResponse(item.from, 'rejected');
                }}
            >
                拒绝
            </Button>
            <Button
                style={styles.footerControl}
                size="small"
                onPress={() => {
                    handleFriendAddResponse(item.from, 'accepted');
                }}
            >
                接受
            </Button>
        </View>
    );

    const renderCardItem = ({ item, index }: { item: any, index: number }) => (
        <Card
            style={[styles.card, { backgroundColor: themes['background-basic-color-2'] }]}
            header={() => (CardHeader(item))}
            footer={() => (CardFooter(item))}
        >
            <Text>
                {item.status === 'pending' ?
                    item.message || '这个用户懒到没有留言.jpg' :
                    item.status === 'accept' ?
                        `${item.from} 已同意添加你为好友` :
                        `${item.from} 已拒绝添加你为好友`
                }
            </Text>
        </Card>
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
            estimatedItemSize={200}
            renderItem={renderCardItem}
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
        padding: 10,
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
    card: {
        flex: 1,
        margin: 5,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15,
    },
    footerControl: {
        marginHorizontal: 5,
    },
});

export default CardList;
