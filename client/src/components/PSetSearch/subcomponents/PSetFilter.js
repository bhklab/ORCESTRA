import React from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import {Button} from 'primereact/button';
import * as APIHelper from '../../Shared/PSetAPIHelper';
import * as APICalls from '../../Shared/APICalls';
import PSetParameterOptions from '../../Shared/PSetParameterOptions';
import './PSetFilter.css';

class PSetFilter extends React.Component {
    constructor(){
        super();
        this.state = {
            autoUpdateChecked: false,
            parameters: {
                dataType: [],
                dataset: [],
                genome: [],
                rnaTool: [],
                rnaRef: [],
                dnaTool: [],
                dnaRef: [],
                drugSensitivity: null
            }
        }
        this.setStateOnParamSelection = this.setStateOnParamSelection.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sendFilterPSetRequest = this.sendFilterPSetRequest.bind(this);
    }

    setStateOnParamSelection(states){
        let parameters = this.state.parameters;
        for(let i = 0; i < states.length; i++){
            parameters[states[i].name] = states[i].value;
        }
        console.log(parameters);
        this.setState({parameters: parameters});
    }

    handleClick = event => {
        event.preventDefault();
        this.sendFilterPSetRequest();
    }

    sendFilterPSetRequest(){
        let filterset = APIHelper.getFilterSet(this.state.parameters);
        let apiStr = APIHelper.buildAPIStr(filterset);
        let searchAll = apiStr === '/pset' ||  apiStr === '/pset?' ? true : false;
        APICalls.queryPSet(apiStr, (data) => {
            this.props.updateAllData(data, searchAll);
        });    
    }

    render(){
        return(
            <React.Fragment>
                <div className='pSetFilterContainer'>
                    <div className='pSetFilter'>
                        <h2>PSet Filter</h2>
                        <div className='filterSet'>
                            <label>Enable Automatic Table Update: </label>
                            <InputSwitch checked={this.state.autoUpdateChecked} onChange={(e) => this.setState({autoUpdateChecked: e.value})} />
                        </div>

                        <PSetParameterOptions 
                            autoUpdate={this.state.autoUpdateChecked}
                            setParentState={this.setStateOnParamSelection}
                            requestUpdate={this.sendFilterPSetRequest}
                            parameters={this.state.parameters}
                            dropdownClassName='filterSet'
                            selectOne={false}
                        />

                        <Button type='submit' label='Search' onClick={this.handleClick} disabled={this.state.autoUpdateChecked}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetFilter;