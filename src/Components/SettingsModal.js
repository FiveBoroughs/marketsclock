import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button, Checkbox, Icon, Modal, Form, Divider, Header, Input } from 'semantic-ui-react';
import { ChromePicker } from 'react-color';
import styled from 'styled-components';
import Slider from 'rc-slider';

import MarketSelector from './MarketSelector.js';

import 'rc-slider/assets/index.css';

const ColorPreview = styled.div`
    margin: -5px 5px;
    padding: 5px;
    background: #e0e1e2;
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba(0,0,0,.1);
    display: inline-block;
    cursor: pointer;
    div{
        width: 36px;
        height: 14px;
        border-radius: 2px;
    }
    #primary{
        background: ${props => props.theme.primary};
    }
    #secondary{
        background: ${props => props.theme.secondary};
    }
    #complementary{
        background: ${props => props.theme.complementary};
    }
    #open{
        background: ${props => props.theme.open};
    }
    #halfOpen{
        background: ${props => props.theme.halfOpen};
    }
    #closed{
        background: ${props => props.theme.closed};
    }
`;

const ColorPopOver = styled.div`
    position: absolute;
    z-index: 2;
`;

const ColorCover = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;

const ColorSelectionSpan = styled.span`
    margin-right: 10px;
`;

const SliderCont = styled(Slider)`
    width: 200px;
`;

const SettingsModal = props => {
    let [displayColorPickerPrimary, setDisplayColorPickerPrimary] = useState(false);
    let [displayColorPickerSecondary, setDisplayColorPickerSecondary] = useState(false);
    let [displayColorPickerComplementary, setDisplayColorPickerComplementary] = useState(false);
    let [displayColorPickerOpen, setDisplayColorPickerOpen] = useState(false);
    let [displayColorPickerHalfOpen, setDisplayColorPickerHalfOpen] = useState(false);
    let [displayColorPickerClosed, setDisplayColorPickerClosed] = useState(false);

    console.log('rendered settingsmodal');


    let minutesAdvanceError = false;
    return (
        <Modal open={props.isSettingsModalOpen} size='small'
            onClose={() => props.handleChangeIsSettingsModalOpen(false)}>
            <Header as='h2' icon='settings' content='Settings' subheader='Manage your preferences' />
            <Modal.Content>
                <Form>
                    <h3>Markets</h3>
                    <MarketSelector
                        handleChangeSelectedMarkets={props.handleChangeSelectedMarkets}
                        selectedMarkets={props.selectedMarkets}
                        markets={props.markets} />
                    <Divider />
                    <h3>Notifications</h3>
                    <Form.Field inline>
                        <Checkbox toggle label="Enable desktop notification if tab is in the background"
                            onChange={props.handleChangeIsPushEnabled}
                            checked={props.isPushEnabled}
                        />
                        <Button animated
                            onClick={props.handleClickPushNotification}
                            disabled={props.isSoundPlaying || !props.isSoundsEnabled}>
                            <Button.Content visible>Try</Button.Content>
                            <Button.Content hidden><Icon name='bell' /></Button.Content>
                        </Button>
                    </Form.Field>
                    <Form.Field inline>
                        <label>Warn me</label>
                        <Input type='number' style={{ width: "75px" }}
                            value={props.minutesAdvanceNotification}
                            error={minutesAdvanceError} //'Enter a number over 0' TODO
                            onChange={(e, { value }) => {
                                if (!isNaN(parseInt(value)) && value >= 0 && value <= 30) {
                                    minutesAdvanceError = false;
                                    props.handleChangeMinutesAdvanceNotification(e, { value })
                                } else {
                                    minutesAdvanceError = true
                                }
                            }}
                        />
                        <label> minutes before events</label>
                    </Form.Field>
                    <Form.Field inline>
                        <label>Check once every</label>
                        <Dropdown selection placeholder='Select interval'
                            value={props.checkInterval}
                            onChange={props.handleChangeCheckInterval}
                            options={[{ key: 'sec', text: 'Second', value: 1000 }, { key: 'min', text: 'Minute', value: 60000 }]}
                        />
                    </Form.Field>
                    <Divider />
                    <h3>Notification sounds</h3>
                    <Form.Field>
                        <Checkbox toggle label="Enable sound"
                            onChange={props.handleChangeIsSoundsEnabled}
                            checked={props.isSoundsEnabled}
                        />
                    </Form.Field>
                    <p>Notification sounds can be disabled individually by market with the Bell, top left of the flag</p>
                    <Form.Group inline>
                        <label>Volume</label>
                        <SliderCont min={0} max={100}
                            disabled={!props.isSoundsEnabled}
                            defaultValue={props.soundVolume}
                            onAfterChange={props.handleChangeSoundVolume}
                            trackStyle={{ backgroundColor: '#2185D0' }}
                            handleStyle={{
                                borderColor: '#2185D0',
                                height: '1.5rem',
                                width: '1.5rem',
                                marginTop: '-0.6rem',
                                backgroundColor: '#FAFAFA',
                            }}
                            railStyle={{ backgroundColor: '#E0E1E2' }}
                        />
                    </Form.Group>
                    <Form.Group inline>
                        <Form.Field width={6}>
                            <Dropdown selection label='Notification sound'
                                disabled={!props.isSoundsEnabled}
                                value={props.selectedNotificationSound}
                                options={props.sounds.map(sound => {
                                    let CleanName = sound.file.charAt(0).toUpperCase() + sound.file.slice(1).split('.')[0].replace(/[-_]+/g, ' ').toLowerCase();
                                    return { key: sound.file, value: sound.file, text: CleanName }
                                })}
                                onChange={props.handleChangeSelectedNotificationSound} />
                        </Form.Field>
                        <Button animated
                            onClick={props.handleChangeIsSoundPlaying}
                            disabled={props.isSoundPlaying || !props.isSoundsEnabled}>
                            <Button.Content visible>
                                Try
                            </Button.Content>
                            <Button.Content hidden>
                                <Icon name='bell' />
                            </Button.Content>
                        </Button>
                    </Form.Group>
                    <Form.Field width='16'>
                        <Checkbox toggle label="Enable human read notifications"
                            onChange={props.handleChangeIsTTSEnabled}
                            checked={props.isTTSEnabled}
                        />
                    </Form.Field>
                    <Divider />
                    <h3>Colors</h3>
                    <Form.Field inline>
                        <ColorSelectionSpan>
                            <label>
                                Primary
                            </label>
                            <ColorPreview onClick={() => { setDisplayColorPickerPrimary(!displayColorPickerPrimary) }}>
                                <div id="primary" />
                            </ColorPreview>
                            {displayColorPickerPrimary ?
                                <ColorPopOver>
                                    <ColorCover onClick={() => { setDisplayColorPickerPrimary(!displayColorPickerPrimary) }} />
                                    <ChromePicker color={props.themeColorPrimary} onChange={props.handleChangeThemeColorPrimary} />
                                </ColorPopOver>
                                : null}
                        </ColorSelectionSpan>
                        <ColorSelectionSpan>
                            <label>
                                Secondary
                            </label>
                            <ColorPreview onClick={() => { setDisplayColorPickerSecondary(!displayColorPickerSecondary) }}>
                                <div id="secondary" />
                            </ColorPreview>
                            {displayColorPickerSecondary ?
                                <ColorPopOver>
                                    <ColorCover onClick={() => { setDisplayColorPickerSecondary(!displayColorPickerSecondary) }} />
                                    <ChromePicker color={props.themeColorSecondary} onChange={props.handleChangeThemeColorSecondary} />
                                </ColorPopOver>
                                : null}
                        </ColorSelectionSpan>
                        <ColorSelectionSpan>
                            <label>
                                Complementary
                            </label>
                            <ColorPreview onClick={() => { setDisplayColorPickerComplementary(!displayColorPickerComplementary) }}>
                                <div id="complementary" />
                            </ColorPreview>
                            {displayColorPickerComplementary ?
                                <ColorPopOver>
                                    <ColorCover onClick={() => { setDisplayColorPickerComplementary(!displayColorPickerComplementary) }} />
                                    <ChromePicker color={props.themeColorComplementary} onChange={props.handleChangeThemeColorComplementary} />
                                </ColorPopOver>
                                : null}
                        </ColorSelectionSpan>
                        <Button animated
                            onClick={() => {
                                props.handleChangeThemeColorPrimary({ rgb: { r: '17', g: '55', b: '67', a: '1' } });
                                props.handleChangeThemeColorSecondary({ rgb: { r: '228', g: '227', b: '219', a: '1' } });
                                props.handleChangeThemeColorComplementary({ rgb: { r: '197', g: '0', b: '16', a: '1' } });
                            }}>
                            <Button.Content visible>Reset</Button.Content>
                            <Button.Content hidden><Icon name="repeat" /></Button.Content>
                        </Button>
                    </ Form.Field>
                    <Form.Field inline>
                        <ColorSelectionSpan>
                            <label>
                                Open
                            </label>
                            <ColorPreview onClick={() => { setDisplayColorPickerOpen(!displayColorPickerOpen) }}>
                                <div id="open" />
                            </ColorPreview>
                            {displayColorPickerOpen ?
                                <ColorPopOver>
                                    <ColorCover onClick={() => { setDisplayColorPickerOpen(!displayColorPickerOpen) }} />
                                    <ChromePicker color={props.themeColorOpen} onChange={props.handleChangeThemeColorOpen} />
                                </ColorPopOver>
                                : null}
                        </ColorSelectionSpan>
                        <ColorSelectionSpan>
                            <label>
                                Half open
                            </label>
                            <ColorPreview onClick={() => { setDisplayColorPickerHalfOpen(!displayColorPickerHalfOpen) }}>
                                <div id="halfOpen" />
                            </ColorPreview>
                            {displayColorPickerHalfOpen ?
                                <ColorPopOver>
                                    <ColorCover onClick={() => { setDisplayColorPickerHalfOpen(!displayColorPickerHalfOpen) }} />
                                    <ChromePicker color={props.themeColorHalfOpen} onChange={props.handleChangeThemeColorHalfOpen} />
                                </ColorPopOver>
                                : null}
                        </ColorSelectionSpan>
                        <ColorSelectionSpan>
                            <label>
                                Closed
                            </label>
                            <ColorPreview onClick={() => { setDisplayColorPickerClosed(!displayColorPickerClosed) }}>
                                <div id="closed" />
                            </ColorPreview>
                            {displayColorPickerClosed ?
                                <ColorPopOver>
                                    <ColorCover onClick={() => { setDisplayColorPickerClosed(!displayColorPickerClosed) }} />
                                    <ChromePicker color={props.themeColorClosed} onChange={props.handleChangeThemeColorClosed} />
                                </ColorPopOver>
                                : null}
                        </ColorSelectionSpan>
                        <Button animated
                            onClick={() => {
                                props.handleChangeThemeColorOpen({ rgb: { r: '49', g: '207', b: '49', a: '1' } });
                                props.handleChangeThemeColorHalfOpen({ rgb: { r: '255', g: '179', b: '45', a: '1' } });
                                props.handleChangeThemeColorClosed({ rgb: { r: '255', g: '60', b: '60', a: '1' } });
                            }}>
                            <Button.Content visible>Reset</Button.Content>
                            <Button.Content hidden><Icon name="repeat" /></Button.Content>
                        </Button>
                    </ Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted
                    onClick={() => props.handleChangeIsSettingsModalOpen(false)}>
                    <Icon name='close' />Close
                    </Button>
            </Modal.Actions>
        </Modal>
    )
};

SettingsModal.propTypes = {
    isSettingsModalOpen: PropTypes.bool,
    handleChangeIsSettingsModalOpen: PropTypes.func,

    isPushEnabled: PropTypes.bool,
    handleChangeIsPushEnabled: PropTypes.func,
    handleClickPushNotification: PropTypes.func,

    minutesAdvanceNotification: PropTypes.string,
    handleChangeMinutesAdvanceNotification: PropTypes.func,

    checkInterval: PropTypes.number,
    handleChangeCheckInterval: PropTypes.func,

    isSoundPlaying: PropTypes.bool,
    isSoundsEnabled: PropTypes.bool,
    handleChangeIsSoundsEnabled: PropTypes.func,
    selectedNotificationSound: PropTypes.any,
    handleChangeSelectedNotificationSound: PropTypes.func,
    sounds: PropTypes.array,
    handleChangeIsSoundPlaying: PropTypes.func,
    handleChangeIsHumanReadPlaying: PropTypes.func,

    selectedMarkets: PropTypes.array,
    markets: PropTypes.array,
    handleChangeSelectedMarkets: PropTypes.func,

    displayColorPickerPrimary: PropTypes.string,
    displayColorPickerSecondary: PropTypes.string,
    displayColorPickerComplementary: PropTypes.string,
    setDisplayColorPickerPrimary: PropTypes.func,
    setDisplayColorPickerSecondary: PropTypes.func,
    setDisplayColorPickerComplementary: PropTypes.func,
    themeColorOpen: PropTypes.string,
    themeColorHalfOpen: PropTypes.string,
    themeColorClosed: PropTypes.string,
    handleChangeThemeColorOpen: PropTypes.func,
    handleChangeThemeColorHalfOpen: PropTypes.func,
    handleChangeThemeColorClosed: PropTypes.func,
};

export default SettingsModal;
