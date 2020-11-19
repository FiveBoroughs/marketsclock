import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { useLocalStorage } from 'web-api-hooks';
import { Icon, Popup } from 'semantic-ui-react';
import { Responsive, WidthProvider } from "react-grid-layout";
import { toast } from 'react-toastify';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import Clock from './Clock';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ClocksContainer = styled.div`
    padding: 20px;
    min-height: 91vh;
`;

const GridItem = styled.section`
    background: ${props => props.theme.secondary};
    contain: strict;
    height: 100%;
    overflow: hidden;
    border-radius: 3px;
    box-shadow:
        0 1px 3px rgba(0,0,0,0.12),
        0 1px 2px rgba(0,0,0,0.24);
`;

const DragHandle = styled.div`
    height: 20px;
    cursor: move;
    display: flex;
    justify-content: space-between;
    padding: 0 2px;
`;

const DragHandleMenu = styled.div`
    cursor: default;
`;

const TimeContainer = props => {
    //State
    const [time, setTime] = useState(moment());
    const [gridLayout, setGridLayout] = useLocalStorage('gridLayout', '');
    const [notificationQueue, setNotificationQueue] = useState([]);

    //Desctruturing of props needed for useEffect
    const isSoundPlaying = props.isSoundPlaying;
    const isTTSPlaying = props.isTTSPlaying;
    const isTTSEnabled = props.isTTSEnabled;
    const isSoundsEnabled = props.isSoundsEnabled;
    const isPushEnabled = props.isPushEnabled;
    const handleChangeIsSoundPlaying = props.handleChangeIsSoundPlaying;
    const handleChangeIsTTSPlaying = props.handleChangeIsTTSPlaying;
    const handleChangeSelectedTTSSound = props.handleChangeSelectedTTSSound;
    const checkInterval = props.checkInterval;

    //When a Clock component reports a Change of session
    //We format it
    //We add it to a queue, that is processed in useEffect
    const handleSessionChange = (marketCode, session) => {
        let market = props.markets.filter(x => x.Code === marketCode)[0];
        let newNotificationQueue = notificationQueue;
        let title = market.Title + " " + session.Title.replace('/', ' ')
        let textNotifAdvance = props.minutesAdvanceNotification === '0' ? "" : props.minutesAdvanceNotification === '1' ? " in " + props.minutesAdvanceNotification + " minute" : " in " + props.minutesAdvanceNotification + " minutes";

        props.handleChangeAlertsCount(props.alertCount + 1);

        newNotificationQueue.push({
            sound: props.selectedMarkets.filter(x => x.Code === market.Code)[0].Notification,
            title: title,
            tts: title + textNotifAdvance,
            options: {
                body: textNotifAdvance,
                icon: '/logo512.png',
                image: '/flags/' + market.CountryCode.toLowerCase() + '.svg'
            }
        });
        setNotificationQueue(newNotificationQueue);
    }

    //If the tab is not in the foreground
    //we use the browser's Notification API, to display a notif
    //But we gotta ask special permission before
    const sendDesktopNotification = (notification) => {
        let desktopNotification;
        if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    desktopNotification = new Notification(notification.title, notification.options);
                }
            });
        } else if (Notification.permission === "granted") {
            desktopNotification = new Notification(notification.title, notification.options);
        }
        //When we get in foreground remove desktop notifications
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible' && desktopNotification) {
                desktopNotification.close();
            }
        });
    };

    //At first and every time one the values in [] at the end changes
    useEffect(() => {
        //If we have notifications waiting and none is currently playing
        //We play the first notification
        //If the tab is in the forground, We display a Toast
        //If the tab is in the background, We display a Desktop notif
        const processNotificationQueue = () => {
            let queueLength = notificationQueue.length;
            // console.log('tick', queueLength + ' notification waiting', isSoundPlaying ? 'notif playing' : 'notif stopped', isTTSPlaying ? 'tts playing' : 'tts stopped')
            //If we have awaiting notifications and none is currently waiting
            if (queueLength > 0 && !isSoundPlaying && !isTTSPlaying) {
                //selected the first notification in the queue
                let notification = notificationQueue[0];
                //Play the notification sounds
                if (isSoundsEnabled && notification.sound)
                    handleChangeIsSoundPlaying(true);
                //Play the TTS read
                if (isTTSEnabled && notification.sound) {
                    handleChangeSelectedTTSSound(notificationQueue[0].tts.replace(/\s/g, '_') + '.mp3');
                    setTimeout(() => handleChangeIsTTSPlaying(true), 500);
                }
                //If we are not in foreground, use a desktop notification
                if (document.visibilityState !== 'visible' && isPushEnabled)
                    sendDesktopNotification(notificationQueue[0])

                //display in browser notification, cancel all on click
                toast(notification.tts, { onClick: (e) => { handleChangeIsSoundPlaying(false); handleChangeIsTTSPlaying(false); } });

                //Update the queue
                setNotificationQueue(notificationQueue.slice(1));
            }
        }
        //Every second
        //We update the time of all clocks
        //We process notifications
        const interval = setInterval(
            () => {
                console.log("interval reached")
                setTime(moment());
                processNotificationQueue();
            }
            , 1000
        );

        return function cleanup() { clearInterval(interval) };
    }, [isSoundPlaying, notificationQueue, isTTSPlaying, isTTSEnabled, isSoundsEnabled, isPushEnabled, handleChangeIsSoundPlaying, handleChangeIsTTSPlaying, handleChangeSelectedTTSSound, checkInterval]);

    // console.log('rendered Time Container');

    return (
        <ClocksContainer>
            <ResponsiveReactGridLayout
                className="layout"
                draggableHandle=".drag-handle"
                rowHeight={75}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 16, md: 8, sm: 2, xs: 1, xxs: 1 }}
                layouts={gridLayout}
                onLayoutChange={(layout, layouts) => setGridLayout(layouts)}
            >
                {props.markets.filter(x => props.selectedMarkets.filter(y => y.Code === x.Code).length > 0).map((market, index) =>
                    <GridItem key={index} data-grid={{ x: index * 4, y: 0, w: 4, h: 5, minW: 3, minH: 2 }} >
                        <DragHandle className="drag-handle">
                            <Icon name='move' size='large' />
                            <DragHandleMenu>
                                <Popup
                                    trigger={
                                        <Icon link name='exclamation' size='large'
                                            onClick={() => handleSessionChange(market.Code, market.Sessions[0])} />
                                    }
                                    content='Simulate an alert'
                                    offset='-10px, 0'
                                    inverted
                                />
                                <Popup
                                    trigger={
                                        <Icon link name='info circle' size='large'
                                            onClick={() => props.handleChangeMarketDetailsModalMarketCode(market.Code)} />
                                    }
                                    content='See full timetable'
                                    offset='-10px, 0'
                                    inverted
                                />
                                <Popup
                                    trigger={
                                        <Icon link size='large'
                                            name={props.selectedMarkets.filter(x => x.Code === market.Code)[0].Notification ? 'bell' : 'bell slash'}
                                            onClick={() => { props.handleChangeSelectedMarkets(props.selectedMarkets.map(x => { if (x.Code === market.Code) { x.Notification = !x.Notification } return x })) }} />
                                    }
                                    content={props.selectedMarkets.filter(x => x.Code === market.Code)[0].Notification ? 'Disable notifications' : 'Enable notifications'}
                                    offset='-10px, 0'
                                    inverted
                                />
                                <Popup
                                    trigger={
                                        <Icon link name='close' size='large'
                                            onClick={() => { props.handleChangeSelectedMarkets(props.selectedMarkets.filter(x => x.Code !== market.Code)) }} />
                                    }
                                    content='Remove this market'
                                    offset='-10px, 0'
                                    inverted
                                />
                            </DragHandleMenu>
                        </DragHandle>
                        <Clock key={'id-' + market.Code}
                            market={market}
                            isSoundsEnabled={props.isSoundsEnabled}
                            time={time}
                            handleSessionChange={handleSessionChange}
                            minutesAdvanceNotification={props.minutesAdvanceNotification}
                        // notificationsEnabled={selectedMarkets.filter(x => x.Code === market.Code)[0].Notification} TODO see if needed
                        />
                    </GridItem>
                )}
            </ResponsiveReactGridLayout>
        </ClocksContainer>
    )
};

TimeContainer.propTypes = {
    isPushEnabled: PropTypes.bool,
    minutesAdvanceNotification: PropTypes.string,

    isSoundPlaying: PropTypes.bool,
    isSoundsEnabled: PropTypes.bool,
    isTTSEnabled: PropTypes.bool,
    handleChangeIsSoundPlaying: PropTypes.func,
    handleChangeIsTTSPlaying: PropTypes.func,
    handleChangeSelectedTTSSound: PropTypes.func,

    markets: PropTypes.array,
    selectedMarkets: PropTypes.array,
    handleChangeSelectedMarkets: PropTypes.func,

    handleChangeMarketDetailsModalMarketCode: PropTypes.func

};

export default TimeContainer;
