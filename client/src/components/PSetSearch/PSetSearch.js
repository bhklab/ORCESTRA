import React from 'react';
import './PSetSearch.css';
import Navigation from '../Navigation/Navigation';
import PSetFilter from './subcomponents/PSetFilter';
import PSetTable from '../Shared/PSetTable';
import SavePSetButton from '../Shared/Buttons/SavePSetButton';
import DownloadPSetButton from '../Shared/Buttons/DownloadPSetButton';
import {Messages} from 'primereact/messages';
import {AuthContext} from '../../context/auth';
import * as APIHelper from '../Shared/PSetAPIHelper';
import * as APICalls from '../Shared/APICalls';

class PSetSearch extends React.Component{
    constructor(){
        super();
        this.state = {
            allData: [],
            selectedPSets: [],
            disableSaveBtn: true
        }

        this.updateAllData = this.updateAllData.bind(this);
        this.evaluateList = this.evaluateList.bind(this);
        this.updatePSetSelection = this.updatePSetSelection.bind(this);
        this.initializeState = this.initializeState.bind(this);
        this.showMessage = this.showMessage.bind(this);
    }

    static contextType = AuthContext;

    componentDidMount(){
        APICalls.queryPSet('/pset', (resData) => {
            this.updateAllData(resData);
        });
    }

    showMessage(status, data){
        APIHelper.messageAfterRequest(status, data, this.initializeState, this.messages);
    }

    evaluateList(list){
        if(list.length > 0){
            return(
                <ul>
                    {list.map((pset) => <li key={pset._id}>{pset.doi}</li>)}
                </ul>
            );
        } else {
            return(<ul><li>None</li></ul>);
        }
    }

    updateAllData(data){
        this.setState({allData: data});
    }

    updatePSetSelection(selected){
        this.setState({selectedPSets: selected}, () => {
            if(APIHelper.isSelected(this.state.selectedPSets)){
                this.setState({disableSaveBtn: false});
            }else{
                this.setState({disableSaveBtn: true});
            }
        });
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
                        <PSetFilter updateAllData={this.updateAllData} />
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
                                <DownloadPSetButton selectedPSets={this.state.selectedPSets} disabled={this.state.disableSaveBtn} onDownloadComplete={this.showMessage} />
                                <SavePSetButton selectedPSets={this.state.selectedPSets} disabled={this.state.disableSaveBtn} onSaveComplete={this.showMessage} />
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