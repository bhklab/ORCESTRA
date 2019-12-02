import React from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';

class PSetTable extends React.Component{
    
    constructor(){
        super();
        this.state = {
            datasets: [],
            rows: 10,
            first: 0,
            start: 0,
            end: 10,
            totalRecords: 0,
            loading: true
        }
        this.detailsColumnTemplate = this.detailsColumnTemplate.bind(this);
        this.toolsRefTemplate = this.toolsRefTemplate.bind(this);
        this.updatePSetSelectionEvent = this.updatePSetSelectionEvent.bind(this);
        this.onPage = this.onPage.bind(this);
    }

    componentDidMount(){
        this.setState({
            loading: false
        });
    }

    toolsRefTemplate(rowData, column){
        const output = rowData[column.field].map(item => <div key={item}>{item}</div>);
        return(
            <div>{output}</div>
        );
    }

    detailsColumnTemplate(rowData, column){
        return(
            <Button className='metaBtn' label='View'/>
        );
    }

    onPage(event){
        this.setState({
            first: event.first,
            start: event.first,
            end: event.first + this.state.rows,
            loading: false
        });
    }

    updatePSetSelectionEvent = event => {
        this.props.updatePSetSelection(event.value);
    }

    render(){
        const datasets = this.props.allData.slice(this.state.start, this.state.end);
        const totalRecords = this.props.allData.length;
        return(
            <DataTable value={datasets} selection={this.props.selectedPSets} onSelectionChange={this.updatePSetSelectionEvent} paginator={true} 
            rows={this.state.rows} totalRecords={totalRecords} lazy={true} first={this.state.first} onPage={this.onPage} loading={this.state.loading}
            scrollable={true} scrollHeight={this.props.scrollHeight}>
                <Column selectionMode="multiple" style={{width:'3.5em'}}/>
                <Column className='textField' field='name' header='Name' style={{width:'18em'}}/>
                <Column className='textField' field='datasetName' header='Dataset' style={{width:'6em'}} />
                <Column className='textField' field='datasetVersion' header='Dataset Version' style={{width:'6em'}}/>
                <Column className='textField' field='drugSensitivity' header='Drug Sensitivity' style={{width:'6em'}}/>
                <Column field='rnaTool' body={this.toolsRefTemplate} style={{width:'8em'}} header='RNA Tool'/>
                <Column field='exomeTool' body={this.toolsRefTemplate} style={{width:'8em'}} header='Exome Tool'/>
                <Column field='rnaRef' body={this.toolsRefTemplate} style={{width:'18em'}} header='RNA Ref'/>
                <Column field='exomeRef' body={this.toolsRefTemplate} style={{width:'6em'}} header='Exome Ref'/>
                <Column field='metadata' body={this.detailsColumnTemplate} style={{textAlign:'center', width:'6em'}} header='Details'/>
            </DataTable>
        );
    }

}

export default PSetTable;