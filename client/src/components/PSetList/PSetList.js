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
    }

	componentDidMount(){
		fetch('/pset')  
            .then(res => res.json())
            .then(datasets=> this.setState({datasets}));
    }

    evaluateList(list){
        if(list.length > 0){
            return(
                <ul>
                    {list.map((pset) => 
                        <li key={pset.id}>
                            {pset.id}
                        </li>
                    )}
                </ul>
            );
        } else {
            return(<ul><li>None</li></ul>)
        }
    }
    
    render(){
        
        return(
            <React.Fragment>
                <Navigation />
                <div className='pageContent'>
                    <h1>Search for existing Pharmaco Datasets</h1>
                    <div className='pSetListContainer'>
                        <PSetFilter />
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
                                <Column className='textField' field='id' header='DOI' style={{width:'8em'}}/>
                                <Column className='textField' field='dataset' header='Dataset' style={{width:'6em'}} />
                                <Column className='textField' field='dataset_ver' header='Dataset Version' style={{width:'7em'}}/>
                                <Column className='textField' field='drug_sens' header='Drug Sensitivity' style={{width:'7em'}}/>
                                <Column className='textField' field='rnaseq' header='RNA Tool' style={{width:'7em'}} />
                                <Column className='textField' field='exomeseq' header='Exome Tool' style={{width:'15em'}} />
                                <Column className='textField' field='rna_ref' header='RNA Ref' />
                                <Column className='textField' field='exome_ref' header='Exome Ref' />
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