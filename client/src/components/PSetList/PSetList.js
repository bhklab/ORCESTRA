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
		fetch('http://dummy.restapiexample.com/api/v1/employees')  
            .then(res => res.json())
            .then(datasets=> this.setState({datasets}));
    }

    evaluateList(list){
        if(list.length > 0){
            return(
                <ul>
                    {list.map((pset) => 
                        <li key={pset.id}>
                            {pset.employee_name}
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
                                <Column field='id' header='DOI' style={{width:'5em'}}/>
                                <Column field='employee_name' header='Dataset' style={{width:'30em'}} />
                                <Column field='employee_age' header='Dataset Version' />
                                <Column field='' header='Drug Sensitivity' />
                                <Column field='' header='RNA Tool' />
                                <Column field='' header='Exome Tool' />
                                <Column field='' header='RNA Ref' />
                                <Column field='' header='Summary' />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetList;