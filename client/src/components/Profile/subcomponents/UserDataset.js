import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';

const StyledUserDataset = styled.div`
    width: 100%;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 1px 20px 20px 20px;
    background-color: rgba(255, 255, 255, 0.8);
    .userPSetContent{
        margin-top: 20px;
        width: 100%;
    }
    .footer{
        margin-top: 20px;
    }
`;

const UserDataset = (props) => {
    const { heading, btnLabel, datasets, handleBtnClick, pending } = props;
    const [selectedDatasets, setSelectedDatasets] = useState([]);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [btnYesDisplayed, setBtnYesDisplayed] = useState(false);

    const handleSelectionChange = (selected) => {
        setSelectedDatasets(selected.value);
        if(selected && selected.value.length > 0){
            setBtnDisabled(false);
        }else{
            setBtnDisabled(true);
        }
    }

    useEffect(() => {
        if(selectedDatasets.length > 0){
            setBtnDisabled(false);
        }else{
            setBtnDisabled(true);
        }
    }, [selectedDatasets]);

    const onClickYes = () => {
        setBtnDisabled(true);
        setBtnYesDisplayed(true);
        handleBtnClick(selectedDatasets);
        setSelectedDatasets([]);
        setDialogVisible(false);
    }
    
    const onHide = () => {
        setDialogVisible(false);
        setBtnYesDisplayed(false);
    }

    const dialogFooter = (
        <div>
            <Button label="Yes" onClick={onClickYes} disabled={btnYesDisplayed}/>
            <Button label="Cancel" onClick={onHide} />
        </div>
    );

    const downloadPSet = (datasetType, doi, link) => async (event) => {
        event.preventDefault();
        console.log('downloadOnePSet');
        await fetch(`/api/${datasetType}/download`, {
            method: 'POST',
            body: JSON.stringify({datasetDOI: doi}),
            headers: {'Content-type': 'application/json'}
        })
        const anchor = document.createElement('a');
        anchor.setAttribute('download', null);
        anchor.style.display = 'none';
        anchor.setAttribute('href', link);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    // data table templates
    const nameColumnTemplate = (rowData, column) => (
        rowData.doi.length > 0 ? 
        <Link to={`/${rowData.datasetType.name}/${rowData.doi}`} target="_blank">{rowData.name}</Link>
        :
        rowData.name
    );
    const downloadTemplate = (rowData, column) => {
        return(
            rowData.downloadLink ? 
            <a id={rowData._id} href='#' onClick={downloadPSet(rowData.datasetType.name, rowData.doi, rowData.downloadLink)}>Download</a> 
            : 'Not Available'
        );
    };
    const canonicalTemplate = (rowData, column) => (
        <div>{rowData[column.field] ? 'Yes' : ''}</div>
    );
    const privateTemplate = (rowData, column) => (
        <div>{rowData[column.field] ? 'Yes' : ''}</div>
    );

    return(
        <StyledUserDataset>
            <h3>{heading}</h3>
            <div className='userPSetContent'>
                {
                    datasets.length > 0 ? 
                    <React.Fragment>
                        <div>
                            <DataTable 
                                value={datasets} 
                                selection={selectedDatasets} 
                                onSelectionChange={(e) => {setSelectedDatasets(e.value)}} 
                                paginator={true} 
                                rows={10} 
                                resizableColumns={true} 
                                scrollable={true} 
                                scrollHeight={'300px'}
                            >
                                {
                                    !pending && <Column selectionMode="multiple" style={{width: '40px', textAlign: 'center'}} />
                                }
                                <Column className='textField' field='name' header='Name' style={{width:'150px'}} body={nameColumnTemplate} sortable={true} />
                                <Column className='textField' field='dataset.name' header='Dataset' style={{width:'100px'}} sortable={true} />
                                <Column className='textField' field='datasetType.label' header='Dataset Type' style={{width:'100px'}} sortable={true} />
                                {
                                    !pending && <Column field='canonical' body={canonicalTemplate} style={{width:'90px', textAlign: 'center'}} header='Canonical' />
                                }
                                {
                                    !pending && <Column field='downloadLink' body={downloadTemplate} style={{width:'90px', textAlign: 'center'}} header='Download' />
                                }
                                <Column field='private' body={privateTemplate} style={{width:'60px', textAlign: 'center'}} header='Private' /> 
                            </DataTable>
                        </div>
                        <div className='footer'>
                        { 
                            !pending && 
                            <Button 
                                label={btnLabel} 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setDialogVisible(true);
                                }} 
                                disabled={btnDisabled} 
                            /> 
                        } 
                        </div>
                    </React.Fragment> 
                    : 
                    <p>None</p>
                }
            </div>
            <div>
                <Dialog 
                    header='Removing Dataset(s)'
                    footer={dialogFooter} 
                    visible={dialogVisible} 
                    style={{width: '300px'}} 
                    modal={true} 
                    onHide={onHide}
                >
                    Are you sure you would like to remove the selected Dataset(s) from the saved list?
                </Dialog>
            </div>
        </StyledUserDataset>
    );
}

export default UserDataset;