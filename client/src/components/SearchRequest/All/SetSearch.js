import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Messages } from 'primereact/messages';
import { MultiSelect } from 'primereact/multiselect';
import { AuthContext } from '../../../hooks/Context';
import useDatasetSearch from '../../../hooks/useDatasetSearch';
import SearchReqContext from '../SearchReqContext';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import RadiomicSetFilter from '../RadiomicSet/RadiomicSetFilter';
import RadiomicSetTable from '../RadiomicSet/RadiomicSetTable';
import { dataTypes } from '../../Shared/Enums';
import StyledPage from '../../../styles/StyledPage';
// dataset filter imports
import FilterInputSwitch from '../../Shared/FilterInputSwitch';
import CustomSelect from '../../Shared/CustomSelect';

const SetSearch = () => {
    const auth = useContext(AuthContext);
    const { searchAll, search } = useDatasetSearch(dataTypes.radiomics);

    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState([]);
    const [isRequest, setIsRequest] = useState(false);

    const [parameters, setParameters] = useState({
        dataset: [],
        search: false
    });

    const [ready, setReady] = useState(false);

    const { datatype } = useParams();
    console.log(datatype);

    // Dataset filter
    const context = useContext(SearchReqContext);

    const [datasetSelect, setDatasetSelect] = useState({ selected: [], options: [], hidden: false });
    const [filterReady, setFilterReady] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            const res = await axios.get('/api/view/data-object-filter', {
                params: { datasetType: datatype }
            });
            setDatasetSelect({ ...datasetSelect, options: res.data.dataset });
            setFilterReady(true);
        };
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const initializeView = async () => {
            const res = await search({ ...parameters, status: 'complete', private: false });
            // console.log(res);
            setDatasets(res);
            setReady(true);
        };
        initializeView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        async function searchRadiomicSet() {
            // console.log(parameters);
            let copy = JSON.parse(JSON.stringify(parameters));
            copy.dataset = copy.dataset.map(item => item.name);
            const result = await search({ ...copy, status: 'complete', private: false });
            setDatasets(result);
        }

        if (parameters.search) {
            searchRadiomicSet();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters]);

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

    return (
        <SearchReqContext.Provider
            value={{
                parameters: parameters,
                setParameters: setParameters,
                isRequest: isRequest,
                setIsRequest: setIsRequest
            }}
        >
            <StyledPage>
                <div className="page-title">ORCESTRA for Radiomics</div>
                <SearchReqWrapper>
                    <RadiomicSetFilter />
                    <MainPanel>
                        <Messages ref={el => (SetSearch.messages = el)} />
                        <SearchReqPanel>
                            <div>
                                <SearchSummary
                                    title="Explore multimodal Radiomics Datasets (Radiomic sets)"
                                    searchAll={searchAll}
                                    matchNum={datasets.length}
                                />
                                {auth.user ? (
                                    <SaveDatasetButton
                                        selectedDatasets={selectedDatasets}
                                        disabled={selectedDatasets.length > 0 ? false : true}
                                        onSaveComplete={showMessage}
                                    />
                                ) : (
                                    '*Login or register to save existing Radiomic sets to your profile.'
                                )}
                            </div>
                        </SearchReqPanel>
                    </MainPanel>
                </SearchReqWrapper>
                {ready ? (
                    <RadiomicSetTable
                        datasets={datasets}
                        selectedDatasets={selectedDatasets}
                        updateDatasetSelection={e => {
                            setSelectedDatasets(e.value);
                        }}
                        scrollHeight="600px"
                        authenticated={auth.user ? true : false}
                        download={true}
                    />
                ) : (
                    <SearchTableLoader />
                )}
            </StyledPage>
            <div className="flex flex-col p-10 z-10 items-center min-h-screen">
                <div className="flex flex-col gap-4 bg-white border-1 drop-shadow-sm rounded-lg p-6">
                    <h3 className="text-heading2Xl font-bold text-center">
                        Explore Multimodal {datatype.toUpperCase()}(S)
                    </h3>
                    {filterReady && (
                        <div className="flex flex-row gap-6 justify-center items-center">
                            <CustomSelect
                                id="dataset"
                                hidden={false}
                                selectOne={isRequest}
                                options={datasetSelect.options}
                                selected={datasetSelect.selected}
                                onChange={e => {
                                    setDatasetSelect({ ...datasetSelect, selected: e.value });
                                    context.setParameters(prev => ({ ...prev, dataset: e.value, search: true }));
                                }}
                            />

                            <div>
                                <MultiSelect
                                    id="dataset"
                                    className="dropdown"
                                    optionLabel="label"
                                    value={datasetSelect.selected}
                                    options={datasetSelect.options}
                                    onChange={e => {
                                        setDatasetSelect({ ...datasetSelect, selected: e.value });
                                        context.setParameters(prev => ({ ...prev, dataset: e.value, search: true }));
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
                            <p className="text-bodyXs text-center text-red-600">
                                Login or register to save existing Radiomic sets to your profile.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </SearchReqContext.Provider>
    );
};

export default SetSearch;
