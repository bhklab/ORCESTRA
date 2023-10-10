import React, {useState, useEffect, useContext} from 'react';
import {Messages} from 'primereact/messages';
import { AuthContext } from '../../../hooks/Context';
import useDatasetSearch from '../../../hooks/useDatasetSearch';
import SearchReqContext from '../SearchReqContext';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import RadiomicSetFilter from './RadiomicSetFilter';
import RadiomicSetTable from './RadiomicSetTable';
import {dataTypes} from '../../Shared/Enums';
import StyledPage from '../../../styles/StyledPage';

const RadiomicSetSearch = () => {
    
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

    useEffect(() => {
        const initializeView = async () => {
            const res = await search({...parameters, status: 'complete', private: false});
            console.log(res)
            setDatasets(res);
            setReady(true);
        }
        initializeView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {   
        async function searchRadiomicSet() {
            console.log(parameters);
            let copy = JSON.parse(JSON.stringify(parameters));
            copy.dataset = copy.dataset.map(item => item.name);
            const result = await search({...copy, status: 'complete', private: false});
            setDatasets(result);
        }

        if(parameters.search){
            searchRadiomicSet();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters]);

    const showMessage = (status, data) => {
        let severity = status ? 'success' : 'error';
        RadiomicSetSearch.messages.show({severity: severity, summary: data.summary, detail: data.message, sticky: true});
        setSelectedDatasets([]);
    }
        
    return(
        <SearchReqContext.Provider 
            value={{ 
                parameters: parameters, 
                setParameters: setParameters, 
                isRequest: isRequest, 
                setIsRequest: setIsRequest
            }}
        >
            <StyledPage>
                <div className='page-title'>ORCESTRA for Radiomics</div>  
                <SearchReqWrapper>
                    <RadiomicSetFilter />
                    <MainPanel>
                        <Messages ref={(el) => RadiomicSetSearch.messages = el} />
                        <SearchReqPanel>
                            <div>
                                <SearchSummary 
                                    title='Explore multimodal Radiomic Datasets (Radiomic Sets)' 
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
                                    '*Login or register to save existing Radiomic Sets to your profile.'
                                }
                            </div>
                        </SearchReqPanel>
                        {
                            ready ?
                            <RadiomicSetTable 
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
            </StyledPage>
        </SearchReqContext.Provider>
    );
}

export default RadiomicSetSearch;