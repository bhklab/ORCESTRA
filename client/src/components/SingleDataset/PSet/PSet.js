import React from 'react';
import { TabView,TabPanel } from 'primereact/tabview';
import DatasetTabContent from './TabContents/DatasetTabContent';
import DisclaimerTabContent from './TabContents/DisclaimerTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';
import PipelineTabContent from './TabContents/PipelineTabContent';
import SnakemakePipelineTabContent from "../SubComponents/SnakemakePipelineTabContent";
import ReleaseNoteTabContent from './TabContents/ReleaseNoteTabContent';
import { TabContainer } from '../SingleDatasetStyle';

const PSet = (props) => {
    const { dataset } = props;
    console.log(dataset.tabData)
    return(
        <React.Fragment>
            <TabContainer>
                <TabView renderActiveOnly={false}>
                    {
                        dataset.tabData.map(td => (
                            <TabPanel key={Math.random()} header={td.header}>
                                {td.header === 'Dataset' && <DatasetTabContent metadata={td.data} />}
                                {td.header === 'Disclaimer' && <DisclaimerTabContent notes={td.data} />}
                                {td.header === 'RNA' && <RNATabContent dataset={dataset.tabData.find(item => item.header === "Dataset").data.dataset} metadata={td.data} />}
                                {td.header === 'DNA' && <DNATabContent metadata={td.data} />}
                                {td.header === 'Pipeline' ? td.data.pipeline ? <SnakemakePipelineTabContent data={td.data} /> : <PipelineTabContent data={td.data} /> : ''}
                                {td.header === 'Release Notes' && <ReleaseNoteTabContent data={td.data} />}
                            </TabPanel>
                        ))
                    }
                </TabView>
            </TabContainer>
        </React.Fragment>
    );
}

export default PSet;