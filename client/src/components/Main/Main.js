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
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const fetchData = async (api) => {
            const res = await fetch(api);
            const json = await res.json();
            console.log(json);
            setStatsData(json.pset);
            setFormData(json.form[0]);
            setDashboard(json.dashboard);
            setReady(true);
        }
        fetchData('/landing/data');
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
                                    <h2>Search and Request PSets</h2>
                                    <div className='mainMenuItemContent'>
                                        <div>Design your own PSet using:</div>
                                        <div className='mainMenuItemLine'><span className='largeNum'>
                                            <button onClick={() => {showDialog('dataset')}}>{formData.dataset.length}</button></span> <span>Datasets.</span>
                                        </div>
                                        <div className='mainMenuItemLine'><span className='largeNum'>
                                            <button onClick={() => {showDialog('rna')}}>{formData.rnaTool.length}</button></span> <span>RNA pipelines.</span>
                                        </div>
                                        <div className='mainMenuItemLine'><span className='largeNum'>
                                            <button onClick={() => {showDialog('dna')}}>{formData.dnaTool.length}</button></span> <span>DNA sequence alignment tools.</span>
                                        </div>
                                        <div className='mainMenuLink'>
                                            <a className='button' href="/PSetSearch">Search and Request</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mainMenuColumn'>
                                <div className='mainMenuItem' style={{ alignSelf: 'flex-start'}}>
                                    <h2>View PSet Request Status</h2>
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
                                    <h2>Top 5 Popular PSets</h2>
                                    <div className='mainMenuItemContent'>
                                        <DataTable value={statsData} >
                                            <Column className='textField' field='download' header='Download' />
                                            <Column className='textField' field='name' header='Name' body={nameColumnTemplate}/>
                                        </DataTable>
                                        <div className='mainMenuLink'><a className='button' href="/Stats">View Statistics</a></div>
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
            }
            
        </React.Fragment>
    );
    
}

export default OrcestraMain;