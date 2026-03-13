import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../hooks/Context';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';
// import { dataTypes } from '../../Shared/Enums';
import { dataTypes } from './dictionaries/dataTypes';
import { DatasetSelect } from './Dropdowns/DatasetSelect';

// PrimeReact Imports
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const SetSearch = () => {
    const auth = useContext(AuthContext);
    const { datatype } = useParams();
    const navigate = useNavigate();

    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState([]);

    useEffect(() => {
        const getDatasets = async () => {
            try {
                const res = await axios.get(`/api/view/data-object-filter/${datatype}`);
                console.log(res.data);
                setDatasets(res.data);
                setSelectedDatasets(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getDatasets();
    }, []);

    return (
        <div className="flex flex-col p-10 z-10 items-center min-h-screen">
            <div className="flex flex-col gap-8 bg-white border-1 drop-shadow-sm rounded-lg p-10 w-full">
                <div>
                    <h2 className="text-headingXl font-bold text-lightBlue">
                        Explore Multimodal {dataTypes[datatype].heading} Datasets
                    </h2>
                    <div className="flex flex-col">
                        {auth.user ? (
                            <SaveDatasetButton
                                selectedDatasets={selectedDatasets}
                                disabled={selectedDatasets.length > 0 ? false : true}
                                // onSaveComplete={showMessage}
                            />
                        ) : (
                            <p className="text-bodyXs text-red-600">
                                Login or register to save existing {datatype} to your profile.
                            </p>
                        )}
                    </div>
                </div>
                <DatasetSelect />
                <DataTable
                    value={selectedDatasets}
                    sortMode="single"
                    sortField="Date Created"
                    size="small"
                    showGridlines={true}
                    stripedRows
                >
                    <Column
                        sortField="name"
                        body={rowData => (
                            <h2
                                className="font-bold text-headingSm text-darkYellow break-all hover:cursor-pointer underline underline-offset-[3px] decoration-[1.5px]"
                                onClick={() => navigate(`/${datatype}/${rowData._id}`)}
                            >
                                {rowData?.name}
                            </h2>
                        )}
                        header="Object Name"
                        style={{ width: '15%' }}
                        sortable
                    />
                    <Column
                        sortField="datasetNote.name"
                        body={rowData => <p className="line-clamp-3">{rowData?.datasetNote?.name}</p>}
                        header="Dataset"
                        style={{ width: '5%' }}
                        sortable
                    />
                    <Column
                        sortField="info.dateCreated"
                        body={rowData => (
                            <p className="line-clamp-3">
                                {rowData?.info?.dateCreated ? (rowData?.info?.dateCreated).slice(0, 10) : ''}
                            </p>
                        )}
                        header="Date Created"
                        style={{ width: '5%' }}
                        sortable
                    />
                    <Column field="version" header="Version" style={{ width: '5%' }} />
                    <Column
                        body={rowData => <p className="line-clamp-3">{rowData?.description}</p>}
                        header="Description"
                        style={{ width: '25%' }}
                    />
                    <Column
                        body={rowData => (
                            <p className="line-clamp-3">
                                {rowData?.dataSources && Object.keys(rowData?.dataSources).join(', ')}
                            </p>
                        )}
                        header="Data"
                        style={{ width: '15%' }}
                    />
                    <Column
                        body={rowData => (
                            <p className="line-clamp-3">{Object.keys(rowData?.releaseNotes).join(', ')}</p>
                        )}
                        header="Release Notes"
                        style={{ width: '15%' }}
                    />
                    <Column
                        body={rowData => (
                            <div className="flex flex-col justify-center items-center">
                                <a
                                    className="flex flex-col py-1 px-4 rounded-full justify-center items-center bg-lightBlue text-darkYellow font-bold"
                                    href={rowData?.repositories.downloadLink}
                                    target="_blank"
                                >
                                    Download
                                </a>
                            </div>
                        )}
                        header="Dataset Download"
                        style={{ width: '5%' }}
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default SetSearch;
