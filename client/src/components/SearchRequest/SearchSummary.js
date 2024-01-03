import React from 'react';
import styled from 'styled-components';

const StyledSearchSummary = styled.div`
    .wrapper {
        display: flex;
        align-items: flex-end;
    }
    .number {
        font-size: 100px;
        font-weight: bold;
    }
    .text {
        font-size: 20px;
        margin-left: 5px;
        align-self: center;
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