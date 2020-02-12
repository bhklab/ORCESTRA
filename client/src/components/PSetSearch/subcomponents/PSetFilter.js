import React from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import * as APIHelper from '../../Shared/PSetAPIHelper';
import * as APICalls from '../../Shared/APICalls';
import PSetParameterOptions from '../../Shared/PSetParameterOptions';
import './PSetFilter.css';

const PSetFilter = (props) => {

    const sendFilterPSetRequest = () => {
        let filterset = APIHelper.getFilterSet(props.parameters);
        let apiStr = APIHelper.buildAPIStr(filterset);
        console.log(apiStr);
        let searchAll = apiStr === '/pset' ||  apiStr === '/pset?' ? true : false;
        APICalls.queryPSet(apiStr, (data) => {
            props.updateAllData(data, searchAll);
        });    
    }

    const setRequestView = event => {
        props.setRequestView(event.value);
    }

    return(
        <React.Fragment>
            <div className='pSetFilterContainer'>
                <div className='pSetFilter'>
                    <h2>PSet Parameters</h2>
                    <div className='filterSet'>
                        <label className='bold'>Request PSet: </label> 
                        <InputSwitch checked={props.isRequest} tooltip="Turn this on to request a PSet." onChange={setRequestView} />
                    </div>
                    <PSetParameterOptions 
                        setParentState={props.setParentState}
                        requestUpdate={sendFilterPSetRequest}
                        parameters={props.parameters}
                        formData={props.formData}
                        dropdownClassName='filterSet'
                        selectOne={props.isRequest}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}

export default PSetFilter;