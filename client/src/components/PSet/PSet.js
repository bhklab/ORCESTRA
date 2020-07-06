import React from 'react';
import './PSet.css';
import {TabView,TabPanel} from 'primereact/tabview';
import * as APICalls from '../Shared/APICalls';
import {GeneralInfoAccordion} from './PSetAccordion';
import DatasetTabContent from './TabContents/DatasetTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';
import * as Helper from '../Shared/Helper';
import DownloadPSetButton from '../Shared/Buttons/DownloadPSetButton';
import {Messages} from 'primereact/messages';

class PSet extends React.Component{
    constructor(){
        super();
        this.state = {
            pset: {},
            general: {},
            dataset: {},
            rna: {},
            dna: {},
            isReady: false,
            message: ''
        }
        this.showMessage = this.showMessage.bind(this);
    }

    componentDidMount(){
        console.log(this.props.match.params.id1 + '/' + this.props.match.params.id2);
        let apiStr = '/api/pset/one/' + this.props.match.params.id1 + '/' + this.props.match.params.id2;
        console.log(apiStr);
        APICalls.queryPSet(apiStr, (pset) => {
            console.log(pset);
            if(pset){
                this.setState({
                    pset: pset,
                    general: {name: pset.name, doi: pset.doi, createdBy: pset.createdBy, dateCreated: pset.dateCreated},
                    dataset: {dataset: pset.dataset, genome: pset.genome},
                    rna: {rnaTool: pset.rnaTool, rnaRef: pset.rnaRef, rawSeqDataRNA: pset.dataset.versionInfo.rawSeqDataRNA},
                    dna: {dnaTool: pset.dnaTool, dnaRef: pset.dnaRef, rawSeqDataDNA: pset.dataset.versionInfo.rawSeqDataDNA},
                    isReady: true
                });
            }else{
                this.setState({message: 'We could not find a PSet with the ID.'})
            }
        });
    }

    showMessage(status, data){
        Helper.messageAfterRequest(status, data, this.initializeState, this.messages);
    }

    render(){
        return(
            <div className='pageContent'>
                <Messages ref={(el) => this.messages = el} />
                <div className='psetTitle'>
                    <h2>Explore PSet - {this.state.pset.name}</h2>
                    <DownloadPSetButton disabled={false} pset={this.state.pset} onDownloadComplete={this.showMessage}/>
                </div>
                {this.state.isReady && <GeneralInfoAccordion data={this.state.general}/>}
                <div className='tabContainer'>
                    {this.state.isReady ? 
                        <TabView renderActiveOnly={false}>
                            <TabPanel header="Dataset">
                                <DatasetTabContent metadata={this.state.dataset} />   
                            </TabPanel>
                            {this.state.pset.dataType.map((type) => 
                                <TabPanel key={type.name} header={type.label}>
                                    {type.name === 'rnaseq' ? 
                                        <RNATabContent metadata={this.state.rna}/> 
                                        : 
                                        <DNATabContent metadata={this.state.dna}/>
                                    }
                                </TabPanel>)
                            }
                        </TabView>
                        : 
                        <h3>{this.state.message}</h3>
                    }
                </div>
            </div>
        );
    }
}

export default PSet;