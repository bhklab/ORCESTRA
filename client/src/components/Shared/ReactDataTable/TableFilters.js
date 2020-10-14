import React from 'react';
import styled from 'styled-components';

const StyledFilter = styled.div`
    margin-left: ${props => props.style.margin ? props.style.margin.left : '0.5rem'};
    margin-right: ${props => props.style.margin ? props.style.margin.right : '0.5rem'};
`

const DefaultFilterInput = styled.input`
    width: 100%;
    margin-bottom: 1.0rem;
    font-size: 14px;
    padding: 5px;
    border: 1px solid #999999;
    border-radius: 3px;
    :focus {
        outline: none;
    }
`

export const Filter = ({column, style}) => {
    return(
        <StyledFilter style={style}>
            {column.canFilter && column.render('Filter')}
        </StyledFilter>
    );
}

export const DefaultColumnFilter = ({
    column: {
        filterValue, 
        setFilter, 
        preFilteredRows,
        filterPlaceholder
    }
}) => {
    return(
        <DefaultFilterInput
            value={filterValue || ""}
            onChange={e => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={filterPlaceholder}
        />
    );
};

