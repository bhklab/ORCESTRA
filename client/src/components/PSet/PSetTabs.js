import React from 'react';
import {TabView,TabPanel} from 'primereact/tabview';
import DatasetTabContent from './TabContents/DatasetTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';
import AccompanyDataTabContent from './TabContents/AccompanyDataTabContent';

export const RNASeqTab = props => {
    return(
        <TabView renderActiveOnly={false}>
            <TabPanel header="Dataset">
                <DatasetTabContent metadata={props.dataset} />   
            </TabPanel>
            {
                props.pset.dataType.map((type) => 
                <TabPanel key={type.name} header={type.label}>
                    {type.name === 'rnaseq' ? 
                        <RNATabContent metadata={props.rna}/> 
                        : 
                        <DNATabContent metadata={props.dna}/>
                    }
                </TabPanel>)
            }
        </TabView>
    )
}

export const RNASeqAccRNATab = props => {
    return(
        <TabView renderActiveOnly={false}>
            <TabPanel header="Dataset">
                <DatasetTabContent metadata={props.dataset} />   
            </TabPanel>
            {
                props.pset.dataType.map((type) => 
                <TabPanel key={type.name} header={type.label}>
                    {type.name === 'rnaseq' ? 
                        <RNATabContent metadata={props.rna}/> 
                        : 
                        <DNATabContent metadata={props.dna}/>
                    }
                </TabPanel>)
            }
            <TabPanel header={'Accompanying RNA Data'}>
                <h1 className='tabMainHeader'>Dataset: {props.dataset.name}</h1>
                <AccompanyDataTabContent data={props.pset.accompanyRNA} />
            </TabPanel>
        </TabView>
    )
}

export const RNASeqAccDNATab = props => {
    return(
        <TabView renderActiveOnly={false}>
            <TabPanel header="Dataset">
                <DatasetTabContent metadata={props.dataset} />   
            </TabPanel>
            {
                props.pset.dataType.map((type) => 
                <TabPanel key={type.name} header={type.label}>
                    {type.name === 'rnaseq' ? 
                        <RNATabContent metadata={props.rna}/> 
                        : 
                        <DNATabContent metadata={props.dna}/>
                    }
                </TabPanel>)
            }
            <TabPanel header={'Accompanying DNA Data'}>
                <h1 className='tabMainHeader'>Dataset: {props.dataset.name}</h1>
                <AccompanyDataTabContent data={props.pset.accompanyDNA} />
            </TabPanel>
        </TabView>
    )
}

export const RNASeqAccRNADNATab = props => {
    return(
        <TabView renderActiveOnly={false}>
            <TabPanel header="Dataset">
                <DatasetTabContent metadata={props.dataset} />   
            </TabPanel>
            {
                props.pset.dataType.map((type) => 
                <TabPanel key={type.name} header={type.label}>
                    {type.name === 'rnaseq' ? 
                        <RNATabContent metadata={props.rna}/> 
                        : 
                        <DNATabContent metadata={props.dna}/>
                    }
                </TabPanel>)
            }
            <TabPanel header={'Accompanying RNA Data'}>
                <h1 className='tabMainHeader'>Dataset: {props.pset.dataset.name}</h1>
                <AccompanyDataTabContent data={props.pset.accompanyRNA} />
            </TabPanel>
            <TabPanel header={'Accompanying DNA Data'}>
                <h1 className='tabMainHeader'>Dataset: {props.pset.dataset.name}</h1>
                <AccompanyDataTabContent data={props.pset.accompanyDNA} />
            </TabPanel>
        </TabView>
    )
}