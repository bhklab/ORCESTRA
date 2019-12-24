import React from 'react';
import './PSet.css';
import Navigation from '../Navigation/Navigation';
import {TabView,TabPanel} from 'primereact/tabview';
import * as APICalls from '../Shared/APICalls';
import DatasetTabContent from './TabContents/DatasetTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';
import * as APIHelper from '../Shared/PSetAPIHelper';
import DownloadPSetButton from '../Shared/Buttons/DownloadPSetButton';
import {Messages} from 'primereact/messages';

class PSet extends React.Component{
    constructor(){
        super();
        this.state = {
            pset: '',
            metadata: '',
            dataset: '',
            isReady: false,
            message: ''
        }
        this.setMetadata = this.setMetadata.bind(this);
        this.showMessage = this.showMessage.bind(this);
    }

    componentDidMount(){
        let apiStr = '/pset/one/' + this.props.match.params.id;
        console.log(apiStr);
        APICalls.queryPSet(apiStr, (resData) => {
            if(resData.pset){
                this.setMetadata(resData, (metadata, pset, dataset) => {
                    this.pset = pset;
                    this.metadata = metadata;
                    this.dataset = dataset;
                    this.setState({
                        pset: this.pset,
                        metadata: this.metadata,
                        dataset: this.dataset,
                        isReady: true
                    });
                }); 
            }else{
                this.setState({message: 'We could not find a PSet with the ID.'})
            }
        });
    }

    setMetadata(data, callback){
        let metadata = data.metadata;
        let pset = data.pset;
        let dataset = {};
        for(let i = 0; i < metadata.dataset.length; i++){
            if(metadata.dataset[i].name === pset.datasetName && metadata.dataset[i].version === pset.datasetVersion){
                dataset = metadata.dataset[i];
            }
        }
        callback(metadata, pset, dataset);
    }

    showMessage(status, data){
        APIHelper.messageAfterRequest(status, data, this.initializeState, this.messages);
    }

    render(){
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                <div className='pageContent'>
                    <div className='psetTitle'>
                        <h1>Explore PSet - {this.state.pset.name}</h1>
                        <DownloadPSetButton disabled={false} selectedPSets={[this.state.pset]} onDownloadComplete={this.showMessage}/>
                    </div>
                    <Messages ref={(el) => this.messages = el} />
                    <div className='tabContainer'>
                        {this.state.isReady ? 
                            <TabView renderActiveOnly={false}>
                                <TabPanel header="Dataset">
                                    <DatasetTabContent pset={this.state.pset} metadata={this.state.dataset} />   
                                </TabPanel>
                                {this.state.pset.dataType.map((type) => 
                                    <TabPanel key={type} header={type}>
                                        {type === 'RNA' ? 
                                            <RNATabContent pset={this.state.pset} metadata={this.state.metadata.rna} dataset={this.state.dataset}/> 
                                            : 
                                            <DNATabContent pset={this.state.pset} metadata={this.state.metadata.dna} dataset={this.state.dataset}/>
                                        }
                                    </TabPanel>)
                                }
                            </TabView>
                            : 
                            <h3>{this.state.message}</h3>
                        }
                    </div>
                </div> 
            </React.Fragment>
        );
    }
}

export default PSet;