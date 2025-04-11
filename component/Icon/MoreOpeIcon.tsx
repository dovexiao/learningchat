import {Icon, useTheme} from '@ui-kitten/components';
import type {IconElement} from '@ui-kitten/components';
import React from 'react';

const MoreOpeIcon = (props: any): IconElement => {
    const themes = useTheme();
    return (
        <Icon
            {...props}
            name="grid-outline"
            fill={themes['color-primary-500']}
        />
    );
};

export { MoreOpeIcon };
