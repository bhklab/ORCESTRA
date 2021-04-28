import React, {useState, useEffect, useContext} from 'react';
import {AuthContext} from '../../../context/auth';
import SearchReqContext from '../SearchReqContext';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import ToxicoSetFilter from './ToxicoSetFilter';
import ToxicoSetTable from './ToxicoSetTable';
import {dataTypes} from '../../Shared/Enums';

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
    // const [disableSaveBtn, setDisableSaveBtn] = useState(true);
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

    // useEffect(() => {
    //     setDisableSaveBtn(Helper.isSelected(selectedPSets) ? false : true)
    // }, [selectedPSets]);

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

    const updateTSetSelection = (selected) => {
        setSelectedTSets(selected);
    }

    // const initializeState = () => {
    //     setSelectedPSets([]);
    //     setDisableSaveBtn(true);
    // }
        
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
                <h2>ORCESTRA for Toxicogenomics - Explore multimodal Toxicogenomic Datasets (ToxicoSets)</h2>  
                <SearchReqWrapper>
                    <ToxicoSetFilter />
                    <MainPanel>
                        {/* <Messages ref={(el) => PSetSearch.messages = el} /> */}
                        <SearchReqPanel>
                            <SearchSummary searchAll={searchAll} matchNum={toxicoSets.length} />  
                        </SearchReqPanel>
                        {
                            ready ?
                            <ToxicoSetTable 
                                tsets={toxicoSets} selectedTSets={selectedTSets} 
                                updateTSetSelection={updateTSetSelection} scrollHeight='600px'
                                authenticated={auth.authenticated} download={true}
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