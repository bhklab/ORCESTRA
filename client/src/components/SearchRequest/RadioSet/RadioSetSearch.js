import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../../../hooks/Context';
import SearchReqContext from '../SearchReqContext';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import RadioSetFilter from './RadioSetFilter';
import RadioSetTable from './RadioSetTable';
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

const RadioSetSearch = () => {
    
    const auth = useContext(AuthContext);
    
    const [datasets, setDatasets] = useState([]);
    const [searchAll, setSearchAll] = useState(true);
    const [selectedDatasets, setSelectedDatasets] = useState([]);
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
            const res = await fetchData(`/api/${dataTypes.radiogenomics}/search`);
            console.log(res)
            setDatasets(res);
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
            const result = await fetchData(`/api/${dataTypes.radiogenomics}/search`, parameters);
            let all = true;
            Object.keys(parameters).forEach(key => {
                if(Array.isArray(parameters[key]) && parameters[key].length){
                    all = false;
                }
            });
            setDatasets(result);
            setSearchAll(all);
        }

        if(parameters.search){
            search();
        }
    }, [parameters]);

    const updateDatasetSelection = (selected) => {
        setSelectedDatasets(selected);
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
                <div className='title'>ORCESTRA for Radiogenomics</div>  
                <SearchReqWrapper>
                    <RadioSetFilter />
                    <MainPanel>
                        {/* <Messages ref={(el) => PSetSearch.messages = el} /> */}
                        <SearchReqPanel>
                            <SearchSummary title='Explore multimodal Radiogenomic Datasets (RadioSets)' searchAll={searchAll} matchNum={datasets.length} />
                        </SearchReqPanel>
                        {
                            ready ?
                            <RadioSetTable 
                                datasets={datasets} selectedDatasets={selectedDatasets} 
                                updateDatasetSelection={updateDatasetSelection} scrollHeight='600px'
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

export default RadioSetSearch;