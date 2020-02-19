import React, {useState, useEffect} from 'react';
import './PSetSearch.css';
import Navigation from '../Navigation/Navigation';
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
import Footer from '../Footer/Footer';

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
    const [notReadyToSubmit, setNotReadyToSubmit] = useState(true);
    const [parameters, setParameters] = useState({});
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const initializeView = async () => {
            const psets = fetchData('/pset?status=complete');
            setAllData(psets);
            setSearchAll(true);
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
            let searchAll = apiStr === '/pset' ||  apiStr === '/pset?' ? true : false;
            const psets = await fetchData(apiStr);
            setAllData(psets);
            setSearchAll(searchAll);
        }
        update();
        let params = parameters;
        params.name = name;
        params.email = email;
        setNotReadyToSubmit(APIHelper.isNotReadyToSubmit(params));
    }, [parameters])

    const updatePSets = async () => {
        let filterset = APIHelper.getFilterSet(parameters);
        let apiStr = APIHelper.buildAPIStr(filterset);
        console.log(apiStr);
        let searchAll = apiStr === '/pset' ||  apiStr === '/pset?' ? true : false;
        const psets = await fetchData(apiStr);
        setAllData(psets);
        setSearchAll(searchAll);
    }

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
        let reqData = parameters;
        reqData.drugSensitivity = reqData.dataset.drugSensitivity;
        reqData.name = name;
        reqData.email = email;
        console.log(reqData);
        const res = await trackPromise(fetch('/pset/request', {
                method: 'POST',
                body: JSON.stringify({reqData: reqData}),
                headers: {'Content-type': 'application/json'}
            }));
        const resData = await res.json();
        showMessage(res.ok, resData);
        initializeState();
    }

    useEffect(() => {
        let params = parameters;
        params.name = name;
        params.email = email;
        setNotReadyToSubmit(APIHelper.isNotReadyToSubmit(params));
    }, [name, email])
    
    const SubmitRequestButton = () => {
        const {promiseInProgress} = usePromiseTracker();
        return(
            promiseInProgress ? 
                <div className='loaderContainer'>
                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                </div>
                :
                <Button label='Submit Request' type='submit' disabled={notReadyToSubmit} onClick={handleSubmitRequest}/>
        );
    }
        
    return(
        <SearchReqContext.Provider value={{ 
                parameters: parameters, 
                setParameters: setParameters, 
                updatePSets: updatePSets, 
                isRequest: isRequest, 
                setIsRequest: setIsRequest
            }}
        >
            <Navigation routing={props} />
            <div className='pageContent'>
                <h1>Search or Request Pharmacogenomic Datasets</h1>
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
                                            <span><span className='pSetSummaryNum'>{allData.length}</span> <span>dataset(s) available.</span></span>
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
                            allData.length ?
                            <PSetTable allData={allData} selectedPSets={selectedPSets} updatePSetSelection={updatePSetSelection} scrollHeight='600px'/> 
                            :
                            <div className='tableLoaderContainer'>
                                <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                            </div>
                        }  
                    </div>
                </div>
            </div>
            <Footer />
        </SearchReqContext.Provider>
    );
}

export default PSetSearch;