import React, {useState, useEffect, useContext} from 'react';
import {Messages} from 'primereact/messages';
import { AuthContext } from '../../../hooks/Context';
import useDatasetSearch from '../../../hooks/useDatasetSearch';
import SearchReqContext from '../SearchReqContext';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import XevaSetFilter from './XevaSetFilter';
import XevaSetTable from './XevaSetTable';
import {dataTypes} from '../../Shared/Enums';
import StyledPage from '../../../styles/StyledPage';

const XevaSetSearch = () => {
    
    const auth = useContext(AuthContext);
    const { searchAll, search } = useDatasetSearch(dataTypes.xenographic);
    
    const [xevaSets, setXevaSets] = useState([]);
    const [selectedXevaSets, setSelectedXevaSets] = useState([]);
    const [isRequest, setIsRequest] = useState(false);
    
    const [parameters, setParameters] = useState({
        dataset: [],
        search: false
    });

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const initializeView = async () => {
            const xevasets = await search({...parameters, status: 'complete', private: false});
            setXevaSets(xevasets);
            setReady(true);
        }
        initializeView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {   
        async function searchXevaSets() {
            let copy = JSON.parse(JSON.stringify(parameters));
            copy.dataset = copy.dataset.map(item => item.name);
            const xevaSets = await search({...copy, status: 'complete', private: false});
            setXevaSets(xevaSets);
        }

        if(parameters.search){
            searchXevaSets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters]);

    const showMessage = (status, data) => {
        let severity = status ? 'success' : 'error';
        XevaSetSearch.messages.show({severity: severity, summary: data.summary, detail: data.message, sticky: true});
        setSelectedXevaSets([]);
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
                <div className='page-title'>ORCESTRA for Xenographic Pharmacogenomics</div>   
                <SearchReqWrapper>
                    <XevaSetFilter />
                    <MainPanel>
                    <Messages ref={(el) => XevaSetSearch.messages = el} />
                        <SearchReqPanel>
                            <div>
                                <SearchSummary 
                                    title='Explore Xenographic Pharmacogenomics Datasets (XevaSets)' 
                                    searchAll={searchAll} 
                                    matchNum={xevaSets.length} 
                                />
                                {
                                    auth.user ?
                                    <SaveDatasetButton 
                                        selectedDatasets={selectedXevaSets} 
                                        disabled={selectedXevaSets.length > 0 ? false : true} 
                                        onSaveComplete={showMessage} 
                                    />
                                    :
                                    '*Login or register to save existing XevaSets to your profile.'
                                }
                            </div>
                        </SearchReqPanel>
                        </MainPanel>
                </SearchReqWrapper>
                        {
                            ready ?
                            <XevaSetTable
                                xevasets={xevaSets} 
                                selectedDatasets={selectedXevaSets} 
                                updateDatasetSelection={(e) => {setSelectedXevaSets(e.value)}} 
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

export default XevaSetSearch;