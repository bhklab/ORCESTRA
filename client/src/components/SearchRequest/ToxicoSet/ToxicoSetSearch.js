import React, {useState, useEffect, useContext} from 'react';
import {Messages} from 'primereact/messages';
import { AuthContext } from '../../../hooks/Context';
import useDatasetSearch from '../../../hooks/useDatasetSearch';
import SearchReqContext from '../SearchReqContext';
import {dataTypes} from '../../Shared/Enums';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import ToxicoSetFilter from './ToxicoSetFilter';
import ToxicoSetTable from './ToxicoSetTable';
import StyledPage from '../../../styles/StyledPage';
import * as MainStyle from '../../Main/MainStyle';


const ToxicoSetSearch = () => {
    
    const auth = useContext(AuthContext);
    const { searchAll, search } = useDatasetSearch(dataTypes.toxicogenomics);
    
    const [toxicoSets, setToxicoSets] = useState([]);
    const [selectedTSets, setSelectedTSets] = useState([]);
    const [isRequest, setIsRequest] = useState(false);
    
    const [parameters, setParameters] = useState({
        dataset: [],
        search: false
    });

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const initializeView = async () => {
            const tsets = await search({...parameters, status: 'complete', private: false});
            console.log(tsets)
            setToxicoSets(tsets);
            setReady(true);
        }
        initializeView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {   
        async function searchTSets() {
            console.log('search');
            console.log(parameters);
            let copy = JSON.parse(JSON.stringify(parameters));
            copy.dataset = copy.dataset.map(item => item.name);
            const toxicoSets = await search({...copy, status: 'complete', private: false});
            setToxicoSets(toxicoSets);
        }

        if(parameters.search){
            searchTSets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <StyledPage>
                <div className='page-title'>ORCESTRA for Toxicogenomics</div>
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
                    </MainPanel>
                </SearchReqWrapper>
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
            </StyledPage>
        </SearchReqContext.Provider>
    );
}

export default ToxicoSetSearch;