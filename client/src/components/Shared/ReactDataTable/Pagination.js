import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import styled from 'styled-components';

export const StyledPagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0 10px 0;

    .pageIndex {
        max-width: 500px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 1%;
        margin-right: 1%;

        button {
            border: none;
            background: none;
            padding: 0;
            line-height: 0;
            cursor: pointer;
        }
    
        button:focus {
            outline: none;
        }
    
        button: disabled {
            cursor: not-allowed;
            pointer-events: none;
            color: #999999;
        }

        .arrows {
            line-height: 0;
        }
    
        .arrowbtn {
            font-size: 20px;
            color: #3D405A;
        }
    
        .indexbtn {
            font-size: 15px;
            margin-left: 5px;
            margin-right: 5px;
            color: #666666;
        }
    
        .current {
            font-weight: bold;
            color: #3D405A;
        }
    }

    .pageCounter {
        line-height: 0;
        color: #666666;
        margin-left: 1%;
        margin-right: 1%;
    }

    .pageSkip {
        margin-left: 1%;
        margin-right: 1%;
        span {
            margin-right: 10px;
            color: #666666;
        }

        input[type=number] {
            width: 10%;
            min-width: 50px;
            padding: 5px;
            color: #666666;
            border: 1px solid #666666;
            border-radius: 5px;
        }

        input:focus {
            outline: none;
        }
    }

    .pageSizeChange {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 1%;
        margin-right: 1%;
        span {
            margin-left: 10px;
            color: #666666;
        }
    }
`;

const Pagination = (props) => {
    return(
        <StyledPagination style={props.style}>
            {
                props.pageOptions.length > 1 && 
                <div className='pageIndex'>
                    <div className='arrows'>
                        <button className='arrowbtn' onClick={() => props.gotoPage(0)} disabled={props.pageIndex === 0}>
                            <i className='pi pi-fw pi-angle-double-left'></i>
                        </button>
                        <button className='arrowbtn' onClick={() => props.previousPage()} disabled={!props.canPreviousPage}>
                            <i className='pi pi-fw pi-angle-left'></i>
                        </button>
                    </div>
                    {
                        props.pageIndexArray.map(index => (
                            <button key={index} className={`indexbtn ${index === props.pageIndex ? 'current' : ''}`} onClick={() => props.gotoPage(index)}>
                                {index + 1}
                            </button>
                        ))
                    }
                    <div className='arrows'>
                        <button className='arrowbtn' onClick={() => props.nextPage()} disabled={!props.canNextPage}>
                            <i className='pi pi-fw pi-angle-right'></i>
                        </button>
                        <button className='arrowbtn' onClick={() => props.gotoPage(props.pageOptions.length - 1)} disabled={props.pageIndex === props.pageOptions.length - 1}>
                            <i className='pi pi-fw pi-angle-double-right'></i>
                        </button>
                    </div>
                </div>
            }
            
            {
                props.pageCounter && 
                <div className='pageCounter'>
                    {props.pageIndex + 1} of {props.pageOptions.length}
                </div>
            }
            {
                props.pageSkip &&
                <div className='pageSkip'>
                    <span>Go to:</span>
                    <input
                        type="number"
                        defaultValue={props.pageIndex + 1 || 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            props.gotoPage(page)
                        }}
                    />
                </div>
            }
            {
                props.pageSizeChange &&
                <div className='pageSizeChange'>
                    <Dropdown 
                        options={[5, 10, 20, 30, 40, 50, 100].map(option => ({value: option, label: option}))} 
                        value={props.pageSize}
                        default={props.pageSize}
                        placeholder=''
                        onChange={(e) => {
                            props.setPageSize(e.value);
                        }}
                    />
                    <span>rows/page</span>
                </div>
            }
        </StyledPagination>
    );
}

export default Pagination;