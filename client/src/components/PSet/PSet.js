import React from 'react';
import './PSet.css';
import {TabView,TabPanel} from 'primereact/tabview';
import * as APICalls from '../Shared/APICalls';
import {GeneralInfoAccordion} from './PSetAccordion';
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
                    general: {name: pset.name, createdBy: pset.createdBy, dateCreated: pset.dateCreated},
                    dataset: {dataset: pset.dataset, genome: pset.genome, drugSensitivity: pset.drugSensitivity},
                    rna: {rnaTool: pset.rnaTool, rnaRef: pset.rnaRef, rawSeqDataRNA: pset.dataset.rawSeqDataRNA},
                    dna: {dnaTool: pset.dnaTool, dnaRef: pset.dnaRef, rawSeqDataDNA: pset.dataset.rawSeqDataDNA},
                    isReady: true
                });
            }else{
                this.setState({message: 'We could not find a PSet with the ID.'})
            }
        });
    }

    showMessage(status, data){
        APIHelper.messageAfterRequest(status, data, this.initializeState, this.messages);
    }

    render(){
        return(
            <div className='pageContent'>
                <Messages ref={(el) => this.messages = el} />
                <div className='psetTitle'>
                    <h1>Explore PSet - {this.state.pset.name}</h1>
                    <DownloadPSetButton disabled={false} selectedPSets={[this.state.pset]} onDownloadComplete={this.showMessage}/>
                </div>
                <GeneralInfoAccordion data={this.state.general}/>
                <div className='tabContainer'>
                    {this.state.isReady ? 
                        <TabView renderActiveOnly={false}>
                            <TabPanel header="Dataset">
                                <DatasetTabContent metadata={this.state.dataset} />   
                            </TabPanel>
                            {this.state.pset.dataType.map((type) => 
                                <TabPanel key={type.name} header={type.name}>
                                    {type.name === 'RNA' ? 
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