import React, {useState, useEffect, useContext} from 'react';
import {Messages} from 'primereact/messages';
import { AuthContext } from '../../../hooks/Context';
import SearchReqContext from '../SearchReqContext';
import SaveDatasetButton from '../../Shared/Buttons/SaveDatasetButton';

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

    const showMessage = (status, data) => {
        let severity = status ? 'success' : 'error';
        ClinGenSetSearch.messages.show({severity: severity, summary: data.summary, detail: data.message, sticky: true});
        setSelectedDatasets([]);
    }
        
    return(
        <SearchReqContext.Provider value={{ 
                parameters: parameters, 
                setParameters: setParameters, 
                isRequest: isRequest, 
                setIsRequest: setIsRequest
            }}
        >
            <div className='pageContent'>
                <div className='title'>ORCESTRA for Clinical Genomics</div>  
                <SearchReqWrapper>
                    <ClinGenSetFilter />
                    <MainPanel>
                        <Messages ref={(el) => ClinGenSetSearch.messages = el} />
                        <SearchReqPanel>
                            <div>
                                <SearchSummary 
                                    title='Explore multimodal Clinical Genomics Datasets' 
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
                                    '*Login or register to save existing Clinical Genomics Datasets to your profile.'
                                }
                            </div>
                        </SearchReqPanel>
                        {
                            ready ?
                            <ClinGenSetTable 
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
            </div>
        </SearchReqContext.Provider>
    );
}

export default ClinGenSetSearch;