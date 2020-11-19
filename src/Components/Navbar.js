import React from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const HeaderStyle = styled.header`
    color: ${props => props.theme.complementary};
    background-color: ${props => props.theme.secondary};
    background-image: linear-gradient(rgb(0,0,0,0.50), rgb(0,0,0,0));
    min-height: 5vh;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

const HeaderCont = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    @media (min-width: 960px) {
        justify-content: space-between;
    }
`;

const Nav = styled.nav`
    ul{
        text-align: center;
    }
    li {
        display: inline-flex;
    }
    a {
        display: inline-block;
        padding: .5em 1.5em;
    }
`;

const LogoCont = styled.h1`
    display: flex;
    align-items: center;
    font-size: 3.5em;
    font-weight: 800;
    line-height: 1;
`;

const Logo = styled.img`
    height: 50px;
`;

const Navbar = props => {
    console.log('rendered navbar');

    return (
        <HeaderStyle>
            <HeaderCont className="container">
                <LogoCont>
                    <Logo src="/Bell_Red.png" alt="Logo" />
                    {window.location.href.indexOf('Tradingalarms.com') !== -1 ?
                        <span>Trading Alarms</span>
                        : window.location.href.indexOf('MarketsClock.com') !== -1 ?
                            <span>Markets Clock</span>
                            :
                            <span>Market Open</span>
                    }
                </LogoCont>
                <Nav>
                    <ul>
                        <li>
                            <Button icon labelPosition='right'
                                onClick={() => props.handleChangeIsSettingsModalOpen(true)}>
                                Settings
                                <Icon name='settings' />
                            </Button>
                        </li>
                    </ul>
                </Nav>
            </HeaderCont>
        </HeaderStyle >
    )
};

Navbar.propTypes = {
    handleChangeIsSettingsModalOpen: PropTypes.func
};

export default React.memo(Navbar);
