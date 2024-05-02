import React from 'react';
import * as MainStyle from '../MainStyle';

const CanonicalBox = (props) => (
    <MainStyle.Item style={{ alignSelf: 'flex-start'}}>
        <h3 className='header'>{`Canonical ${props.datasetName}s`}</h3>
        <div className='content'>
            <div>{`The latest version of ${props.datasetName}s created by BHK Lab.`}</div>
            <div className='link'>
                <MainStyle.Button href={`/${props.datasetType}/canonical`}>{`View Canonical ${props.datasetName}s`}</MainStyle.Button>
            </div>
        </div>
    </MainStyle.Item>
);

export default CanonicalBox;