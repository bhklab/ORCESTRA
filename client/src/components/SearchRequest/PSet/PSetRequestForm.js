import React, { useState, useEffect, useContext } from 'react';
import SearchReqContext from '../SearchReqContext';

import CustomInputText from '../../Shared/CustomInputText';
import {Button} from 'primereact/button';
import { ThreeDots } from 'react-loader-spinner';
import {usePromiseTracker} from "react-promise-tracker";
import {trackPromise} from 'react-promise-tracker';
import styled from 'styled-components';

const RequestForm = styled.div`
    width: 300px;
    div {
        margin-top: 25px;
    }
`;

const LoaderContainer = styled.div`
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
`;

function isSelected(reqParam){
    if(typeof reqParam === 'undefined' || reqParam === null){
        return(false);
    }
    if(Array.isArray(reqParam) && !reqParam.length){
        return(false);
    }
    return(true);
}

function hasName(name){
    if(typeof name === 'undefined' || name === null){
        return(false);
    }
    if(name.length === 0){
        return(false);
    }
    return(true);
}

function isValidEmail(email){
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(typeof email === 'undefined' || email === null){
        return(false);
    }
    if(email.length === 0){
        return(false);
    }
    if(!regex.test(email)){
        return(false);
    }
    return(true);
}

const getReadyToSubmit = (request) => {
    if(!isSelected(request.dataset)){
        return(false)
    }
    if(!isSelected(request.drugSensitivity)){
        return(false);
    }
    if(!hasName(request.name)){return(false)}

    if(!isValidEmail(request.email)){return(false)}

    if(!isSelected(request.genome) && !(request.dataset.name === 'CTRPv2' || request.dataset.name === 'FIMM')){
        return(false);
    }
    if(!isSelected(request.rnaTool) && !(request.dataset.name === 'CTRPv2' || request.dataset.name === 'FIMM')){
        return(false);
    }
    if(!isSelected(request.rnaRef) && !(request.dataset.name === 'CTRPv2' || request.dataset.name === 'FIMM')){
        return(false);
    }

    return(true);
}

const PSetRequestForm = (props) => {

    const context = useContext(SearchReqContext);
    const [readyToSubmit, setReadyToSubmit] = useState(false);

    useEffect(() => {
        setReadyToSubmit(getReadyToSubmit(context.parameters));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.parameters]);

    const submitRequest = async event => {
        event.preventDefault();
        let dataset = {
            name: context.parameters.dataset.name, 
            label: context.parameters.dataset.label, 
            versionInfo: context.parameters.drugSensitivity.version, 
            filteredSensitivity: context.parameters.filteredSensitivity
        }
        let reqData = {...context.parameters};
        let dataType = context.parameters.defaultData.concat(context.parameters.dataType);
        let rnaRef = {...context.parameters.rnaRef};

        reqData.dataset = dataset;
        reqData.dataType = dataType;
        reqData.rnaRef = (Object.keys(rnaRef).length === 0 && rnaRef.constructor === Object ? [] : [rnaRef]);
        
        // delete any unnecessary fields for the database.
        delete reqData.canonicalOnly;
        delete reqData.drugSensitivity;
        delete reqData.filteredSensitivity;
        delete reqData.defaultData;
        delete reqData.search;
        reqData.dataType.forEach(dt => {
            delete dt.hidden;
            delete dt.options;
        });
        reqData.rnaRef.forEach(ref => {delete ref.hidden});

        console.log(reqData);
        
        const res = await trackPromise(fetch('/api/pset/request', {
                method: 'POST',
                body: JSON.stringify({reqData: reqData}),
                headers: {'Content-type': 'application/json'}
            }));
        const resData = await res.json();
        props.onRequestComplete(res.ok, resData);
        // props.onRequestComplete(true, {});
    }

    const SubmitRequestButton = () => {
        const {promiseInProgress} = usePromiseTracker();
        return(
            promiseInProgress ? 
                <LoaderContainer>
                    <ThreeDots type="ThreeDots" color="#3D405A" height={100} width={100} />
                </LoaderContainer>
                :
                <Button label='Submit Request' type='submit' disabled={!readyToSubmit} onClick={submitRequest}/>
        );
    }

    return(
        <RequestForm>
            <h3>Request PSet</h3>
            <CustomInputText 
                label='PSet Name:'
                value={context.parameters.name || ''} 
                onChange={(e) => {context.setParameters({...context.parameters, name: e.target.value, search: false})}}
            />
            <CustomInputText 
                label='Email to receive DOI:'
                value={context.parameters.email || ''} 
                onChange={(e) => {context.setParameters({...context.parameters, email: e.target.value, search: false})}}
            />
            <div>
                <SubmitRequestButton />
            </div>
        </RequestForm>
    );
}

export default PSetRequestForm;