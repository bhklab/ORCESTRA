import React, {useState} from 'react';
import styled from 'styled-components';
import ReleaseNoteTableGroup from './ReleaseNoteTableGroup';
import ReleaseNoteExperimentTableGroup from './ReleaseNoteExperimentTableGroup';

const StyledReleaseNotes = styled.div`
    width: 95%;
    margin-left: auto;
    margin-right: auto;
`

const StyledMetricsPanel = styled.div`
    margin-bottom: 30px;
`

const StyledMetricGroupMenu = styled.div`
    display: flex;
    margin-top: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    .menuItem {
        margin-right: 10px;
        padding-bottom: 5px;
        button {
            border: none;
            background: none;
            cursor: pointer;
            font-size: 16px;
            color: #3D405A;
        }
        button:focus {
            outline: none;
        }
    }
    .selected {
        button {
            font-weight: bold;
        }
        border-bottom: 3px solid rgb(241, 144, 33);
    }
`

const StyledMolDataGroup = styled.div`
    margin-top: 20px;    
    margin-bottom: 20px;
    table {
        td {
            padding: 0.2rem;
            font-size: 14px;
        }
        .title {
            font-weight: bold;
            color: #3D405A;
        }
    }
`

const ReleaseNoteTabContent = (props) => {

    const [display, setDisplay] = useState('cellLines');

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

    const molDataGroup = (data) => (
        <StyledMolDataGroup>
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

    return(
        <StyledReleaseNotes>
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
                    <div className={display === 'molData' ? 'menuItem selected' : 'menuItem'}>
                        <button type='button' onClick={() => setDisplay('molData')}>Molecular Data</button>
                    </div>
                </StyledMetricGroupMenu>
                {display === 'cellLines' && <ReleaseNoteTableGroup dataset={{name: props.data.name, version: props.data.version}} type='cellLines'/>}
                {display === 'drugs' && <ReleaseNoteTableGroup dataset={{name: props.data.name, version: props.data.version}} type='drugs'/>}
                {display === 'experiments' && <ReleaseNoteExperimentTableGroup dataset={{name: props.data.name, version: props.data.version}} type='experiments'/>}
                {display === 'molData' && molDataGroup(props.data.molData)}
            </StyledMetricsPanel>
        </StyledReleaseNotes>
    );
}

export default ReleaseNoteTabContent;