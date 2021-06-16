import React from 'react';
import { TabHeader, TabContent, StyledAccordion} from '../../SingleDatasetStyle';
import { AccordionTab } from 'primereact/accordion';
import styled from 'styled-components';

const PipelineContent = styled.div`
    display: flex;
    align-items: ${props => props.alignTop ? 'baseline' : 'center'};
    h3 {
        margin-right: 10px;
    }
    .pipeline-execution {
        margin-left: 10px;
        line-height: 15px;
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
                <PipelineContent alignTop={true}>
                    <h3>Pipeline Execution:</h3>
                    <div className='pipeline-execution'> 
                        All ORCESTRA pipelines and associated repositories can be found here: <a href='https://github.com/BHKLAB-Pachyderm'>https://github.com/BHKLAB-Pachyderm</a>. <br />
                        Pipeline repositories are denoted by a "pipelines" suffix in the GitHub repository name. <br />
                        Pipelines within these repositories are JSON files that are executed by running the following Pacyderm command: <b>pachctl create-pipeline -f pipeline_file.json</b>. <br />
                        Each JSON file has specified inputs that are accessed by the pipeline, along with a command section that runs a given script.
                    </div>
                </PipelineContent>
                <PipelineContent>
                    <h3>Docker Image: </h3>
                    <a target="_blank" rel='noreferrer' href={'https://hub.docker.com/r/' + props.data.config.transform.image.split(':')[0]}>
                        {props.data.config.transform.image}
                    </a>
                </PipelineContent>
                <PipelineContent>
                    <h3>Pipeline Repository: </h3>
                    <a target="_blank" rel='noreferrer' href={props.data.config.input.cross[0].git.url}>{props.data.config.input.cross[0].git.url}</a>
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