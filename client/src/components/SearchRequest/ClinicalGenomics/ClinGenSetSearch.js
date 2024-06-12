import React, {useState, useEffect, useContext} from 'react';
import {Messages} from 'primereact/messages';
import { AuthContext } from '../../../hooks/Context';
import useDatasetSearch from '../../../hooks/useDatasetSearch';
import SearchReqContext from '../SearchReqContext';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import ClinGenSetFilter from './ClinGenSetFilter';
import ClinGenSetTable from './ClinGenSetTable';
import {dataTypes} from '../../Shared/Enums';
import StyledPage from '../../../styles/StyledPage';

const ClinGenSetSearch = (props) => {
    const { datasetType } = props;
    const auth = useContext(AuthContext);
    const { searchAll, search } = useDatasetSearch(datasetType);
    
    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState([]);
    const [isRequest, setIsRequest] = useState(false);
    const [parameters, setParameters] = useState({
        dataset: [],
        search: false
    });
    const [ready, setReady] = useState(false);

    const getDataObjectName = () => {
        switch(datasetType){
            case dataTypes.clinicalgenomics:
                return 'Clinical Genomics';
            case dataTypes.icb:
                return 'ICB';
            default:
                return ''
        }
    }

    useEffect(() => {
        const initializeView = async () => {
            const res = await search({...parameters, status: 'complete', private: false});
            setDatasets(res);
            setReady(true);
        }
        initializeView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {   
        async function searchClinGenSets() {
            console.log(parameters);
            let copy = JSON.parse(JSON.stringify(parameters));
            copy.dataset = copy.dataset.map(item => item.name);
            const result = await search({...copy, status: 'complete', private: false});
            setDatasets(result);
        }

        if(parameters.search){
            searchClinGenSets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters]);

    const showMessage = (status, data) => {
        let severity = status ? 'success' : 'error';
        ClinGenSetSearch.messages.show({severity: severity, summary: data.summary, detail: data.message, sticky: true});
        setSelectedDatasets([]);
    }
        
    return(
        <SearchReqContext.Provider value={{ 
                parameters: parameters, 
                setParameters: setParameters, 
                isRequest: isRequest, 
                setIsRequest: setIsRequest
            }}
        >
            <StyledPage>
                <div className='page-title'>{`ORCESTRA for ${getDataObjectName()}`}</div>  
                <SearchReqWrapper>
                    <ClinGenSetFilter datasetType={datasetType} datasetTypeLabel={getDataObjectName()} />
                    <MainPanel>
                        <Messages ref={(el) => ClinGenSetSearch.messages = el} />
                        <SearchReqPanel>
                            <div>
                                <SearchSummary 
                                    title={`Explore multimodal ${getDataObjectName()} Datasets`}
                                    searchAll={searchAll} 
                                    matchNum={datasets.length} 
                                />
                                {
                                    auth.user ?
                                    <SaveDatasetButton 
                                        selectedDatasets={selectedDatasets} 
                                        disabled={selectedDatasets.length > 0 ? false : true} 
                                        onSaveComplete={showMessage} 
                                    />
                                    :
                                    '*Login or register to save existing data objects to your profile.'
                                }
                                </div>
                        </SearchReqPanel>
                        </MainPanel>
                </SearchReqWrapper>
                        {
                            ready ?
                            <ClinGenSetTable 
                                datasetType={datasetType}
                                datasets={datasets} 
                                selectedDatasets={selectedDatasets} 
                                updateDatasetSelection={(e) => {setSelectedDatasets(e.value)}} 
                                scrollHeight='600px'
                                authenticated={auth.user ? true : false}  
                                download={true}
                            /> 
                            :
                            <SearchTableLoader />
                        }  
            </StyledPage>
        </SearchReqContext.Provider>
    );
}

export default ClinGenSetSearch;