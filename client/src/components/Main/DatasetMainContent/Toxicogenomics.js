import React, {useState, useEffect} from 'react';
import * as MainStyle from '../MainStyle';
import PopularDatasetBox from '../MainBoxes/PopularDatasetBox';
import YourOwnDataBox from '../MainBoxes/YourOwnDataBox';
//  import ToxicoSetSearch from '../../SearchRequest/ToxicoSet/ToxicoSetSearch';
import {dataTypes} from '../../Shared/Enums';

const Toxicogenomics = () => {

    const [statsData, setStatsData] = useState([]);
    const [formData, setFormData] = useState({
        dataset: []
    });

    useEffect(() => {
        const fetchData = async (api) => {
            const res = await fetch(api);
            const json = await res.json();
            console.log(json);
            setStatsData(json.dataset);
            setFormData({...json.form});
        }
        fetchData(`/api/${dataTypes.toxicogenomics}/landing/data`);
    }, []);

    return (
        <MainStyle.Wrapper>
            <MainStyle.DatasetHeaderGroup>
                <h1>ORCESTRA for Toxicogenomics</h1>   
                <h2>Explore and request multimodal Toxicogenomic Datasets (ToxicoSets)</h2>
            </MainStyle.DatasetHeaderGroup>
            <MainStyle.Row>
                <MainStyle.Column>
                    <MainStyle.Item>
                        <h3>Search Available ToxicoSets</h3>
                        <div className='content'>
                            <div className='line'>
                                <MainStyle.Number>
                                    {formData.dataset.length}
                                </MainStyle.Number> 
                                <span>ToxicoSets are available.</span>
                            </div>
                            <div className='link'>
                                <MainStyle.Button href={`/${dataTypes.toxicogenomics}/search`}>Go to Search</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                </MainStyle.Column> 
                <MainStyle.Column>
                    <PopularDatasetBox datasetName='ToxicoSet' datasetType={dataTypes.toxicogenomics} statsData={statsData} disableBtn={true} />
                    <YourOwnDataBox datasetName='ToxicoSet' datasetType={dataTypes.toxicogenomics} />
                </MainStyle.Column>    
            </MainStyle.Row> 
        </MainStyle.Wrapper>
    );
}

export default Toxicogenomics;