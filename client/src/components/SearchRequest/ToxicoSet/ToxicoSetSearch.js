import React, {useState, useEffect, useContext} from 'react';
import '../SearchRequest.css';
import Loader from 'react-loader-spinner';
import ToxicoSetFilter from './ToxicoSetFilter';
import ToxicoSetTable from './ToxicoSetTable';
import {AuthContext} from '../../../context/auth';
import {dataTypes} from '../../Shared/Enums';

export const SearchReqContext = React.createContext();

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
        <SearchReqContext.Provider value={{ 
                parameters: parameters, 
                setParameters: setParameters, 
                isRequest: isRequest, 
                setIsRequest: setIsRequest
            }}
        >
            <div className='pageContent'>
                <h2>Search or Request Toxicogenomic Datasets</h2>
                <div className='pSetListContainer'>
                    <ToxicoSetFilter />
                    <div className='pSetTable'>
                        {/* <Messages ref={(el) => PSetSearch.messages = el} /> */}
                        <div className='pSetSelectionSummary'>
                            <div className='summaryPanel'>
                                <h2>Summary</h2>
                                <div className='pSetSummaryContainer'>
                                    <div className='pSetSummaryItem'>
                                        {
                                            searchAll ? 
                                            <span><span className='pSetSummaryNum'>{toxicoSets.length ? toxicoSets.length : 0}</span> <span>dataset(s) available.</span></span>
                                            :
                                            <span><span className='pSetSummaryNum'>{toxicoSets.length}</span> <span>{toxicoSets.length === 1 ? ' match' : ' matches'}</span> found.</span>
                                        }
                                    </div>
                                </div>
                                {/* <SavePSetButton selectedPSets={selectedPSets} disabled={disableSaveBtn} onSaveComplete={showMessage} /> */}
                            </div>
                        </div>
                        {
                            ready ?
                            <ToxicoSetTable 
                                tsets={toxicoSets} selectedTSets={selectedTSets} 
                                updateTSetSelection={updateTSetSelection} scrollHeight='600px'
                                authenticated={auth.authenticated} download={true}
                            /> 
                            :
                            <div className='tableLoaderContainer'>
                                <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                            </div>
                        }  
                    </div>
                </div>
            </div>
        </SearchReqContext.Provider>
    );
}

export default ToxicoSetSearch;