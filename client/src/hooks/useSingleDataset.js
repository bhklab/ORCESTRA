import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DownloadDatasetButton from '../components/Shared/Buttons/DownloadDatasetButton';
import { dataTypes } from '../components/Shared/Enums';

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-top: -10px;
    margin-bottom: 15px;
    .title {
        font-size: 20px;
        font-weight: bold;
    }
`;

const useSingleDataset = (datasetType, doi) => {
    const [dataset, setDataset] = useState({ready: false, data: {}});

    const getLabel = () => {
        switch(datasetType){
            case dataTypes.pharmacogenomics:
                return 'PSet';
            case dataTypes.toxicogenomics:
                return 'ToxicoSet';
            case dataTypes.xenographic:
                return 'XevaSet';
            case dataTypes.radiogenomics:
                return 'RadioSet';
            case dataTypes.clinicalgenomics:
                return 'ClinicalGenomics Dataset';
            default:
                return 'Dataset';
        }
    }
    
    const getDataset = async () => {
        try{
            const res = await axios.get(`/api/${datasetType}/one/${doi}`);
            setDataset({
                ready: true,
                data: res.data
            });
        }catch(error){
            console.log(error);
        }
    }

    const getHeader = () => {
        return(
            <Header>
                <div className='title'>
                    Explore {getLabel()} - {dataset.data.name}
                </div>
                <DownloadDatasetButton disabled={false} datasetType={datasetType} dataset={dataset.data} />
            </Header>
        );
    }
    
    return {
        getDataset,
        getHeader,
        dataset
    };
}

export default useSingleDataset;