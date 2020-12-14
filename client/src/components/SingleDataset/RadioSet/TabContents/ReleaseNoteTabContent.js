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

    return(
        <StyledReleaseNotes>
            {metricDataGroup('Samples', props.data.name, 'sample', props.data.releaseNotes.samples, renderDataRow)} 
            {metricDataGroup('Radiation Types', props.data.name, 'radiation type', props.data.releaseNotes.radiationTypes, renderDataRow)} 
        </StyledReleaseNotes>
    );
}

export default ReleaseNoteTabContent;