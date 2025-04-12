import {Icon, useTheme} from '@ui-kitten/components';
import type {IconElement} from '@ui-kitten/components';
import React from 'react';

const BasicOpeIcon = (props: any): IconElement => {
    const themes = useTheme();
    return (
        <Icon
            {...props}
            name="more-horizontal-outline"
            fill={themes['color-primary-500']}
        />
    );
};

export { BasicOpeIcon };
