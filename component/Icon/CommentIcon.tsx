import {Icon, useTheme} from '@ui-kitten/components';
import type {IconElement} from '@ui-kitten/components';
import React from 'react';

const CommentIcon = (props: any): IconElement => {
    // const themes = useTheme();
    return (
        <Icon
            {...props}
            name="message-circle-outline"
            // fill={themes['color-primary-500']}
            fill={'#757575'}
        />
    );
};

export { CommentIcon };
