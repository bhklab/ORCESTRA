import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ThreeDots } from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';
import { trackPromise } from 'react-promise-tracker';

import DownloadButton from '../components/Shared/Buttons/DownloadButton';
import CustomMessages from '../components/Shared/CustomMessages';
import CustomSelect from '../components/Shared/CustomSelect';
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
        padding: 5px 8px;
    }
`;

const StyledAccordion = styled(Accordion)`
    width: 100%;
    margin-top: 10px;
    margin-bottom: 30px;
    h4 {
        margin-left: 20px;
        font-size: 14px;
        max-width: 90%;
    }
`;

const MessageContainer = styled.div`
    margin-bottom: 10px;
`;

const sharelinkMessage = {
    severity: 'success',
    summary: 'Sharable Link',
    detail: '',
    sticky: true
};

const successMessage = {
    severity: 'success',
    summary: 'Dataset Published',
    detail: 'Your dataset is now publicly available',
    sticky: true
};

const errorMessage = {
    severity: 'error',
    summary: 'Error Occurred',
    detail: 'An error occurred on the server',
    sticky: true
};

const useSingleDataset = (datasetType, id) => {
    const { promiseInProgress } = usePromiseTracker();

    const [dataset, setDataset] = useState({ ready: false, data: {} });
    const [selectedObject, setSelectedObject] = useState('');
    const [publicView, setPublicView] = useState(false);
    const [ownerView, setOwnerView] = useState(false);
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState();

    const getLabel = () => {
        switch (datasetType) {
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
            case dataTypes.icb:
                return 'Immune Checkpoint Blockade';
            default:
                return 'Dataset';
        }
    };

    const getDataset = async (shareToken = null) => {
        try {
            const res = await axios.get('/api/view/single-data-object', {
                params: {
                    datasetType: datasetType,
                    id: id,
                    shareToken: shareToken ? shareToken.replace('?shared=', '') : null
                }
            });
            // console.log(res.data);
            setDataset({
                ready: true,
                data: res.data
            });
            if (res.data && !res.data.info.private) {
                setPublicView(true);
            }
            if (res.data && res.data.info.private && !shareToken) {
                setOwnerView(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const publishDataset = async e => {
        e.preventDefault();
        let res;
        try {
            setShowPublishDialog(false);
            res = await trackPromise(
                axios.post('/api/data-object/publish', {
                    datasetType: datasetType,
                    id: id
                })
            );
        } catch (error) {
            console.log(error);
        } finally {
            setMessage(res.data ? successMessage : errorMessage);
            setShowMessage(Math.random());
            if (res.data) {
                setPublicView(true);
            }
        }
    };

    const getShareLink = async e => {
        e.preventDefault();
        let res;
        try {
            res = await axios.post('/api/data-object/sharelink', {
                datasetType: datasetType,
                id: id
            });
            // console.log(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            let message = res.data
                ? { ...sharelinkMessage, detail: `Anyone with this link can view your dataset: ${res.data}` }
                : errorMessage;
            setMessage(message);
            setShowMessage(Math.random());
        }
    };

    const renderDataObjectDownload = () => {
        if (Array.isArray(dataset.data.downloadLink)) {
            return (
                <React.Fragment>
                    <CustomSelect
                        className="left"
                        selectOne={true}
                        selected={selectedObject}
                        label="Data Object: "
                        options={dataset.data.downloadLink.map(link => ({
                            label: link.name,
                            value: link
                        }))}
                        onChange={e => {
                            setSelectedObject(e.value);
                        }}
                    />
                    <DownloadButton
                        className="left"
                        disabled={selectedObject === ''}
                        datasetType={datasetType}
                        doi={dataset.data.doi}
                        downloadLink={selectedObject !== '' ? selectedObject.downloadLink : ''}
                        mode="dataset"
                        label="Download Dataset"
                        tooltip={`Download ${dataset.data.name}(${
                            typeof selectedObject !== 'undefined' ? selectedObject.name : ''
                        }) as an R object`}
                    />
                </React.Fragment>
            );
        }
        return (
            <DownloadButton
                className="left"
                disabled={dataset.data.downloadLink !== '' ? false : true}
                datasetType={datasetType}
                doi={dataset.data.doi}
                downloadLink={dataset.data.downloadLink}
                mode="dataset"
                label="Download Dataset"
                tooltip={`Download ${dataset.data.name} as an R object`}
            />
        );
    };

    const getHeader = () => {
        return (
            <Header>
                <div className="title left">
                    Explore {getLabel()} - {dataset.data.name}
                </div>
                {renderDataObjectDownload()}
                {publicView && dataset.data.bioComputeObject && (
                    <DownloadButton
                        className="left"
                        disabled={false}
                        datasetType={datasetType}
                        doi={dataset.data.bioComputeObject.doi}
                        downloadLink={dataset.data.bioComputeObject.downloadLink}
                        mode="bioCompute"
                        label="Download BioCompute Object"
                        tooltip={`Download the BioCompute object of the pipleine used to create ${dataset.data.name}`}
                    />
                )}
                {ownerView && (
                    <Button
                        className="left"
                        label="Get sharable link"
                        icon="pi pi-share-alt"
                        onClick={getShareLink}
                        tooltip={`Generates a link you can share with others to access this page.`}
                    />
                )}
                {ownerView ? (
                    promiseInProgress ? (
                        <ThreeDots color="#3D405A" height={50} width={50} />
                    ) : (
                        <Button
                            className="p-button-success"
                            label="Publish"
                            icon="pi pi-check"
                            onClick={e => {
                                e.preventDefault();
                                setShowPublishDialog(true);
                            }}
                            tooltip={`Makes ${dataset.data.name} publicly available.`}
                        />
                    )
                ) : (
                    ''
                )}
            </Header>
        );
    };

    const getGeneralInfoAccordion = data => {
        console.log(data);
        if (data.legacy === false) {
            return <h1 style={{ fontSize: '30px' }}>Full Dataset Coming Soon!</h1>;
        } else {
            // Legacy dataset 'General Information' block
            return (
                <StyledAccordion className="generalInfoAccordion" activeIndex={0}>
                    <AccordionTab header="General Information">
                        <h4>Name: {data.name}</h4>
                        <div>
                            <h4>
                                Dataset DOI:{' '}
                                <a href={`https://doi.org/${data.doi}`} target="_blank" rel="noreferrer">
                                    {data.doi}
                                </a>
                            </h4>
                            {data.bioComputeObject && (
                                <h4>
                                    BioCompute Object DOI:{' '}
                                    <a
                                        href={`https://doi.org/${data.bioComputeObject.doi}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {data.bioComputeObject.doi}
                                    </a>
                                </h4>
                            )}
                        </div>
                        <h4>Date Created: {data.info.date.created.split('T')[0]}</h4>
                        {data.info.createdBy && (
                            <h4>
                                Created By {data.info.createdBy} {data.info.canonical ? '(Canonical)' : ''}
                            </h4>
                        )}
                    </AccordionTab>
                </StyledAccordion>
            );
        }
    };

    const publishDialog = () => {
        const footer = (
            <div>
                <Button label="Yes" onClick={publishDataset} />
                <Button
                    label="No"
                    className="p-button-secondary"
                    onClick={e => {
                        setShowPublishDialog(false);
                    }}
                />
            </div>
        );
        return (
            <Dialog
                header={`Publish ${dataset.data.name}?`}
                footer={footer}
                visible={showPublishDialog}
                modal
                onHide={e => {
                    setShowPublishDialog(false);
                }}
            >
                Would you like to publish your dataset? This step is irreversible.
            </Dialog>
        );
    };

    const datasetMessage = (
        <MessageContainer>
            <CustomMessages trigger={showMessage} message={message} />
        </MessageContainer>
    );

    return {
        getDataset,
        getHeader,
        getGeneralInfoAccordion,
        publishDialog,
        datasetMessage,
        dataset
    };
};

export default useSingleDataset;
