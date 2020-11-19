import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useLocalStorage } from 'web-api-hooks';
import moment from 'moment-timezone';

const Background = styled.footer`
    height:2vh;
    text-align:center;

    color: ${props => props.theme.secondary};
    background-color: ${props => props.theme.primary};
    background-image: linear-gradient(rgb(0,0,0,0), rgb(0,0,0,0.50));
`;

const Footer = props => {
    const [visitCount, setVisitCount] = useLocalStorage('visitCount', 1);
    React.useEffect(() => {
        setVisitCount(count => count + 1);
    }, [setVisitCount]);
    console.log('rendered footer');

    return (
        <Background>
            <span>
                {visitCount} Visits
            </span>
            &nbsp;|&nbsp;
            <span>
                {props.alertCount} Alerts
            </span>
            {(visitCount > 20 || props.alertCount > 100) &&
                <>
                    &nbsp;|&nbsp;
                    <span>
                        Project costs $ {Math.round(1200 + moment().diff(moment("2020-01-01"), 'seconds') * 0.00003073807635)}
                    </span>
                    <span>
                        &nbsp;|&nbsp;
                        Please consider
                        &nbsp;
                    <a href='https://bitcoin.pinescripters.io/api/v1/invoices?storeId=4Me65BPoj7SwkteoaFdLnqEULNXVpQxFpDL3rybXRvPp&checkoutDesc=Market Open donation&price=5&currency=USD'>
                            donating
                    </a>
                    </span>
                </>
            }
        </Background>
    )
};

Footer.propTypes = {
    alertCount: PropTypes.number
}

export default React.memo(Footer);
