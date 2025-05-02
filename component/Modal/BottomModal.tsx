import React, {forwardRef, useImperativeHandle} from 'react';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme, Text} from '@ui-kitten/components';

type OpeModalHandle = {
    show: (data: OpeModalItemProps[]) => void;
    hidden: () => void;
}

type OpeModalItemProps = {
    name: string;
    onHandleClick: () => void;
};

const BottomModal = forwardRef<OpeModalHandle, {}>(
    ({}, ref) => {
        const [visible, setVisible] = React.useState(false);
        const [bottomModalData, setBottomModalData] = React.useState<OpeModalItemProps[]>([]);
        const themes = useTheme();

        useImperativeHandle(ref, () => ({
            show: (data: OpeModalItemProps[]) => {
                setBottomModalData(data || []);
                setVisible(true);
            },
            hidden: () => setVisible(false),
        }));

        return (
            <>
                {visible && (
                    <>
                        <TouchableOpacity
                            style={styles.overlay}
                            onPress={() => setVisible(false)}
                        />
                        <View style={[styles.opeContainer, {backgroundColor: themes['background-basic-color-2']}]}>
                            {bottomModalData.map((item, index) => (
                                <View style={[styles.opeItem, {backgroundColor: themes['background-basic-color-1']}]}>
                                    <Pressable key={index} onPress={item.onHandleClick}>
                                        <Text>{item.name}</Text>
                                    </Pressable>
                                </View>
                            ))}
                            {bottomModalData.length === 0 && <Text>没有操作权限</Text>}
                        </View>
                    </>
                )}
            </>
        );
    }
);

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 99,
    },
    opeContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        minHeight: 120,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        zIndex: 100,
    },
    opeItem: {
        width: '25%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
});

export default BottomModal;
