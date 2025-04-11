import {Icon, useTheme} from '@ui-kitten/components';
import type {IconElement} from '@ui-kitten/components';
import React from 'react';

const PostIcon = (props: any): IconElement => {
    const themes = useTheme();
    return (
        <Icon
            {...props}
            name="paper-plane-outline"
            fill={themes['color-primary-500']}
        />
    );
};

export { PostIcon };
