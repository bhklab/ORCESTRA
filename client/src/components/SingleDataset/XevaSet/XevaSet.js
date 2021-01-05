import React, {useState, useEffect} from 'react';
import {TabView,TabPanel} from 'primereact/tabview';
import DatasetTabContent from './TabContents/DatasetTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';
import PipelineTabContent from '../PSet/TabContents/PipelineTabContent';
import ReleaseNoteTabContent from './TabContents/ReleaseNoteTabContent';
import {GeneralInfoAccordion} from '../PSet/PSetAccordion';
import DownloadDataSetButton from '../../Shared/Buttons/DownloadDatasetButton';
import {TabContainer} from '../SingleDatasetStyle';
import {dataTypes} from '../../Shared/Enums';
import styled from 'styled-components';

const StyledTitle = styled.div`
    display: flex;
    align-items: baseline;
`

const XevaSet = (props) => {
    const [xevaSet, setXevaSet] = useState({});
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false)

    useEffect(() => {
        const getData = async () => {
            try{
                const res = await fetch(`/api/${dataTypes.xenographic}/one/${props.params.id1}/${props.params.id2}`);
                if(res.ok){
                    const json = await res.json();
                    console.log(json);
                    setXevaSet(json);
                    setReady(true);
                }else{
                    setError(true);
                }
            }catch(error){
                console.log(error);
                setError(true);
            } 
        }
        getData();
    }, []);

    return(
        <div className='pageContent'>
            {
                ready &&
                <React.Fragment>
                    <StyledTitle>
                        <h2>Explore XevaSet - {xevaSet.name}</h2>
                        <DownloadDataSetButton disabled={false} datasetType={dataTypes.xenographic} dataset={xevaSet} />
                    </StyledTitle>
                    <GeneralInfoAccordion datasetType='XevaSet' data={xevaSet.generalInfo}/>
                    <TabContainer>
                        <TabView renderActiveOnly={false}>
                            {
                                xevaSet.tabData.map(td => (
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
            { error && <h3>XevaSet with the specified DOI could not be found</h3>}
        </div>
    );
}

export default XevaSet;