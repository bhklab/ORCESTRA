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

    const getMetricDataRowText = (key) => {
        switch(key){
            case 'current':
                return('Currently Available:');
            case 'new':
                return('Newly Added:');
            case 'removed':
                return('Removed from Previous Version:');
        }
    }

    const metricDataGroup = (title, data, renderRow) => (
        <StyledMetricDataGroup>
            <h2>{title}</h2>
            <table>
                <tbody>
                    { renderRow(data) }
                </tbody>
            </table>
        </StyledMetricDataGroup>
    );

    const renderDataRow = (data) => {
        if(data){
            return(
                    Object.keys(data).map(key => (
                        data[key] !== null &&
                        <tr key={key}>
                            <td>
                                {getMetricDataRowText(key)}
                            </td>
                            <td>
                                <span className='number'>{ data[key].samples }</span> samples in <span className='number'>{ data[key].datasets }</span> datasets
                            </td>
                        </tr>
                    )
                )
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
                metricDataGroup('Number of Samples', props.data.releaseNotes.samples, renderDataRow)
            } 
        </StyledReleaseNotes>
    );
}

export default ReleaseNoteTabContent;