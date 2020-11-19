import React, { useState } from 'react';
import moment from 'moment-timezone';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import ScaleText from "react-scale-text";

const ClockContainer = styled.div`
    height: calc(100% - 20px);
    margin: auto;

    font-weight: 700;
    line-height: 0.9;
    font-size: 5em;

    color: ${props => props.theme.secondary};
    -webkit-text-fill-color: ${props => props.theme.secondary};
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: ${props => props.theme.primary};

    text-shadow:
        3px 3px 0 ${props => props.theme.primary},
        -1px -1px 0 ${props => props.theme.primary}
        1px -1px 0 ${props => props.theme.primary},
        -1px 1px 0 ${props => props.theme.primary},
        1px 1px 0 ${props => props.theme.primary};
`;

const Flag = styled.img`
    position: fixed;
    top: 0;
    left: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
    z-index: -10;
    opacity: 0.5;
`;

const TimeText = styled.div`
    letter-spacing:-3px;
    font-family: 'Fira Mono';

    height: 33.33%;
    /* font-size: ${props => (props.divWidth / 150) + 'vw'}; */
    -webkit-text-fill-color : ${props => props.sessionColor === 0 ? props.theme.closed : props.sessionColor === 1 ? props.theme.halfOpen : props.theme.open};
`;
const Session = styled.div`
    height: 33.33%;
    /* font-size: ${props => (props.divWidth / 200) + 'vw'}; */
    -webkit-text-fill-color : ${props => props.sessionColor === 0 ? props.theme.closed : props.sessionColor === 1 ? props.theme.halfOpen : props.theme.open};
`;
const NextSession = styled.div`
    height: 33.33%;
    /* font-size: ${props => (props.divWidth / 250) + 'vw'}; */
    mix-blend-mode: difference;
    -webkit-text-stroke-width: 0;
    text-shadow:none;
`;
const Title = styled.div`
    /* font-size: ${props => (props.divWidth / 250) + 'vw'}; */
    height: 25%;
    width: 100%;
`;

const Logo = styled.img`
    position: fixed;
    bottom: 0;
    left: 0;
    object-fit: contain;
    height: 25%;
    width: 25%;
    z-index: -2;
    opacity: 0.4;
    padding: 0.5%;
`;

const deepCopyMoment = (time) => {
    return moment.tz(time.tz()).set({
        day: time.get('date'),
        month: time.get('month'),
        year: time.get('year'),
        hour: time.get('hour'),
        minute: time.get('minute'),
        seconds: time.get('second')
    });
}

const getSession = (market, time) => {
    for (let i = 0; i < market.Sessions.length; i++) {
        //If within session's days
        if (market.Sessions[i].Days.filter(x => x === time.format('dddd')).length > 0) {
            let StartTime = deepCopyMoment(time).set({
                hour: market.Sessions[i].StartTime.split(':')[0],
                minute: market.Sessions[i].StartTime.split(':')[1],
                seconds: 0
            });
            let EndTime = (market.Sessions[i].EndTime) ?
                deepCopyMoment(time).set({
                    hour: market.Sessions[i].EndTime.split(':')[0],
                    minute: market.Sessions[i].EndTime.split(':')[1],
                    seconds: 0
                }) : null;
            // If within the sessions times
            if (EndTime && time.isSameOrAfter(StartTime) && time.isBefore(EndTime)) {
                return market.Sessions[i];
            }
        }
    }
    return {
        Title: 'Closed',
        Style: 0
    }
}

const getNextSession = (market, time, currentSession) => {
    //Cycle the weekdays until we find a day when the market is open
    for (let i = 0; i <= 7; i++) {
        // Get the session for that day
        const cycledDay = deepCopyMoment(time);
        cycledDay.add(i, 'days');
        const sessionsCycledDay = market.Sessions.filter(x => x.Days.includes(cycledDay.format('dddd')))

        //If there are sessions that day
        if (sessionsCycledDay.length > 0) {
            // Go through each of the sessions
            for (let session of sessionsCycledDay) {
                let nextSessionStartTime = deepCopyMoment(cycledDay).set({
                    hour: session.StartTime.split(':')[0],
                    minute: session.StartTime.split(':')[1],
                    seconds: 0
                });
                if (time.isBefore(nextSessionStartTime) && (session.Title !== currentSession.Title || sessionsCycledDay.length === 1)) {
                    return [session, nextSessionStartTime];
                }
            }
        }
    }
    return [null, null];
}


function Clock(props) {
    const [TitleDivElement, setTitleDivElement] = useState('');
    const [TimeTextDivElement, setTimeTextDivElement] = useState('');
    const [SessionDivElement, setSessionDivElement] = useState('');
    const [NextSessionDivElement, setNextSessionDivElement] = useState('');

    const [lastSessionChange, setLastSessionChange] = useState();

    const localedTime = props.time.tz(props.market.TimeZone);
    let advanceTime = deepCopyMoment(localedTime).add(props.minutesAdvanceNotification, 'minutes').add(1, 'seconds');
    const currentSession = getSession(props.market, localedTime);
    const advanceSession = getSession(props.market, advanceTime);

    if (currentSession.Title !== advanceSession.Title && (!lastSessionChange || (lastSessionChange < localedTime))) {
        console.info('Session difference found')
        props.handleSessionChange(props.market.Code, advanceSession);
        setLastSessionChange(advanceTime);
    }

    let [nextSession, nextSessionStartTime] = getNextSession(props.market, localedTime, currentSession);
    const countdownToNextSession = localedTime.to(nextSessionStartTime, true);

    // console.log('rendered Clock');

    return (
        <ClockContainer>
            <Flag src={"flags/" + props.market.CountryCode.toLowerCase() + ".svg"} alt={props.market.CountryCode} />
            <Title ref={(divElement) => { setTitleDivElement(divElement) }} divWidth={TitleDivElement && TitleDivElement.clientWidth} >
                {props.market.Title}
                {/* {TitleDivElement.clientWidth > 500 ? props.market.Title : props.market.Code.toUpperCase()} */}
                {/* {TitleDivElement && TitleDivElement.clientHeight + '-' + TitleDivElement.clientWidth} */}
            </Title>
            {props.isLoading ? (
                <Loader>Loading</Loader>
            ) : (
                    <div style={{ height: '75%', width: '100%' }}>
                        <TimeText sessionColor={currentSession && currentSession.Style} ref={(divElement) => { setTimeTextDivElement(divElement) }} divWidth={TimeTextDivElement && TimeTextDivElement.clientWidth}>
                            {localedTime && localedTime.format('LTS')}
                        </TimeText>
                        <Session sessionColor={currentSession && currentSession.Style} ref={(divElement) => { setSessionDivElement(divElement) }} divWidth={SessionDivElement && SessionDivElement.clientWidth}>
                            {currentSession && currentSession.Title}
                        </Session>
                        <NextSession ref={(divElement) => { setNextSessionDivElement(divElement) }} divWidth={NextSessionDivElement && NextSessionDivElement.clientWidth}>
                            {countdownToNextSession && countdownToNextSession}
                            &nbsp;to&nbsp;
                            {nextSession && nextSession.Title}
                        </NextSession>
                        <Logo src={"logos/" + props.market.Code.toLowerCase() + ".png"} alt={props.market.Code + "logo"} />
                    </div>
                )}
        </ClockContainer>
    );
}

export default Clock;