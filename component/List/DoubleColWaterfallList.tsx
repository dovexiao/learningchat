import React from 'react';
import {FlatList, StyleSheet, TouchableHighlight, TouchableOpacity, View} from "react-native";

type ListProps = {
    data: any[],
    onListItemClick: (item: any) => void,
    renderListItem: (item: any) => React.ReactElement
}

const DoubleColWaterfallList = ({ data, onListItemClick, renderListItem }: ListProps): React.ReactElement => {
    const dataLeft = data.filter((item, index) => index % 2 === 0);
    const dataRight = data.filter((item, index) => index % 2 === 1);

    return (
        <View style={styles.container}>
            <SingleList
                data={dataLeft}
                onListItemClick={onListItemClick}
                renderListItem={renderListItem}
            />
            <SingleList
                data={dataRight}
                onListItemClick={onListItemClick}
                renderListItem={renderListItem}
            />
        </View>
    );
};

const SingleList = ({ data, onListItemClick, renderListItem }: ListProps): React.ReactElement => {
    return (
        <FlatList
            style={styles.list}
            data={data}
            renderItem={({item, index}) => (
                <TouchableOpacity
                    key={item.key}
                    onPress={() => onListItemClick(item)}
                    // onShowUnderlay={separators.highlight}
                    // onHideUnderlay={separators.unhighlight}
                >
                    {renderListItem(item)}
                </TouchableOpacity>
            )}
            ListEmptyComponent={()=>(<></>)}
            onEndReached={() => {}}
            onEndReachedThreshold={0.5}
            onRefresh={()=>{}}
            onViewableItemsChanged={()=>{}}
            refreshing={false}
        ></FlatList>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    list: {
        width: '50%',
    },
});

export default DoubleColWaterfallList;
