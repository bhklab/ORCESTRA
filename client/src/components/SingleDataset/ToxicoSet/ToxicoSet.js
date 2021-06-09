import React from 'react';
import { TabView,TabPanel } from 'primereact/tabview';
import DatasetTabContent from './TabContents/DatasetTabContent';
import PipelineTabContent from '../PSet/TabContents/PipelineTabContent';
import ReleaseNoteTabContent from './TabContents/ReleaseNoteTabContent';
import { TabContainer } from '../SingleDatasetStyle';

const ToxicoSet = (props) => {
    const { dataset } = props;
    return(
        <React.Fragment>
            <TabContainer>
                <TabView renderActiveOnly={false}>
                    {
                        dataset.tabData.map(td => (
                            <TabPanel key={Math.random()} header={td.header}>
                                {td.header === 'Dataset' && <DatasetTabContent metadata={td.data} />}
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

export default ToxicoSet;