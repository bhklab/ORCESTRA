import React, {useState, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import ReactDataTable from '../../Shared/ReactDataTable/ReactDataTable';

const StyledReleaseNoteTableGroup = styled.div`
    margin-left: 10px;
    display: flex;
    .column {
        width: 25%;
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

const ReleaseNoteTableGroup = (props) => {

    const [data, setData] = useState({});
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const res = await fetch(`/api/pset/releasenotes/${props.dataset.name}/${props.dataset.version}/${props.type}`);
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

    const getTable = (columns, data) => (
        <ReactDataTable 
            columns={columns} 
            data={data} 
            pageSize={20} 
            pageCounter={true} 
            pageSkip={false} 
            pageSizeChange={false}
            hideHeader={true}
            style={{
                headerTextAlign: 'left',
                cellPadding: '0.5rem 0rem',
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
                ready &&
                <React.Fragment>
                    <div className='column'>
                        <h3>{`Current (${data[props.type].current.length})`}</h3>
                        {getTable(current, data[props.type].current)}
                    </div>
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
                </React.Fragment>
            }
        </StyledReleaseNoteTableGroup>
    );
}

export default ReleaseNoteTableGroup;