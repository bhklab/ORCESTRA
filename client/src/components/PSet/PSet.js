import React from 'react';
import './PSet.css';
import Navigation from '../Navigation/Navigation';
import {TabView,TabPanel} from 'primereact/tabview';
import * as APICalls from '../Shared/APICalls';
import DatasetTabContent from './TabContents/DatasetTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';

class PSet extends React.Component{
    constructor(){
        super();
        this.state = {
            pset: '',
            metadata: '',
            dataset: '',
            isReady: false
        }
        this.setMetadata = this.setMetadata.bind(this);
    }

    componentDidMount(){
        let apiStr = '/pset/one/' + this.props.match.params.id;
        console.log(apiStr);
        APICalls.queryPSet(apiStr, (resData) => {
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

    render(){
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                <div className='pageContent'>
                    <h1>Explore PSet - {this.state.pset.name}</h1>
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
                            : ''
                        }
                    </div>
                </div> 
            </React.Fragment>
        );
    }
}

export default PSet;