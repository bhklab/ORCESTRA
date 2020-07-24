import React, {useState, useEffect} from 'react';
import {TabView,TabPanel} from 'primereact/tabview';
import DatasetTabContent from './TabContents/DatasetTabContent';
import RNATabContent from './TabContents/RNATabContent';
import DNATabContent from './TabContents/DNATabContent';
import PipelineTabContent from './TabContents/PipelineTabContent';
import {GeneralInfoAccordion} from './PSetAccordion';
import DownloadPSetButton from '../Shared/Buttons/DownloadPSetButton';
import {TabContainer} from './PSetStyle';
import styled from 'styled-components';

const StyledTitle = styled.div`
    display: flex;
    align-items: baseline;
`

const PSet = (props) => {
    const [pset, setPSet] = useState({})
    const [ready, setReady] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const getData = async () => {
            try{
                const res = await fetch('/api/pset/one/' + props.match.params.id1 + '/' + props.match.params.id2)
                if(res.ok){
                    const json = await res.json()
                    console.log(json)
                    setPSet(json)
                    setReady(true)
                }else{
                    setError(true)
                }
            }catch(error){
                console.log(error)
                setError(true)
            } 
        }
        getData()
    }, [])

    return(
        <div className='pageContent'>
            {
                ready &&
                <React.Fragment>
                    <StyledTitle>
                        <h2>Explore PSet - {pset.name}</h2>
                        <DownloadPSetButton disabled={false} pset={pset} />
                    </StyledTitle>
                    <GeneralInfoAccordion data={pset.generalInfo}/>
                    <TabContainer>
                        <TabView renderActiveOnly={false}>
                            {
                                pset.tabData.map(td => (
                                    <TabPanel key={Math.random()} header={td.header}>
                                        {td.header === 'Dataset' && <DatasetTabContent metadata={td.data} />}
                                        {td.header === 'RNA' && <RNATabContent metadata={td.data} />}
                                        {td.header === 'DNA' && <DNATabContent metadata={td.data} />}
                                        {td.header === 'Pipeline' && <PipelineTabContent data={td.data} />}
                                    </TabPanel>
                                ))
                            }
                        </TabView>
                    </TabContainer>
                </React.Fragment>
            } 
            { error && <h3>PSet with the specified DOI could not be found</h3>}
        </div>
    );
}

export default PSet;