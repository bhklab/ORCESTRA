import React from 'react';
import * as MainStyle from '../MainStyle';
import CanonicalBox from '../MainBoxes/CanonicalBox';
import PopularDatasetBox from '../MainBoxes/PopularDatasetBox';
import YourOwnDataBox from '../MainBoxes/YourOwnDataBox';
import {dataTypes} from '../../Shared/Enums';

const Xenographic = () => {
    return (
        <MainStyle.Wrapper>
            <MainStyle.DatasetHeaderGroup>
                <h1>ORCESTRA for Xenograhpic Pharmacogenomics Data</h1>   
                <h2>Explore and request multimodal Xenograhpic Pharmacogenomics Datasets (XevaSets)</h2>
            </MainStyle.DatasetHeaderGroup>
            <MainStyle.Row>
                <MainStyle.Column>
                    <CanonicalBox datasetName='XevaSet' datasetType={dataTypes.xenographic} />
                    <MainStyle.Item>
                        <h3>Search and Request XevaSets</h3>
                        <div className='content'>
                            <div className='link'>
                                <MainStyle.Button href={`/${dataTypes.xenographic}/search>Search and Request`}>Search and Request</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                </MainStyle.Column> 
                <MainStyle.Column>
                    <PopularDatasetBox datasetName='XevaSet' datasetType={dataTypes.xenographic} statsData={[]} />
                    <YourOwnDataBox datasetName='XevaSet' datasetType={dataTypes.xenographic} />
                </MainStyle.Column>    
            </MainStyle.Row> 
        </MainStyle.Wrapper>
    );
}

export default Xenographic;