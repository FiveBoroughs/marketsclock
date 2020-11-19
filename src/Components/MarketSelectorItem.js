import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import styled from 'styled-components';


const Flag = styled(Image)`
    float: left;
    max-width: 40px;
    max-height: 40px;
`;

const Logo = styled(Image)`
    float: right !important;
    max-width: 40px;
    max-height: 40px;
`;

const MarketSelectorItem = props => {
    return (
        <>
            <Flag
                src={"flags/" + props.market.CountryCode.toLowerCase() + ".svg"}
                alt="flag" />
            <Logo
                src={"logos/" + props.market.Code.toLowerCase() + ".png"}
                alt="logo" />

            {props.market.Title}
        </>
    )
};

MarketSelectorItem.propTypes = {
    market: PropTypes.object
};

export default MarketSelectorItem;
