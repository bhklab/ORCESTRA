import React from 'react';
import { TabView,TabPanel } from 'primereact/tabview';
import DisclaimerTabContent from '../PSet/TabContents/DisclaimerTabContent';
import DatasetTabContent from './TabContents/DatasetTabContent';
import SnakemakePipelineTabContent from "../SubComponents/SnakemakePipelineTabContent";
import ReleaseNoteTabContent from './TabContents/ReleaseNoteTabContent';
import { TabContainer } from '../SingleDatasetStyle';

const RadiomicSet = (props) => {
    const { dataset } = props;
    return(
        <React.Fragment>
            <TabContainer>
                <TabView renderActiveOnly={false}>
                    {
                        dataset.tabData.map(td => (
                            <TabPanel key={Math.random()} header={td.header}>
                                {td.header === 'Disclaimer' && <DisclaimerTabContent notes={td.data} />}
                                {td.header === 'Dataset' && <DatasetTabContent metadata={td.data} />}
                                {td.header === 'Pipeline' && <SnakemakePipelineTabContent data={td.data} />}
                                {td.header === 'Release Notes' && <ReleaseNoteTabContent data={td.data} />}
                            </TabPanel>
                        ))
                    }
                </TabView>
            </TabContainer>
        </React.Fragment>
    );
}

export default RadiomicSet;