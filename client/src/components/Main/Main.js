import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import './Main.css';

const OrcestraMain = (props) => {
    
    const [statsData, setStatsData] = useState([]);
    const [formData, setFormData] = useState({
        dataset: [],
        rnaTool: [],
        dnaTool: []
    });
    const [user, setUser] = useState(0);
    const [dashboard, setDashboard] = useState({
        pending: 0,
        inProcess: 0
    })

    useEffect(() => {
        const fetchData = async (api) => {
            const res = await fetch(api);
            const json = await res.json();
            console.log(json);
            setStatsData(json.pset);
            setFormData(json.form[0]);
            setUser(json.user);
            setDashboard(json.dashboard);
        }
        fetchData('/landing/data');
    }, [])

    const nameColumnTemplate = (rowData, column) => {
        let route = '/' + rowData.doi;
        return(
            <Link to={route} >{rowData.name}</Link>
        );
    }

    return (
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
                                    <div className='mainMenuItemLine'><span className='largeNum'>{formData.dataset.length}</span> <span>Datasets.</span></div>
                                    <div className='mainMenuItemLine'><span className='largeNum'>{formData.rnaTool.length}</span> <span>RNA tools.</span></div>
                                    <div className='mainMenuItemLine'><span className='largeNum'>{formData.dnaTool.length}</span> <span>DNA tools.</span></div>
                                    <div className='mainMenuLink'><a className='button' href="/PSetSearch">Search and Request</a></div>
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
                            {/* <div className='mainMenuItem'>
                                <h2>Create your profile</h2>
                                <div className='mainMenuItemContent'>
                                    <div>ORCESTRA has: </div>
                                    <div className='mainMenuItemLine'><span className='largeNum'>{user}</span> <span>Active users.</span></div>
                                    <div className='mainMenuLink'><a className='button' href="/Authentication">Login/Register</a></div>
                                </div>
                            </div>  */}
                        </div>    
                    </div>  
                </div>  
            </div>
        </div>
    );
    
}

export default OrcestraMain;