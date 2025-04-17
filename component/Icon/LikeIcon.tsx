import {Icon, useTheme} from '@ui-kitten/components';
import type {IconElement} from '@ui-kitten/components';
import React from 'react';

const LikeIcon = (props: any): IconElement => {
    const themes = useTheme();
    return (
        <Icon
            {...props}
            name="heart-outline"
            fill={themes['color-primary-500']}
            // fill={'#757575'}
        />
    );
};

export { LikeIcon };
