import React, {useState, useEffect, useContext} from 'react';
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

const PSetSearchBeta = (props) => {
    const [allData, setAllData] = useState([]);
    const [formDataOriginal, setFormDataOriginal] = useState({});
    const [formData, setFormData] = useState({});
    const [searchAll, setSearchAll] = useState(true);
    const [selectedPSets, setSelectedPSets] = useState([]);
    const [disableSaveBtn, setDisableSaveBtn] = useState(true);
    const [isRequest, setIsRequest] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [notReadyToSubmit, setNotReadyToSubmit] = useState(true);

    const [parameters, setParameters] = useState({
        dataType: [],
        dataset: [],
        drugSensitivity: [],
        genome: [],
        rnaTool: [],
        rnaRef: [],
        dnaTool: [],
        dnaRef: [],
        name: '',
        email: ''
    });

    const fetchData = async (url) => {
        const response = await fetch(url);
        const json = await response.json();
        return(json);
    }

    useEffect(() => {
        const initializeView = async () => {
            const psets = await fetchData('/pset?status=complete');
            const formDataset = await fetchData('/formData');
            setAllData(psets);
            setSearchAll(true);
            setFormData(formDataset[0]);
            setFormDataOriginal(JSON.parse(JSON.stringify(formDataset[0])));
            setIsLoaded(true);
        }
        initializeView();
    }, []);

    useEffect(() => {
        setDisableSaveBtn(APIHelper.isSelected(selectedPSets) ? false : true)
    }, [selectedPSets]);

    const showMessage = (status, data) => {
        let severity = status ? 'success' : 'error';
        PSetSearchBeta.messages.show({severity: severity, summary: data.summary, detail: data.message, sticky: true});
        initializeState();
    }

    const setStateOnParamSelection = (states) => {
        let params = parameters;
        for(let i = 0; i < states.length; i++){
            params[states[i].name] = states[i].value;
        }
        console.log(params);
        setParameters(params);
        setNotReadyToSubmit(APIHelper.isNotReadyToSubmit(params));
    }

    const updateAllData = (data, searchAll = true) => {
        setAllData(data);
        setSearchAll(searchAll);
    }

    const updatePSetSelection = (selected) => {
        setSelectedPSets(selected);
    }

    const setRequestView = (visible) => {
        const params = parameters;
        let fData = formData;
        if(visible){
            if(params.dataset.length){
                fData.dataset = params.dataset;
                params.dataset = params.dataset[0];
            }
            if(params.genome.length){
                fData.genome = params.genome;
                params.genome = params.genome[0];
            }
        }else{
            console.log(params)
            if(fData.dataset.length < formDataOriginal.dataset.length){
                params.dataset = fData.dataset;
            }else if(!Array.isArray(params.dataset)){
                let datasetVal = JSON.parse(JSON.stringify(params.dataset));
                params.dataset = [];
                params.dataset.push(datasetVal);
            }
            if(fData.genome.length < formDataOriginal.genome.length){
                params.genome = fData.genome
            }else if(!Array.isArray(params.genome)){
                let genomeVal = JSON.parse(JSON.stringify(params.genome));
                params.genome = [];
                params.genome.push(genomeVal);
            }
            fData = formDataOriginal;
        }
        setParameters(params);
        setFormData(JSON.parse(JSON.stringify(fData)));
        setNotReadyToSubmit(APIHelper.isNotReadyToSubmit(params));
        setIsRequest(visible);
    }

    const initializeState = () => {
        setSelectedPSets([]);
        setDisableSaveBtn(true);
    }

    const handleSubmitRequest = async event => {
        event.preventDefault();
        let reqData = parameters;
        reqData.drugSensitivity = reqData.dataset.drugSensitivity;
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

    const updateReqInputEvent = event => {
        event.preventDefault();
        let params = parameters;
        params[event.target.id] = event.target.value;
        console.log(params);
        setParameters(params);
        setNotReadyToSubmit(APIHelper.isNotReadyToSubmit(params));
    }
    
    const SubmitRequestButton = props => {
        const {promiseInProgress} = usePromiseTracker();
        return(
            promiseInProgress ? 
                <div className='loaderContainer'>
                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                </div>
                :
                <Button label='Submit Request' type='submit' disabled={false} onClick={handleSubmitRequest}/>
        );
    }
        
    return(
        <React.Fragment>
            <Navigation routing={props} />
            <div className='pageContent'>
                <h1>Search or Request Pharmacogenomic Datasets</h1>
                <div className='pSetListContainer'>
                {
                    isLoaded ?
                    <PSetFilter 
                        updateAllData={updateAllData} 
                        setRequestView={setRequestView} 
                        setParentState={setStateOnParamSelection}
                        isRequest={isRequest}
                        formData={formData} 
                        parameters={parameters}
                    />
                    :
                    <div></div>
                }
                    
                    <div className='pSetTable'>
                        <Messages ref={(el) => PSetSearchBeta.messages = el} />
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
                                            <InputText id='name' className='paramInput' value={parameters.name || ''} onChange={updateReqInputEvent} />
                                    </div>
                                    <div className='reqFormInput'>
                                        <label>Email to receive DOI:</label>
                                            <InputText id='email' className='paramInput' value={parameters.email || ''} onChange={updateReqInputEvent} />
                                    </div>
                                    <div className='reqFormInput'>
                                        <SubmitRequestButton />
                                    </div>
                                </div>
                            }
                        </div>
                        <PSetTable allData={allData} selectedPSets={selectedPSets} updatePSetSelection={updatePSetSelection} scrollHeight='600px'/>    
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default PSetSearchBeta;