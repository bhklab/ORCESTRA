import React, {useState, useEffect} from 'react';
import * as MainStyle from '../MainStyle';
import CanonicalBox from '../MainBoxes/CanonicalBox';
import PopularDatasetBox from '../MainBoxes/PopularDatasetBox';
import YourOwnDataBox from '../MainBoxes/YourOwnDataBox';
import {dataTypes} from '../../Shared/Enums';

const Xenographic = () => {

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
        fetchData(`/api/${dataTypes.xenographic}/landing/data`);
    }, []);

    return (
        <MainStyle.Wrapper>
            <MainStyle.DatasetHeaderGroup>
                <h1>ORCESTRA for Xenograhpic Pharmacogenomics Data</h1>   
                <h2>Explore and request multimodal Xenograhpic Pharmacogenomics Datasets (XevaSets)</h2>
            </MainStyle.DatasetHeaderGroup>
            <MainStyle.Row>
                <MainStyle.Column>
                    {/* <CanonicalBox datasetName='XevaSet' datasetType={dataTypes.xenographic} /> */}
                    <MainStyle.Item>
                        <h3>Search Available XevaSets</h3>
                        <div className='content'>
                            <div className='line'>
                                <MainStyle.Number>
                                    {formData.dataset.length}
                                </MainStyle.Number> 
                                <span>XevaSets are available.</span>
                            </div>
                            <div className='link'>
                                <MainStyle.Button href={`/${dataTypes.xenographic}/search`}>Go to Search</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                </MainStyle.Column> 
                <MainStyle.Column>
                    <PopularDatasetBox datasetName='XevaSet' datasetType={dataTypes.xenographic} statsData={statsData} disableBtn={true} />
                    <YourOwnDataBox datasetName='XevaSet' datasetType={dataTypes.xenographic} />
                </MainStyle.Column>    
            </MainStyle.Row> 
        </MainStyle.Wrapper>
    );
}

export default Xenographic;