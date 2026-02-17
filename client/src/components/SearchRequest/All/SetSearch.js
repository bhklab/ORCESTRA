import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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

    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState([]);

    useEffect(() => {
        const getDatasets = async () => {
            try {
                const res = await axios.get(`/api/view/data-object-filter/${datatype}`);
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
            <div className="flex flex-col gap-8 bg-white border-1 drop-shadow-sm rounded-lg p-10">
                <div>
                    <h2 className="text-headingXl font-bold text-lightBlue">
                        Explore multimodal {dataTypes[datatype].heading}
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
                <DataTable value={selectedDatasets} size="small" showGridlines={true} stripedRows>
                    <Column field="name" header="Object Name" />
                    <Column field="version" header="Version" />
                    <Column field="category" header="Dataset" />
                    <Column field="description" header="Description" />
                    {/* <Column field="category" header="Molecular Data" />
                    <Column field="category" header="Tools" />
                    <Column field="category" header="RNA Ref" />
                    <Column field="quantity" header="Total Downloads" /> */}
                    <Column field="quantity" header="Download" />
                </DataTable>
            </div>
        </div>
    );
};

export default SetSearch;
