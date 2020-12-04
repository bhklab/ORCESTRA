import React from 'react';
import * as MainStyle from '../MainStyle';
import CanonicalBox from '../MainBoxes/CanonicalBox';
import PopularDatasetBox from '../MainBoxes/PopularDatasetBox';
import YourOwnDataBox from '../MainBoxes/YourOwnDataBox';
import {dataTypes} from '../../Shared/Enums';

const Toxicogenomics = () => {

    return (
        <MainStyle.Wrapper>
            <MainStyle.DatasetHeaderGroup>
                <h1>ORCESTRA for Toxicogenomics</h1>   
                <h2>Explore and request multimodal Toxicogenomic Datasets (ToxicoSets)</h2>
            </MainStyle.DatasetHeaderGroup>
            <MainStyle.Row>
                <MainStyle.Column>
                    <CanonicalBox datasetName='ToxicoSet' datasetType={dataTypes.toxicogenomics} />
                    <MainStyle.Item>
                        <h3>Search and Request ToxicoSets</h3>
                        <div className='content'>
                            <div className='link'>
                                <MainStyle.Button href={`/${dataTypes.toxicogenomics}/search>Search and Request`}>Search and Request</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                </MainStyle.Column> 
                <MainStyle.Column>
                    <PopularDatasetBox datasetName='ToxicoSet' datasetType={dataTypes.toxicogenomics} statsData={[]} />
                    <YourOwnDataBox datasetName='ToxicoSet' datasetType={dataTypes.toxicogenomics} />
                </MainStyle.Column>    
            </MainStyle.Row> 
        </MainStyle.Wrapper>
    );
}

export default Toxicogenomics;