import React from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import * as MainStyle from '../MainStyle';

const PopularDatasetBox = (props) => {
    
    const nameColumnTemplate = (rowData, column) => {
        let route = `/${props.datasetType}/${rowData.doi}`;
        return(
            <Link to={route} >{rowData.name}</Link>
        );
    };

    return(
        <MainStyle.Item>
            <h3>{`Top 5 Popular ${props.datasetName}s`}</h3>
            <div className='content'>
                <DataTable value={props.statsData} >
                    <Column className='textField' field='download' header='Download' />
                    <Column className='textField' field='name' header='Name' body={nameColumnTemplate}/>
                </DataTable>
                <div className='link'>
                    <MainStyle.Button href={`/${props.datasetType}/stats`}>View Statistics</MainStyle.Button>
                </div>
            </div>
        </MainStyle.Item> 
    );
};

export default PopularDatasetBox;