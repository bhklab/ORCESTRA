import React from 'react';
import './PSetList.css';
import Navigation from '../Navigation/Navigation'
import PSetFilter from './subcomponents/PSetFilter';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Messages} from 'primereact/messages';

class PSetList extends React.Component{
    constructor(){
        super();
        this.state = {
            datasets: [],
            selectedPSets: [],
            disableSaveBtn: true
        }
        this.evaluateList = this.evaluateList.bind(this);
        this.filterPSet = this.filterPSet.bind(this);
        this.saveSelectedPSets = this.saveSelectedPSets.bind(this);
        this.afterSubmitRequest = this.afterSubmitRequest.bind(this);
        this.updatePSetSelectionEvent = this.updatePSetSelectionEvent.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.initializeState = this.initializeState.bind(this);
    }

	componentDidMount(){
		fetch('/pset')  
            .then(res => res.json())
            .then(resData => this.setState({datasets: resData}));
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
            .then(resData => this.setState({datasets: resData}));
    }

    saveSelectedPSets = event => {
        event.preventDefault();
        if(this.state.selectedPSets.length){
            var userPSet = { username: 'user1@email.com' };
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

    afterSubmitRequest(success, resData){
        this.initializeState();
        if(success){
            this.messages.show({severity: 'success', summary: resData.summary, detail: resData.message});
        }else{
            this.messages.show({severity: 'error', summary: 'An error occured', detail: resData.toString(), sticky: true});
        }    
    }

    updatePSetSelectionEvent = event => {
        this.setState({selectedPSets: event.value}, () => {
            if(this.isSelected(this.state.selectedPSets)){
                this.setState({disableSaveBtn: false});
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
                                        <span className='pSetSummaryNum'>{this.state.datasets.length}</span> {this.state.datasets.length === 1 ? ' match' : ' matches'} found.
                                    </div>
                                    <div className='pSetSummaryItem'>
                                        <span className='pSetSummaryNum'>{this.state.selectedPSets.length}</span> selected.
                                    </div>
                                    <div className='pSetSummaryItem pSetSelectedList'>
                                        <h5>Selected PSets:</h5> 
                                        {this.evaluateList(this.state.selectedPSets)}
                                    </div>
                                </div>
                                <Button label='Save' onClick={this.saveSelectedPSets} disabled={this.state.disableSaveBtn}/>
                            </div>
                            <DataTable value={this.state.datasets.slice(0, 50)} selection={this.state.selectedPSets} onSelectionChange={this.updatePSetSelectionEvent} scrollable={true} scrollHeight="600px">
                                <Column selectionMode="multiple" style={{width:'3.5em'}}/>
                                <Column className='textField' field='doi' header='DOI' style={{width:'18em'}}/>
                                <Column className='textField' field='datasetName' header='Dataset' style={{width:'6em'}} />
                                <Column className='textField' field='datasetVersion' header='Dataset Version' style={{width:'7em'}}/>
                                <Column className='textField' field='drugSensitivity' header='Drug Sensitivity' style={{width:'7em'}}/>
                                <Column className='textField' field='rnaTool' header='RNA Tool' style={{width:'10em'}} />
                                <Column className='textField' field='exomeTool' header='Exome Tool' style={{width:'10em'}} />
                                <Column className='textField' field='rnaRef' header='RNA Ref' style={{width:'10em'}} />
                                <Column className='textField' field='exomeRef' header='Exome Ref' style={{width:'10em'}} />
                                <Column className='textField' field='metadata' header='Metadata' />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetList;