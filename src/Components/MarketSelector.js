import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

import MarketSelectorItem from './MarketSelectorItem';

const DropdownCont = styled(Dropdown)`
    width: 100%;
`;

const MarketSelector = props => {
    const dropdownOptions = props.markets.map(market => ({
        key: market.Code,
        text: market.Title,
        value: market.Code,
        content: (
            <MarketSelectorItem market={market} />
        )
    }));

    return (
        <DropdownCont multiple search selection placeholder='Select Markets'
            value={props.selectedMarkets.map(x => x.Code)}
            onChange={props.handleChangeSelectedMarkets}
            options={dropdownOptions}
        />
    )
};

MarketSelector.propTypes = {
    selectedMarkets: PropTypes.array,
    markets: PropTypes.array,
    handleChangeSelectedMarkets: PropTypes.func
};

export default MarketSelector;
