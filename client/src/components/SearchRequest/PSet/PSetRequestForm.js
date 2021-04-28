import React, {useContext} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import Loader from 'react-loader-spinner';
import {usePromiseTracker} from "react-promise-tracker";
import {trackPromise} from 'react-promise-tracker';
import styled from 'styled-components';
import {SearchReqContext} from './PSetSearch';

const RequestForm = styled.div`
    width: 400px;
    .reqFormInput {
        display: flex;
        align-items: center;
        margin-top: 35px;
    }
    .paramInput {
        flex-grow: 1;
    }
`

const LoaderContainer = styled.div`
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
`

const PSetRequestForm = (props) => {

    const context = useContext(SearchReqContext);

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
        reqData.dataType.forEach(dt => {delete dt.hide});
        reqData.rnaRef.forEach(ref => {delete ref.hide});

        console.log(reqData);
        
        const res = await trackPromise(fetch('/api/pset/request', {
                method: 'POST',
                body: JSON.stringify({reqData: reqData}),
                headers: {'Content-type': 'application/json'}
            }));
        const resData = await res.json();
        props.onRequestComplete(res.ok, resData);
    }

    const SubmitRequestButton = () => {
        const {promiseInProgress} = usePromiseTracker();
        return(
            promiseInProgress ? 
                <LoaderContainer>
                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                </LoaderContainer>
                :
                <Button label='Submit Request' type='submit' disabled={!props.readyToSubmit} onClick={submitRequest}/>
        );
    }

    return(
        <RequestForm>
            <h2>Request PSet</h2>
            <div className='reqFormInput'>
                <label>PSet Name:</label>
                <InputText id='name' className='paramInput' value={context.parameters.name || ''} 
                    onChange={(e) => {context.setParameters({...context.parameters, name: e.target.value, search: false})}} />
            </div>
            <div className='reqFormInput'>
                <label>Email to receive DOI:</label>
                <InputText id='email' className='paramInput' value={context.parameters.email || ''} 
                    onChange={(e) => {context.setParameters({...context.parameters, email: e.target.value, search: false})}} />
            </div>
            <div className='reqFormInput'>
                <SubmitRequestButton />
            </div>
        </RequestForm>
    );
}

export default PSetRequestForm;