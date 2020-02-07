import React from 'react';
import {InputSwitch} from 'primereact/inputswitch';
//import {Button} from 'primereact/button';
import * as APIHelper from '../../Shared/PSetAPIHelper';
import * as APICalls from '../../Shared/APICalls';
import PSetParameterOptions from '../../Shared/PSetParameterOptions';
import './PSetFilter.css';

class PSetFilter extends React.Component {
    constructor(){
        super();
        this.state = {
            psetRequestMode: false,
            // parameters: {
            //     dataType: [],
            //     dataset: [],
            //     drugSensitivity: [],
            //     genome: [],
            //     rnaTool: [],
            //     rnaRef: [],
            //     dnaTool: [],
            //     dnaRef: [],
            //     drugSensitivity: null
            // }
        }

        // this.handleClick = this.handleClick.bind(this);
        this.sendFilterPSetRequest = this.sendFilterPSetRequest.bind(this);
        this.setRequestView = this.setRequestView.bind(this);
    }

    // handleClick = event => {
    //     event.preventDefault();
    //     this.sendFilterPSetRequest();
    // }

    sendFilterPSetRequest(){
        let filterset = APIHelper.getFilterSet(this.props.parameters);
        let apiStr = APIHelper.buildAPIStr(filterset);
        console.log(apiStr);
        let searchAll = apiStr === '/pset' ||  apiStr === '/pset?' ? true : false;
        APICalls.queryPSet(apiStr, (data) => {
            this.props.updateAllData(data, searchAll);
        });    
    }

    setRequestView = event => {
        this.props.setRequestView(event.value);
    }

    render(){
        return(
            <React.Fragment>
                <div className='pSetFilterContainer'>
                    <div className='pSetFilter'>
                        <h2>PSet Parameters</h2>
                        <div className='filterSet'>
                            <label className='bold'>Request PSet: </label> 
                            <InputSwitch checked={this.props.isRequest} tooltip="Turn this on to request a PSet." onChange={this.setRequestView} />
                        </div>
                        <PSetParameterOptions 
                            autoUpdate={true}
                            setParentState={this.props.setParentState}
                            requestUpdate={this.sendFilterPSetRequest}
                            parameters={this.props.parameters}
                            formData={this.props.formData}
                            dropdownClassName='filterSet'
                            selectOne={this.props.isRequest}
                        />
                        {/* <Button type='submit' label='Search' onClick={this.handleClick} disabled={this.state.autoUpdateChecked}/> */}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetFilter;