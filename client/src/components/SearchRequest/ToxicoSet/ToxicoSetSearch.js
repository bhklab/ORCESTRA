import React, {useState, useEffect, useContext} from 'react';
import {Messages} from 'primereact/messages';
import { AuthContext } from '../../../hooks/Context';
import SearchReqContext from '../SearchReqContext';
import {dataTypes} from '../../Shared/Enums';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import ToxicoSetFilter from './ToxicoSetFilter';
import ToxicoSetTable from './ToxicoSetTable';

async function fetchData(url, parameters) {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({parameters: {...parameters, status: 'complete'}}),
        headers: {'Content-type': 'application/json'}
    });
    const json = await response.json();
    return(json);
}

const ToxicoSetSearch = () => {
    
    const auth = useContext(AuthContext);
    
    const [toxicoSets, setToxicoSets] = useState([]);
    const [searchAll, setSearchAll] = useState(true);
    const [selectedTSets, setSelectedTSets] = useState([]);
    const [isRequest, setIsRequest] = useState(false);
    
    const [parameters, setParameters] = useState({
        dataset: [],
        name: '',
        email: '',
        search: false
    });

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const initializeView = async () => {
            const tsets = await fetchData(`/api/${dataTypes.toxicogenomics}/search`);
            console.log(tsets)
            setToxicoSets(tsets);
            setSearchAll(true);
            setReady(true);
        }
        initializeView();
    }, []);

    useEffect(() => {   
        async function search() {
            console.log('search');
            console.log(parameters);
            const toxicoSets = await fetchData(`/api/${dataTypes.toxicogenomics}/search`, parameters);
            let all = true;
            Object.keys(parameters).forEach(key => {
                if(Array.isArray(parameters[key]) && parameters[key].length){
                    all = false;
                }
            });
            setToxicoSets(toxicoSets);
            setSearchAll(all);
        }

        if(parameters.search){
            search();
        }
    }, [parameters]);

    const showMessage = (status, data) => {
        let severity = status ? 'success' : 'error';
        ToxicoSetSearch.messages.show({severity: severity, summary: data.summary, detail: data.message, sticky: true});
        setSelectedTSets([]);
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
            <div className='pageContent'> 
                <div className='title'>ORCESTRA for Toxicogenomics</div>
                <SearchReqWrapper>
                    <ToxicoSetFilter />
                    <MainPanel>
                        <Messages ref={(el) => ToxicoSetSearch.messages = el} />
                        <SearchReqPanel>
                            <div>
                                <SearchSummary 
                                    title='Explore multimodal Toxicogenomic Datasets (ToxicoSets)' 
                                    searchAll={searchAll} 
                                    matchNum={toxicoSets.length} 
                                />  
                                {
                                    auth.user ?
                                    <SaveDatasetButton 
                                        selectedDatasets={selectedTSets} 
                                        disabled={selectedTSets.length > 0 ? false : true} 
                                        onSaveComplete={showMessage} 
                                    />
                                    :
                                    '*Login or register to save existing ToxicoSets to your profile.'
                                }
                            </div>
                        </SearchReqPanel>
                        {
                            ready ?
                            <ToxicoSetTable 
                                tsets={toxicoSets} 
                                selectedDatasets={selectedTSets} 
                                updateDatasetSelection={(e) => {setSelectedTSets(e.value)}} 
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

export default ToxicoSetSearch;