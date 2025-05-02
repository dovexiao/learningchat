import React, { forwardRef, useImperativeHandle } from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Divider} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';

type MenuItem = {
    icon: (props: any) => IconElement,
    title: string,
    onPress: () => void,
};

type OverflowMenuProps = {
    menuData: MenuItem[];
    position: { x: number; y: number };
}

type OverflowMenuHandle = {
    show: () => void;
}

const OverflowMenu = forwardRef<OverflowMenuHandle, OverflowMenuProps>(
    ({menuData, position}, ref) => {
        const [visible, setVisible] = React.useState(false);

        useImperativeHandle(ref, () => ({
            show: () => setVisible(true),
        }));

        const positionStyle = {
            top: position.y < 0 ? -position.y : undefined,
            bottom: position.y > 0 ? position.y : undefined,
            left: position.x < 0 ? -position.x : undefined,
            right: position.x > 0 ? position.x : undefined,
        };

        return (
            <>
                {visible && (
                    <>
                        <TouchableOpacity
                            style={styles.overlay}
                            onPress={() => setVisible(false)}
                        />
                        <View style={[styles.menu, positionStyle]}>
                            {menuData.map((item, index) => (
                                <React.Fragment key={index}>
                                    <View style={styles.menuItem}>
                                        <Button
                                            appearance={'ghost'}
                                            accessoryLeft={item.icon}
                                            onPress={() => {
                                                item.onPress();
                                                setVisible(false);
                                            }}
                                        >
                                            {item.title}
                                        </Button>
                                    </View>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </View>
                    </>
                )}
            </>
        );
    }
);

const styles = StyleSheet.create({
    menu: {
        position: 'absolute',
        right: 5,
        top: 50,
        backgroundColor: 'white',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 100,
    },
    menuItem: {
        minWidth: 130,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 99,
    },
});

export default OverflowMenu;
