import React from 'react';
import { TabHeader, TabContent, StyledAccordion} from '../PSetStyle';
import {Accordion,AccordionTab} from 'primereact/accordion';
import styled from 'styled-components';

const PipelineContent = styled.div`
    display: flex;
    align-items: center;
    h3 {
        margin-right: 10px;
    }
`

const PipelineTabContent = props => {
    return(
        <React.Fragment>
            <TabHeader>Pipeline Data</TabHeader>
            <TabContent>
                <PipelineContent>
                    <h3>Pachyderm CommitID:</h3>
                    <div>{props.data.commitID}</div>
                </PipelineContent>
                <PipelineContent>
                    <h3>Docker Image: </h3>
                    <a target="_blank" href={'https://hub.docker.com/r/' + props.data.config.transform.image.split(':')[0]}>
                        {props.data.config.transform.image}
                    </a>
                </PipelineContent>
                <PipelineContent>
                    <h3>Pipeline Repository: </h3>
                    <a target="_blank" href={props.data.config.input.cross[0].git.url}>{props.data.config.input.cross[0].git.url}</a>
                </PipelineContent>
                <StyledAccordion>
                    <AccordionTab header='Pipeline Configuration File'>
                        <pre>
                            {JSON.stringify(props.data.config, null, 2)}
                        </pre>
                    </AccordionTab>
                </StyledAccordion>
            </TabContent>
        </React.Fragment> 
    )
}

export default PipelineTabContent