import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../hooks/Context';
import { Check, X, Info } from 'lucide-react';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';
// import { dataTypes } from '../../Shared/Enums';
import { dataTypes } from './dictionaries/dataTypes';
import { DatasetSelect } from './Dropdowns/DatasetSelect';

// PrimeReact Imports
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';

const SetSearch = () => {
    const auth = useContext(AuthContext);
    const { datatype } = useParams();
    const navigate = useNavigate();

    const [datasetNotes, setDatasetNotes] = useState([]); // All datatype notes
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [datasetObjects, setDatasetObjects] = useState([]); // All datatype objects
    const [filteredDatasetObjects, setFilteredDatasetObjects] = useState([]);

    const [selectedDatasets, setSelectedDatasets] = useState([]); //Selected datasets for saving mechanism (will be reintroduced later on)

    useEffect(() => {
        const getDatasets = async () => {
            try {
                const res = await axios.get(`/api/view/data-object-filter/${datatype}`);
                const uniqueObjs = new Set(res.data.map(item => item.datasetNote.name)); // Get unique datasetNote names
                setDatasetNotes(
                    Array.from(uniqueObjs).map(name => ({
                        name: name,
                        code: name
                    }))
                ); // Cast to array of objects for MultiSelect component ingestion
                setDatasetObjects(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getDatasets();
    }, []);

    useEffect(() => {
        const filteredNames = filteredNotes.map(note => note.name);
        setFilteredDatasetObjects(datasetObjects.filter(obj => filteredNames.includes(obj.datasetNote.name)));
    }, [filteredNotes]);

    return (
        <div className="flex flex-col px-10 py-32 z-10 items-center min-h-screen">
            <div className="flex flex-col gap-8 bg-white border-1 drop-shadow-sm rounded-lg p-10 w-full">
                <div>
                    <h2 className="text-headingXl font-bold text-lightBlue">
                        Explore Multimodal {dataTypes[datatype].heading} Datasets
                    </h2>
                    {/* <div className="flex flex-col">
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
                    </div> */}
                </div>
                {datasetNotes && (
                    <DatasetSelect
                        datasetNotes={datasetNotes}
                        filteredNotes={filteredNotes}
                        setFilteredNotes={setFilteredNotes}
                    />
                )}
                <Tooltip
                    key={filteredDatasetObjects.length || datasetObjects.length}
                    target=".description-info-tooltip"
                    position="top"
                    pt={{
                        text: {
                            className:
                                'bg-gray-800 text-white text-bodyXs font-normal px-3 py-2 rounded-md shadow-md max-w-md'
                        }
                    }}
                />
                <DataTable
                    value={filteredDatasetObjects.length > 0 ? filteredDatasetObjects : datasetObjects} // when nothing is filtered, use base list of objects
                    sortMode="multiple"
                    multiSortMeta={[
                        { field: 'info.canonical', order: -1 },
                        { field: 'info.dateCreated', order: -1 }
                    ]}
                    size="small"
                    showGridlines={true}
                    stripedRows
                >
                    <Column
                        field="name"
                        body={rowData => (
                            <h2
                                className="font-bold text-headingSm text-darkYellow break-all hover:cursor-pointer hover:underline underline-offset-[3px] decoration-[1.5px]"
                                onClick={() => navigate(`/${datatype}/${rowData._id}`)}
                            >
                                {rowData?.name}
                                {rowData?.version ? ` (v${rowData.version})` : ''}
                            </h2>
                        )}
                        header="Object Name"
                        style={{ width: '20%' }}
                        sortable
                    />
                    <Column
                        field="datasetNote.name"
                        body={rowData => <p className="line-clamp-3">{rowData?.datasetNote?.name}</p>}
                        header="Dataset"
                        style={{ width: '15%' }}
                        sortable
                    />
                    <Column
                        field="info.dateCreated"
                        body={rowData => (
                            <p className="line-clamp-3">
                                {rowData?.info?.dateCreated ? (rowData?.info?.dateCreated).slice(0, 10) : ''}
                            </p>
                        )}
                        header="Date Created"
                        style={{ width: '10%' }}
                        sortable
                    />
                    <Column
                        field="info.canonical"
                        body={rowData => (
                            <div className="flex flex-col justify-center items-center">
                                {rowData?.info?.canonical ? (
                                    <Check className="text-green-700 font-bold w-6" strokeWidth={3} />
                                ) : (
                                    <X className="text-red-700 font-bold w-6" strokeWidth={3} />
                                )}
                            </div>
                        )}
                        header={
                            <div className="flex items-center gap-2">
                                Canonical
                                <Tooltip
                                    target=".canonical-info-tooltip"
                                    position="top"
                                    pt={{
                                        text: {
                                            className:
                                                'bg-gray-800 text-white text-bodyXs font-normal px-3 py-2 rounded-md shadow-md max-w-xs'
                                        }
                                    }}
                                />
                                <span
                                    className="canonical-info-tooltip flex items-center cursor-pointer"
                                    data-pr-tooltip="Latest versions of datasets curated by the Benjamin Haibe-Kains lab"
                                >
                                    <Info className="text-gray-600 font-bold w-3.5" strokeWidth={3.5} />
                                </span>
                            </div>
                        }
                        style={{ width: '5%' }}
                        sortable
                    />
                    <Column
                        body={rowData => {
                            const plainDescription = rowData?.description?.replace(/<[^>]+>/g, '');
                            return (
                                <p className="line-clamp-3 description-info-tooltip" data-pr-tooltip={plainDescription}>
                                    {plainDescription}
                                </p>
                            );
                        }}
                        header="Description"
                        style={{ width: '30%' }}
                    />
                    <Column
                        body={rowData => (
                            <div className="flex gap-1 flex-wrap">
                                {rowData?.dataSources &&
                                    Object.keys(rowData?.dataSources).map(source => (
                                        <div className="flex px-3 py-1.5 text-bodyXs shadow-sm text-white bg-lightBlue rounded-full ">
                                            {source}
                                        </div>
                                    ))}
                            </div>
                        )}
                        header="Raw Data Sources"
                        style={{ width: '20%' }}
                    />
                    {/* <Column
                        body={rowData =>
                            rowData?.releaseNotes && (
                                <p className="line-clamp-3">{Object.keys(rowData?.releaseNotes).join(', ')}</p>
                            )
                        }
                        header="Release Notes"
                        style={{ width: '15%' }}
                    /> */}
                    {/* <Column
                        body={rowData => (
                            <div className="flex flex-col justify-center items-center">
                                <a
                                    className="flex flex-col justify-center items-center hover:-translate-y-0.5 transition text-gray-400 hover:text-lightBlue"
                                    href={rowData?.repositories.downloadLink}
                                    target="_blank"
                                >
                                    <Download className="w-7" strokeWidth={2.5} />
                                </a>
                            </div>
                        )}
                        header="Download"
                        style={{ width: '5%' }}
                    /> */}
                </DataTable>
            </div>
        </div>
    );
};

export default SetSearch;
