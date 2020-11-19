import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Header, Icon, Table } from 'semantic-ui-react';
import styled from 'styled-components'; import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const deepCopyMoment = (time) => {
    return moment.tz(time.tz()).set({
        day: time.get('date'),
        month: time.get('month'),
        year: time.get('year'),
        hour: time.get('hour'),
        minute: time.get('minute'),
        seconds: time.get('second')
    });
};

const CalendarConst = styled(Calendar)`
    .calendarStyleClosed{
        background-color: ${props => props.theme.closed};
        color: ${props => props.theme.primary};
    }
    .calendarStyleHalfOpen{
        background-color: ${ props => props.theme.halfOpen};
        color: ${props => props.theme.primary};
    }
    .calendarStyleOpen{
        background-color: ${ props => props.theme.open};
        color: ${props => props.theme.primary};
    }
`;

const buildCalendarEvents = (market) => {
    const time = moment().tz(market.TimeZone);
    let events = [];
    market.Sessions.forEach(session => {
        session.Days.forEach(day => {
            for (let i = -3; i < 50; i++) {
                const dayMoment = deepCopyMoment(time).day(day);
                dayMoment.day(dayMoment.day() + 7 * i);
                if (market.Holidays.filter(holiday => holiday.Date === dayMoment.format("DD/MM/YY")).length <= 0) {
                    events.push({
                        title: session.Title,
                        start: new Date(
                            dayMoment.get('year'),
                            dayMoment.get('month'),
                            dayMoment.get('date'),
                            session.StartTime.split(':')[0],
                            session.StartTime.split(':')[1]),
                        end: new Date(
                            dayMoment.get('year'),
                            dayMoment.get('month'),
                            dayMoment.get('date'),
                            session.EndTime.split(':')[0],
                            session.EndTime.split(':')[1]),
                        style: session.Style
                    });
                }
            }
        });
    });

    market.Holidays.forEach(holiday => {
        const dayMoment = moment(holiday.Date, "DD/MM/YY");

        events.push({
            title: holiday.Title,
            allDay: true,
            start: new Date(
                dayMoment.get('year'),
                dayMoment.get('month'),
                dayMoment.get('date')),
            end: new Date(
                dayMoment.get('year'),
                dayMoment.get('month'),
                dayMoment.get('date')),
            style: 0
        });
        if (holiday.Sessions.StartTime && holiday.Sessions.EndTime) {
            events.push({
                title: holiday.Sessions.Title,
                start: new Date(
                    dayMoment.get('year'),
                    dayMoment.get('month'),
                    dayMoment.get('date'),
                    holiday.Sessions.StartTime.split(':')[0],
                    holiday.Sessions.StartTime.split(':')[1]),
                end: new Date(
                    dayMoment.get('year'),
                    dayMoment.get('month'),
                    dayMoment.get('date'),
                    holiday.Sessions.EndTime.split(':')[0],
                    holiday.Sessions.EndTime.split(':')[1]),
                style: holiday.Sessions.Style
            });
        }
    });
    return events;
};

const MarketDetails = props => {
    const market = props.markets.filter(x => x.Code === props.marketDetailsModalMarketCode)[0];

    return (
        <Modal open={props.isMarketDetailsModalOpen} size='large'
            onClose={props.handleChangeIsMarketDetailsModal}>
            <Header as='h2' icon='settings' content={market.Title} subheader='Market details' />
            <Modal.Content>
                {/* <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell>Start</Table.HeaderCell>
                            <Table.HeaderCell>End</Table.HeaderCell>
                            <Table.HeaderCell>Days</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {market.Sessions.map(
                            (session, ISession) =>
                                <Table.Row key={'table-session-' + ISession}>
                                    <Table.Cell>
                                        <ColorDot sessionColor={session.Style} />
                                        {session.Title}
                                    </Table.Cell>
                                    <Table.Cell>{session.StartTime}</Table.Cell>
                                    <Table.Cell>{session.EndTime}</Table.Cell>
                                    <Table.Cell>{
                                        session.Days.map((day, IDay) =>
                                            <div key={'table-session-' + ISession + '-day-' + IDay}>
                                                <p>{day}</p>
                                            </div>)
                                    }</Table.Cell>
                                </Table.Row>
                        )}
                    </Table.Body>
                </Table> */}

                <p>
                    Time zone :&nbsp;
                    {market.TimeZone}
                </p>
                <p>
                    Country :&nbsp;
                    {market.CountryCode}
                </p>

                <CalendarConst
                    localizer={momentLocalizer(moment)}
                    defaultView='week'
                    events={buildCalendarEvents(market)}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={(event) => {
                        return { className: event.style === 0 ? "calendarStyleClosed" : event.style === 1 ? "calendarStyleHalfOpen" : "calendarStyleOpen" }
                    }}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={props.handleChangeIsMarketDetailsModal}>
                    <Icon name='close' />
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    )
};

MarketDetails.propTypes = {
    markets: PropTypes.array,
    handleChangeIsMarketDetailsModal: PropTypes.func,
    isMarketDetailsModalOpen: PropTypes.bool,
    marketDetailsModalMarketCode: PropTypes.string,
    themeColorOpen: PropTypes.string,
    themeColorHalfOpen: PropTypes.string,
    themeColorClosed: PropTypes.string
};

export default MarketDetails;
