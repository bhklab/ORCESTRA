import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../../../hooks/Context';
import SearchReqContext from '../SearchReqContext';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import PSetFilter from './PSetFilter';
import PSetRequestForm from './PSetRequestForm';
import PSetTable from './PSetTable';
import SearchSummary from '../SearchSummary';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';
import SearchTableLoader from '../SearchTableLoader';
import {Messages} from 'primereact/messages';
import * as Helper from '../../Shared/Helper';
import {dataTypes} from '../../Shared/Enums';

async function fetchData(url, parameters) {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({parameters: {...parameters, status: 'complete', private: false}}),
        headers: {'Content-type': 'application/json'}
    });
    const json = await response.json();
    return(json);
}

const PSetSearch = () => {
    
    const auth = useContext(AuthContext);
    
    const [psets, setPSets] = useState([]);
    const [searchAll, setSearchAll] = useState(true);
    const [selectedPSets, setSelectedPSets] = useState([]);
    const [isRequest, setIsRequest] = useState(false);
    const [readyToSubmit, setReadyToSubmit] = useState(true);
    
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
            const psets = await fetchData(`/api/${dataTypes.pharmacogenomics}/search`);
            console.log(psets)
            setPSets(psets);
            setSearchAll(true);
            setReady(true);
        }
        initializeView();
    }, []);

    useEffect(() => {   
        async function search() {
            console.log('search');
            console.log(parameters);
            let copy = JSON.parse(JSON.stringify(parameters));
            Object.keys(copy).forEach(key => {
                if(!Array.isArray(copy[key]) && !(key === 'canonicalOnly' || key === 'filteredSensitivity')){
                    copy[key] = [copy[key]];
                }
            });
            const psets = await fetchData(`/api/${dataTypes.pharmacogenomics}/search`, copy);
            let all = true;
            Object.keys(parameters).forEach(key => {
                if(Array.isArray(parameters[key]) && parameters[key].length){
                    all = false;
                }
            });
            setPSets(psets);
            setSearchAll(all);
        }

        if(parameters.search){
            search();
        }
        
        if(isRequest){
            setReadyToSubmit(Helper.isReadyToSubmit(parameters));
        }
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
                                <PSetRequestForm readyToSubmit={readyToSubmit} onRequestComplete={showMessage} />
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