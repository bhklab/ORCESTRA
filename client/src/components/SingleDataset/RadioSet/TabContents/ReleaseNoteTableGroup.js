import React, {useState, useEffect, useMemo} from 'react';
import {usePromiseTracker} from "react-promise-tracker";
import {trackPromise} from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';
import ReactDataTable from '../../../Shared/ReactDataTable/ReactDataTable';

const StyledReleaseNoteTableGroup = styled.div`
    margin-left: 10px;
    .flex{
        display: flex;
    }
    .column {
        width: 30%;
        min-width: 270px;
        margin-right: 30px;
    }
    .none {
        margin-left: 10px;
        font-weight: bold;
        font-size: 20px;
        color: #3D405A;
    }
`

const LoaderContainer = styled.div`
    height: 300px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ReleaseNoteTableGroup = (props) => {
    const {promiseInProgress} = usePromiseTracker();
    const [data, setData] = useState({});
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const res = await trackPromise(fetch(`/api/pset/releasenotes/${props.dataset.name}/${props.dataset.version}/${props.type}`));
            const json = await res.json();
            console.log(json);
            setData(json);
            setReady(true);
        }
        getData();
    }, []);

    const current = useMemo(
        () => [
            {
                Header: ``,
                accessor: 'name',
                filterPlaceholder: '',
                disableFilters: false,
                disableSortBy: true
            },
        ],
        []
    );

    const currentExp = useMemo(
        () => [
            {
                Header: `Experiment ID`,
                accessor: 'experimentID',
                filterPlaceholder: '',
                disableFilters: false,
                disableSortBy: true,
                width: '20%'
            },
            {
                Header: `Cell Line`,
                accessor: 'cellLine',
                filterPlaceholder: '',
                disableFilters: false,
                disableSortBy: true,
                width: '10%'
            },
            {
                Header: `Drug`,
                accessor: 'drug',
                filterPlaceholder: '',
                disableFilters: false,
                disableSortBy: true,
                width: '15%'
            },
            {
                Header: `Min. Conc. Range`,
                accessor: 'concRangeMin',
                filterPlaceholder: '',
                disableFilters: false,
                disableSortBy: true,
                width: '10%'
            },
            {
                Header: `Max. Conc. Range`,
                accessor: 'concRangeMax',
                filterPlaceholder: '',
                disableFilters: false,
                disableSortBy: true,
                width: '10%'
            },
        ],
        []
    );

    const newData = useMemo(
        () => [
            {
                Header: ``,
                accessor: 'name',
                filterPlaceholder: '',
                disableFilters: false,
                disableSortBy: true
            },
        ],
        []
    );

    const removed = useMemo(
        () => [
            {
                Header: ``,
                accessor: 'name',
                filterPlaceholder: '',
                disableFilters: false,
                disableSortBy: true
            },
        ],
        []
    );

    const getTable = (columns, data, currentExp=false) => (
        <ReactDataTable 
            columns={columns} 
            data={data} 
            pageSize={20} 
            pageCounter={true} 
            pageSkip={false} 
            pageSizeChange={false}
            hideHeader={currentExp ? false : true}
            style={{
                headerTextAlign: 'left',
                cellPadding: '0.5rem 0.5rem',
                cellTextAlign: 'left'
            }}
            filterStyle={{
                margin: {
                    left: '0',
                    right: '0'
                }
            }}
        />
    );

    return(
        <StyledReleaseNoteTableGroup>
            {
                (!promiseInProgress && ready) ?
                <div>
                    {
                        props.type === 'experiments' &&
                        <div>
                            <h3>{`Current (${data[props.type].current.length})`}</h3>
                            {getTable(currentExp, data[props.type].current, true)}
                        </div>
                    }
                    <div className='flex'>
                        {
                            props.type != 'experiments' &&
                            <div className='column'>
                                <h3>{`Current (${data[props.type].current.length})`}</h3>
                                {getTable(current, data[props.type].current)}
                            </div>
                        }
                        <div className='column'>
                            <h3>{`New${data[props.type].new.length ? ` (${data[props.type].new.length})` : ''}`}</h3>
                            {
                                data[props.type].new.length ? 
                                getTable(newData, data[props.type].new) : 
                                <div className='none'>N/A</div>
                            }
                        </div>
                        <div className='column'>
                            <h3>{`Removed${data[props.type].removed.length ? ` (${data[props.type].removed.length})` : ''}`}</h3>
                            {
                                data[props.type].removed.length ? 
                                getTable(removed, data[props.type].removed) : 
                                <div className='none'>N/A</div>
                            }
                        </div>
                    </div>
                </div>
                :
                <LoaderContainer>
                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                </LoaderContainer>
            }
        </StyledReleaseNoteTableGroup>
    );
}

export default ReleaseNoteTableGroup;