import React from 'react';
import * as MainStyle from '../MainStyle';

const YourOwnDataBox = (props) => (
    <MainStyle.Item>
        <h3 className='header'>{`Generate ${props.datasetName}s with Your Data`}</h3>
        <div className='content'>
            <p>
                <b>{`You can generate ${props.datasetName}s using your own datasets.`}</b> <br /> 
                For more information, please read about <a href={`/app/documentation/datacontribution`}>contributing your data</a>.
            </p>    
        </div>
    </MainStyle.Item> 
);

export default YourOwnDataBox;