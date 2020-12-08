import React, {useState, useEffect} from 'react';
import {DatasetDialog, RNADialog, DNADialog} from '../MainDialog/PharmacogenomicsDialog';
import * as MainStyle from '../MainStyle';
import CanonicalBox from '../MainBoxes/CanonicalBox';
import RequestStatusBox from '../MainBoxes/RequestStatusBox';
import PopularDatasetBox from '../MainBoxes/PopularDatasetBox';
import YourOwnDataBox from '../MainBoxes/YourOwnDataBox';
import {dataTypes} from '../../Shared/Enums';

const Pharmacogenomics = () => {
    
    const [statsData, setStatsData] = useState([]);
    const [formData, setFormData] = useState({
        dataset: [],
        rnaTool: [],
        dnaTool: [],
        rnaRef: [],
        dnaRef: []
    });
    const [dashboard, setDashboard] = useState({
        pending: 0,
        inProcess: 0
    });
    const [datasetVisible, setDatasetVisible] = useState(false);
    const [rnaVisible, setRNAVisible] = useState(false);
    const [dnaVisible, setDNAVisible] = useState(false);

    useEffect(() => {
        const fetchData = async (api) => {
            const res = await fetch(api);
            const json = await res.json();
            const dataset = json.form.dataset; 
            let versionCombo = 0
            for(let i = 0; i < dataset.length; i++){
                versionCombo += dataset[i].versions.length
            }
            setStatsData(json.dataset);
            setFormData({...json.form, versionCombo: versionCombo});
            setDashboard(json.dashboard);
        }
        fetchData(`/api/${dataTypes.pharmacogenomics}/landing/data`);
    }, []);

    const showDialog = (type) => {
        switch(type){
            case 'dataset':
                setDatasetVisible(true);
                break;
            case 'rna':
                setRNAVisible(true);
                break;
            case 'dna':
                setDNAVisible(true);
                break;
            default:
                break;
        }
    }

    const hideDialog = (type) => {
        switch(type){
            case 'dataset':
                setDatasetVisible(false);
                break;
            case 'rna':
                setRNAVisible(false);
                break;
            case 'dna':
                setDNAVisible(false);
                break;
            default:
                break;
        }
    }

    return (
        <MainStyle.Wrapper>
            <MainStyle.DatasetHeaderGroup>
                <h1>ORCESTRA for Pharmacogenomics</h1>   
                <h2>Explore and request multimodal Pharmacogenomic Datasets (PSets)</h2>
            </MainStyle.DatasetHeaderGroup>
            <MainStyle.Row>
                <MainStyle.Column>
                    <MainStyle.Item>
                        <h3>Search and Request PSets</h3>
                        <div className='content'>
                            <div>Design your own PSet using:</div>
                            <div className='line'>
                                <MainStyle.Number>
                                    <button onClick={() => {showDialog('dataset')}}>{formData.versionCombo}</button>
                                </MainStyle.Number> 
                                <span>Dataset/Drug sensitivity combinations</span>
                            </div>
                            <div className='line'>
                                <MainStyle.Number>
                                    <button onClick={() => {showDialog('rna')}}>{formData.rnaTool.length}</button>
                                </MainStyle.Number> 
                                <span>RNA pipelines.</span>
                            </div>
                            <div className='link'>
                                <MainStyle.Button href={`/${dataTypes.pharmacogenomics}/search`}>Search and Request</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                </MainStyle.Column>
                <MainStyle.Column>
                    <CanonicalBox datasetName='PSet' datasetType={dataTypes.pharmacogenomics} />
                    <RequestStatusBox datasetName='PSet' datasetType={dataTypes.pharmacogenomics} dashboard={dashboard}/>
                </MainStyle.Column> 
                <MainStyle.Column>
                    <PopularDatasetBox datasetName='PSet' datasetType={dataTypes.pharmacogenomics} statsData={statsData} />
                    <YourOwnDataBox datasetName='PSet' datasetType={dataTypes.pharmacogenomics} />
                </MainStyle.Column>    
            </MainStyle.Row> 
            <DatasetDialog visible={datasetVisible} onHide={() => {hideDialog('dataset')}} dataset={formData.dataset} />
            <RNADialog visible={rnaVisible} onHide={() => {hideDialog('rna')}} rna={{tool: formData.rnaTool, ref: formData.rnaRef}} />
            <DNADialog visible={dnaVisible} onHide={() => {hideDialog('dna')}} dna={{tool: formData.dnaTool, ref: formData.dnaRef}} />  
        </MainStyle.Wrapper>
    );
}

export default Pharmacogenomics;