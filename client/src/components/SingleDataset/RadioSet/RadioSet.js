import React, { useEffect } from 'react';
import useSingleDataset from '../../../hooks/useSingleDataset';
import { TabView,TabPanel } from 'primereact/tabview';
import DatasetTabContent from './TabContents/DatasetTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';
import PipelineTabContent from './TabContents/PipelineTabContent';
import ReleaseNoteTabContent from './TabContents/ReleaseNoteTabContent';
import { GeneralInfoAccordion } from './PSetAccordion';
import { TabContainer } from '../SingleDatasetStyle';
import { dataTypes } from '../../Shared/Enums';

const RadioSet = (props) => {
    const { getDataset, getHeader, dataset } = useSingleDataset(dataTypes.radiogenomics, `${props.params.id1}/${props.params.id2}`);

    useEffect(() => {
        const getData = async () => {
            getDataset();
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div className='pageContent'>
            {
                dataset.ready &&
                <React.Fragment>
                    { getHeader() }
                    <GeneralInfoAccordion datasetType='RadioSet' data={dataset.data.generalInfo}/>
                    <TabContainer>
                        <TabView renderActiveOnly={false}>
                            {
                                dataset.data.tabData.map(td => (
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
            } 
            { !dataset.data && <h3>RadioSet with the specified DOI could not be found</h3>}
        </div>
    );
}

export default RadioSet;