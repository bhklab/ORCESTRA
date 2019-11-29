import React from 'react';
import './PSetSearch.css';
import Navigation from '../Navigation/Navigation'
import PSetFilter from './subcomponents/PSetFilter';
import PSetTable from '../Shared/PSetTable';
import {Button} from 'primereact/button';
import {Messages} from 'primereact/messages';
import {AuthContext} from '../../context/auth';

class PSetSearch extends React.Component{
    constructor(){
        super();
        this.state = {
            allData: [],
            selectedPSets: [],
            disableSaveBtn: true
        }

        this.evaluateList = this.evaluateList.bind(this);
        this.filterPSet = this.filterPSet.bind(this);
        this.saveSelectedPSets = this.saveSelectedPSets.bind(this);
        this.afterSubmitRequest = this.afterSubmitRequest.bind(this);
        this.updatePSetSelection = this.updatePSetSelection.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.initializeState = this.initializeState.bind(this);
    }

    static contextType = AuthContext;

    componentDidMount(){
        console.log('PSetSearch');
        this.filterPSet('/pset');
    }

    evaluateList(list){
        if(list.length > 0){
            return(
                <ul>
                    {list.map((pset) => 
                        <li key={pset._id}>
                            {pset.doi}
                        </li>
                    )}
                </ul>
            );
        } else {
            return(<ul><li>None</li></ul>)
        }
    }

    filterPSet(api){
        console.log(api);
        fetch(api)  
            .then(res => res.json())
            .then(resData => {
                this.setState({
                    allData: resData
                });
            }   
        );
    }

    saveSelectedPSets = event => {
        event.preventDefault();
        if(this.context.authenticated){
            if(this.state.selectedPSets.length){
                var userPSet = { username: this.context.username };
                console.log(this.state.selectedPSets);
                var psetId = [];
                for(let i = 0; i < this.state.selectedPSets.length; i++){
                    psetId.push(this.state.selectedPSets[i]._id);
                }
                console.log(psetId);
                userPSet.psetId = psetId;
    
                fetch('/user/pset/add', {
                    method: 'POST',
                    body: JSON.stringify({reqData: userPSet}),
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(resData => this.afterSubmitRequest(1, resData))
                    .catch(err => this.afterSubmitRequest(0, err));
    
            }else{
                console.log('nothing to save');
            }
        }
    }

    afterSubmitRequest(success, resData){
        this.initializeState();
        if(success){
            this.messages.show({severity: 'success', summary: resData.summary, detail: resData.message});
        }else{
            this.messages.show({severity: 'error', summary: 'An error occured', detail: resData.toString(), sticky: true});
        }    
    }

    updatePSetSelection(selected){
        this.setState({selectedPSets: selected}, () => {
            if(this.isSelected(this.state.selectedPSets)){
                this.setState({disableSaveBtn: false});
            }else{
                this.setState({disableSaveBtn: true});
            }
        });
    }

    isSelected(reqParam){
        if(typeof reqParam === 'undefined' || reqParam === null){
            return(false);
        }
        if(Array.isArray(reqParam) && !reqParam.length){
            return(false);
        }
        return(true);
    }

    initializeState(){
        this.setState({
            selectedPSets: [],
            disableSaveBtn: true
        });
    }
    
    render(){
        
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                <div className='pageContent'>
                    <h1>Search for existing Pharmaco Datasets</h1>
                    <div className='pSetListContainer'>
                        <PSetFilter filterPSet={this.filterPSet} />
                        <div className='pSetTable'>
                            <div className='pSetSelectionSummary'>
                                <h2>Summary</h2>
                                <Messages ref={(el) => this.messages = el} />
                                <div className='pSetSummaryContainer'>
                                    <div className='pSetSummaryItem'>
                                        <span className='pSetSummaryNum'>{this.state.allData.length}</span> {this.state.allData.length === 1 ? ' match' : ' matches'} found.
                                    </div>
                                    <div className='pSetSummaryItem'>
                                        <span className='pSetSummaryNum'>{this.state.selectedPSets.length}</span> selected.
                                    </div>
                                    <div className='pSetSummaryItem pSetSelectedList'>
                                        <h5>Selected PSets:</h5> 
                                        {this.evaluateList(this.state.selectedPSets)}
                                    </div>
                                </div>
                                <Button className='downloadBtn' label='Download' disabled={this.state.disableSaveBtn}/>
                                {this.context.authenticated ? <Button label='Save' onClick={this.saveSelectedPSets} disabled={this.state.disableSaveBtn}/> : '*Login or register to save existing PSets to your profile.'}
                            </div>
                            <PSetTable allData={this.state.allData} selectedPSets={this.state.selectedPSets} updatePSetSelection={this.updatePSetSelection} scrollHeight='600px'/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetSearch;