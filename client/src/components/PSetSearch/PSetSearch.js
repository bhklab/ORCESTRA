import React, {useState, useEffect} from 'react';
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
import * as APIHelper from '../Shared/PSetAPIHelper';

export const SearchReqContext = React.createContext();

async function fetchData(url) {
    const response = await fetch(url);
    const json = await response.json();
    return(json);
}

const PSetSearch = (props) => {
    const [allData, setAllData] = useState([]);
    const [searchAll, setSearchAll] = useState(true);
    const [selectedPSets, setSelectedPSets] = useState([]);
    const [disableSaveBtn, setDisableSaveBtn] = useState(true);
    const [isRequest, setIsRequest] = useState(false);
    const [readyToSubmit, setReadyToSubmit] = useState(true);
    const [parameters, setParameters] = useState({});
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [ready, setReady] = useState(false)

    useEffect(() => {
        const initializeView = async () => {
            const psets = await fetchData('/api/pset?status=complete');
            setAllData(psets);
            setSearchAll(true);
            setReady(true);
        }
        initializeView();
    }, []);

    useEffect(() => {
        setDisableSaveBtn(APIHelper.isSelected(selectedPSets) ? false : true)
    }, [selectedPSets]);

    useEffect(() => {   
        async function update() {
            let filterset = APIHelper.getFilterSet(parameters);
            let apiStr = APIHelper.buildAPIStr(filterset);
            console.log(apiStr);
            let searchAll = apiStr === '/api/pset' ||  apiStr === '/api/pset?status=complete' ? true : false;
            const psets = await fetchData(apiStr);
            setAllData(psets);
            setSearchAll(searchAll);
        }
        update();
        if(isRequest){
            let params = {...parameters};
            params.name = name;
            params.email = email;
            setReadyToSubmit(APIHelper.isReadyToSubmit(params));
        }
    }, [parameters])

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

    const handleSubmitRequest = async event => {
        event.preventDefault();
        let reqData = {...parameters};
        let dataType = {...parameters.dataType}
        let rnaRef = {...parameters.rnaRef}

        reqData.dataType = [dataType]
        reqData.rnaRef = [rnaRef]
        reqData.drugSensitivity = reqData.dataset.drugSensitivity;
        reqData.name = name;
        reqData.email = email;
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

    useEffect(() => {
        let params = {...parameters};
        params.name = name;
        params.email = email;
        setReadyToSubmit(APIHelper.isReadyToSubmit(params));
    }, [name, email])
    
    const SubmitRequestButton = () => {
        const {promiseInProgress} = usePromiseTracker();
        return(
            promiseInProgress ? 
                <div className='loaderContainer'>
                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                </div>
                :
                <Button label='Submit Request' type='submit' disabled={!readyToSubmit} onClick={handleSubmitRequest}/>
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
                                            <span><span className='pSetSummaryNum'>{allData.length ? allData.length : 0}</span> <span>dataset(s) available.</span></span>
                                            :
                                            <span><span className='pSetSummaryNum'>{allData.length}</span> <span>{allData.length === 1 ? ' match' : ' matches'}</span> found.</span>
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
                                            <InputText id='name' className='paramInput' value={name || ''} onChange={(e) => {setName(e.target.value)}} />
                                    </div>
                                    <div className='reqFormInput'>
                                        <label>Email to receive DOI:</label>
                                            <InputText id='email' className='paramInput' value={email || ''} onChange={(e) => {setEmail(e.target.value)}} />
                                    </div>
                                    <div className='reqFormInput'>
                                        <SubmitRequestButton />
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            isRequest ?
                            <PSetTable allData={allData} selectedPSets={selectedPSets} updatePSetSelection={updatePSetSelection} scrollHeight='600px'/> 
                            :
                            ready ?
                            <PSetTable allData={allData} selectedPSets={selectedPSets} updatePSetSelection={updatePSetSelection} scrollHeight='600px'/> 
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