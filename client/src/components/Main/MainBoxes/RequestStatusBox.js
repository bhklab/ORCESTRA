import React from 'react';
import * as MainStyle from '../MainStyle';

const RequestStatusBox = (props) => (
    <MainStyle.Item style={{ alignSelf: 'flex-start'}}>
        <h3 className='header'>{`View ${props.datasetName} Request Status`}</h3>
        <div className='content'>
            <div>{`ORCESTRA is processing following ${props.datasetName} requests:`}</div>
            <div className='line'>
                <MainStyle.Number>{props.reqStatus.pending}</MainStyle.Number> 
                <span>Requests in queue.</span>
            </div>
            <div className='line'>
                <MainStyle.Number>{props.reqStatus.inProcess}</MainStyle.Number> 
                <span >Requests in process.</span>
            </div>
            <div className='link'>
                <MainStyle.Button href={`/${props.datasetType}/status`}>View Request Status</MainStyle.Button>
            </div>
        </div>
    </MainStyle.Item>
);

export default RequestStatusBox;