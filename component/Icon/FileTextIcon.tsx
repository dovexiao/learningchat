import {Icon, useTheme} from '@ui-kitten/components';
import type {IconElement} from '@ui-kitten/components';
import React from 'react';

const FileTextIcon = (props: any): IconElement => {
    const themes = useTheme();
    return (
        <Icon
            {...props}
            name="file-text-outline"
            fill={themes['color-primary-500']}
        />
    );
};

export { FileTextIcon };
