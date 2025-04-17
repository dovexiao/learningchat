import {Icon, useTheme} from '@ui-kitten/components';
import type {IconElement} from '@ui-kitten/components';
import React from 'react';

const MessageIcon = (props: any): IconElement => {
    const themes = useTheme();
    return (
        <Icon
            {...props}
            name="message-circle-outline"
            fill={themes['color-primary-500']}
        />
    );
};

export { MessageIcon };
