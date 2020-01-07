import React from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';

class PSetTable extends React.Component{
    
    constructor(){
        super();
        this.state = {
            //datasets: [],
            rows: 10,
            first: 0,
            start: 0,
            end: 10,
            totalRecords: 0,
            loading: true
        }
        this.nameColumnTemplate = this.nameColumnTemplate.bind(this);
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
        let output ='';
        if(rowData[column.field]){
            output = rowData[column.field].map(item => <div key={item.name}>{item.name}</div>);
        }
        return(
            <div>{output}</div>
        );
    }

    nameColumnTemplate(rowData, column){
        let route = '/' + rowData.doi;
        return(
            <Link to={route} >{rowData.name}</Link>
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
                <Column selectionMode="multiple" style={{width: '3.5em'}}/>
                {this.props.showDownload && <Column className='textField' field='download' header='Download' style={{width: '6.5em'}}/>}
                <Column className='textField' field='name' header='Name' style={{width:'10em'}} body={this.nameColumnTemplate}/>
                <Column className='textField' field='dataset.name' header='Dataset' style={{width:'6em'}} />
                <Column className='textField' field='dataset.version' header='Dataset Version' style={{width:'6em'}}/>
                <Column className='textField' field='drugSensitivity.version' header='Drug Sensitivity' style={{width:'7em'}}/>
                <Column field='rnaTool' body={this.toolsRefTemplate} style={{width:'8em'}} header='RNA Tool'/>
                <Column field='exomeTool' body={this.toolsRefTemplate} style={{width:'8em'}} header='Exome Tool'/>
                <Column field='rnaRef' body={this.toolsRefTemplate} style={{width:'18em'}} header='RNA Ref'/>
                <Column field='exomeRef' body={this.toolsRefTemplate} style={{width:'15em'}} header='Exome Ref'/>
            </DataTable>
        );
    }

}

export default PSetTable;