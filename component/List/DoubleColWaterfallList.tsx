import React from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {CellContainer, MasonryFlashList} from '@shopify/flash-list';
import {Spinner, Text} from '@ui-kitten/components';
import {FadeIn, FadeOut} from 'react-native-reanimated';

type WaterfallListProps = {
    skeletonItem: () => React.ReactElement;
    renderListItem: ({item, index}: { item: any, index: number }) => React.ReactElement
    getNextPageData: () => Promise<any>;
    estimateListItemHeight: (item: any, index: number) => any;
}

const highlyBalancedGrouping = (data: any[], heightDiff: number, leftGroupCount: number) => {
    const generateCombinations = (arr: any[], k: number) => {
        const result: any[] = [];
        const backtrack = (start: number, current: any[]) => {
            // console.log(start, current.length);
            if (current.length === k) {
                result.push([...current]);
                return;
            }
            for (let i = start; i < arr.length; i++) {
                current.push(arr[i]);
                backtrack(i + 1, current);
                current.pop();
            }
        };
        backtrack(0, []);
        return result;
    };

    const combinations = generateCombinations(data, leftGroupCount);
    let minDiff = Infinity;
    let bestCombination = [];

    for (const combination of combinations) {
        const sum = combination.reduce((accumulator: number, currentValue: any) => accumulator + currentValue.value, 0);
        const diff = Math.abs(sum - heightDiff);
        if (diff < minDiff) {
            minDiff = diff;
            bestCombination = combination;
        }
    }

    return bestCombination;
};

const crossGrouping = (data: any[], firstData: any[], secondData: any[]): any[] => {
    let newData = [];
    for (let i = 0; i < data.length; i++) {
        let index = Math.floor(i / 2);
        if (i % 2 === 0) {
            newData.push(data[firstData[index].id]);
        } else {
            newData.push(data[secondData[index].id]);
        }
    }
    return newData;
};

const { width: screenWidth } = Dimensions.get('window');

const DoubleColWaterfallList = ({ skeletonItem, renderListItem, getNextPageData, estimateListItemHeight }: WaterfallListProps): React.ReactElement => {
    const [data, setData] = React.useState<any>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const [isMoreEmpty, setIsMoreEmpty] = React.useState(false);
    const [refreshingLoading, setRefreshingLoading] = React.useState(false);
    const [columnsTotalHeight, setColumnsTotalHeight] = React.useState([0, 0]);

    const renderHeader = (): React.ReactElement => (
        <></>
    );

    const renderEmpty = (): React.ReactElement => (
        <>
            {!isLoading && <Text style={styles.empty}>暂无帖子, 来发一个!</Text>}
        </>
    );

    const renderFooter = (): React.ReactElement => (
        <>
            {isMoreEmpty && !isEmpty &&
                <Text style={styles.footer}>暂无更多帖子, 来发一个!</Text>
            }
            {/*{isLoading && !isEmpty &&*/}
            {/*    <View style={styles.footer}>*/}
            {/*        <Spinner />*/}
            {/*    </View>*/}
            {/*}*/}
        </>
    );

    const sortByHeightForColumnLocation = (newData: any[], oldData: any[], columnsHeight: any[]): any[] => {
        // console.log('数据长度', oldData.length, newData.length);
        // console.log('目前列总高度情况', columnsHeight[0], columnsHeight[1]);
        if (newData.length === 0) {
            return [];
        }
        const listItemHeightData = newData.map((item: any, index: number) => {
            return {
                id: index,
                value: item.listItemViewHeights.totalHeight,
            };
        });
        const columnsHeightDiff = columnsHeight[0] - columnsHeight[1];
        // console.log('列高度差', columnsHeightDiff);
        const dataHeightSum = listItemHeightData.reduce((accumulator: number, currentItem: any) => accumulator + currentItem.value, 0);
        // console.log('数据总高度', dataHeightSum);
        const groupingForLeftHeightBalance = (dataHeightSum - columnsHeightDiff) / 2;
        // console.log('分组算法对左高度平衡计算值', groupingForLeftHeightBalance);
        let leftGrouping: any[] = [];
        if (newData.length % 2 === 0) {
            leftGrouping = highlyBalancedGrouping(listItemHeightData, groupingForLeftHeightBalance, newData.length / 2);
        } else if (oldData.length % 2 === 1){
            leftGrouping = highlyBalancedGrouping(listItemHeightData, groupingForLeftHeightBalance, Math.floor(newData.length / 2));
        } else {
            leftGrouping = highlyBalancedGrouping(listItemHeightData, groupingForLeftHeightBalance, Math.floor(newData.length / 2) + 1);
        }
        const rightGrouping = listItemHeightData.filter((item: any) => {
            return !leftGrouping.some((leftItem: any) => leftItem.id === item.id);
        });
        // console.log('分组情况', leftGrouping, rightGrouping);
        const leftColumnNewHeight = leftGrouping.reduce((accumulator: number, currentValue: any) => accumulator + currentValue.value, 0);
        const rightColumnNewHeight = rightGrouping.reduce((accumulator: number, currentValue: any) => accumulator + currentValue.value, 0);
        // console.log('分组情况高度', leftColumnNewHeight, rightColumnNewHeight);
        let sortedData: any[];
        if (oldData.length % 2 === 1) {
            sortedData = crossGrouping(newData, rightGrouping, leftGrouping);
        } else {
            sortedData = crossGrouping(newData, leftGrouping, rightGrouping);
        }
        setColumnsTotalHeight((prev: any[]) => [prev[0] + leftColumnNewHeight, prev[1] + rightColumnNewHeight]);
        return sortedData;
    };

    const loadMore = async () => {
        // 避免重复请求数据, 条件: 正在请求 或者 已确认没有更多数据
        if (isLoading || isMoreEmpty) {
            return;
        }
        const useData = [...data];
        const emptyData = new Array(5).fill(null);
        setData((prev: any[]) => [...prev, ...emptyData]);
        setIsLoading(true);

        await new Promise<void>(resolve => {
            requestAnimationFrame(() => {
                resolve();
            });
        });

        let newData = await getNextPageData();
        // console.log(newData);
        newData = newData.map((item: any, index: number) => {
            return {
                ...item,
                listItemViewHeights: estimateListItemHeight(item, index),
            };
        });
        // console.log('重排前数据', newData);
        const sortedData: any[] = sortByHeightForColumnLocation(newData, useData, [...columnsTotalHeight]);
        // console.log('重排后数据', sortedData);

        const realData = [...useData, ...sortedData];
        setIsEmpty(realData.length === 0);
        setIsMoreEmpty(newData.length === 0);
        setData([...useData, ...sortedData]);
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshingLoading(true);
        const newColumnsTotalHeight = [0, 0];
        setColumnsTotalHeight(newColumnsTotalHeight);

        let newData = await getNextPageData();
        newData = newData.map((item: any, index: number) => {
            return {
                ...item,
                listItemViewHeights: estimateListItemHeight(item, index),
            };
        });
        const sortedData: any[] = sortByHeightForColumnLocation(newData, [], newColumnsTotalHeight);

        setIsMoreEmpty(newData.length === 0);
        setIsEmpty(newData.length === 0);
        setData(sortedData);
        setRefreshingLoading(false);
    };

    const AnimatedCellContainer = Animated.createAnimatedComponent(CellContainer);

    const CellRenderer = React.forwardRef((props, ref) => {
        return (
            <AnimatedCellContainer
                {...props}
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                ref={ref}
            >
                {/*{data[props.index] ?*/}
                {/*    props.children :*/}
                {/*    skeletonItem()*/}
                {/*}*/}
            </AnimatedCellContainer>
        );
    });

    return (
        <MasonryFlashList
            onLayout={(event) => {
                const { height, width } = event.nativeEvent.layout;
                console.log('可见高度 :', height);
                console.log('可见宽度 :', width);
            }}
            keyExtractor={(item: any, index: number) => index.toString()}
            data={data}
            numColumns={2}      // 列表项列数
            estimatedItemSize={300}     // 预估列表项尺寸
            estimatedListSize={{
                height: 480,
                width: 400,
            }}    // 预估列表尺寸
            renderItem={renderListItem}      // 列表项渲染函数
            // 自定义列表项容器组件
            CellRendererComponent={CellRenderer}
            disableAutoLayout={true}
            contentContainerStyle={styles.container}     // 列表容器样式 (背景色和内边距)
            ListHeaderComponent={renderHeader}      // 列表头组件
            ListHeaderComponentStyle={{}}
            ListEmptyComponent={renderEmpty}        // 列表空组件
            ListFooterComponent={renderFooter}      // 列表尾组件
            ListFooterComponentStyle={{}}
            extraData={{}}      // 额外数据，用于列表项更新时重新渲染
            onEndReached={loadMore}     // 触底回调
            onEndReachedThreshold={0.1}     // 触底阈值
            onRefresh={onRefresh}
            refreshing={refreshingLoading}
            overrideItemLayout={(layout, item) => {
                if (item) {
                    layout.size = item.listItemViewHeights.totalHeight;
                }
            }}
            optimizeItemArrangement={true}
            onLoad={({ elapsedTimeInMs }) => {
                if (elapsedTimeInMs > 100) {
                    console.warn('列表渲染耗时较高，建议优化动画复杂度');
                }
            }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'inherit',
        paddingVertical: 10,
        paddingHorizontal: 10,
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

export default DoubleColWaterfallList;
