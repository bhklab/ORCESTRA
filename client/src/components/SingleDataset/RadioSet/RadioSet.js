import React from 'react';
import { TabView,TabPanel } from 'primereact/tabview';
import DatasetTabContent from './TabContents/DatasetTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';
import PipelineTabContent from './TabContents/PipelineTabContent';
import ReleaseNoteTabContent from './TabContents/ReleaseNoteTabContent';
import { GeneralInfoAccordion } from './PSetAccordion';
import { TabContainer } from '../SingleDatasetStyle';

const RadioSet = (props) => {
    const { dataset } = props;
    return(
        <React.Fragment>
            <GeneralInfoAccordion datasetType='RadioSet' data={dataset.generalInfo}/>
            <TabContainer>
                <TabView renderActiveOnly={false}>
                    {
                        dataset.tabData.map(td => (
                            <TabPanel key={Math.random()} header={td.header}>
                                {td.header === 'Dataset' && <DatasetTabContent metadata={td.data} />}
                                {td.header === 'RNA' && <RNATabContent metadata={td.data} />}
                                {td.header === 'DNA' && <DNATabContent metadata={td.data} />}
                                {td.header === 'Pipeline' && <PipelineTabContent data={td.data} />}
                                {td.header === 'Release Notes' && <ReleaseNoteTabContent data={td.data} />}
                            </TabPanel>
                        ))
                    }
                </TabView>
            </TabContainer>
        </React.Fragment>
    );
}

export default RadioSet;