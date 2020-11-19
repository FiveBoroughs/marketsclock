import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useLocalStorage } from 'web-api-hooks';
import Favicon from 'react-favicon';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';

import Page from './Components/Page';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

const Background = styled.div`
    background: ${props => props.theme.secondary};
    background-image:
        linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
        linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 10px 10px;
`;

function App() {
    const [alertsCount, setAlertsCount] = useLocalStorage('alertCount', 0);
    const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    //Themes
    const [themeColorPrimary, setThemeColorPrimary] = useLocalStorage('themeColorMain', 'rgb(17,55,67,1)');
    const [themeColorSecondary, setThemeColorSecondary] = useLocalStorage('themeColorSecondary', 'rgb(228,227,219,1)');
    const [themeColorComplementary, setThemeColorComplementary] = useLocalStorage('themeColorComplementary', 'rgb(197,0,26,1)');
    const [themeColorOpen, setThemeColorOpen] = useLocalStorage('themeColorOpen', 'rgb(111,255,0)');
    const [themeColorHalfOpen, setThemeColorHalfOpen] = useLocalStorage('themeColorHalfOpen', 'rgb(255,191,0)');
    const [themeColorClosed, setThemeColorClosed] = useLocalStorage('themeColorClosed', 'rgb(255,64,0)');
    let theme = { primary: themeColorPrimary, secondary: themeColorSecondary, complementary: themeColorComplementary, open: themeColorOpen, halfOpen: themeColorHalfOpen, closed: themeColorClosed };
    let invertTheme = ({ primary, secondary, complementary }) => ({ primary: secondary, secondary: primary, complementary: complementary });

    console.log('render App');

    return (
        <ThemeProvider theme={theme}>
            <Background>
                <Favicon url='favicon.ico' alertCount={unreadAlertsCount} />
                <ThemeProvider theme={invertTheme}>
                    <Navbar
                        handleChangeIsSettingsModalOpen={(value) => { setIsSettingsModalOpen(value) }} />
                </ThemeProvider>
                <Page
                    themeColorPrimary={themeColorPrimary}
                    themeColorSecondary={themeColorSecondary}
                    themeColorComplementary={themeColorComplementary}
                    handleChangeThemeColorPrimary={(value) => setThemeColorPrimary('rgb(' + value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b + ',' + value.rgb.a + ')')}
                    handleChangeThemeColorSecondary={(value) => setThemeColorSecondary('rgb(' + value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b + ',' + value.rgb.a + ')')}
                    handleChangeThemeColorComplementary={(value) => setThemeColorComplementary('rgb(' + value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b + ',' + value.rgb.a + ')')}
                    themeColorOpen={themeColorOpen}
                    themeColorHalfOpen={themeColorHalfOpen}
                    themeColorClosed={themeColorClosed}
                    handleChangeThemeColorOpen={(value) => setThemeColorOpen('rgb(' + value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b + ',' + value.rgb.a + ')')}
                    handleChangeThemeColorHalfOpen={(value) => setThemeColorHalfOpen('rgb(' + value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b + ',' + value.rgb.a + ')')}
                    handleChangeThemeColorClosed={(value) => setThemeColorClosed('rgb(' + value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b + ',' + value.rgb.a + ')')}

                    alertsCount={alertsCount}
                    handleChangeAlertsCount={(value) => setAlertsCount(value)}
                    unreadAlertsCount={unreadAlertsCount}
                    handleChangeUnreadAlertsCount={(value) => setUnreadAlertsCount(value)}

                    isSettingsModalOpen={isSettingsModalOpen}
                    handleChangeIsSettingsModalOpen={(value) => { setIsSettingsModalOpen(value) }}
                />
                <Footer alertsCount={alertsCount} />
            </Background>
        </ThemeProvider>
    );
}

export default App;
