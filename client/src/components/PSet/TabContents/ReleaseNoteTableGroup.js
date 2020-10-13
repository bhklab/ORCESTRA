import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

const StyledReleaseNoteTableGroup = styled.div`
    display: flex;
    justify-content: space-between;
`

const StyledTable = styled.table`
    width: ${props => props.width};
    thead {
        display:block;
    }
    tbody {
        height: 300px;
        overflow-y:scroll; 
        display:block;
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

    const getTable = (header, data, width='30%') => (
        <StyledTable width={width}>
            <thead>
                <tr>
                    <td>{header}</td>
                </tr>
            </thead>
            <tbody>
                {
                    data.map(row => (
                        <tr key={row.name}>
                            <td>{row.name}</td>
                        </tr>
                    ))
                }
            </tbody>
        </StyledTable>
    );

    const getCurrentExperimentTable = (header, data) => (
        <StyledTable width='100%'>
            <thead>
                <tr>
                    <td>{header}</td>
                </tr>
                <tr>
                    <td>Experiment ID</td>
                    <td>Cell Line</td>
                    <td>Drug</td>
                    <td>Min. Concentration Range</td>
                    <td>Max. Concentration Range</td>
                </tr>
            </thead>
            <tbody>
                {
                    data.map(row => (
                        <tr key={row.experimentID}>
                            <td>{row.experimentID}</td>
                        </tr>
                    ))
                }
            </tbody>
        </StyledTable>
    )

    return(
        <StyledReleaseNoteTableGroup>
            {
                ready &&
                <React.Fragment>
                    {
                        props.type === 'experiments' ? 
                        getCurrentExperimentTable(`Current (${data[props.type].current.length})`,data[props.type].current) : 
                        getTable(`Current (${data[props.type].current.length})`, data[props.type].current)
                    }
                    {getTable(`New (${data[props.type].new.length})`, data[props.type].new, props.type === 'experiments' ? '50%' : '30%')}
                    {getTable(`Removed (${data[props.type].removed.length})`, data[props.type].removed, props.type === 'experiments' ? '50%' : '30%')}
                </React.Fragment>
            }
        </StyledReleaseNoteTableGroup>
    );
}

export default ReleaseNoteTableGroup;