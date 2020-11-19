import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useLocalStorage } from 'web-api-hooks';
import Sound from 'react-sound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import SettingsModal from './SettingsModal';
import Description from './Description';
import MarketsModal from './MarketsModal';
import TimeContainer from './TimeContainer';
import MarketDetails from './MarketDetails';

import MarketsJson from '../assets/Data/Markets.json';
import SoundsJson from '../assets/Data/Sounds.json';
//Stop react-sound console messages
window.soundManager.setup({ debugMode: false });



const StyledToastContainer = styled(ToastContainer).attrs({
    className: 'toast-container',
    toastClassName: 'toast',
    bodyClassName: 'body',
    progressClassName: 'progress',
})`
    top: 0;
    right: 0;
    padding: 0;
    margin: 5px;
    width: 33%;
    .toast {
        background-color: ${props => props.theme.secondary};
        margin: 10px;
        cursor: auto;
    }
    .body {
        background-color: ${props => props.theme.secondary};
        color: ${props => props.theme.primary};
        margin: 0;
        display: grid;
        align-items: center;
    }
    .progress{
        background: ${props => props.theme.complementary};
    }
`;

const Page = props => {
    const [isMarketDetailsModalOpen, setIsMarketDetailsModalOpen] = useState(false);
    const [marketDetailsModalMarketCode, setMarketDetailsModalMarketCode] = useState('nyse');
    //Settings
    const [isMarketsModalOpen, setIsMarketsModalOpen] = useState(false);
    const [isPushEnabled, setIsPushEnabled] = useLocalStorage('isPushEnabled', true);
    const [minutesAdvanceNotification, setMinutesAdvanceNotification] = useLocalStorage('minutesAdvanceNotification', '0');
    const [checkInterval, setCheckInterval] = useLocalStorage('checkInterval', 60000)
    //sound
    const [soundVolume, setSoundVolume] = useLocalStorage('soundVolume', 75)
    const [isSoundsEnabled, setIsSoundsEnabled] = useLocalStorage('isSoundsEnabled', true);
    const [isSoundPlaying, setIsSoundPlaying] = useState(false);
    const [selectedNotificationSound, setSelectedNotificationSound] = useLocalStorage('notificationSound', 'time-is-now.mp3');
    const [isTTSEnabled, setIsTTSEnabled] = useLocalStorage('isTTSEnabled', true);
    const [isTTSPlaying, setIsTTSPlaying] = useState(false);
    const [selectedTTSSound, setSelectedTTSSound] = useState('');
    //Markets
    const Markets = MarketsJson.markets;
    const [selectedMarkets, setSelectedMarkets] = useLocalStorage('selectedMarkets', [
        { Code: "hkex", Notification: true },
        { Code: "nyse", Notification: true },
        { Code: "lse", Notification: true },
        { Code: "bitmex-perp", Notification: true }
    ]);

    console.log('rendered Page');

    return (
        <>
            <Description
                handleIsMarketsModalOpen={() => setIsMarketsModalOpen(!isMarketsModalOpen)}
            />
            <TimeContainer
                isPushEnabled={isPushEnabled}
                minutesAdvanceNotification={minutesAdvanceNotification}
                handleChangeAlertsCount={props.handleChangeAlertsCount}

                handleChangeIsSoundPlaying={(value) => { setIsSoundPlaying(value) }}
                handleChangeIsTTSPlaying={(value) => { setIsTTSPlaying(value) }}
                handleChangeSelectedTTSSound={(value) => { setSelectedTTSSound(value) }}
                isSoundPlaying={isSoundPlaying}
                isSoundsEnabled={isSoundsEnabled}
                isTTSEnabled={isTTSEnabled}

                markets={Markets}
                selectedMarkets={selectedMarkets}
                handleChangeSelectedMarkets={(e, { value }) => { setSelectedMarkets(value.map(x => { return { Code: x, Notification: true } })) }}

                handleChangeMarketDetailsModalMarketCode={(value) => { setMarketDetailsModalMarketCode(value); setIsMarketDetailsModalOpen(!isMarketDetailsModalOpen) }}
            />
            {props.isSettingsModalOpen &&
                <SettingsModal
                    isSettingsModalOpen={props.isSettingsModalOpen}
                    handleChangeIsSettingsModalOpen={props.handleChangeIsSettingsModalOpen}

                    isPushEnabled={isPushEnabled}
                    handleChangeIsPushEnabled={() => { setIsPushEnabled(!isPushEnabled) }}
                    // handleClickPushNotification={() => { sendDesktopNotification({ title: 'Push notification', options: {} }) }}// TODO

                    minutesAdvanceNotification={minutesAdvanceNotification}
                    handleChangeMinutesAdvanceNotification={(e, { value }) => { setMinutesAdvanceNotification(value) }}
                    checkInterval={checkInterval}
                    handleChangeCheckInterval={(e, { value }) => setCheckInterval(value)}

                    isSoundPlaying={isSoundPlaying}
                    isSoundsEnabled={isSoundsEnabled}
                    handleChangeIsSoundsEnabled={() => { setIsSoundsEnabled(!isSoundsEnabled) }}
                    selectedNotificationSound={selectedNotificationSound}
                    handleChangeSelectedNotificationSound={(e, { value }) => { setSelectedNotificationSound(value) }}
                    sounds={SoundsJson.sounds}
                    soundVolume={soundVolume}
                    handleChangeSoundVolume={(value) => { setSoundVolume(value) }}
                    handleChangeIsSoundPlaying={(value) => { setIsSoundPlaying(value) }}
                    isTTSEnabled={isTTSEnabled}
                    handleChangeIsTTSEnabled={() => { setIsTTSEnabled(!isTTSEnabled) }}

                    markets={Markets}
                    selectedMarkets={selectedMarkets}
                    handleChangeSelectedMarkets={(e, { value }) => { setSelectedMarkets(value.map(x => { return { Code: x, Notification: true } })) }}

                    themeColorPrimary={props.themeColorPrimary}
                    themeColorSecondary={props.themeColorSecondary}
                    themeColorComplementary={props.themeColorComplementary}
                    handleChangeThemeColorPrimary={props.handleChangeThemeColorPrimary}
                    handleChangeThemeColorSecondary={props.handleChangeThemeColorSecondary}
                    handleChangeThemeColorComplementary={props.handleChangeThemeColorComplementary}
                    themeColorOpen={props.themeColorOpen}
                    themeColorHalfOpen={props.themeColorHalfOpen}
                    themeColorClosed={props.themeColorClosed}
                    handleChangeThemeColorOpen={props.handleChangeThemeColorOpen}
                    handleChangeThemeColorHalfOpen={props.handleChangeThemeColorHalfOpen}
                    handleChangeThemeColorClosed={props.handleChangeThemeColorClosed}
                />
            }
            {isMarketDetailsModalOpen &&
                <MarketDetails
                    markets={Markets}
                    handleChangeIsMarketDetailsModal={() => setIsMarketDetailsModalOpen(!isMarketDetailsModalOpen)}
                    isMarketDetailsModalOpen={isMarketDetailsModalOpen}
                    marketDetailsModalMarketCode={marketDetailsModalMarketCode}
                    themeColorOpen={props.themeColorOpen}
                    themeColorHalfOpen={props.themeColorHalfOpen}
                    themeColorClosed={props.themeColorClosed}
                />

            }
            {isMarketsModalOpen &&
                <MarketsModal
                    handleIsMarketModalOpen={() => setIsMarketsModalOpen(!isMarketsModalOpen)}
                    markets={Markets}
                    selectedMarkets={selectedMarkets}
                    isMarketsModalOpen={isMarketsModalOpen}
                    handleChangeSelectedMarkets={(e, { value }) => { setSelectedMarkets(value.map(x => { return { Code: x, Notification: true } })) }}
                />
            }
            {isSoundsEnabled &&
                <Sound
                    url={'/sounds/' + selectedNotificationSound}
                    playStatus={isSoundPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
                    volume={soundVolume}
                    onFinishedPlaying={() => { setIsSoundPlaying(false); }}
                    onError={(e, d) => { console.error(e, d); setIsSoundPlaying(false); }}
                />
            }
            {isTTSEnabled &&
                <Sound
                    url={'/tts/' + selectedTTSSound}
                    playStatus={isTTSPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
                    volume={soundVolume}
                    onFinishedPlaying={() => { setIsTTSPlaying(false); setSelectedTTSSound(''); }}
                    onError={(e, d) => { console.error(e, d); setIsTTSPlaying(false); setSelectedTTSSound(''); }}
                />
            }
            <StyledToastContainer />
        </>
    )
};

Page.propTypes = {
    themeColorPrimary: PropTypes.string,
    themeColorSecondary: PropTypes.string,
    themeColorComplementary: PropTypes.string,
    handleChangeThemeColorPrimary: PropTypes.func,
    handleChangeThemeColorSecondary: PropTypes.func,
    handleChangeThemeColorComplementary: PropTypes.func,
    themeColorOpen: PropTypes.string,
    themeColorHalfOpen: PropTypes.string,
    themeColorClosed: PropTypes.string,
    handleChangeThemeColorOpen: PropTypes.func,
    handleChangeThemeColorHalfOpen: PropTypes.func,
    handleChangeThemeColorClosed: PropTypes.func,

    alertsCount: PropTypes.number,
    handleChangeAlertCount: PropTypes.func,
    unreadAlertsCount: PropTypes.number,
    handleChangeUnreadAlertsCount: PropTypes.func,

    isSettingsModalOpen: PropTypes.bool,
    handleChangeIsSettingsModalOpen: PropTypes.func
};

export default Page;
