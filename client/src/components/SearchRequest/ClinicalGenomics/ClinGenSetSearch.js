import React, {useState, useEffect, useContext} from 'react';
import {AuthContext} from '../../../context/auth';
import SearchReqContext from '../SearchReqContext';

import { SearchReqWrapper, MainPanel, SearchReqPanel } from '../SearchReqStyle';
import SearchTableLoader from '../SearchTableLoader';
import SearchSummary from '../SearchSummary';
import ClinGenSetFilter from './ClinGenSetFilter';
import ClinGenSetTable from './ClinGenSetTable';
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

const ClinGenSetSearch = () => {
    
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
            const res = await fetchData(`/api/${dataTypes.clinicalgenomics}/search`);
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
            const result = await fetchData(`/api/${dataTypes.clinicalgenomics}/search`, parameters);
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
        <SearchReqContext.Provider value={{ 
                parameters: parameters, 
                setParameters: setParameters, 
                isRequest: isRequest, 
                setIsRequest: setIsRequest
            }}
        >
            <div className='pageContent'>
                <h2>ORCESTRA for Clinical Genomics - Explore multimodal Clinical Genomics Datasets</h2>  
                <SearchReqWrapper>
                    <ClinGenSetFilter />
                    <MainPanel>
                        {/* <Messages ref={(el) => PSetSearch.messages = el} /> */}
                        <SearchReqPanel>
                            <SearchSummary searchAll={searchAll} matchNum={datasets.length} />
                        </SearchReqPanel>
                        {
                            ready ?
                            <ClinGenSetTable 
                                datasets={datasets} selectedDatasets={selectedDatasets} 
                                updateDatasetSelection={updateDatasetSelection} scrollHeight='600px'
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

export default ClinGenSetSearch;