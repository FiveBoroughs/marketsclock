import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Transition, Button } from 'semantic-ui-react';
import { useLocalStorage } from 'web-api-hooks';
import styled from 'styled-components';

const Container = styled.div`
    width: 75%;
    margin: auto;
`;

const Background = styled.div`
    margin: 20px;
    padding: 10px;
    border-radius: 3px;

    background-color: ${props => props.theme.complementary};
    background-image: radial-gradient(
        circle at bottom left,
        rgb(0,0,0,0.25),
        rgb(0,0,0,0)
    );
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

const Elements = styled.div`
    color: ${props => props.theme.secondary};

    display:flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
`;

const Text = styled.div`
    font-size: 2em;
    margin: 20px;
    text-align: left;
`;

const Title = styled.div`
    font-weight: 600;
    padding-bottom: 10px;
`;

const SubTitle = styled.div`
    font-weight: 300;
`;

const IconE = styled(Icon)`
    float: right;
`;

const Description = props => {
    const [descriptionSeen, setDescriptionSeen] = useLocalStorage('descriptionSeen', false);

    return (
        <Container>
            <Transition visible={!descriptionSeen} animation='fly right' duration={300}>
                <Background>
                    <IconE link name='close' onClick={() => setDescriptionSeen(true)} />
                    <Elements>

                        <Text>
                            <Title>
                                Market Open will notify you of market events
                        </Title>
                            <SubTitle>
                                Keep it as a background tab, and receive notifications
                        </SubTitle>
                        </Text>
                        <Button inverted onClick={props.handleIsMarketsModalOpen}>
                            Add Markets, Futures, Options
                        </Button>
                    </Elements>
                </Background>
            </Transition>
        </Container >
    )
};

Description.propTypes = {
    handleIsMarketsModalOpen: PropTypes.func
};

export default Description;
