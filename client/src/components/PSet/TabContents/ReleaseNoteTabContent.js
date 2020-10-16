import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DatasetTabContent from './DatasetTabContent';
import ReleaseNoteTableGroup from './ReleaseNoteTableGroup';


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

const StyledMetricDataGroup = styled.div`
    margin-top: 20px;    
    margin-bottom: 20px;
    table {
        td {
            padding: 0.3rem;
            font-size: 14px;
            .number {
                color: #3D405A;
                font-weight: bold;
                font-size: 16px;
            }
        }
        .title {
            font-weight: bold;
            color: #3D405A;
        }
    }
`

const AdditionalInformation = styled.div`
    margin-bottom: 20px;
    table {
        td {
            padding: 0.3rem;
            font-size: 14px;
            .number {
                color: #3D405A;
                font-weight: bold;
                font-size: 16px;
            }
        }
        .title {
            font-weight: bold;
            color: #3D405A;
        }
    }
`

const ReleaseNoteTabContent = (props) => {

    //const [display, setDisplay] = useState('cellLines');

    const getMetricDataText = (key, label, count) => {
        switch(key){
            case 'current':
                return `${label}${count > 1 ? 's' : ''} in this dataset.`;
            case 'new':
                return `newly added ${label}${count > 1 ? 's' : ''}.`;
            case 'removed':
                return `${label}${count > 1 ? 's' : ''} ${count > 1 ? 'were' : 'was'} removed from previous version.`;
        }
    }

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

    const metricDataGroup = (title, name, label, data, renderRow) => (
        <StyledMetricDataGroup>
            <h2>{title}</h2>
            <table>
                <tbody>
                    { renderRow(name, data, label) }
                </tbody>
            </table>
        </StyledMetricDataGroup>
    );

    const renderDataRow = (name=null, data, label) => (
        Object.keys(data).map(key => (
            data[key] > 0 &&
            <tr key={key}>
                <td><span className='number'>{ data[key] }</span></td>
                <td className='text'>{ getMetricDataText(key, label, data[key]) }</td>
            </tr>
        ))
    );

    const renderMolDataRow = (name, data) => (
        Object.keys(data).map(key => (
            key === 'mutationExome' ? name === 'GDSC' && molDataTableRow(key, data) :  molDataTableRow(key, data)
        ))
    );

    const molDataTableRow = (key, data) => (
        <tr key={key}>
            <td className='title'>{getMolDataName(key)}</td>
            <td>
                {
                    data[key].available ?  
                    <span><span className='number'>{data[key].count}</span> cell lines {data[key].noUpdates && '(no updates from previous version)'}</span>
                    : 'Not available for this dataset.'
                }
            </td>
        </tr>
    );

    return(
        <StyledReleaseNotes>
            {metricDataGroup('Cell Lines', props.data.name, 'cell line', props.data.releaseNotes.cellLines, renderDataRow)} 
            {metricDataGroup('Drugs', props.data.name, 'drug', props.data.releaseNotes.drugs, renderDataRow)} 
            {metricDataGroup('Drug Sensitivity Experiments', props.data.name, 'experiment', props.data.releaseNotes.experiments, renderDataRow)} 
            {metricDataGroup('Molecular Data', props.data.name, '', props.data.releaseNotes.molData, renderMolDataRow)} 
            {
                props.data.name === 'GDSC' &&
                <AdditionalInformation>
                    <h2>Additional Information</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td className='title'>GDSC Official Release Notes: </td>
                                <td>
                                    <a href={props.data.releaseNotes.additional.link} target="_blank" rel="noopener noreferrer">{props.data.releaseNotes.additional.link}</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </AdditionalInformation>
            }
            {/* <StyledMetricsPanel>
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
                {display === 'experiments' && <ReleaseNoteTableGroup dataset={{name: props.data.name, version: props.data.version}} type='experiments'/>}
                {display === 'molData' && molDataGroup(props.data.molData)}
            </StyledMetricsPanel> */}
        </StyledReleaseNotes>
    );
}

export default ReleaseNoteTabContent;