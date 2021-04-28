import React from 'react';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SearchTableLoader = () => {
    return(
        <Container>
            <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
        </Container>
    );
}

export default SearchTableLoader;
