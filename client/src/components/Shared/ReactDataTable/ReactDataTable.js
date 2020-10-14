import React, {useEffect, useState} from 'react';
import {useTable, usePagination, useFilters, useGlobalFilter, useSortBy} from 'react-table';
import {Filter, DefaultColumnFilter} from './TableFilters';
import Pagination from './Pagination';
import styled from 'styled-components';

export const StyledReactTable = styled.div`
    width: ${props => props.style.width ? props.style.width : '100%'};
    color: #666666;

    table{
        border-collapse: collapse;
        width: ${props => props.style.width ? props.style.width : '100%'};
    }

    thead {
        font-size: 12px;
        color: #666666;
    }  

    tbody {
        font-size: 12px;
    }

    tbody tr:nth-child(even) {

    }

    th[class='header'] {
        vertical-align: top;
        .headerContent {
            display: flex;
            align-items: ${props => props.style.headerTextAlign ? props.style.headerTextAlign : 'center'};
            justify-content: ${props => props.style.headerTextAlign ? props.style.headerTextAlign : 'center'};
            margin: 0.5rem 0.5rem;
        }
    }

    th {
        text-align: ${props => props.style.headerTextAlign ? props.style.headerTextAlign : 'center'};
        letter-spacing: 0.5px;
    }

    tbody td {
        padding: ${props => props.style.cellPadding ? props.style.cellPadding : '1.5rem 0.5rem'};
        text-align: ${props => props.style.cellTextAlign ? props.style.cellTextAlign : 'center'};
    }
`;

const ReactDataTable = (props) => {

    const [pageIndexArray, setPageIndexArray] = useState(Array.from(Array(5).keys()));

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        pageOptions,
        page,
        state: { pageIndex, pageSize, hideHeader},
        gotoPage,
        previousPage,
        nextPage,
        setPageSize,
        canPreviousPage,
        canNextPage,
    } = useTable(
        {
            columns: props.columns, 
            data: props.data, 
            initialState: { 
                pageIndex: 0,
                pageSize: props.pageSize,
                sortBy: props.sortBy ? props.sortBy : [],
                hideHeader: props.hideHeader
            },
            defaultColumn: {Filter: DefaultColumnFilter},
        },
        useFilters,
        useSortBy,
        usePagination
    );

    useEffect(() => {
        let numPages = pageOptions.length >= 5 ? 5 : pageOptions.length;
        let start = 0;
        // if index of the current page is not 2, shift the index array.
        // if current index is 2 or less away from the end, shift the index array only to the last page index.
        if(pageIndexArray.indexOf(pageIndex) != 2 && pageIndex -2 > 0 && pageIndex + 2 < pageOptions.length - 1){
            start = pageOptions[pageIndex - 2];
        }else if(pageIndex + 2 >= pageOptions.length - 1){ 
            start = pageOptions.length - numPages;
        }
        setPageIndexArray(Array(numPages).fill().map((_, i) => (start + i)));
    }, [pageIndex]);

    const getSortArrow = (column) => {
        if(column.disableSortBy){
            return '';
        }else{
            if(column.isSorted){
                if(column.isSortedDesc){
                    return <i className='pi pi-fw pi-arrow-down'></i>
                }else{
                    return <i className='pi pi-fw pi-arrow-up'></i>
                }
            }else{
                return <i className='pi pi-fw pi-sort-alt'></i>
            }
        }
    }

    return(
        <StyledReactTable style={props.style}>
            <table {...getTableProps()}>
                <thead>
                    {
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map(column => (
                                        <th className='header' {...column.getHeaderProps({style: {width: column.width || 'auto'}})}>
                                            {
                                                !hideHeader &&
                                                <div className='headerContent' {...column.getSortByToggleProps()}>
                                                    { column.render('Header') }
                                                    { getSortArrow(column) }
                                                </div>
                                            }
                                            <Filter column={column} style={props.filterStyle} />
                                        </th>
                                    ))
                                }
                            </tr>
                        )) 
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        page.map(row => {
                            prepareRow(row);
                            return(
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {
                                            return(
                                                <td key={Math.random()} {...cell.getCellProps}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            <Pagination 
                style={props.style} 
                gotoPage={gotoPage} 
                previousPage={previousPage} 
                nextPage={nextPage} 
                pageIndex={pageIndex} 
                pageIndexArray={pageIndexArray} 
                canPreviousPage={canPreviousPage} 
                canNextPage={canNextPage}
                pageOptions={pageOptions}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageCounter={props.pageCounter}
                pageSkip={props.pageSkip}
                pageSizeChange={props.pageSizeChange}
            />
        </StyledReactTable>
    );
}

export default ReactDataTable;