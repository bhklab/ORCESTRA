import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import DownloadDatasetButton from '../components/Shared/Buttons/DownloadDatasetButton';
import CustomMessages from '../components/Shared/CustomMessages';
import { dataTypes } from '../components/Shared/Enums';

const Header = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .title {
        font-size: 20px;
        font-weight: bold;
    }
    .left {
        margin-right: 30px;
    }
`;

const MessageContainer = styled.div`
    margin-bottom: 10px;
`;

const successMessage = {
    severity: 'success',
    summary: 'Dataset Published',
    detail: 'Your dataset is now publicly available',
    sticky: true
}

const errorMessage = {
    severity: 'error',
    summary: 'Error Occurred',
    detail: 'An error occurred on the server',
    sticky: true
}

const useSingleDataset = (datasetType, doi) => {
    const [dataset, setDataset] = useState({ready: false, data: {}});
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState();

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
            console.log(res.data)
            setDataset({
                ready: true,
                data: res.data
            });
        }catch(error){
            console.log(error);
        }
    }

    const publishDataset = async (e) => {
        e.preventDefault();
        let res;
        try{
            setShowPublishDialog(false);
            res = await axios.get(`/api/${datasetType}/publish/${doi}`);
            console.log(res.data);
        }catch(error){
            console.log(error);
        }finally{
            setMessage(res.data ? successMessage : errorMessage);
            setShowMessage(Math.random());
            if(res.data){
                setDataset({...dataset, data: {...dataset.data, private: res.data.private}});
            }
        }
    }

    const getHeader = () => {
        return(
            <Header>
                <div className='title left'>
                    Explore {getLabel()} - {dataset.data.name}
                </div>
                <DownloadDatasetButton className='left' disabled={false} datasetType={datasetType} dataset={dataset.data} />
                { 
                    dataset.data.private && 
                    <Button 
                        label='Publish' 
                        icon='pi pi-share-alt' 
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPublishDialog(true);
                        }}
                    /> 
                }
            </Header>
        );
    }

    const publishDialog = () => {
        const footer = (
            <div>
                <Button label='Yes' onClick={publishDataset} />
                <Button label='No' className='p-button-secondary' onClick={(e) => {setShowPublishDialog(false)}}/>
            </div>
        )
        return(
            <Dialog 
                header={`Publish ${dataset.data.name}?`} 
                footer={footer}
                visible={showPublishDialog} 
                modal 
                onHide={(e) => {setShowPublishDialog(false)}}
            >
                Would you like to publish your dataset?
                This step is irreversible.
            </Dialog>
        );
    }
    
    const datasetMessage = (
        <MessageContainer>
            <CustomMessages trigger={showMessage} message={message} />
        </MessageContainer>
    );
    
    return {
        getDataset,
        getHeader,
        publishDialog,
        datasetMessage,
        dataset
    };
}

export default useSingleDataset;