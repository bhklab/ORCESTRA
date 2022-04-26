import React from 'react';
import styled from 'styled-components';

const StyledReleaseNotes = styled.div`
    width: 95%;
    margin-left: auto;
    margin-right: auto;
`;

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
`;

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
`;

const ReleaseNoteTabContent = (props) => {
    const { data } = props;

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

    const metricDataGroup = (title, label, dataName) => {
        const count = data.releaseNotes.counts.find(item => item.name === dataName);
        if(!count){
            return '';
        }
        return(
            <StyledMetricDataGroup>
                <h2>{title}</h2>
                <table>
                    <tbody>
                        {
                            Object.keys(count).map(key => (
                                count[key] > 0 &&
                                <tr key={key}>
                                    <td><span className='number'>{ count[key].toLocaleString() }</span></td>
                                    <td className='text'>{ getMetricDataText(key, label, count[key]) }</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </StyledMetricDataGroup>
        )
    };

    const renderMolDataRow = () => {
        return (
            <StyledMetricDataGroup>
                <h2>Molecular Data</h2>
                <table>
                    <tbody>
                        {
                            data.releaseNotes.molData.map(item => (
                                <tr key={item.name}>
                                    <td className='title'>{item.label}</td>
                                    <td>
                                        {
                                            item.available ?  
                                            <span><span className='number'>{item.expCount}</span> cell lines {item.noUpdates && '(no updates from previous version)'}</span>
                                            : 'Not available for this dataset.'
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </StyledMetricDataGroup>
        );
    }

    return(
        <StyledReleaseNotes>
            {metricDataGroup('Cell Lines', 'cell line', 'cellLines')} 
            {metricDataGroup('Drugs', 'drug', 'drugs')} 
            {metricDataGroup('Drug Sensitivity Experiments', 'experiment', 'experiments')} 
            {
                renderMolDataRow()
            }
            {
                data.datasetName === 'GDSC' &&
                <AdditionalInformation>
                    <h2>Additional Information</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td className='title'>GDSC Official Release Notes: </td>
                                <td>
                                    <a href={data.releaseNotes.additionalNotes.link} target="_blank" rel="noopener noreferrer">{data.releaseNotes.additionalNotes.link}</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </AdditionalInformation>
            }
        </StyledReleaseNotes>
    );
}

export default ReleaseNoteTabContent;