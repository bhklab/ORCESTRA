import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import {DatasetDialog, RNADialog, DNADialog} from '../MainDialog/MainDialog';
import './Main.css';

const OrcestraMain = (props) => {
    
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
        <React.Fragment>
            <div className='mainContent'>
                <div className="home">
                    <h1>ORCESTRA</h1>   
                    <h2>Orchestration platform for reproducing pharmacogenomic analyses</h2>
                    <div className='mainMenuContainer'>
                        <div className='mainMenuRow'>
                            <div className='mainMenuColumn'>
                                <div className='mainMenuItem'>
                                    <h3>Search and Request PSets</h3>
                                    <div className='mainMenuItemContent'>
                                        <div>Design your own PSet using:</div>
                                        <div className='mainMenuItemLine'>
                                            <div className='largeNum'><button onClick={() => {showDialog('dataset')}}>{formData.versionCombo}</button></div> <div>Dataset/Drug sensitivity combinations</div>
                                        </div>
                                        <div className='mainMenuItemLine'><span className='largeNum'>
                                            <button onClick={() => {showDialog('rna')}}>{formData.rnaTool.length}</button></span> <span>RNA pipelines.</span>
                                        </div>
                                        <div className='mainMenuItemLine'><span className='largeNum'>
                                            <button onClick={() => {showDialog('dna')}}>{formData.dnaTool.length}</button></span> <span>DNA tools.</span>
                                        </div>
                                        <div className='mainMenuLink'>
                                            <a className='button' href="/PSetSearch">Search and Request</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mainMenuColumn'>
                                <div className='mainMenuItem' style={{ alignSelf: 'flex-start'}}>
                                    <h3>Canonical PSets</h3>
                                    <div className='mainMenuItemContent'>
                                        <div>The latest version of PSets created by BHK Lab.</div>
                                        <div className='mainMenuLink'><a className='button' href="/Canonical">View Canonical PSets</a></div>
                                    </div>
                                </div>
                                <div className='mainMenuItem' style={{ alignSelf: 'flex-start'}}>
                                    <h3>View PSet Request Status</h3>
                                    <div className='mainMenuItemContent'>
                                        <div>ORCESTRA is processing following requests:</div>
                                        <div className='mainMenuItemLine'><span className='largeNum'>{dashboard.pending}</span> <span>Requests in queue.</span></div>
                                        <div className='mainMenuItemLine'><span className='largeNum'>{dashboard.inProcess}</span> <span >Requests in process.</span></div>
                                        <div className='mainMenuLink'><a className='button' href="/Dashboard">View Dashboard</a></div>
                                    </div>
                                </div>
                            </div> 
                            <div className='mainMenuColumn'>
                                <div className='mainMenuItem'>
                                    <h3>Top 5 Popular PSets</h3>
                                    <div className='mainMenuItemContent'>
                                        <DataTable value={statsData} >
                                            <Column className='textField' field='download' header='Download' />
                                            <Column className='textField' field='name' header='Name' body={nameColumnTemplate}/>
                                        </DataTable>
                                        <div className='mainMenuLink'><a className='button' href="/Stats">View Statistics</a></div>
                                    </div>
                                </div> 
                                <div className='mainMenuItem'>
                                    <h3>Generate PSets with Your Data</h3>
                                    <div className='mainMenuItemContent'>
                                        <p>
                                            <b>You can generate PSets using your own datasets.</b> <br /> 
                                            For more information, please read about <a href='/Tutorial'>contributing your data</a>.
                                        </p>    
                                    </div>
                                </div> 
                            </div>    
                        </div>  
                    </div>  
                </div>
            </div>
            <DatasetDialog visible={datasetVisible} onHide={() => {hideDialog('dataset')}} dataset={formData.dataset} />
            <RNADialog visible={rnaVisible} onHide={() => {hideDialog('rna')}} rna={{tool: formData.rnaTool, ref: formData.rnaRef}} />
            <DNADialog visible={dnaVisible} onHide={() => {hideDialog('dna')}} dna={{tool: formData.dnaTool, ref: formData.dnaRef}} />
        </React.Fragment>
    );
    
}

export default OrcestraMain;