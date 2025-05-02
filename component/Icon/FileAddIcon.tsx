import {Icon, useTheme} from '@ui-kitten/components';
import type {IconElement} from '@ui-kitten/components';
import React from 'react';

const FileAddIcon = (props: any): IconElement => {
    const themes = useTheme();
    return (
        <Icon
            {...props}
            name="file-add-outline"
            fill={themes['color-primary-500']}
        />
    );
};

export { FileAddIcon };
