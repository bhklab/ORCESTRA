import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import './RequestStatus.css';
import Loader from 'react-loader-spinner';
import {Messages} from 'primereact/messages';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { AuthContext } from '../../hooks/Context';
import StyledPage from '../../styles/StyledPage';

const RequestStatus = () => {
    
    const auth = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            const res = await axios.get('/api/data-objects/search', {params: {datasetType: 'pset', requested: true}});
            console.log(res.data);
            setData(res.data);
            setLoading(false);
        }
        getData();
    }, []);

    const show = (message) => {
        RequestStatus.messages.show(message);
    }

    const submitRequest = async (id) => {
        const result = await fetch(
            '/api/pset/process', 
            { 
                method: 'POST', 
                body: JSON.stringify({id: id}), 
                headers: {'Content-type': 'application/json'} 
            }
        );
        const json = await result.json();
        return({ok: result.ok, data: json});
    }
    
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target.id);
        const result = await submitRequest(event.target.id);
        if(result.ok){
            show({severity: 'success', summary: result.data.summary, detail: result.data.message, sticky: true});
        }else{
            show({severity: 'error', summary: result.data.summary, detail: result.data.message, sticky: true});
        }
        const res = await fetch('/api/pset/search', {
            method: 'POST',
            body: JSON.stringify({parameters: {status: ['pending', 'in-process']}}),
            headers: {'Content-type': 'application/json'}
        });
        const json = await res.json();
        console.log(json);
        setData(json);
    }

    const dateTimeTemplate = (rowData, column) => {
        let dateTimeStr = '';
        if(rowData.info.date[column.field]){
            dateTimeStr = new Date(rowData.info.date[column.field]).toLocaleString(undefined, {dateStyle: 'long', timeStyle: 'medium'});
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
        <StyledPage>
            <div className='dashboardWrapper'>
                <Messages ref={(el) => RequestStatus.messages = el }></Messages>
                <div className='dashboardSummary'>
                    <h2>Request Status</h2>
                    <div className='dashboardSummaryContainer'>
                        <div className='dashboardSummarySection'>
                            <span className='number'>{ data.filter(d => d.status === 'pending').length }</span> pending request(s).
                        </div>
                        <div className='dashboardSummarySection'>
                            <span className='number'>{ data.filter(d => d.status === 'in-process').length }</span> request(s) in process.
                        </div>    
                    </div>    
                </div>
                <div className='dashboardTable'>
                    {
                        !loading ?
                            data.length > 0 ?
                            <DataTable value={data} paginator={true}  scrollable={true} rows={10} >
                                <Column className='textField' field='info.status' header='Status' style={{width:'2em'}} sortable={true} />
                                <Column className='textField' field='name' header='Name' style={{width:'5em'}} sortable={true} />
                                <Column className='textField' field='submitted' header='Submitted Date' body={dateTimeTemplate} style={{width:'4em'}} sortable={true} />
                                <Column className='textField' field='processed' header='Process Start Date' body={dateTimeTemplate} style={{width:'4em'}} sortable={true} />
                                { auth.user.isAdmin && <Column body={buttonTemplate} style={{width:'1.5em'}}/> }
                            </DataTable>
                            :
                            <h3>There are no pending or in-process requests.</h3>
                        :   
                        <div className='dashboardTableLoaderContainer'>
                            <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                        </div>
                    } 
                </div> 
            </div>   
        </StyledPage>  
    );
}

export default RequestStatus;