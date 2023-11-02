import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Stats.css';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import DatasetChart from './DatasetChart';
import { ThreeDots } from 'react-loader-spinner';
import {dataTypes} from '../Shared/Enums';
import StyledPage from '../../styles/StyledPage';

const Stats = () => {

    const [view, setView] = useState({metricDatasets: [], downloads: []});
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const res = await axios.get('/api/view/statistics', {params: {datasetType: 'pset'}});
            setView(res.data);
            setIsReady(true);
        }
        getData();
    }, [])
    
    const nameColumnTemplate = (rowData, column) => {
        let route = `/${dataTypes.pharmacogenomics}/${rowData.doi}`;
        return(
            <Link to={route} target="_blank">{rowData.name}</Link>
        );
    }
        
    return(
        <StyledPage>
            {
                isReady ?
                <div className='statContainer'>
                    <div className='container downloadHistogram'>
                        <h3>Dataset Metrics and Usage Statistics</h3>
                        <DatasetChart metricDatasets={view.metricDatasets} />
                    </div>
                    <div className='container rankingTable'>
                        <h3>Download Ranking</h3>
                        <DataTable 
                            value={view.downloads} paginator={true} rows={10} scrollable={true} 
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
                    <ThreeDots type="ThreeDots" color="#3D405A" height={100} width={100} />
                </div>
            }
        </StyledPage>
    );
}

export default Stats;