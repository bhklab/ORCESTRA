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
            pset: {},
            metadata: {},
            isReady: false
        }
    }

    componentDidMount(){
        let apiStr = '/pset/one/' + this.props.match.params.id;
        console.log(apiStr);
        APICalls.queryPSet(apiStr, (resData) => {
            this.setState({
                pset: resData.pset,
                metadata: resData.metadata,
                isReady: true
            });
        });
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
                                    <DatasetTabContent pset={this.state.pset} metadata={this.state.metadata.dataset} />   
                                </TabPanel>
                                {this.state.pset.dataType.map((type) => 
                                    <TabPanel key={type} header={type}>
                                        {type === 'RNA' ? 
                                            <RNATabContent pset={this.state.pset} metadata={this.state.metadata.rna} /> 
                                            : 
                                            <DNATabContent pset={this.state.pset} metadata={this.state.metadata.dna} />
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