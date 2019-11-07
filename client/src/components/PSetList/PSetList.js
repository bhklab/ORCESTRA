import React from 'react';
import './PSetList.css';
import Navigation from '../Navigation/Navigation'
import PSetFilter from './subcomponents/PSetFilter';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {ScrollPanel} from 'primereact/scrollpanel';

class PSetList extends React.Component{
    constructor(){
        super();
        this.state = {
            datasets: [],
            selectedPSets: []
        }
        this.evaluateList = this.evaluateList.bind(this);
        this.filterPSet = this.filterPSet.bind(this);
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
                        <li key={pset.doi}>
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
    
    render(){
        
        return(
            <React.Fragment>
                <Navigation />
                <div className='pageContent'>
                    <h1>Search for existing Pharmaco Datasets</h1>
                    <div className='pSetListContainer'>
                        <PSetFilter filterPSet={this.filterPSet} />
                        <div className='pSetTable'>
                            <div className='pSetSelectionSummary'>
                                <h2>Summary</h2>
                                <div className='pSetSummaryContainer'>
                                    <div className='pSetSummaryItem'>
                                        <span className='pSetSummaryNum'>{this.state.datasets.length}</span> matches found.
                                    </div>
                                    <div className='pSetSummaryItem'>
                                        <span className='pSetSummaryNum'>{this.state.selectedPSets.length}</span> selected.
                                    </div>
                                    <div className='pSetSummaryItem pSetSelectedList'>
                                        <h5>Selected PSets:</h5> 
                                        {this.evaluateList(this.state.selectedPSets)}
                                    </div>
                                </div>
                                <Button label='Save' />
                            </div>
                            <DataTable value={this.state.datasets.slice(0, 50)} selection={this.state.selectedPSets} onSelectionChange={e => this.setState({selectedPSets: e.value})} scrollable={true} scrollHeight="600px">
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