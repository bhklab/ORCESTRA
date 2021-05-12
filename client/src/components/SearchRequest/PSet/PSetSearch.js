import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../../../hooks/Context';
import useDatasetSearch from '../../../hooks/useDatasetSearch';
import SearchReqContext from '../SearchReqContext';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import PSetFilter from './PSetFilter';
import PSetRequestForm from './PSetRequestForm';
import PSetTable from './PSetTable';
import SearchSummary from '../SearchSummary';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';
import SearchTableLoader from '../SearchTableLoader';
import {Messages} from 'primereact/messages';
import {dataTypes} from '../../Shared/Enums';

const PSetSearch = () => {
    
    const auth = useContext(AuthContext);
    const { searchAll, search } = useDatasetSearch(dataTypes.pharmacogenomics);

    const [psets, setPSets] = useState([]);
    const [selectedPSets, setSelectedPSets] = useState([]);
    const [isRequest, setIsRequest] = useState(false);
    
    const [parameters, setParameters] = useState({
        dataset: [],
        drugSensitivity: [],
        canonicalOnly: false,
        filteredSensitivity: false,
        genome: [],
        dataType: [],
        defaultData: [],
        rnaTool: [],
        rnaRef: [],
        name: '',
        email: '',
        search: false
    });

    const [ready, setReady] = useState(false)

    useEffect(() => {
        const initializeView = async () => {
            const psets = await search({...parameters, status: 'complete', private: false});
            console.log(psets);
            setPSets(psets);
            setReady(true);
        }
        initializeView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {   
        async function searchPSets() {
            console.log('search');
            console.log(parameters);
            let copy = JSON.parse(JSON.stringify(parameters));
            Object.keys(copy).forEach(key => {
                if(!Array.isArray(copy[key]) && !(key === 'canonicalOnly' || key === 'filteredSensitivity' || key === 'search' || key === 'name' || key === 'email')){
                    copy[key] = [copy[key]];
                }
            });
            const psets = await search({...copy, status: 'complete', private: false});
            setPSets(psets);
        }

        if(parameters.search){
            searchPSets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters]);

    const showMessage = (status, data) => {
        let severity = status ? 'success' : 'error';
        PSetSearch.messages.show({severity: severity, summary: data.summary, detail: data.message, sticky: true});
        setSelectedPSets([]);
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
                <SearchReqWrapper>
                    <PSetFilter />
                    <MainPanel>
                        <Messages ref={(el) => PSetSearch.messages = el} />
                        <SearchReqPanel>
                            <div>
                                <SearchSummary 
                                    title='Search or Request Pharmacogenomic Datasets (PSets)' 
                                    searchAll={searchAll} 
                                    matchNum={psets.length} 
                                />
                                {
                                    auth.user ?
                                    <SaveDatasetButton 
                                        selectedDatasets={selectedPSets} 
                                        disabled={selectedPSets.length > 0 ? false : true} 
                                        onSaveComplete={showMessage} 
                                    />
                                    :
                                    '*Login or register to save existing PSets to your profile.'
                                }
                            </div>
                            {
                                isRequest &&
                                <PSetRequestForm onRequestComplete={showMessage} />
                            }
                        </SearchReqPanel>
                        {
                            ready ?
                            <PSetTable 
                                psets={psets} 
                                selectedPSets={selectedPSets} 
                                updatePSetSelection={(e) => {setSelectedPSets(e.value)}} 
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

export default PSetSearch;