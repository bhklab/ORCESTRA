import React from 'react';
import styled from 'styled-components';

const StyledSearchSummary = styled.div`
    margin-right: 20px;
    .wrapper {
        display: flex;
        align-items: flex-end;
        margin-top: -25px;
        margin-bottom: 15px;
    }
    .number {
        font-size: 100px;
        font-weight: bold;
    }
    .text {
        font-size: 20px;
        margin-left: 5px;
        padding-bottom: 15px;
    }
`;

const SearchSummary = (props) => {
    const { title, searchAll, matchNum } = props;
    return(
        <StyledSearchSummary>
            <h3>{title}</h3>
            <div className='wrapper'>
                <span className='number'>
                    {matchNum}
                </span> 
                <span className='text'>
                    { searchAll ? 'dataset(s) available.' : `${(matchNum === 1 ? ' match' : ' matches')} found.` }
                </span>
            </div>
        </StyledSearchSummary>
    );
}

export default SearchSummary;