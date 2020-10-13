import React, {useState} from 'react';
import styled from 'styled-components';
import ReleaseNoteTableGroup from './ReleaseNoteTableGroup';
import ReleaseNoteExperimentTableGroup from './ReleaseNoteExperimentTableGroup';

const StyledMetricsPanel = styled.div`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
`

const StyledMetricGroupMenu = styled.div`
    display: flex;
    padding-top: 10px;
    padding-bottom: 10px;
    .menuItem {
        margin-right: 10px;
        padding-bottom: 5px;
        button {
            border: none;
            background: none;
            cursor: pointer;
            font-size: 14px;
        }
        button:focus {
            outline: none;
        }
    }
    .selected {
        button {
            font-weight: bold;
        }
        border-bottom: 1px solid #000000;
    }
`

const StyledMolDataGroup = styled.div`
    margin-bottom: 20px;
    table {
        margin-left: 20px;
        td {
            padding: 2px;
            font-size: 12px;
        }
        .title {
            font-weight: bold;
        }
    }
`

const ReleaseNoteTabContent = (props) => {

    const [display, setDisplay] = useState('cellLines');

    const metricGroup = (name, data) => (
        <div>
            <h4>{name}</h4>
            <div>Current: {data.current}</div>
            <div>New: {data.new}</div>
            <div>Removed: {data.removed}</div>
        </div>
    );

    const molDataGroup = (data) => (
        <StyledMolDataGroup>
            <h3>Molecular Data</h3>
            <table>
                <tbody>
                {
                    Object.keys(data).map(key => (
                        <tr key={key}>
                            <td className='title'>{getMolDataName(key)}</td>
                            <td>{data[key]}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </StyledMolDataGroup>
    );

    const getMolDataName = (key) => {
        switch(key){
            case 'rnaSeq':
                return 'RNA-seq: ';
            case 'microarray': 
                return 'Microarray: ';
            case 'mutation':
                return 'Mutation: ';
            case 'mutationExome':
                return 'Mutation (Exome): ';
            case 'cnv':
                return 'CNV: ';
            case 'fusion':
                return 'Fusion: ';
            case 'methylation':
                return 'Methylation: '
        }
    }

    return(
        <React.Fragment>
            <h3>Number of Cell Lines, Drugs and Experiments</h3>
            <StyledMetricsPanel>
                <StyledMetricGroupMenu>
                    <div className={display === 'cellLines' ? 'menuItem selected' : 'menuItem'}>
                        <button type='button' onClick={() => setDisplay('cellLines')}>Cell Lines</button>
                    </div>
                    <div className={display === 'drugs' ? 'menuItem selected' : 'menuItem'}>
                        <button type='button' onClick={() => setDisplay('drugs')}>Drugs</button>
                    </div>    
                    <div className={display === 'experiments' ? 'menuItem selected' : 'menuItem'}>
                        <button type='button' onClick={() => setDisplay('experiments')}>Experiments</button>
                    </div>
                </StyledMetricGroupMenu>
                {display === 'cellLines' && <ReleaseNoteTableGroup dataset={{name: props.data.name, version: props.data.version}} type='cellLines'/>}
                {display === 'drugs' && <ReleaseNoteTableGroup dataset={{name: props.data.name, version: props.data.version}} type='drugs'/>}
                {display === 'experiments' && <ReleaseNoteExperimentTableGroup dataset={{name: props.data.name, version: props.data.version}} type='experiments'/>}
            </StyledMetricsPanel>
            {molDataGroup(props.data.molData)}
        </React.Fragment>
    );
}

export default ReleaseNoteTabContent;