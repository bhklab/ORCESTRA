import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../../../hooks/Context';
import SearchReqContext from '../SearchReqContext';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import XevaSetFilter from './XevaSetFilter';
import XevaSetTable from './XevaSetTable';
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

const XevaSetSearch = () => {
    
    const auth = useContext(AuthContext);
    
    const [xevaSets, setXevaSets] = useState([]);
    const [searchAll, setSearchAll] = useState(true);
    const [selectedXevaSets, setSelectedXevaSets] = useState([]);
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
            const xevasets = await fetchData(`/api/${dataTypes.xenographic}/search`);
            console.log(xevasets)
            setXevaSets(xevasets);
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
            const xevaSets = await fetchData(`/api/${dataTypes.xenographic}/search`, parameters);
            let all = true;
            Object.keys(parameters).forEach(key => {
                if(Array.isArray(parameters[key]) && parameters[key].length){
                    all = false;
                }
            });
            setXevaSets(xevaSets);
            setSearchAll(all);
        }

        if(parameters.search){
            search();
        }
    }, [parameters]);

    const updateXevaSetSelection = (selected) => {
        setSelectedXevaSets(selected);
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
                <div className='title'>ORCESTRA for Xenographic Pharmacogenomics</div>   
                <SearchReqWrapper>
                    <XevaSetFilter />
                    <MainPanel>
                        {/* <Messages ref={(el) => PSetSearch.messages = el} /> */}
                        <SearchReqPanel>
                            <SearchSummary title='Explore Xenographic Pharmacogenomics Datasets (XevaSets)' searchAll={searchAll} matchNum={xevaSets.length} />
                        </SearchReqPanel>
                        {
                            ready ?
                            <XevaSetTable
                                xevasets={xevaSets} selectedXevaSets={selectedXevaSets} 
                                updateXevaSetSelection={updateXevaSetSelection} scrollHeight='600px'
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

export default XevaSetSearch;