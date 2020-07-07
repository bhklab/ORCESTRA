import React from 'react';
import './PSet.css';
import * as PSetTabs from './PSetTabs';
import * as APICalls from '../Shared/APICalls';
import {GeneralInfoAccordion} from './PSetAccordion';
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
            accompanyRNA: {},
            accompanyDNA: {},
            isReady: false,
            message: ''
        }
        this.selectTab = this.selectTab.bind(this);
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

    selectTab(){
        if(this.state.pset.accompanyRNA.length && this.state.pset.accompanyDNA.length){
            return <PSetTabs.RNASeqAccRNADNATab pset={this.state.pset} dataset={this.state.dataset} rna={this.state.rna} dna={this.state.dna} />
        }
        if(this.state.pset.accompanyRNA.length && !this.state.pset.accompanyDNA.length){
            return <PSetTabs.RNASeqAccRNATab pset={this.state.pset} dataset={this.state.dataset} rna={this.state.rna} dna={this.state.dna} />
        }
        if(!this.state.pset.accompanyRNA.length && this.state.pset.accompanyDNA.length){
            return <PSetTabs.RNASeqAccDNATab pset={this.state.pset} dataset={this.state.dataset} rna={this.state.rna} dna={this.state.dna} />
        }
        return <PSetTabs.RNASeqTab pset={this.state.pset} dataset={this.state.dataset} rna={this.state.rna} dna={this.state.dna} />
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
                    {
                        this.state.isReady ? 
                        this.selectTab()
                        : 
                        <h3>{this.state.message}</h3>
                    }
                </div>
            </div>
        );
    }
}

export default PSet;