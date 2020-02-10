import React, {useState, useEffect, useContext} from 'react';
import './Dashboard.css';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import {usePromiseTracker} from "react-promise-tracker";
import {trackPromise} from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import {Messages} from 'primereact/messages';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {AuthContext} from '../../context/auth';

const Dashboard = (props) => {
    
    const auth = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pachydermOnline, setPachydermOnline] = useState(false);
    //const [submitInProgress, setSubmitInProgress] = useState(false);

    const { promiseInProgress } = usePromiseTracker();

    const show = (message) => {
        Dashboard.messages.show(message);
    }

    const fetchData = async (url) => {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
    }

    const submitRequest = async (id) => {
        //setSubmitInProgress(true);
        const result = await trackPromise(fetch(
            '/pset/process', 
            { 
                method: 'POST', 
                body: JSON.stringify({id: id}), 
                headers: {'Content-type': 'application/json'} 
            }
        ));
        const json = await result.json();
        //setSubmitInProgress(false);
        return({ok: result.ok, data: json});
    }

    const checkPachydermStatus = async () => {
        const status = await fetch('/pachyderm/status');
        const json = await status.json();
        setPachydermOnline(json.isOnline);
    }

    useEffect(() => {
        fetchData('/pset?status=pending&status=in-process');
        checkPachydermStatus();
    }, []);
    
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target.id);
        const result = await submitRequest(event.target.id);
        if(result.ok){
            show({severity: 'success', summary: result.data.summary, detail: result.data.message});
        }else{
            show({severity: 'error', summary: result.data.summary, detail: result.data.message, sticky: true});
        }
        await fetchData('/pset?status=pending&status=in-process');
    }

    const dateTimeTemplate = (rowData, column) => {
        let dateTimeStr = '';
        if(rowData[column.field]){
            dateTimeStr = new Date(rowData[column.field]).toLocaleString(undefined, {dateStyle: 'long', timeStyle: 'medium'});
        }
        return(<div>{dateTimeStr}</div>)
    }

    const buttonTemplate = (rowData, column) => {
        let button = '';
        if(rowData.status === 'pending'){
            button = <button id={rowData._id} onClick={onSubmit} className='dashboardBtn' type='button'>Submit</button>
        }
        return(<div className='dashBoardBtnContainer'>{button}</div>)
    }

    return(
        <React.Fragment>
            <Navigation routing={props} />
            <div className='pageContent'>
                <div className='dashboardWrapper'>
                    <h1>PSet Request Dashboard</h1>
                    <Messages ref={(el) => Dashboard.messages = el }></Messages>
                    <div className='dashboardSummary'>
                        <h2>Dashboard Summary</h2>
                        <div className='dashboardSummaryContainer'>
                            <div className='dashboardSummarySection'>
                                <span className='number'>{ data.filter(d => d.status === 'pending').length }</span> pending request(s).
                            </div>
                            <div className='dashboardSummarySection'>
                                <span className='number'>{ data.filter(d => d.status === 'in-process').length }</span> request(s) in process.
                            </div>  
                            <div className='dashboardSummarySection'>
                                {
                                    pachydermOnline ? 
                                    <div>Online</div>
                                    :
                                    <div>Offline</div>
                                }
                            </div>    
                        </div>    
                    </div>
                    <div className='dashboardTable'>
                        {
                            !loading &&
                            <DataTable value={data} paginator={true}  scrollable={true} rows={10} >
                                <Column className='textField' field='status' header='Status' style={{width:'2em'}} sortable={true} />
                                <Column className='textField' field='name' header='Name' style={{width:'5em'}} sortable={true} />
                                <Column className='textField' field='dateSubmitted' header='Submitted Date' body={dateTimeTemplate} style={{width:'4em'}} sortable={true} />
                                <Column className='textField' field='dateProcessed' header='Process Start Date' body={dateTimeTemplate} style={{width:'4em'}} sortable={true} />
                                <Column body={buttonTemplate} style={{width:'1.5em'}}/>
                            </DataTable>
                        } 
                        {
                            promiseInProgress && 
                            <div className='dashboardTableOverlay'>
                                
                                <div className='dashboardLoaderContainer'>
                                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                                </div>
                                
                            </div>   
                        }
                    </div> 
                </div>   
            </div>
            <Footer />
        </React.Fragment>    
    );
}

export default Dashboard;