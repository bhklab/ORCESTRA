import React, {useState, useEffect} from 'react';
import './Stats.css';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import DatasetChart from './DatasetChart';
import Loader from 'react-loader-spinner';

const Stats = () => {

    const [psets, setPSets] = useState([])
    const [chartData] = useState([])
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('/api/stats/data')
            const json = await res.json()
            console.log(json)
            setPSets(json.psets)
            setIsReady(true)
        }
        getData()
    }, [])
    
    const nameColumnTemplate = (rowData, column) => {
        let route = '/' + rowData.doi;
        return(
            <Link to={route} target="_blank">{rowData.name}</Link>
        );
    }
        
    return(
        <div className='pageContent'>
            <h2>Dataset Metrics and PSet Usage Statistics</h2>
            {
                isReady ?
                <div className='statContainer'>
                    <div className='container downloadHistogram'>
                        <h3>Dataset Metrics</h3>
                        <DatasetChart chartData={chartData} />
                    </div>
                    <div className='container rankingTable'>
                        <h3>Download Ranking</h3>
                        <DataTable 
                            value={psets} paginator={true} rows={10} scrollable={true} 
                            resizableColumns={true} columnResizeMode="fit"
                        >
                            <Column className='textField' field='download' header='Number of Downloads' style={{width:'5%', textAlign:'center'}} sortable={true} />
                            <Column className='textField' field='name' header='Name' style={{width:'7%', textAlign:'center'}} body={nameColumnTemplate} sortable={true} />
                            <Column className='textField' field='dataset' header='Dataset' style={{width:'5%', textAlign:'center'}} sortable={true} />
                            <Column className='textField' field='version' header='Drug Sensitivity' style={{width:'5%', textAlign:'center'}} sortable={true} />
                        </DataTable>
                    </div>  
                </div>
                :
                <div className='componentLoaderContainer'>
                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                </div>
            }
        </div>
    );
}

export default Stats;