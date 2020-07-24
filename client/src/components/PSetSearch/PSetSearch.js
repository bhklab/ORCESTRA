import React, {useState, useEffect, useContext} from 'react';
import './PSetSearch.css';
import PSetFilter from './subcomponents/PSetFilter';
import PSetTable from '../Shared/PSetTable';
import SavePSetButton from '../Shared/Buttons/SavePSetButton';
import {usePromiseTracker} from "react-promise-tracker";
import {trackPromise} from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Messages} from 'primereact/messages';
import * as Helper from '../Shared/Helper';
import {AuthContext} from '../../context/auth';

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

const PSetSearch = () => {
    
    const auth = useContext(AuthContext);
    
    const [psets, setPSets] = useState([]);
    const [searchAll, setSearchAll] = useState(true);
    const [selectedPSets, setSelectedPSets] = useState([]);
    const [disableSaveBtn, setDisableSaveBtn] = useState(true);
    const [isRequest, setIsRequest] = useState(false);
    const [readyToSubmit, setReadyToSubmit] = useState(true);
    
    const [parameters, setParameters] = useState({
        dataset: [],
        drugSensitivity: [],
        genome: [],
        dataType: [],
        rnaTool: [],
        rnaRef: [],
        name: '',
        email: '',
        search: false
    });

    const [ready, setReady] = useState(false)

    useEffect(() => {
        const initializeView = async () => {
            const psets = await fetchData('/api/pset/search');
            setPSets(psets);
            setSearchAll(true);
            setReady(true);
        }
        initializeView();
    }, []);

    useEffect(() => {
        setDisableSaveBtn(Helper.isSelected(selectedPSets) ? false : true)
    }, [selectedPSets]);

    useEffect(() => {   
        async function search() {
            console.log('search');
            console.log(parameters);
            let copy = JSON.parse(JSON.stringify(parameters));
            Object.keys(copy).forEach(key => {
                if(!Array.isArray(copy[key])){
                    copy[key] = [copy[key]];
                }
            });
            const psets = await fetchData('/api/pset/search', copy);
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
        initializeState();
    }

    const updatePSetSelection = (selected) => {
        setSelectedPSets(selected);
    }

    const initializeState = () => {
        setSelectedPSets([]);
        setDisableSaveBtn(true);
    }

    const submitRequest = async event => {
        event.preventDefault();
        let dataset = {name: parameters.dataset.name, label: parameters.dataset.label, versionInfo: parameters.drugSensitivity.version}
        let reqData = {...parameters};
        let dataType = parameters.defaultData.concat(parameters.dataType);
        let rnaRef = {...parameters.rnaRef};

        reqData.dataset = dataset;
        reqData.dataType = dataType;
        reqData.rnaRef = (Object.keys(rnaRef).length === 0 && rnaRef.constructor === Object ? [] : [rnaRef]);
        
        // delete any unnecessary fields for the database.
        delete reqData.drugSensitivity;
        delete reqData.defaultData;
        delete reqData.search;
        reqData.dataType.forEach(dt => {delete dt.hide});
        reqData.rnaRef.forEach(ref => {delete ref.hide});

        console.log(reqData);
        
        const res = await trackPromise(fetch('/api/pset/request', {
                method: 'POST',
                body: JSON.stringify({reqData: reqData}),
                headers: {'Content-type': 'application/json'}
            }));
        const resData = await res.json();
        showMessage(res.ok, resData);
        initializeState();
    }

    const SubmitRequestButton = () => {
        const {promiseInProgress} = usePromiseTracker();
        return(
            promiseInProgress ? 
                <div className='loaderContainer'>
                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                </div>
                :
                <Button label='Submit Request' type='submit' disabled={!readyToSubmit} onClick={submitRequest}/>
        );
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
                <h2>Search or Request Pharmacogenomic Datasets</h2>
                <div className='pSetListContainer'>
                    <PSetFilter />
                    <div className='pSetTable'>
                        <Messages ref={(el) => PSetSearch.messages = el} />
                        <div className='pSetSelectionSummary'>
                            <div className='summaryPanel'>
                                <h2>Summary</h2>
                                <div className='pSetSummaryContainer'>
                                    <div className='pSetSummaryItem'>
                                        {
                                            searchAll ? 
                                            <span><span className='pSetSummaryNum'>{psets.length ? psets.length : 0}</span> <span>dataset(s) available.</span></span>
                                            :
                                            <span><span className='pSetSummaryNum'>{psets.length}</span> <span>{psets.length === 1 ? ' match' : ' matches'}</span> found.</span>
                                        }
                                    </div>
                                </div>
                                <SavePSetButton selectedPSets={selectedPSets} disabled={disableSaveBtn} onSaveComplete={showMessage} />
                            </div>
                            {
                                isRequest &&
                                <div className='requestFormPanel'>
                                    <h2>Request PSet</h2>
                                    <div className='reqFormInput'>
                                        <label>PSet Name:</label>
                                            <InputText id='name' className='paramInput' value={parameters.name || ''} onChange={(e) => {setParameters({...parameters, name: e.target.value, search: false})}} />
                                    </div>
                                    <div className='reqFormInput'>
                                        <label>Email to receive DOI:</label>
                                            <InputText id='email' className='paramInput' value={parameters.email || ''} onChange={(e) => {setParameters({...parameters, email: e.target.value, search: false})}} />
                                    </div>
                                    <div className='reqFormInput'>
                                        <SubmitRequestButton />
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            ready ?
                            <PSetTable 
                                psets={psets} selectedPSets={selectedPSets} 
                                updatePSetSelection={updatePSetSelection} scrollHeight='600px'
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

export default PSetSearch;