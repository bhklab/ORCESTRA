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

const ClinGenSetSearch = () => {
    
    const auth = useContext(AuthContext);
    const { searchAll, search } = useDatasetSearch(dataTypes.clinicalgenomics);
    
    const [datasets, setDatasets] = useState([]);
    const [selectedDatasets, setSelectedDatasets] = useState([]);
    const [isRequest, setIsRequest] = useState(false);
    
    const [parameters, setParameters] = useState({
        dataset: [],
        search: false
    });

    const [ready, setReady] = useState(false);

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
            const result = await search({...parameters, status: 'complete', private: false});
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
            <div className='pageContent'>
                <div className='page-title'>ORCESTRA for Clinical Genomics</div>  
                <SearchReqWrapper>
                    <ClinGenSetFilter />
                    <MainPanel>
                        <Messages ref={(el) => ClinGenSetSearch.messages = el} />
                        <SearchReqPanel>
                            <div>
                                <SearchSummary 
                                    title='Explore multimodal Clinical Genomics Datasets' 
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
                                    '*Login or register to save existing Clinical Genomics Datasets to your profile.'
                                }
                            </div>
                        </SearchReqPanel>
                        {
                            ready ?
                            <ClinGenSetTable 
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
                    </MainPanel>
                </SearchReqWrapper>
            </div>
        </SearchReqContext.Provider>
    );
}

export default ClinGenSetSearch;