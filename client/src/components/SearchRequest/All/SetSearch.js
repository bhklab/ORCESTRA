import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Messages } from 'primereact/messages';
import { MultiSelect } from 'primereact/multiselect';
import { AuthContext } from '../../../hooks/Context';
import useDatasetSearch from '../../../hooks/useDatasetSearch';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';
import { dataTypes } from '../../Shared/Enums';

const SetSearch = () => {
    const auth = useContext(AuthContext);
    const { searchAll, search } = useDatasetSearch(dataTypes.radiomics);

    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState([]);

    const { datatype } = useParams();

    const [datasetSelect, setDatasetSelect] = useState({ selected: [], options: [], hidden: false });
    const [filterReady, setFilterReady] = useState(false);

    const showMessage = (status, data) => {
        let severity = status ? 'success' : 'error';
        SetSearch.messages.show({
            severity: severity,
            summary: data.summary,
            detail: data.message,
            sticky: true
        });
        setSelectedDatasets([]);
    };

    useEffect(() => {
        const initialize = async () => {
            const res = await axios.get(`/api/view/data-object-filter/${datatype}`);
            setDatasetSelect({ ...datasetSelect, options: res.data.dataset });
            setFilterReady(true);
        };
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col p-10 z-10 items-center min-h-screen">
            <div className="flex flex-col gap-4 bg-white border-1 drop-shadow-sm rounded-lg p-6">
                <h3 className="text-headingSm font-bold">Explore multimodal {datatype} datasets</h3>
                {filterReady && (
                    <div className="flex flex-row gap-6 justify-start">
                        <div>
                            <MultiSelect
                                id="dataset"
                                className="dropdown"
                                optionLabel="label"
                                value={datasetSelect.selected}
                                options={datasetSelect.options}
                                selected={datasetSelect.selected}
                                onChange={e => {
                                    setDatasetSelect({ ...datasetSelect, selected: e.value });
                                }}
                                filter={true}
                                itemTemplate={
                                    <div>
                                        <span className="text-gray-100">{datasetSelect.options.label}</span>
                                    </div>
                                }
                                selectedItemTemplate={<span>Select Dataset</span>}
                            />
                        </div>

                        <div>
                            <MultiSelect
                                id="dataset"
                                className="dropdown"
                                optionLabel="label"
                                value={datasetSelect.selected}
                                options={datasetSelect.options}
                                onChange={e => {
                                    setDatasetSelect({ ...datasetSelect, selected: e.value });
                                }}
                                filter={true}
                                itemTemplate={
                                    <div>
                                        <span className="text-gray-100">{datasetSelect.options.label}</span>
                                    </div>
                                }
                                selectedItemTemplate={<span>Select Datasets</span>}
                            />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <span className="text-headingLg font-bold">{datasets.length}</span>
                            <span className="">
                                {searchAll
                                    ? 'dataset(s) available.'
                                    : `${datasets.length === 1 ? ' match' : ' matches'} found.`}
                            </span>
                        </div>
                    </div>
                )}
                <div className="flex flex-col">
                    {auth.user ? (
                        <SaveDatasetButton
                            selectedDatasets={selectedDatasets}
                            disabled={selectedDatasets.length > 0 ? false : true}
                            onSaveComplete={showMessage}
                        />
                    ) : (
                        <p className="text-bodyXs text-red-600">
                            Login or register to save existing {datatype} to your profile.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SetSearch;
