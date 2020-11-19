import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, Header, Icon } from 'semantic-ui-react';

import MarketSelector from './MarketSelector';

const MarketsModal = props => {
    console.log('rendered Markets Modal')

    return (
        <Modal open={props.isMarketsModalOpen} size='small'
            onClose={props.handleIsMarketModalOpen}>
            <Header as='h2' icon='settings' content='Markets' subheader='Change your selected markets' />
            <Modal.Content>
                <Form>
                    <MarketSelector
                        handleChangeSelectedMarkets={props.handleChangeSelectedMarkets}
                        selectedMarkets={props.selectedMarkets}
                        markets={props.markets}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={props.handleIsMarketModalOpen}>
                    <Icon name='close' />
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    )
};

MarketsModal.propTypes = {
    selectedMarkets: PropTypes.array,
    markets: PropTypes.array,
    handleIsMarketModalOpen: PropTypes.func,
    isMarketsModalOpen: PropTypes.bool,
    handleChangeSelectedMarkets: PropTypes.func
};

export default MarketsModal;
