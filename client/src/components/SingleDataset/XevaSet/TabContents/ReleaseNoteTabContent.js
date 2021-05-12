import React from 'react';
import styled from 'styled-components';


const StyledReleaseNotes = styled.div`
    width: 95%;
    margin-left: auto;
    margin-right: auto;
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

const ReleaseNoteTabContent = (props) => {

    const getMetricDataText = (key, label, count) => {
        switch(key){
            case 'current':
                return `${label}${count > 1 ? 's' : ''} in this dataset.`;
            case 'new':
                return `newly added ${label}${count > 1 ? 's' : ''}.`;
            case 'removed':
                return `${label}${count > 1 ? 's' : ''} ${count > 1 ? 'were' : 'was'} removed from previous version.`;
            default:
                return '';
        }
    }

    const metricDataGroup = (title, label, data, renderRow) => (
        <StyledMetricDataGroup>
            <h2>{title}</h2>
            <table>
                <tbody>
                    { renderRow(data, label) }
                </tbody>
            </table>
        </StyledMetricDataGroup>
    );

    const renderDataRow = (data, label) => {
        if(data){
            return(
                Object.keys(data).map(key => (
                    data[key] > 0 &&
                    <tr key={key}>
                        <td><span className='number'>{ data[key] }</span></td>
                        <td className='text'>{ getMetricDataText(key, label, data[key]) }</td>
                    </tr>
                ))
            );
        }else{
            return(
                <tr>
                    <td>Not Available</td>
                    <td className='text'></td>
                </tr>
            );
        }
    }

    return(
        <StyledReleaseNotes>
            {
                metricDataGroup('Models', 'model', props.data.releaseNotes.models, renderDataRow)
            } 
            {
                metricDataGroup('Patients', 'patient', props.data.releaseNotes.patients, renderDataRow)
            }
            {
                metricDataGroup('Drugs', 'drug', props.data.releaseNotes.drugs, renderDataRow)
            } 
            {
                metricDataGroup('Drug Sensitivity Experiments', 'experiment', props.data.releaseNotes.experiments, renderDataRow)
            } 
        </StyledReleaseNotes>
    );
}

export default ReleaseNoteTabContent;