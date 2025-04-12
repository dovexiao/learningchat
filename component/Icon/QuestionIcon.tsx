import {Icon, useTheme} from '@ui-kitten/components';
import type {IconElement} from '@ui-kitten/components';
import React from 'react';

const QuestionIcon = (props: any): IconElement => {
    const themes = useTheme();
    return (
        <Icon
            {...props}
            name="question-mark-circle-outline"
            fill={themes['color-primary-500']}
        />
    );
};

export { QuestionIcon };
