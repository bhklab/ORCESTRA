import React from 'react';
import {TabView,TabPanel} from 'primereact/tabview';
import DatasetTabContent from './TabContents/DatasetTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';

const DatasetTab = props => {
    return(
        <TabView renderActiveOnly={false}>
            <TabPanel header="Dataset">
                <DatasetTabContent metadata={props.dataset} />   
            </TabPanel>
        </TabView>
    )
}

const DatasetRNATab = props => {
    return(
        <TabView renderActiveOnly={false}>
            <TabPanel header="Dataset">
                <DatasetTabContent metadata={props.dataset} />   
            </TabPanel>
            <TabPanel header="RNA Data">
                <RNATabContent metadata={props.rnaData}/> 
            </TabPanel>
        </TabView>
    )
}

const DatasetDNATab = props => {
    return(
        <TabView renderActiveOnly={false}>
            <TabPanel header="Dataset">
                <DatasetTabContent metadata={props.dataset} />   
            </TabPanel>
            <TabPanel header="DNA Data">
                <DNATabContent metadata={props.dnaData}/> 
            </TabPanel>
        </TabView>
    )
}

const DatasetRNADNATab = props => {
    return(
        <TabView renderActiveOnly={false}>
            <TabPanel header="Dataset">
                <DatasetTabContent metadata={props.dataset} />   
            </TabPanel>
            <TabPanel header="RNA Data">
                <RNATabContent metadata={props.rnaData}/> 
            </TabPanel>
            <TabPanel header="DNA Data">
                <DNATabContent metadata={props.dnaData}/> 
            </TabPanel>
        </TabView>
    )
}

const PSetTab = props => {
    
    const selectTab = () => {
        if(props.rnaData.length && props.dnaData.length){
            return <DatasetRNADNATab dataset={props.dataset} rnaData={props.rnaData} dnaData={props.dnaData} />
        }
        if(props.rnaData.length && !props.dnaData.length){
            return <DatasetRNATab dataset={props.dataset} rnaData={props.rnaData} />
        }
        if(!props.rnaData.length && props.dnaData.length){
            return <DatasetDNATab dataset={props.dataset} dnaData={props.dnaData} />
        }
        return <DatasetTab dataset={props.dataset} />
    }
    
    return(
        selectTab()
    )
}

export default PSetTab;