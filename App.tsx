/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppStackNavigator } from './screens/AppNavigation.tsx';
import { ThemeContext } from './hooks/ThemeContext.tsx';
import { default as lightTheme } from './light-theme.json';
import { default as darkTheme } from './dark-theme.json';
import { AuthProvider } from './hooks/AuthContext.tsx';

type Theme = 'light' | 'dark';

function App(): JSX.Element {
    const [theme, setTheme] = React.useState<Theme>('light');
    const [customTheme, setCustomTheme] = React.useState(lightTheme);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        const nextCustomTheme = theme === 'light' ? darkTheme : lightTheme;
        setTheme(nextTheme);
        setCustomTheme(nextCustomTheme);
    };

    return (
        <>
            <IconRegistry icons={EvaIconsPack}/>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <AuthProvider>
                    <ApplicationProvider {...eva} theme={{...eva[theme], ...customTheme}}>
                        <AppStackNavigator />
                    </ApplicationProvider>
                </AuthProvider>
            </ThemeContext.Provider>
        </>

    );
}


export default App;
