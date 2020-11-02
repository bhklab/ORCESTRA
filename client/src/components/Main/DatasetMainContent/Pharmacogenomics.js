import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import {DatasetDialog, RNADialog, DNADialog} from '../MainDialog/PharmacogenomicsDialog';
import * as MainStyle from '../MainStyle';

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
            const dataset = json.form.dataset 
            let versionCombo = 0
            for(let i = 0; i < dataset.length; i++){
                versionCombo += dataset[i].versions.length
            }
            setStatsData(json.pset);
            setFormData({...json.form, versionCombo: versionCombo});
            setDashboard(json.dashboard);
        }
        fetchData('/api/landing/data');
    }, [])

    const nameColumnTemplate = (rowData, column) => {
        let route = '/' + rowData.doi;
        return(
            <Link to={route} >{rowData.name}</Link>
        );
    }

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
                                <MainStyle.Button href="/search">Search and Request</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                </MainStyle.Column>
                <MainStyle.Column>
                    <MainStyle.Item style={{ alignSelf: 'flex-start'}}>
                        <h3>Canonical PSets</h3>
                        <div className='content'>
                            <div>The latest version of PSets created by BHK Lab.</div>
                            <div className='link'>
                                <MainStyle.Button href="/canonical">View Canonical PSets</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                    <MainStyle.Item style={{ alignSelf: 'flex-start'}}>
                        <h3>View PSet Request Status</h3>
                        <div className='content'>
                            <div>ORCESTRA is processing following requests:</div>
                            <div className='line'>
                                <MainStyle.Number>{dashboard.pending}</MainStyle.Number> 
                                <span>Requests in queue.</span>
                            </div>
                            <div className='line'>
                                <MainStyle.Number>{dashboard.inProcess}</MainStyle.Number> 
                                <span >Requests in process.</span>
                            </div>
                            <div className='link'>
                                <MainStyle.Button href="/status">View Request Status</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item>
                </MainStyle.Column> 
                <MainStyle.Column>
                    <MainStyle.Item>
                        <h3>Top 5 Popular PSets</h3>
                        <div className='content'>
                            <DataTable value={statsData} >
                                <Column className='textField' field='download' header='Download' />
                                <Column className='textField' field='name' header='Name' body={nameColumnTemplate}/>
                            </DataTable>
                            <div className='link'>
                                <MainStyle.Button href="/stats">View Statistics</MainStyle.Button>
                            </div>
                        </div>
                    </MainStyle.Item> 
                    <MainStyle.Item>
                        <h3>Generate PSets with Your Data</h3>
                        <div className='content'>
                            <p>
                                <b>You can generate PSets using your own datasets.</b> <br /> 
                                For more information, please read about <a href='/documentation/datacontribution'>contributing your data</a>.
                            </p>    
                        </div>
                    </MainStyle.Item> 
                </MainStyle.Column>    
            </MainStyle.Row> 
            <DatasetDialog visible={datasetVisible} onHide={() => {hideDialog('dataset')}} dataset={formData.dataset} />
            <RNADialog visible={rnaVisible} onHide={() => {hideDialog('rna')}} rna={{tool: formData.rnaTool, ref: formData.rnaRef}} />
            <DNADialog visible={dnaVisible} onHide={() => {hideDialog('dna')}} dna={{tool: formData.dnaTool, ref: formData.dnaRef}} />  
        </MainStyle.Wrapper>
    );
}

export default Pharmacogenomics;